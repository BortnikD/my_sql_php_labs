<?php

class ChargesController
{

    private ChargesRepository $repository;

    public function __construct(private readonly PDO $pdo)
    {
        $this->repository = new ChargesRepository($this->pdo);
    }

    public function handle(string $method, ?string $sub, array $query): void
    {
        if ($method !== 'GET') {
            AuditResponse::error('Method Not Allowed', 405);
        }

        $year = isset($query['year']) ? (int)$query['year'] : null;

        if (!$year) {
            AuditResponse::error('Query param year is required', 400);
        }

        match ($sub) {
            'total' => $this->getTotal($query, $year),
            'total-by-year' => $this->getTotalByYear($year),
            null => $this->getAll($query, $year),
            default => AuditResponse::error('Not Found', 404),
        };
    }

    private function getAll(array $query, int $year): void
    {
        $companyName = $query['company_name'] ?? null;
        if (!$companyName) {
            AuditResponse::error('Query param company_name is required', 400);
        }
        $data = $this->repository->getAllByCompanyNameAndYear($companyName, $year);
        AuditResponse::success($data);
    }

    private function getTotal(array $query, int $year): void
    {
        $companyName = $query['company_name'] ?? null;
        if (!$companyName) {
            AuditResponse::error('Query param company_name is required', 400);
        }
        $data = $this->repository->getTotalSumAndHoursByCompanyNameAndYear($companyName, $year);
        AuditResponse::success($data);
    }

    private function getTotalByYear(int $year): void
    {
        $data = $this->repository->getTotalSumAndHoursBydYear($year);
        AuditResponse::success($data);
    }
}
