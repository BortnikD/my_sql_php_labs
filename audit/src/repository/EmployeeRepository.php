<?php

readonly class EmployeeRepository {

    private function __construct(private PDO $pdo) {}

    public function findById(int $id): array|false {
        $stmt = $this->pdo->prepare('SELECT * FROM employee WHERE id = :id');
        $stmt->execute([$id]);
        return $stmt->fetch();
    }

    public function findAll(): array {
        return $this->pdo
            ->prepare('SELECT * FROM employee ORDER BY id DESC')
            ->fetchAll();
    }


    public function create(array $data): int {

    }

}