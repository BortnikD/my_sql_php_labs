<?php

readonly class CategoryDto implements JsonSerializable
{
    public function __construct(
        public int     $id,
        public string  $name,
        public float   $rate,
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
            rate: (float)$row['rate'],
            created_at: $row['created_at'],
            updated_at: $row['updated_at'] ?? null,
        );
    }

    public function jsonSerialize(): mixed
    {
        return get_object_vars($this);
    }
}
