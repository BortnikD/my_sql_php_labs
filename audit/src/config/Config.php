<?php

class Config
{
    private static ?array $env = null;

    private static function load(): array
    {
        if (self::$env === null) {
            self::$env = parse_ini_file(__DIR__ . '/../../.env') ?: [];
        }
        return self::$env;
    }

    public static function get(string $key, string $default = ''): string
    {
        return self::load()[$key] ?? $default;
    }
}
