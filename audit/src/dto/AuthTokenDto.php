<?php

readonly class AuthTokenDto implements JsonSerializable
{
    public function __construct(
        public string  $token,
        public string  $username,
        public string  $role,
        public int     $expiresAt,
        public int     $loginCount = 0,
        public ?string $lastLoginAt = null,
    )
    {
    }

    public function jsonSerialize(): array
    {
        return [
            'token' => $this->token,
            'username' => $this->username,
            'role' => $this->role,
            'expires_at' => $this->expiresAt,
            'login_count' => $this->loginCount,
            'last_login_at' => $this->lastLoginAt,
        ];
    }
}
