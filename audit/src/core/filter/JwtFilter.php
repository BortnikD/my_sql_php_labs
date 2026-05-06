<?php

readonly class JwtFilter implements Filter
{
    public function __construct(private JwtService $jwt) {}

    public function doFilter(Request $request, FilterChain $chain): void
    {
        if (!$request->authRequired) {
            $chain->next($request);
            return;
        }

        $authHeader = $request->headers['AUTHORIZATION'] ?? null;

        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            AuditResponse::error('Unauthorized', 401);
        }

        $principal = $this->jwt->parse(substr($authHeader, 7));

        if (!$principal) {
            AuditResponse::error('Unauthorized', 401);
        }

        $chain->next($request->withPrincipal($principal));
    }
}
