<?php

readonly class EmployeeRepository implements CrudRepository
{
    public function __construct(private PDO $pdo)
    {
    }

    public function findById(int $id): ?EmployeeDto
    {
        $stmt = $this->pdo->prepare('SELECT * FROM employee WHERE id = :id AND is_deleted = FALSE');
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch();
        return $row ? EmployeeDto::fromRow($row) : null;
    }

    /** @return EmployeeDto[] */
    public function findAll(): array
    {
        $stmt = $this->pdo->prepare('SELECT * FROM employee WHERE is_deleted = FALSE ORDER BY id DESC');
        $stmt->execute();
        return array_map(EmployeeDto::fromRow(...), $stmt->fetchAll());
    }

    public function create(array $data): int
    {
        $stmt = $this->pdo->prepare('
            INSERT INTO employee (category_id, first_name, last_name, middle_name, birth_date)
            VALUES (:category_id, :first_name, :last_name, :middle_name, :birth_date)
        ');
        $stmt->execute([
            ':category_id' => $data['category_id'],
            ':first_name' => $data['first_name'],
            ':last_name' => $data['last_name'],
            ':middle_name' => $data['middle_name'] ?? null,
            ':birth_date' => $data['birth_date'],
        ]);
        return (int)$this->pdo->lastInsertId();
    }

    public function update(int $id, array $data): bool
    {
        $stmt = $this->pdo->prepare('
            UPDATE employee
            SET category_id  = :category_id,
                first_name   = :first_name,
                last_name    = :last_name,
                middle_name  = :middle_name,
                birth_date   = :birth_date,
                updated_at   = CURRENT_TIMESTAMP
            WHERE id = :id AND is_deleted = FALSE
        ');
        return $stmt->execute([
            ':category_id' => $data['category_id'],
            ':first_name' => $data['first_name'],
            ':last_name' => $data['last_name'],
            ':middle_name' => $data['middle_name'] ?? null,
            ':birth_date' => $data['birth_date'],
            ':id' => $id,
        ]);
    }

    public function delete(int $id): bool
    {
        $stmt = $this->pdo->prepare('
            UPDATE employee
            SET is_deleted = TRUE, deleted_at = CURRENT_TIMESTAMP
            WHERE id = :id AND is_deleted = FALSE
        ');
        return $stmt->execute([':id' => $id]);
    }
}
