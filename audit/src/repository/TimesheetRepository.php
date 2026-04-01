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
