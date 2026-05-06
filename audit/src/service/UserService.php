<?php

readonly class UserService
{
    public function __construct(
        private UserRepository $repository,
        private JwtService     $jwt,
    )
    {
    }

    public function register(string $username, string $password): int
    {
        if ($this->repository->findByUsername($username)) {
            throw new RuntimeException('Username already taken');
        }
        return $this->repository->create([
            'username' => $username,
            'password_hash' => password_hash($password, PASSWORD_BCRYPT),
        ]);
    }

    public function login(string $username, string $password): ?AuthTokenDto
    {
        $user = $this->repository->findByUsername($username);
        if (!$user || !password_verify($password, $user->password_hash)) {
            return null;
        }
        return $this->jwt->generate($user);
    }
}
