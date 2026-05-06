<?php

class Constants
{
    public static function jwtTtl(): int
    {
        return (int)Config::get('JWT_TTL', '86400');
    }

    public static function adminUsername(): string
    {
        return Config::get('ADMIN_USERNAME', 'admin');
    }

    public static function adminEmail(): string
    {
        return Config::get('ADMIN_EMAIL', 'admin@audit.local');
    }

    public static function adminPassword(): string
    {
        return Config::get('ADMIN_PASSWORD', 'admin123');
    }
}
