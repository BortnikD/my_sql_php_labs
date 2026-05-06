<?php

readonly class JwtService
{
    public function __construct(private string $secret)
    {
    }

    public function generate(UserDto $user): AuthTokenDto
    {
        $exp   = time() + 86400;
        $roles = ['ROLE_USER'];

        $header  = $this->b64url(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
        $payload = $this->b64url(json_encode([
            'sub'   => $user->username,
            'id'    => $user->id,
            'roles' => $roles,
            'iat'   => time(),
            'exp'   => $exp,
        ]));
        $sig   = $this->b64url(hash_hmac('sha256', "$header.$payload", $this->secret, true));
        $token = "$header.$payload.$sig";

        return new AuthTokenDto(
            token:     $token,
            username:  $user->username,
            roles:     $roles,
            expiresAt: $exp,
        );
    }

    public function parse(string $token): ?AuthenticationPrincipal
    {
        $parts = explode('.', $token);
        if (count($parts) !== 3) return null;

        [$headerB64, $payloadB64, $signature] = $parts;

        $expected = $this->b64url(
            hash_hmac('sha256', "$headerB64.$payloadB64", $this->secret, true)
        );

        if (!hash_equals($expected, $signature)) return null;

        $payload = json_decode(
            base64_decode(strtr($payloadB64, '-_', '+/')),
            true
        );

        if (!is_array($payload)) return null;
        if (isset($payload['exp']) && $payload['exp'] < time()) return null;

        return new AuthenticationPrincipal(
            id: (int)($payload['id'] ?? 0),
            username: $payload['sub'] ?? '',
            roles: $payload['roles'] ?? [],
        );
    }

    private function b64url(string $data): string
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }
}
