<?php

class Database {

    private static ?PDO $pdo = null;

    public static function getConnection(): PDO {
        if (self::$pdo === null) {
            $env = parse_ini_file(__DIR__ . "../../.env");
            self::$pdo = new PDO(
                "mysql:host={$env['DATABASE_HOST']};port={$env['DATABASE_PORT']};dbname={$env['DATABASE_NAME']};charset=utf8mb4",
                $env['DATABASE_USER'],
                $env['DATABASE_PASSWORD'],
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                ]
            );
        }
        return self::$pdo;
    }
}