<?php

readonly class CorsFilter implements Filter
{
    public function __construct(private string $allowOrigin = 'http://localhost:3000') {}

    public function doFilter(Request $request, FilterChain $chain): void
    {
        header("Access-Control-Allow-Origin: {$this->allowOrigin}");
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
        header('Content-Type: application/json; charset=utf-8');

        if ($request->method === 'OPTIONS') {
            http_response_code(204);
            exit;
        }

        $chain->next($request);
    }
}
