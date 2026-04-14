<?php

class TimesheetController extends CrudController
{
    private TimesheetRepository $repo;

    public function __construct(PDO $pdo)
    {
        $this->repo = new TimesheetRepository($pdo);
    }

    protected function repository(): CrudRepository
    {
        return $this->repo;
    }

    protected function entityName(): string
    {
        return 'Timesheet';
    }

    protected function handleGet(?int $id, array $query): void
    {
        if ($id) {
            $this->getById($id);
        } elseif (isset($query['employee_id'])) {
            AuditResponse::success($this->repo->findByEmployee((int)$query['employee_id']));
        } elseif (isset($query['job_id'])) {
            AuditResponse::success($this->repo->findByJob((int)$query['job_id']));
        } else {
            $this->getAll();
        }
    }
}
