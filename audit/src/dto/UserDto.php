<?php

readonly class UserDto implements JsonSerializable
{
    public function __construct(
        public int     $id,
        public string  $username,
        public string  $email,
        public string  $password_hash,
        public string  $role = 'USER',
        public int     $loginCount = 0,
        public ?string $lastLoginAt = null,
    )
    {
    }

    public static function fromRow(array $row): self
    {
        return new self(
            id: (int)$row['id'],
            username: $row['username'],
            email: $row['email'],
            password_hash: $row['password_hash'],
            role: $row['role'] ?? 'USER',
            loginCount: (int)($row['login_count'] ?? 0),
            lastLoginAt: $row['last_login_at'] ?? null,
        );
    }

    // password_hash намеренно не сериализуется
    public function jsonSerialize(): mixed
    {
        return [
            'id' => $this->id,
            'username' => $this->username,
            'email' => $this->email,
            'role' => $this->role,
            'login_count' => $this->loginCount,
            'last_login_at' => $this->lastLoginAt,
        ];
    }
}
