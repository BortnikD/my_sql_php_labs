<?php

class ChargesController
{
    private ChargesRepository $repository;

    public function __construct(PDO $pdo)
    {
        $this->repository = new ChargesRepository($pdo);
    }

    public function handle(Request $request): void
    {
        if ($request->method !== 'GET') {
            AuditResponse::error('Method Not Allowed', 405);
        }

        $year = isset($request->query['year']) ? (int)$request->query['year'] : null;

        if (!$year) {
            AuditResponse::error('Query param year is required', 400);
        }

        match ($request->sub) {
            'total' => $this->getTotal($request->query, $year),
            'total-by-year' => $this->getTotalByYear($year),
            'statement' => $this->getStatement($year),
            null => $this->getAll($request->query, $year),
            default => AuditResponse::error('Not Found', 404),
        };
    }

    private function getAll(array $query, int $year): void
    {
        $companyName = $query['company_name'] ?? null;
        if (!$companyName) {
            AuditResponse::error('Query param company_name is required', 400);
        }
        AuditResponse::success($this->repository->getAllByCompanyNameAndYear($companyName, $year));
    }

    private function getTotal(array $query, int $year): void
    {
        $companyName = $query['company_name'] ?? null;
        if (!$companyName) {
            AuditResponse::error('Query param company_name is required', 400);
        }
        AuditResponse::success($this->repository->getTotalSumAndHoursByCompanyNameAndYear($companyName, $year));
    }

    private function getTotalByYear(int $year): void
    {
        AuditResponse::success($this->repository->getTotalSumAndHoursBydYear($year));
    }

    private function getStatement(int $year): void
    {
        AuditResponse::success($this->repository->getStatementByYear($year));
    }
}
