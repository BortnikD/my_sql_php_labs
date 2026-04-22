<?php

readonly class JobRepository implements CrudRepository
{
    public function __construct(private PDO $pdo)
    {
    }

    public function findById(int $id): ?JobDto
    {
        $stmt = $this->pdo->prepare('SELECT * FROM job WHERE id = :id AND is_deleted = FALSE');
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch();
        return $row ? JobDto::fromRow($row) : null;
    }

    /** @return JobDto[] */
    public function findAll(): array
    {
        $stmt = $this->pdo->prepare('SELECT * FROM job WHERE is_deleted = FALSE ORDER BY id');
        $stmt->execute();
        return array_map(JobDto::fromRow(...), $stmt->fetchAll());
    }

    public function create(array $data): int
    {
        $stmt = $this->pdo->prepare('
            INSERT INTO job (name, company_name, start_at)
            VALUES (:name, :company_name, :start_at)
        ');
        $stmt->execute([
            ':name' => $data['name'],
            ':company_name' => $data['company_name'],
            ':start_at' => $data['start_at'],
        ]);
        return (int)$this->pdo->lastInsertId();
    }

    public function update(int $id, array $data): bool
    {
        $stmt = $this->pdo->prepare('
            UPDATE job
            SET name         = :name,
                company_name = :company_name,
                start_at     = :start_at,
                is_completed = :is_completed,
                completed_at = :completed_at,
                updated_at   = CURRENT_TIMESTAMP
            WHERE id = :id AND is_deleted = FALSE
        ');
        return $stmt->execute([
            ':name' => $data['name'],
            ':company_name' => $data['company_name'],
            ':start_at' => $data['start_at'],
            ':is_completed' => $data['is_completed'] ?? false,
            ':completed_at' => $data['completed_at'] ?? null,
            ':id' => $id,
        ]);
    }

    public function delete(int $id): bool
    {
        $stmt = $this->pdo->prepare('
            UPDATE job
            SET is_deleted = TRUE, deleted_at = CURRENT_TIMESTAMP
            WHERE id = :id AND is_deleted = FALSE
        ');
        return $stmt->execute([':id' => $id]);
    }
}
