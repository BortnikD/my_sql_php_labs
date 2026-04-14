<?php

interface CrudRepository
{
    public function findById(int $id): ?JsonSerializable;

    /** @return JsonSerializable[] */
    public function findAll(): array;

    public function create(array $data): int;

    public function update(int $id, array $data): bool;

    public function delete(int $id): bool;
}
