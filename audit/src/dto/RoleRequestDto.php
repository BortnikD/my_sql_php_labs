<?php

readonly class RoleRequestDto implements JsonSerializable
{
    public function __construct(
        public int    $id,
        public int    $userId,
        public string $username,
        public string $status,
        public string $createdAt,
    )
    {
    }

    public static function fromRow(array $row): self
    {
        return new self(
            id: (int)$row['id'],
            userId: (int)$row['user_id'],
            username: $row['username'],
            status: $row['status'],
            createdAt: $row['created_at'],
        );
    }

    public function jsonSerialize(): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->userId,
            'username' => $this->username,
            'status' => $this->status,
            'created_at' => $this->createdAt,
        ];
    }
}
