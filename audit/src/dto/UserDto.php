<?php

readonly class UserDto implements JsonSerializable
{
    public function __construct(
        public int    $id,
        public string $username,
        public string $password_hash,
    )
    {
    }

    public static function fromRow(array $row): self
    {
        return new self(
            id: (int)$row['id'],
            username: $row['username'],
            password_hash: $row['password_hash'],
        );
    }

    // password_hash намеренно не сериализуется
    public function jsonSerialize(): mixed
    {
        return ['id' => $this->id, 'username' => $this->username];
    }
}
