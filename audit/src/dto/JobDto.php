<?php

readonly class JobDto implements JsonSerializable
{
    public function __construct(
        public int     $id,
        public string  $name,
        public string  $company_name,
        public string  $start_at,
        public bool    $is_completed,
        public ?string $completed_at,
        public string  $created_at,
        public ?string $updated_at,
    )
    {
    }

    public static function fromRow(array $row): self
    {
        return new self(
            id: (int)$row['id'],
            name: $row['name'],
            company_name: $row['company_name'],
            start_at: $row['start_at'],
            is_completed: (bool)$row['is_completed'],
            completed_at: $row['completed_at'] ?? null,
            created_at: $row['created_at'],
            updated_at: $row['updated_at'] ?? null,
        );
    }

    public function jsonSerialize(): mixed
    {
        return get_object_vars($this);
    }
}
