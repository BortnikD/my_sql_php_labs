<?php

require_once __DIR__ . '/src/config/Database.php';
require_once __DIR__ . '/src/config/Cors.php';
require_once __DIR__ . '/src/controller/AuditResponse.php';
require_once __DIR__ . '/src/dto/CategoryDto.php';
require_once __DIR__ . '/src/dto/EmployeeDto.php';
require_once __DIR__ . '/src/dto/JobDto.php';
require_once __DIR__ . '/src/dto/TimesheetDto.php';
require_once __DIR__ . '/src/repository/CrudRepository.php';
require_once __DIR__ . '/src/repository/CategoryRepository.php';
require_once __DIR__ . '/src/repository/EmployeeRepository.php';
require_once __DIR__ . '/src/repository/JobRepository.php';
require_once __DIR__ . '/src/repository/TimesheetRepository.php';
require_once __DIR__ . '/src/dto/ChargeRowDto.php';
require_once __DIR__ . '/src/dto/CompanyStatementDto.php';
require_once __DIR__ . '/src/dto/ChargesStatementDto.php';
require_once __DIR__ . '/src/repository/ChargesRepository.php';
require_once __DIR__ . '/src/controller/CrudController.php';
require_once __DIR__ . '/src/controller/CategoryController.php';
require_once __DIR__ . '/src/controller/EmployeeController.php';
require_once __DIR__ . '/src/controller/JobController.php';
require_once __DIR__ . '/src/controller/TimesheetController.php';
require_once __DIR__ . '/src/controller/ChargesController.php';

Cors::handle();

$pdo = Database::getConnection();
$method = $_SERVER['REQUEST_METHOD'];
$query = $_GET;

$path = trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/');
$parts = explode('/', $path);

$resource = $parts[0] ?? null;
$sub = isset($parts[1]) && $parts[1] !== '' ? $parts[1] : null;
$id = ($sub && is_numeric($sub)) ? (int)$sub : null;

match ($resource) {
    'employees' => (new EmployeeController($pdo))->handle($method, $id),
    'categories' => (new CategoryController($pdo))->handle($method, $id),
    'jobs' => (new JobController($pdo))->handle($method, $id),
    'timesheets' => (new TimesheetController($pdo))->handle($method, $id, $query),
    'charges' => (new ChargesController($pdo))->handle($method, $sub, $query),
    default => AuditResponse::error('Not Found', 404),
};
