<?php

class AuditResponseFactory {

    public static function success(mixed $data): void {
        http_response_code(200);
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
        exit;
    }

    public static function created(mixed $data): void {
        http_response_code(201);
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
        exit;
    }

    public static function error(string $message, int $status = 400): void {
        http_response_code($status);
        echo json_encode(['error' => $message], JSON_UNESCAPED_UNICODE);
        exit;
    }

}