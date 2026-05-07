<?php

class UserController
{
    private UserService $service;
    private UserRepository $repo;

    public function __construct(PDO $pdo)
    {
        $this->repo = new UserRepository($pdo);
        $this->service = new UserService(
            $this->repo,
            new JwtService(Config::get('JWT_SECRET', 'dev-secret'))
        );
    }

    public function handle(Request $request): void
    {
        $principal = $request->principal;
        $parts = $request->pathParts; // [users, sub?, id?, action?]
        $sub = $parts[1] ?? null;

        $targetId = is_numeric($sub) ? (int)$sub : null;

        match (true) {
            $request->method === 'GET'    && $sub === null           => $this->listUsers($principal),
            $request->method === 'GET'    && $sub === 'role-request' => $this->myRoleRequest($principal),
            $request->method === 'GET'    && $sub === 'role-requests'=> $this->listRoleRequests($principal),
            $request->method === 'PUT'    && $sub === 'role-requests'=> $this->handleRoleAction($principal, $parts),
            $request->method === 'PUT'    && $targetId !== null && ($parts[2] ?? null) === 'role'
                                                                     => $this->changeRole($principal, $targetId, $request),
            $request->method === 'DELETE' && $targetId !== null      => $this->deleteUser($principal, $targetId),
            default => AuditResponse::error('Not Found', 404),
        };
    }

    private function listUsers(?AuthenticationPrincipal $principal): void
    {
        $this->requireRole($principal, 'ADMIN');
        AuditResponse::success($this->repo->findAll());
    }

    private function myRoleRequest(?AuthenticationPrincipal $principal): void
    {
        if (!$principal) {
            AuditResponse::error('Unauthorized', 401);
        }
        $req = $this->repo->findLatestRoleRequestByUser($principal->id);
        AuditResponse::success($req ? $req->jsonSerialize() : ['status' => null]);
    }

    private function listRoleRequests(?AuthenticationPrincipal $principal): void
    {
        $this->requireRole($principal, 'ADMIN');
        AuditResponse::success($this->service->getPendingRoleRequests());
    }

    // PUT /users/role-requests/{id}/approve  или  /deny
    private function handleRoleAction(?AuthenticationPrincipal $principal, array $parts): void
    {
        $this->requireRole($principal, 'ADMIN');

        $requestId = isset($parts[2]) && is_numeric($parts[2]) ? (int)$parts[2] : null;
        $action = $parts[3] ?? null;

        if (!$requestId) {
            AuditResponse::error('Role request ID is required', 400);
        }

        try {
            match ($action) {
                'approve' => $this->service->approveRoleRequest($requestId),
                'deny' => $this->service->denyRoleRequest($requestId),
                default => AuditResponse::error('Unknown action. Use approve or deny', 400),
            };
            AuditResponse::success(['updated' => true]);
        } catch (RuntimeException $e) {
            AuditResponse::error($e->getMessage(), 404);
        }
    }

    // PUT /users/{id}/role   body: {"role":"ADMIN"|"OPERATOR"|"USER"}
    private function changeRole(?AuthenticationPrincipal $principal, int $targetId, Request $request): void
    {
        $this->requireRole($principal, 'ADMIN');

        $target = $this->repo->findById($targetId);
        if (!$target) {
            AuditResponse::error('User not found', 404);
        }
        if ($target->role === 'ADMIN') {
            AuditResponse::error('Cannot change role of another admin', 403);
        }

        $role = $request->body['role'] ?? null;
        $allowed = ['USER', 'OPERATOR', 'ADMIN'];
        if (!in_array($role, $allowed, true)) {
            AuditResponse::error('Invalid role. Allowed: USER, OPERATOR, ADMIN', 400);
        }

        $this->repo->updateRole($targetId, $role);
        AuditResponse::success(['updated' => true]);
    }

    // DELETE /users/{id}
    private function deleteUser(?AuthenticationPrincipal $principal, int $targetId): void
    {
        $this->requireRole($principal, 'ADMIN');

        if ($principal->id === $targetId) {
            AuditResponse::error('Cannot delete yourself', 403);
        }

        $target = $this->repo->findById($targetId);
        if (!$target) {
            AuditResponse::error('User not found', 404);
        }
        if ($target->role === 'ADMIN') {
            AuditResponse::error('Cannot delete another admin', 403);
        }

        $this->repo->delete($targetId);
        AuditResponse::success(['deleted' => true]);
    }

    private function requireRole(?AuthenticationPrincipal $principal, string $role): void
    {
        if (!$principal?->hasRole($role)) {
            AuditResponse::error('Forbidden', 403);
        }
    }
}
