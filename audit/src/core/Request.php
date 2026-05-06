<?php

readonly class Request
{
    public function __construct(
        public string                   $method,
        public string                   $path,
        public array                    $pathParts,
        public ?string                  $resource,
        public ?string                  $sub,
        public ?int                     $id,
        public array                    $query,
        public array                    $headers,
        public ?array                   $body,
        public ?AuthenticationPrincipal $principal = null,
        public bool                     $authRequired = false,
    )
    {
    }

    public static function fromGlobals(): self
    {
        $method = $_SERVER['REQUEST_METHOD'];
        $path = trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/');
        $parts = explode('/', $path);

        $resource = ($parts[0] ?? '') !== '' ? $parts[0] : null;
        $sub = isset($parts[1]) && $parts[1] !== '' ? $parts[1] : null;
        $id = (is_numeric($sub)) ? (int)$sub : null;

        $headers = [];
        foreach ($_SERVER as $key => $value) {
            if (str_starts_with($key, 'HTTP_')) {
                $headers[substr($key, 5)] = $value;
            }
        }
        if (isset($_SERVER['CONTENT_TYPE'])) {
            $headers['CONTENT_TYPE'] = $_SERVER['CONTENT_TYPE'];
        }

        $rawBody = file_get_contents('php://input');
        $body = ($rawBody !== '') ? json_decode($rawBody, true) : null;

        return new self(
            method: $method,
            path: $path,
            pathParts: $parts,
            resource: $resource,
            sub: $sub,
            id: $id,
            query: $_GET,
            headers: $headers,
            body: $body,
        );
    }

    public function withPrincipal(AuthenticationPrincipal $principal): self
    {
        return new self(
            method: $this->method,
            path: $this->path,
            pathParts: $this->pathParts,
            resource: $this->resource,
            sub: $this->sub,
            id: $this->id,
            query: $this->query,
            headers: $this->headers,
            body: $this->body,
            principal: $principal,
            authRequired: $this->authRequired,
        );
    }

    public function withAuthRequired(bool $required): self
    {
        return new self(
            method: $this->method,
            path: $this->path,
            pathParts: $this->pathParts,
            resource: $this->resource,
            sub: $this->sub,
            id: $this->id,
            query: $this->query,
            headers: $this->headers,
            body: $this->body,
            principal: $this->principal,
            authRequired: $required,
        );
    }
}
