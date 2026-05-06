<?php

readonly class AuthenticationPrincipal
{
    /**
     * @param string[] $roles
     */
    public function __construct(
        public int    $id,
        public string $username,
        public array  $roles = [],
    )
    {
    }

    public function hasRole(string $role): bool
    {
        return in_array($role, $this->roles, true);
    }
}
