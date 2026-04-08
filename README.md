# Audit — система учёта рабочего времени

Учебный проект: REST API на чистом PHP + фронтенд на Next.js + MySQL в Docker.

## Структура проекта

```
.
├── audit/                      # PHP REST API
│   ├── index.php               # Точка входа, маршрутизация
│   ├── .htaccess               # Rewrite-правила для Apache
│   ├── .env                    # Конфиг подключения к БД
│   └── src/
│       ├── config/
│       │   ├── Database.php    # Синглтон PDO-подключения
│       │   └── Cors.php        # CORS-заголовки
│       ├── controller/
│       │   ├── AuditResponse.php
│       │   ├── CategoryController.php
│       │   ├── EmployeeController.php
│       │   ├── JobController.php
│       │   └── TimesheetController.php
│       └── repository/
│           ├── CategoryRepository.php
│           ├── EmployeeRepository.php
│           ├── JobRepository.php
│           └── TimesheetRepository.php
│
├── web-ui/                     # Next.js фронтенд
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── Aside.tsx
│   └── next.config.ts
│
├── sql_initialization/         # SQL-скрипты
│   ├── ddl.sql                 # Создание таблиц (БД audit_db)
│   ├── inserts.sql             # Тестовые данные
│   ├── queries.sql             # Примеры запросов
│   └── ServerLogic.sql         # Хранимая логика
│
├── docker/
│   └── php/
│       └── vhost.conf          # Apache VirtualHost конфиг
│
└── docker-compose.yml
```

## Сервисы

| Сервис      | Образ             | Порт        | Описание              |
|-------------|-------------------|-------------|-----------------------|
| `audit_db`  | `mysql:9`         | `3307:3306` | База данных MySQL     |
| `audit_api` | `php:8.2-apache`  | `8080:80`   | REST API              |
| `audit_ui`  | `node:20-alpine`  | `3000:3000` | Next.js фронтенд      |

## Схема базы данных

- **category** — категории сотрудников (ставка, название)
- **employee** → category — сотрудники (ФИО, дата рождения, soft-delete)
- **job** — работы/задачи (название, компания, даты, статус выполнения)
- **timesheet** → employee + job — табель рабочего времени (часы, soft-delete)

## Запуск

### Требования

- [Docker](https://www.docker.com/) и Docker Compose

### Запустить всё одной командой

```bash
docker compose up --build
```

После запуска:
- **API** — `http://localhost:8080`
- **UI** — `http://localhost:3000`
- **MySQL** — `localhost:3307` (пользователь: `mysql`, пароль: `mysql`)

База данных инициализируется автоматически из `sql_initialization/ddl.sql` и `inserts.sql` при первом запуске.

> **Первый запуск UI** занимает больше времени — `npm install` выполняется внутри контейнера.

### Запустить только отдельный сервис

```bash
# Только БД и API
docker compose up audit_db audit_api

# Только БД
docker compose up audit_db
```

### Остановить

```bash
docker compose down

# Остановить и удалить данные БД
docker compose down -v
```

## API

Подробная документация — [audit/API.md](audit/API.md) и [audit/docs/openapi.json](audit/docs/openapi.json).

### Ресурсы

| Метод  | Путь                | Описание                          |
|--------|---------------------|-----------------------------------|
| GET    | `/employees`        | Список сотрудников                |
| POST   | `/employees`        | Создать сотрудника                |
| PUT    | `/employees/{id}`   | Обновить сотрудника               |
| DELETE | `/employees/{id}`   | Soft-delete сотрудника            |
| GET    | `/categories`       | Список категорий                  |
| GET    | `/jobs`             | Список работ                      |
| GET    | `/timesheets`       | Табель (фильтры: `?employee_id=`, `?job_id=`) |

### Пример запроса

```bash
curl http://localhost:8080/employees
curl http://localhost:8080/timesheets?employee_id=1
```

## Локальная разработка без Docker

### API (PHP)

Требуется PHP 8.2+ с расширением `pdo_mysql`.

```bash
cd audit
php -S localhost:8080
```

### UI (Next.js)

```bash
cd web-ui
npm install
npm run dev
```

> При локальной разработке убедитесь, что `audit/.env` указывает на доступный MySQL (например, через Docker: `DATABASE_HOST=127.0.0.1`, `DATABASE_PORT=3307`).
