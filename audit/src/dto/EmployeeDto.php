<?php

readonly class EmployeeDto implements JsonSerializable
{
    public function __construct(
        public int     $id,
        public int     $category_id,
        public string  $first_name,
        public string  $last_name,
        public ?string $middle_name,
        public string  $birth_date,
        public string  $created_at,
        public ?string $updated_at,
    )
    {
    }

    public static function fromRow(array $row): self
    {
        return new self(
            id: (int)$row['id'],
            category_id: (int)$row['category_id'],
            first_name: $row['first_name'],
            last_name: $row['last_name'],
            middle_name: $row['middle_name'] ?? null,
            birth_date: $row['birth_date'],
            created_at: $row['created_at'],
            updated_at: $row['updated_at'] ?? null,
        );
    }

    public function jsonSerialize(): mixed
    {
        return get_object_vars($this);
    }
}
