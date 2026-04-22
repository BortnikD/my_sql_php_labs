<?php

readonly class ChargesRepository
{

    public function __construct(private PDO $pdo)
    {
    }

    public function getAllByCompanyNameAndYear(string $companyName, int $year): array
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
              AND j.company_name = :company_name
              AND j.completed_at >= :start_of_year AND j.completed_at < :end_of_year
        ");
        $stmt->execute([
            ':company_name' => $companyName,
            ':start_of_year' => $year . '-01-01 00:00:00',
            ':end_of_year' => ($year + 1) . '-01-01 00:00:00',
        ]);
        return $stmt->fetchAll();
    }

    public function getTotalSumAndHoursByCompanyNameAndYear(string $companyName, int $year): array
    {
        $stmt = $this->pdo->prepare("
            SELECT j.company_name, SUM(t.hours) as total_hours, SUM(c.rate * t.hours) AS total_sum
            FROM employee e
                     JOIN category c ON e.category_id = c.id
                     JOIN timesheet t ON e.id = t.employee_id
                     JOIN job j ON t.job_id = j.id
            WHERE e.is_deleted = FALSE
              AND t.is_deleted = FALSE
              AND j.is_completed = TRUE
              AND j.company_name = :company_name
              AND j.completed_at >= :start_of_year AND j.completed_at < :end_of_year
            GROUP BY j.company_name
        ");
        $stmt->execute([
            ':company_name' => $companyName,
            ':start_of_year' => $year . '-01-01 00:00:00',
            ':end_of_year' => ($year + 1) . '-01-01 00:00:00',
        ]);
        return $stmt->fetchAll();
    }

    public function getStatementByYear(int $year): ChargesStatementDto
    {
        $stmt = $this->pdo->prepare("
            SELECT j.company_name,
                   CONCAT(SUBSTRING(e.first_name, 1, 1), '.', COALESCE(SUBSTRING(e.middle_name, 1, 1), ''), '.',
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
              AND j.completed_at >= :start_of_year AND j.completed_at < :end_of_year
            ORDER BY j.company_name, e.last_name
        ");
        $stmt->execute([
            ':start_of_year' => $year . '-01-01 00:00:00',
            ':end_of_year' => ($year + 1) . '-01-01 00:00:00',
        ]);

        $grouped = [];
        foreach ($stmt->fetchAll() as $row) {
            $grouped[$row['company_name']][] = ChargeRowDto::fromRow($row);
        }

        $companies = [];
        $totalHours = 0.0;
        $totalSum = 0.0;

        foreach ($grouped as $companyName => $charges) {
            $companyHours = array_sum(array_map(fn(ChargeRowDto $r) => $r->hours, $charges));
            $companySum = array_sum(array_map(fn(ChargeRowDto $r) => $r->paid_out, $charges));
            $totalHours += $companyHours;
            $totalSum += $companySum;
            $companies[] = new CompanyStatementDto($companyName, $charges, $companyHours, $companySum);
        }

        return new ChargesStatementDto($companies, $totalHours, $totalSum);
    }

    public function getTotalSumAndHoursBydYear(int $year): array
    {
        $stmt = $this->pdo->prepare("
            SELECT SUM(t.hours) as total_hours, SUM(c.rate * t.hours) AS total_sum
            FROM employee e
                     JOIN category c ON e.category_id = c.id
                     JOIN timesheet t ON e.id = t.employee_id
                     JOIN job j ON t.job_id = j.id
            WHERE e.is_deleted = FALSE
              AND t.is_deleted = FALSE
              AND j.is_completed = TRUE
              AND j.completed_at >= :start_of_year AND j.completed_at < :end_of_year
        ");
        $stmt->execute([
            ':start_of_year' => $year . '-01-01 00:00:00',
            ':end_of_year' => ($year + 1) . '-01-01 00:00:00',
        ]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
