<?php

readonly class TimesheetRepository
{

    public function __construct(private PDO $pdo)
    {
    }

    public function findById(int $id): array|false
    {
        $stmt = $this->pdo->prepare('SELECT * FROM timesheet WHERE id = :id AND is_deleted = FALSE');
        $stmt->execute([':id' => $id]);
        return $stmt->fetch();
    }

    public function findAll(): array
    {
        $stmt = $this->pdo->prepare('SELECT * FROM timesheet WHERE is_deleted = FALSE ORDER BY id DESC');
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function findByEmployee(int $employeeId): array
    {
        $stmt = $this->pdo->prepare('
            SELECT * FROM timesheet
            WHERE employee_id = :employee_id AND is_deleted = FALSE
            ORDER BY id DESC
        ');
        $stmt->execute([':employee_id' => $employeeId]);
        return $stmt->fetchAll();
    }

    public function findByJob(int $jobId): array
    {
        $stmt = $this->pdo->prepare('
            SELECT * FROM timesheet
            WHERE job_id = :job_id AND is_deleted = FALSE
            ORDER BY id DESC
        ');
        $stmt->execute([':job_id' => $jobId]);
        return $stmt->fetchAll();
    }

    public function create(array $data): int
    {
        $stmt = $this->pdo->prepare('
            INSERT INTO timesheet (employee_id, job_id, hours)
            VALUES (:employee_id, :job_id, :hours)
        ');

        $stmt->execute([
            ':employee_id' => $data['employee_id'],
            ':job_id' => $data['job_id'],
            ':hours' => $data['hours'],
        ]);
        return (int)$this->pdo->lastInsertId();
    }

    public function update(int $id, array $data): bool
    {
        $stmt = $this->pdo->prepare('
            UPDATE timesheet
            SET employee_id = :employee_id,
                job_id      = :job_id,
                hours       = :hours,
                updated_at  = CURRENT_TIMESTAMP
            WHERE id = :id AND is_deleted = FALSE
        ');

        return $stmt->execute([
            ':employee_id' => $data['employee_id'],
            ':job_id' => $data['job_id'],
            ':hours' => $data['hours'],
            ':id' => $id,
        ]);
    }

    public function getStatementOfCharges(): array
    {
        $stmt = $this->pdo->prepare("
            SELECT CONCAT(SUBSTRING(e.first_name, 1, 1), '.', COALESCE(SUBSTRING(e.middle_name, 1, 1), ''), '.',
                          e.last_name) AS full_name,
                   c.name              AS category_name,
                   c.rate,
                   j.completed_at,
                   t.hours,
                   c.rate * t.hours    AS paid_out
            FROM employee e
                     JOIN category c ON e.category_id = c.id
                     JOIN timesheet t ON e.id = t.employee_id
                     JOIN job j ON t.job_id = j.id
            WHERE e.is_deleted = FALSE
              AND t.is_deleted = FALSE
              AND j.is_completed = TRUE
        ");
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function delete(int $id): bool
    {
        $stmt = $this->pdo->prepare('
            UPDATE timesheet
            SET is_deleted = TRUE, deleted_at = CURRENT_TIMESTAMP
            WHERE id = :id AND is_deleted = FALSE
        ');
        return $stmt->execute([':id' => $id]);
    }
}
