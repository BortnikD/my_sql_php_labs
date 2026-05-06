<?php

readonly class UserRepository implements CrudRepository
{
    public function __construct(private PDO $pdo)
    {
    }

    public function findById(int $id): ?UserDto
    {
        $stmt = $this->pdo->prepare('SELECT * FROM user WHERE id = :id');
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch();
        return $row ? UserDto::fromRow($row) : null;
    }

    public function findByUsername(string $username): ?UserDto
    {
        $stmt = $this->pdo->prepare('SELECT * FROM user WHERE username = :username');
        $stmt->execute([':username' => $username]);
        $row = $stmt->fetch();
        return $row ? UserDto::fromRow($row) : null;
    }

    public function findByEmail(string $email): ?UserDto
    {
        $stmt = $this->pdo->prepare('SELECT * FROM user WHERE email = :email');
        $stmt->execute([':email' => $email]);
        $row = $stmt->fetch();
        return $row ? UserDto::fromRow($row) : null;
    }

    /** @return UserDto[] */
    public function findAll(): array
    {
        $stmt = $this->pdo->prepare('SELECT * FROM user ORDER BY id');
        $stmt->execute();
        return array_map(UserDto::fromRow(...), $stmt->fetchAll());
    }

    public function create(array $data): int
    {
        $stmt = $this->pdo->prepare('
            INSERT INTO user (username, email, password_hash)
            VALUES (:username, :email, :password_hash)
        ');
        $stmt->execute([
            ':username' => $data['username'],
            ':email' => $data['email'],
            ':password_hash' => $data['password_hash'],
        ]);
        return (int)$this->pdo->lastInsertId();
    }

    public function update(int $id, array $data): bool
    {
        $stmt = $this->pdo->prepare('UPDATE user SET username = :username WHERE id = :id');
        return $stmt->execute([':username' => $data['username'], ':id' => $id]);
    }

    public function updateLoginStats(int $id): void
    {
        $this->pdo->prepare(
            'UPDATE user SET login_count = login_count + 1, last_login_at = NOW() WHERE id = :id'
        )->execute([':id' => $id]);
    }

    public function updateRole(int $id, string $role): bool
    {
        $stmt = $this->pdo->prepare('UPDATE user SET role = :role WHERE id = :id');
        return $stmt->execute([':role' => $role, ':id' => $id]);
    }

    public function delete(int $id): bool
    {
        $stmt = $this->pdo->prepare('DELETE FROM user WHERE id = :id');
        return $stmt->execute([':id' => $id]);
    }

    public function hasPendingRoleRequest(int $userId): bool
    {
        $stmt = $this->pdo->prepare(
            "SELECT COUNT(*) FROM role_requests WHERE user_id = :uid AND status = 'PENDING'"
        );
        $stmt->execute([':uid' => $userId]);
        return (int)$stmt->fetchColumn() > 0;
    }

    public function createRoleRequest(int $userId): int
    {
        $stmt = $this->pdo->prepare('INSERT INTO role_requests (user_id) VALUES (:uid)');
        $stmt->execute([':uid' => $userId]);
        return (int)$this->pdo->lastInsertId();
    }

    public function findLatestRoleRequestByUser(int $userId): ?RoleRequestDto
    {
        $stmt = $this->pdo->prepare("
            SELECT rr.id, rr.user_id, u.username, rr.status, rr.created_at
            FROM role_requests rr
            JOIN user u ON u.id = rr.user_id
            WHERE rr.user_id = :uid
            ORDER BY rr.created_at DESC
            LIMIT 1
        ");
        $stmt->execute([':uid' => $userId]);
        $row = $stmt->fetch();
        return $row ? RoleRequestDto::fromRow($row) : null;
    }

    /** @return RoleRequestDto[] */
    public function findPendingRoleRequests(): array
    {
        $stmt = $this->pdo->prepare("
            SELECT rr.id, rr.user_id, u.username, rr.status, rr.created_at
            FROM role_requests rr
            JOIN user u ON u.id = rr.user_id
            WHERE rr.status = 'PENDING'
            ORDER BY rr.created_at
        ");
        $stmt->execute();
        return array_map(RoleRequestDto::fromRow(...), $stmt->fetchAll());
    }

    public function approveRoleRequest(int $requestId): bool
    {
        $stmt = $this->pdo->prepare(
            "SELECT user_id FROM role_requests WHERE id = :id AND status = 'PENDING'"
        );
        $stmt->execute([':id' => $requestId]);
        $row = $stmt->fetch();
        if (!$row) return false;

        $this->pdo->prepare(
            "UPDATE role_requests SET status = 'APPROVED', updated_at = NOW() WHERE id = :id"
        )->execute([':id' => $requestId]);

        $this->pdo->prepare(
            "UPDATE user SET role = 'OPERATOR', login_count = 0, last_login_at = NULL WHERE id = :id"
        )->execute([':id' => (int)$row['user_id']]);

        return true;
    }

    public function denyRoleRequest(int $requestId): bool
    {
        $stmt = $this->pdo->prepare(
            "UPDATE role_requests SET status = 'DENIED', updated_at = NOW()
             WHERE id = :id AND status = 'PENDING'"
        );
        $stmt->execute([':id' => $requestId]);
        return $stmt->rowCount() > 0;
    }
}
