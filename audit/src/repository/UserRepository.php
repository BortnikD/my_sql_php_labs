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
            INSERT INTO user (username, password_hash)
            VALUES (:username, :password_hash)
        ');
        $stmt->execute([
            ':username' => $data['username'],
            ':password_hash' => $data['password_hash'],
        ]);
        return (int)$this->pdo->lastInsertId();
    }

    public function update(int $id, array $data): bool
    {
        $stmt = $this->pdo->prepare('
            UPDATE user SET username = :username WHERE id = :id
        ');
        return $stmt->execute([':username' => $data['username'], ':id' => $id]);
    }

    public function delete(int $id): bool
    {
        $stmt = $this->pdo->prepare('DELETE FROM user WHERE id = :id');
        return $stmt->execute([':id' => $id]);
    }
}
