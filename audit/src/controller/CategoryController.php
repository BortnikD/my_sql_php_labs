<?php

class CategoryController
{

    private CategoryRepository $repository;

    public function __construct(private readonly PDO $pdo)
    {
        $this->repository = new CategoryRepository($this->pdo);
    }

    public function handle(string $method, ?int $id): void
    {
        match ($method) {
            'GET' => $id ? $this->getCategoryById($id) : $this->getAllCategories(),
            'POST' => $this->createCategory(),
            'PUT' => $this->updateCategory($id),
            'DELETE' => $this->deleteCategory($id),
            default => AuditResponse::error('Method Not Allowed', 405),
        };
    }

    private function getAllCategories(): void
    {
        $categories = $this->repository->findAll();
        AuditResponse::success($categories);
    }

    private function getCategoryById(int $id): void
    {
        $category = $this->repository->findById($id);
        if (!$category) {
            AuditResponse::error('Category not found', 404);
        }
        AuditResponse::success($category);
    }

    private function createCategory(): void
    {
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data) {
            AuditResponse::error('Invalid JSON body', 400);
        }
        $id = $this->repository->create($data);
        AuditResponse::created(['id' => $id]);
    }

    private function updateCategory(?int $id): void
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
            : AuditResponse::error('Category not found', 404);
    }

    private function deleteCategory(?int $id): void
    {
        if (!$id) {
            AuditResponse::error('ID is required', 400);
        }
        $ok = $this->repository->delete($id);
        $ok ? AuditResponse::success(['deleted' => true])
            : AuditResponse::error('Category not found', 404);
    }
}
