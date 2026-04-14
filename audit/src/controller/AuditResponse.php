<?php

class AuditResponse
{
    private static function setJsonHeader(): void
    {
        header('Content-Type: application/json; charset=utf-8');
    }

    public static function success(array|JsonSerializable $data): void
    {
        self::setJsonHeader();
        http_response_code(200);
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
        exit;
    }

    public static function created(array $data): void
    {
        self::setJsonHeader();
        http_response_code(201);
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
        exit;
    }

    public static function error(string $message, int $status = 400): void
    {
        self::setJsonHeader();
        http_response_code($status);
        echo json_encode(['error' => $message], JSON_UNESCAPED_UNICODE);
        exit;
    }
}
