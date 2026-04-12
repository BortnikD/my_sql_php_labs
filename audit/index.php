<?php

require_once __DIR__ . '/src/config/Database.php';
require_once __DIR__ . '/src/config/Cors.php';
require_once __DIR__ . '/src/controller/AuditResponse.php';
require_once __DIR__ . '/src/repository/CategoryRepository.php';
require_once __DIR__ . '/src/repository/EmployeeRepository.php';
require_once __DIR__ . '/src/repository/JobRepository.php';
require_once __DIR__ . '/src/repository/TimesheetRepository.php';
require_once __DIR__ . '/src/controller/CategoryController.php';
require_once __DIR__ . '/src/controller/EmployeeController.php';
require_once __DIR__ . '/src/controller/JobController.php';
require_once __DIR__ . '/src/controller/TimesheetController.php';

Cors::handle();

$pdo = Database::getConnection();
$method = $_SERVER['REQUEST_METHOD'];
$query = $_GET;

$path = trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/');
$parts = explode('/', $path);

$resource = $parts[0] ?? null;
$id = isset($parts[1]) && $parts[1] !== '' ? (int)$parts[1] : null;

match ($resource) {
    'employees' => (new EmployeeController($pdo))->handle($method, $id),
    'categories' => (new CategoryController($pdo))->handle($method, $id),
    'jobs' => (new JobController($pdo))->handle($method, $id),
    'timesheets' => (new TimesheetController($pdo))->handle($method, $id, $query),
    'charges' => (new TimesheetController($pdo))->handleCharges(),
    default => AuditResponse::error('Not Found', 404),
};
