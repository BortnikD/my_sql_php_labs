<?php

readonly class AuthTokenDto implements JsonSerializable
{
    public function __construct(
        public string $token,
        public string $username,
        public array  $roles,
        public int    $expiresAt,
    ) {}

    public function jsonSerialize(): array
    {
        return [
            'token'      => $this->token,
            'username'   => $this->username,
            'roles'      => $this->roles,
            'expires_at' => $this->expiresAt,
        ];
    }
}
