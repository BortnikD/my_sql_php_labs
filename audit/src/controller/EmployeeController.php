<?php

#[AllowDynamicProperties]
class EmployeeController {

    public function __construct(private readonly PDO $pdo) {
        $this->repository = new EmployeeRepository($this->pdo);
    }


}