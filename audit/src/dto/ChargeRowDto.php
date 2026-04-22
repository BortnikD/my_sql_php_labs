<?php

readonly class ChargeRowDto implements JsonSerializable
{
    public function __construct(
        public string $full_name,
        public string $category_name,
        public float  $rate,
        public string $completed_at,
        public float  $hours,
        public float  $paid_out,
    )
    {
    }

    public static function fromRow(array $row): self
    {
        return new self(
            full_name: $row['full_name'],
            category_name: $row['category_name'],
            rate: (float)$row['rate'],
            completed_at: $row['completed_at'],
            hours: (float)$row['hours'],
            paid_out: (float)$row['paid_out'],
        );
    }

    public function jsonSerialize(): mixed
    {
        return get_object_vars($this);
    }
}
