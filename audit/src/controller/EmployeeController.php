<?php

class EmployeeController extends CrudController
{
    private EmployeeRepository $repo;

    public function __construct(PDO $pdo)
    {
        $this->repo = new EmployeeRepository($pdo);
    }

    protected function repository(): CrudRepository
    {
        return $this->repo;
    }

    protected function entityName(): string
    {
        return 'Employee';
    }
}
