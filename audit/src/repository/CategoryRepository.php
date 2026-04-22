<?php

readonly class CategoryRepository implements CrudRepository
{
    public function __construct(private PDO $pdo)
    {
    }

    public function findById(int $id): ?CategoryDto
    {
        $stmt = $this->pdo->prepare('SELECT * FROM category WHERE id = :id AND is_deleted = FALSE');
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch();
        return $row ? CategoryDto::fromRow($row) : null;
    }

    /** @return CategoryDto[] */
    public function findAll(): array
    {
        $stmt = $this->pdo->prepare('SELECT * FROM category WHERE is_deleted = FALSE ORDER BY id');
        $stmt->execute();
        return array_map(CategoryDto::fromRow(...), $stmt->fetchAll());
    }

    public function create(array $data): int
    {
        $stmt = $this->pdo->prepare('
            INSERT INTO category (name, rate)
            VALUES (:name, :rate)
        ');
        $stmt->execute([
            ':name' => $data['name'],
            ':rate' => $data['rate'],
        ]);
        return (int)$this->pdo->lastInsertId();
    }

    public function update(int $id, array $data): bool
    {
        $stmt = $this->pdo->prepare('
            UPDATE category
            SET name       = :name,
                rate       = :rate,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = :id AND is_deleted = FALSE
        ');
        return $stmt->execute([
            ':name' => $data['name'],
            ':rate' => $data['rate'],
            ':id' => $id,
        ]);
    }

    public function delete(int $id): bool
    {
        $stmt = $this->pdo->prepare('
            UPDATE category
            SET is_deleted = TRUE, deleted_at = CURRENT_TIMESTAMP
            WHERE id = :id AND is_deleted = FALSE
        ');
        return $stmt->execute([':id' => $id]);
    }
}
