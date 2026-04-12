<?php

class TimesheetController
{

    private TimesheetRepository $repository;

    public function __construct(private readonly PDO $pdo)
    {
        $this->repository = new TimesheetRepository($this->pdo);
    }

    public function handle(string $method, ?int $id, array $query): void
    {
        match ($method) {
            'GET' => $this->handleGet($id, $query),
            'POST' => $this->createTimesheet(),
            'PUT' => $this->updateTimesheet($id),
            'DELETE' => $this->deleteTimesheet($id),
            default => AuditResponse::error('Method Not Allowed', 405),
        };
    }

    private function handleGet(?int $id, array $query): void
    {
        if ($id) {
            $this->getTimesheetById($id);
        } elseif (isset($query['employee_id'])) {
            $this->getTimesheetsByEmployee((int)$query['employee_id']);
        } elseif (isset($query['job_id'])) {
            $this->getTimesheetsByJob((int)$query['job_id']);
        } else {
            $this->getAllTimesheets();
        }
    }

    private function getAllTimesheets(): void
    {
        $timesheets = $this->repository->findAll();
        AuditResponse::success($timesheets);
    }

    private function getTimesheetById(int $id): void
    {
        $timesheet = $this->repository->findById($id);
        if (!$timesheet) {
            AuditResponse::error('Timesheet not found', 404);
        }
        AuditResponse::success($timesheet);
    }

    private function getTimesheetsByEmployee(int $employeeId): void
    {
        $timesheets = $this->repository->findByEmployee($employeeId);
        AuditResponse::success($timesheets);
    }

    private function getTimesheetsByJob(int $jobId): void
    {
        $timesheets = $this->repository->findByJob($jobId);
        AuditResponse::success($timesheets);
    }

    private function createTimesheet(): void
    {
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data) {
            AuditResponse::error('Invalid JSON body', 400);
        }
        $id = $this->repository->create($data);
        AuditResponse::created(['id' => $id]);
    }

    private function updateTimesheet(?int $id): void
    {
        if (!$id) {
            AuditResponse::error('ID is required', 400);
        }
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data) {
            AuditResponse::error('Invalid JSON body', 400);
        }
        $ok = $this->repository->update($id, $data);
        $ok ? AuditResponse::success(['updated' => true])
            : AuditResponse::error('Timesheet not found', 404);
    }

    private function deleteTimesheet(?int $id): void
    {
        if (!$id) {
            AuditResponse::error('ID is required', 400);
        }
        $ok = $this->repository->delete($id);
        $ok ? AuditResponse::success(['deleted' => true])
            : AuditResponse::error('Timesheet not found', 404);
    }
}
