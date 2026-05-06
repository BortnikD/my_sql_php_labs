<?php

class DocsController
{
    public function __construct(PDO $pdo)
    {
    }

    public function handle(Request $request): void
    {
        if ($request->method !== 'GET') {
            AuditResponse::error('Method Not Allowed', 405);
        }

        header('Content-Type: text/html; charset=utf-8');
        echo <<<'HTML'
            <!doctype html>
            <html lang="ru">
            <head>
                <meta charset="utf-8"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <title>Audit API — Docs</title>
            </head>
            <body>
                <script id="api-reference" data-url="/openapi.json"></script>
                <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
            </body>
            </html>
            HTML;
        exit;
    }
}
