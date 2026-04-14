<?php

abstract class CrudController
{
    abstract protected function repository(): CrudRepository;

    abstract protected function entityName(): string;

    public function handle(string $method, ?int $id, array $query = []): void
    {
        match ($method) {
            'GET' => $this->handleGet($id, $query),
            'POST' => $this->create(),
            'PUT' => $this->update($id),
            'DELETE' => $this->delete($id),
            default => AuditResponse::error('Method Not Allowed', 405),
        };
    }

    protected function handleGet(?int $id, array $query): void
    {
        $id ? $this->getById($id) : $this->getAll();
    }

    final protected function getAll(): void
    {
        AuditResponse::success($this->repository()->findAll());
    }

    final protected function getById(int $id): void
    {
        $entity = $this->repository()->findById($id);
        $entity
            ? AuditResponse::success($entity)
            : AuditResponse::error("{$this->entityName()} not found", 404);
    }

    final protected function create(): void
    {
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data) {
            AuditResponse::error('Invalid JSON body', 400);
        }
        $id = $this->repository()->create($data);
        AuditResponse::created(['id' => $id]);
    }

    final protected function update(?int $id): void
    {
        if (!$id) {
            AuditResponse::error('ID is required', 400);
        }
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data) {
            AuditResponse::error('Invalid JSON body', 400);
        }
        $this->repository()->update($id, $data)
            ? AuditResponse::success(['updated' => true])
            : AuditResponse::error("{$this->entityName()} not found", 404);
    }

    final protected function delete(?int $id): void
    {
        if (!$id) {
            AuditResponse::error('ID is required', 400);
        }
        $this->repository()->delete($id)
            ? AuditResponse::success(['deleted' => true])
            : AuditResponse::error("{$this->entityName()} not found", 404);
    }
}
