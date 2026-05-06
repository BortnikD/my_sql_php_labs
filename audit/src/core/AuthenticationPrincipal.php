<?php

readonly class AuthenticationPrincipal
{
    public function __construct(
        public int    $id,
        public string $username,
        public string $role = 'USER',
    )
    {
    }

    public function hasRole(string $required): bool
    {
        return match ($required) {
            'USER' => true,
            'OPERATOR' => in_array($this->role, ['OPERATOR', 'ADMIN'], true),
            'ADMIN' => $this->role === 'ADMIN',
            default => false,
        };
    }
}
