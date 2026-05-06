<?php

abstract class CrudController
{
    abstract protected function repository(): CrudRepository;

    abstract protected function entityName(): string;

    protected function requiredReadRole(): string
    {
        return 'USER';
    }

    protected function requiredWriteRole(): string
    {
        return 'ADMIN';
    }

    public function handle(Request $request): void
    {
        $isWrite = in_array($request->method, ['POST', 'PUT', 'DELETE'], true);
        $required = $isWrite ? $this->requiredWriteRole() : $this->requiredReadRole();

        if (!$request->principal?->hasRole($required)) {
            AuditResponse::error('Forbidden', 403);
        }

        match ($request->method) {
            'GET' => $this->handleGet($request->id, $request->query),
            'POST' => $this->create($request),
            'PUT' => $this->update($request->id, $request),
            'DELETE' => $this->delete($request->id),
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

    final protected function create(Request $request): void
    {
        if (!$request->body) {
            AuditResponse::error('Invalid JSON body', 400);
        }
        $id = $this->repository()->create($request->body);
        AuditResponse::created(['id' => $id]);
    }

    final protected function update(?int $id, Request $request): void
    {
        if (!$id) {
            AuditResponse::error('ID is required', 400);
        }
        if (!$request->body) {
            AuditResponse::error('Invalid JSON body', 400);
        }
        $this->repository()->update($id, $request->body)
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
