<?php

class CategoryController extends CrudController
{
    private CategoryRepository $repo;

    public function __construct(PDO $pdo)
    {
        $this->repo = new CategoryRepository($pdo);
    }

    protected function repository(): CrudRepository
    {
        return $this->repo;
    }

    protected function entityName(): string
    {
        return 'Category';
    }
}
