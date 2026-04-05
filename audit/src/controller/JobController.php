<?php

class JobController
{

    private JobRepository $repository;

    public function __construct(private readonly PDO $pdo)
    {
        $this->repository = new JobRepository($this->pdo);
    }

    public function handle(string $method, ?int $id): void
    {
        match ($method) {
            'GET' => $id ? $this->getJobById($id) : $this->getAllJobs(),
            'POST' => $this->createJob(),
            'PUT' => $this->updateJob($id),
            'DELETE' => $this->deleteJob($id),
            default => AuditResponse::error('Method Not Allowed', 405),
        };
    }

    private function getAllJobs(): void
    {
        $jobs = $this->repository->findAll();
        AuditResponse::success($jobs);
    }

    private function getJobById(int $id): void
    {
        $job = $this->repository->findById($id);
        if (!$job) {
            AuditResponse::error('Job not found', 404);
        }
        AuditResponse::success($job);
    }

    private function createJob(): void
    {
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data) {
            AuditResponse::error('Invalid JSON body', 400);
        }
        $id = $this->repository->create($data);
        AuditResponse::created(['id' => $id]);
    }

    private function updateJob(?int $id): void
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
            : AuditResponse::error('Job not found', 404);
    }

    private function deleteJob(?int $id): void
    {
        if (!$id) {
            AuditResponse::error('ID is required', 400);
        }
        $ok = $this->repository->delete($id);
        $ok ? AuditResponse::success(['deleted' => true])
            : AuditResponse::error('Job not found', 404);
    }
}
