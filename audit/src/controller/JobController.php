<?php

class JobController extends CrudController
{
    private JobRepository $repo;

    public function __construct(PDO $pdo)
    {
        $this->repo = new JobRepository($pdo);
    }

    protected function repository(): CrudRepository
    {
        return $this->repo;
    }

    protected function entityName(): string
    {
        return 'Job';
    }
}
