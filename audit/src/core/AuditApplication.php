<?php

class AuditApplication
{
    /** @var array<string, array{class: class-string, authRequired: bool}> */
    private array $routes = [];

    /** @var Filter[] */
    private array $filters = [];

    private function __construct(private PDO $pdo)
    {
    }

    public static function create(PDO $pdo): self
    {
        return new self($pdo);
    }

    public function addFilter(Filter $filter): self
    {
        $this->filters[] = $filter;
        return $this;
    }

    /**
     * @param class-string $controllerClass
     */
    public function register(string $resource, string $controllerClass, bool $authRequired = false): self
    {
        $this->routes[$resource] = [
            'class' => $controllerClass,
            'authRequired' => $authRequired,
        ];
        return $this;
    }

    public function run(): void
    {
        $request = Request::fromGlobals();

        $authRequired = $this->routes[$request->resource]['authRequired'] ?? false;
        if ($authRequired) {
            $request = $request->withAuthRequired(true);
        }

        $chain = new FilterChain($this->filters, fn(Request $req) => $this->dispatch($req));
        $chain->next($request);
    }

    private function dispatch(Request $request): void
    {
        $route = $this->routes[$request->resource] ?? null;

        if (!$route) {
            AuditResponse::error('Not Found', 404);
        }

        (new $route['class']($this->pdo))->handle($request);
    }
}
