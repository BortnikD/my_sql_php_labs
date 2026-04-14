<?php

readonly class TimesheetDto implements JsonSerializable
{
    public function __construct(
        public int     $id,
        public int     $employee_id,
        public int     $job_id,
        public float   $hours,
        public string  $created_at,
        public ?string $updated_at,
    )
    {
    }

    public static function fromRow(array $row): self
    {
        return new self(
            id: (int)$row['id'],
            employee_id: (int)$row['employee_id'],
            job_id: (int)$row['job_id'],
            hours: (float)$row['hours'],
            created_at: $row['created_at'],
            updated_at: $row['updated_at'] ?? null,
        );
    }

    public function jsonSerialize(): mixed
    {
        return get_object_vars($this);
    }
}
