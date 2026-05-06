<?php

class AuthController
{
    private UserService $service;

    public function __construct(PDO $pdo)
    {
        $jwt = new JwtService(Config::get('JWT_SECRET', 'dev-secret'));
        $this->service = new UserService(new UserRepository($pdo), $jwt);
    }

    public function handle(Request $request): void
    {
        if ($request->method !== 'POST') {
            AuditResponse::error('Method Not Allowed', 405);
        }

        match ($request->sub) {
            'login' => $this->login($request),
            'register' => $this->register($request),
            default => AuditResponse::error('Not Found', 404),
        };
    }

    private function login(Request $request): void
    {
        $body = $request->body;
        if (!isset($body['username'], $body['password'])) {
            AuditResponse::error('username and password are required', 400);
        }

        $authToken = $this->service->login($body['username'], $body['password']);

        if (!$authToken) {
            AuditResponse::error('Invalid credentials', 401);
        }

        AuditResponse::success($authToken);
    }

    private function register(Request $request): void
    {
        $body = $request->body;
        if (!isset($body['username'], $body['email'], $body['password'])) {
            AuditResponse::error('username, email and password are required', 400);
        }

        try {
            $id = $this->service->register($body['username'], $body['email'], $body['password']);
            AuditResponse::created(['id' => $id]);
        } catch (RuntimeException $e) {
            AuditResponse::error($e->getMessage(), 422);
        }
    }
}
