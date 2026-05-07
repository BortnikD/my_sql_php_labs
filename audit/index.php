<?php

require_once __DIR__ . '/src/config/Database.php';
require_once __DIR__ . '/src/config/Config.php';
require_once __DIR__ . '/src/config/Constants.php';
require_once __DIR__ . '/src/controller/AuditResponse.php';
require_once __DIR__ . '/src/core/AuthenticationPrincipal.php';
require_once __DIR__ . '/src/core/Request.php';
require_once __DIR__ . '/src/core/filter/Filter.php';
require_once __DIR__ . '/src/core/filter/FilterChain.php';
require_once __DIR__ . '/src/core/filter/CorsFilter.php';
require_once __DIR__ . '/src/core/filter/JwtFilter.php';
require_once __DIR__ . '/src/core/AdminSeeder.php';
require_once __DIR__ . '/src/core/AuditApplication.php';
require_once __DIR__ . '/src/dto/UserDto.php';
require_once __DIR__ . '/src/dto/AuthTokenDto.php';
require_once __DIR__ . '/src/dto/RoleRequestDto.php';
require_once __DIR__ . '/src/dto/CategoryDto.php';
require_once __DIR__ . '/src/dto/EmployeeDto.php';
require_once __DIR__ . '/src/dto/JobDto.php';
require_once __DIR__ . '/src/dto/TimesheetDto.php';
require_once __DIR__ . '/src/dto/ChargeRowDto.php';
require_once __DIR__ . '/src/dto/CompanyStatementDto.php';
require_once __DIR__ . '/src/dto/ChargesStatementDto.php';
require_once __DIR__ . '/src/repository/CrudRepository.php';
require_once __DIR__ . '/src/repository/UserRepository.php';
require_once __DIR__ . '/src/repository/CategoryRepository.php';
require_once __DIR__ . '/src/repository/EmployeeRepository.php';
require_once __DIR__ . '/src/repository/JobRepository.php';
require_once __DIR__ . '/src/repository/TimesheetRepository.php';
require_once __DIR__ . '/src/repository/ChargesRepository.php';
require_once __DIR__ . '/src/service/JwtService.php';
require_once __DIR__ . '/src/service/UserService.php';
require_once __DIR__ . '/src/controller/CrudController.php';
require_once __DIR__ . '/src/controller/AuthController.php';
require_once __DIR__ . '/src/controller/CategoryController.php';
require_once __DIR__ . '/src/controller/EmployeeController.php';
require_once __DIR__ . '/src/controller/JobController.php';
require_once __DIR__ . '/src/controller/TimesheetController.php';
require_once __DIR__ . '/src/controller/ChargesController.php';
require_once __DIR__ . '/src/controller/UserController.php';
require_once __DIR__ . '/src/controller/DocsController.php';


AuditApplication::create(Database::getConnection())
    ->addFilter(new CorsFilter())
    ->addFilter(new JwtFilter(new JwtService(Config::get('JWT_SECRET'))))
    ->register('docs', DocsController::class)
    ->register('auth', AuthController::class)
    ->register('employees', EmployeeController::class, authRequired: true)
    ->register('categories', CategoryController::class, authRequired: true)
    ->register('jobs', JobController::class, authRequired: true)
    ->register('timesheets', TimesheetController::class, authRequired: true)
    ->register('charges', ChargesController::class, authRequired: true)
    ->register('users', UserController::class, authRequired: true)
    ->run();
