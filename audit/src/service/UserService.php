<?php

readonly class UserService
{
    public function __construct(
        private UserRepository $repository,
        private JwtService     $jwt,
    )
    {
    }

    public function register(string $username, string $email, string $password): int
    {
        if (strlen($username) < 3) {
            throw new RuntimeException('Username must be at least 3 characters');
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new RuntimeException('Invalid email format');
        }
        if (strlen($password) < 6) {
            throw new RuntimeException('Password must be at least 6 characters');
        }
        if ($this->repository->findByUsername($username)) {
            throw new RuntimeException('Username already taken');
        }
        if ($this->repository->findByEmail($email)) {
            throw new RuntimeException('Email already registered');
        }

        $userId = $this->repository->create([
            'username' => $username,
            'email' => $email,
            'password_hash' => password_hash($password, PASSWORD_BCRYPT),
        ]);

        $this->repository->createRoleRequest($userId);

        return $userId;
    }

    public function login(string $username, string $password): ?AuthTokenDto
    {
        $user = $this->repository->findByUsername($username);
        if (!$user || !password_verify($password, $user->password_hash)) {
            return null;
        }

        $previousLastLogin = $user->lastLoginAt;
        $previousCount = $user->loginCount;

        $this->repository->updateLoginStats($user->id);

        $updatedUser = new UserDto(
            id: $user->id,
            username: $user->username,
            email: $user->email,
            password_hash: $user->password_hash,
            role: $user->role,
            loginCount: $previousCount + 1,
            lastLoginAt: $previousLastLogin,
        );

        return $this->jwt->generate($updatedUser);
    }

    /** @return RoleRequestDto[] */
    public function getPendingRoleRequests(): array
    {
        return $this->repository->findPendingRoleRequests();
    }

    public function approveRoleRequest(int $requestId): void
    {
        if (!$this->repository->approveRoleRequest($requestId)) {
            throw new RuntimeException('Role request not found or already processed');
        }
    }

    public function denyRoleRequest(int $requestId): void
    {
        if (!$this->repository->denyRoleRequest($requestId)) {
            throw new RuntimeException('Role request not found or already processed');
        }
    }
}
