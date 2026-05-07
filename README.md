# Audit — система учёта начислений сотрудников

Учебный проект: REST API на чистом PHP + фронтенд на Next.js + MySQL в Docker.

## Стек

| Слой     | Технология                        |
|----------|-----------------------------------|
| Backend  | PHP 8.2, Apache, PDO, JWT (HS256) |
| Frontend | Next.js 14 (App Router), Tailwind |
| Database | MySQL 9                           |
| Infra    | Docker Compose                    |

## Структура проекта

```
.
├── audit/                          # PHP REST API
│   ├── index.php                   # Точка входа, маршрутизация
│   ├── openapi.json                # OpenAPI 3.0 спецификация
│   ├── .htaccess                   # Rewrite-правила для Apache
│   ├── .env                        # Конфиг (см. .env.example)
│   └── src/
│       ├── config/
│       │   ├── Config.php          # Чтение .env
│       │   ├── Constants.php       # Централизованные настройки (JWT TTL, admin)
│       │   └── Database.php        # Синглтон PDO-подключения
│       ├── core/
│       │   ├── AdminSeeder.php     # Авто-создание администратора при старте
│       │   ├── AuditApplication.php
│       │   ├── AuthenticationPrincipal.php
│       │   ├── Request.php
│       │   └── filter/
│       │       ├── CorsFilter.php
│       │       ├── JwtFilter.php
│       │       └── FilterChain.php
│       ├── controller/
│       │   ├── AuditResponse.php
│       │   ├── AuthController.php      # POST /auth/login, /auth/register
│       │   ├── CrudController.php      # Абстрактный CRUD с ролевой защитой
│       │   ├── CategoryController.php
│       │   ├── ChargesController.php
│       │   ├── DocsController.php      # GET /docs — Scalar UI
│       │   ├── EmployeeController.php
│       │   ├── JobController.php
│       │   ├── TimesheetController.php
│       │   └── UserController.php      # Управление пользователями и заявками
│       ├── service/
│       │   ├── JwtService.php
│       │   └── UserService.php
│       ├── repository/
│       │   ├── CrudRepository.php
│       │   ├── CategoryRepository.php
│       │   ├── ChargesRepository.php
│       │   ├── EmployeeRepository.php
│       │   ├── JobRepository.php
│       │   ├── TimesheetRepository.php
│       │   └── UserRepository.php
│       └── dto/
│           ├── AuthTokenDto.php
│           ├── UserDto.php
│           ├── RoleRequestDto.php
│           ├── CategoryDto.php
│           ├── EmployeeDto.php
│           ├── JobDto.php
│           ├── TimesheetDto.php
│           ├── ChargeRowDto.php
│           ├── ChargesStatementDto.php
│           └── CompanyStatementDto.php
│
├── web-ui/                         # Next.js фронтенд (App Router)
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                # Главная: инфо + кнопка входа / статус заявки
│   │   ├── globals.css
│   │   ├── Aside.tsx               # Боковая навигация (фильтруется по роли)
│   │   ├── auth/page.tsx           # Вход / регистрация + «Запомнить меня»
│   │   ├── admin/page.tsx          # Заявки на роль оператора (только ADMIN)
│   │   ├── employees/page.tsx
│   │   ├── categories/page.tsx
│   │   ├── jobs/page.tsx
│   │   ├── timesheets/page.tsx
│   │   ├── charges/page.tsx
│   │   └── components/
│   │       ├── AppShell.tsx        # Роутинг-гард + баннер приветствия
│   │       ├── DataTable.tsx
│   │       ├── EntityModal.tsx
│   │       └── ConfirmModal.tsx
│   └── lib/
│       ├── auth.ts                 # sessionStorage / localStorage утилиты
│       ├── axiosInstance.ts
│       ├── types.ts
│       └── webclients/
│           ├── AuthClient.ts
│           ├── UserClient.ts
│           ├── EmployeeClient.ts
│           ├── CategoryClient.ts
│           ├── JobClient.ts
│           ├── TimesheetClient.ts
│           └── ChargesClient.ts
│
├── sql_initialization/
│   ├── ddl.sql                     # Создание таблиц
│   ├── inserts.sql                 # Тестовые данные
│   ├── queries.sql
│   └── ServerLogic.sql
│
├── docker/php/
│   ├── Dockerfile
│   └── vhost.conf
│
└── docker-compose.yml
```

## Сервисы

| Сервис      | Образ            | Порт        | Описание          |
|-------------|------------------|-------------|-------------------|
| `audit_db`  | `mysql:9`        | `3307:3306` | База данных MySQL |
| `audit_api` | PHP 8.2 + Apache | `8080:80`   | REST API          |
| `audit_ui`  | `node:20-alpine` | `3000:3000` | Next.js фронтенд  |

## Схема базы данных

| Таблица         | Описание                                                              |
|-----------------|-----------------------------------------------------------------------|
| `category`      | Категории сотрудников (название, ставка ₽/ч, soft-delete)            |
| `employee`      | Сотрудники (ФИО, дата рождения, категория, soft-delete)               |
| `job`           | Работы (название, компания, даты, статус выполнения, soft-delete)     |
| `timesheet`     | Табель (сотрудник × работа × часы, soft-delete)                       |
| `user`          | Пользователи (username, email, bcrypt-хэш, роль, счётчик входов)     |
| `role_requests` | Заявки на роль оператора (PENDING / APPROVED / DENIED)               |

## Роли и права доступа

| Роль       | Права                                                                  |
|------------|------------------------------------------------------------------------|
| `USER`     | Чтение справочников (employees, categories, jobs). Ждёт апрув заявки. |
| `OPERATOR` | Доступ к ведомостям начислений (`/charges/*`)                          |
| `ADMIN`    | Полный CRUD по всем ресурсам + управление пользователями и заявками    |

Иерархия проверяется через `hasRole()`: `ADMIN` удовлетворяет проверке `OPERATOR`, `OPERATOR` — проверке `USER`.

При регистрации автоматически создаётся заявка на роль `OPERATOR`. Администратор одобряет или отклоняет её в разделе **Заявки**.

## Запуск

### Требования

- [Docker](https://www.docker.com/) и Docker Compose

### Подготовка конфига

```bash
cp audit/.env.example audit/.env
```

Необходимые переменные (`audit/.env`):

```ini
DATABASE_HOST=audit_db
DATABASE_PORT=3306
DATABASE_USER=mysql
DATABASE_PASSWORD=mysql
DATABASE_NAME=audit_db
JWT_SECRET="ваш-секретный-ключ"

# Опционально — дефолты показаны ниже
# JWT_TTL=86400
# ADMIN_USERNAME=admin
# ADMIN_EMAIL=admin@audit.local
# ADMIN_PASSWORD=admin123
```

### Запустить всё

```bash
docker compose up --build
```

После запуска:

| Адрес                          | Описание                  |
|--------------------------------|---------------------------|
| `http://localhost:3000`        | Веб-интерфейс             |
| `http://localhost:8080`        | REST API                  |
| `http://localhost:8080/docs`   | Scalar API документация   |
| `localhost:3307`               | MySQL (user: mysql/mysql) |

> Администратор создаётся автоматически при первом запросе к API (`AdminSeeder`).  
> Логин по умолчанию: `admin` / `admin123` (можно переопределить через `.env`).

БД инициализируется из `ddl.sql` + `inserts.sql` при первом старте контейнера.

### Остановить

```bash
docker compose down

# Остановить и очистить данные БД (нужно при изменении схемы)
docker compose down -v
```

## API

Интерактивная документация: **`http://localhost:8080/docs`** (Scalar)

### Аутентификация

Все защищённые эндпоинты принимают заголовок:

```
Authorization: Bearer <JWT>
```

JWT выдаётся при входе, TTL — 24 ч (настраивается через `JWT_TTL` в `.env`).

### Эндпоинты

#### Auth

| Метод | Путь              | Доступ | Описание         |
|-------|-------------------|--------|------------------|
| POST  | `/auth/login`     | —      | Вход             |
| POST  | `/auth/register`  | —      | Регистрация      |

#### Справочники

| Метод  | Путь                  | Чтение   | Запись  |
|--------|-----------------------|----------|---------|
| GET    | `/categories`         | USER+    | —       |
| POST   | `/categories`         | —        | ADMIN   |
| PUT    | `/categories/{id}`    | —        | ADMIN   |
| DELETE | `/categories/{id}`    | —        | ADMIN   |
| GET    | `/employees`          | USER+    | —       |
| POST   | `/employees`          | —        | ADMIN   |
| PUT    | `/employees/{id}`     | —        | ADMIN   |
| DELETE | `/employees/{id}`     | —        | ADMIN   |
| GET    | `/jobs`               | USER+    | —       |
| POST   | `/jobs`               | —        | ADMIN   |
| PUT    | `/jobs/{id}`          | —        | ADMIN   |
| DELETE | `/jobs/{id}`          | —        | ADMIN   |

#### Табель (только ADMIN)

| Метод  | Путь                              | Описание                               |
|--------|-----------------------------------|----------------------------------------|
| GET    | `/timesheets`                     | Все записи (фильтры: `?employee_id=`, `?job_id=`) |
| POST   | `/timesheets`                     | Добавить запись                        |
| PUT    | `/timesheets/{id}`                | Обновить запись                        |
| DELETE | `/timesheets/{id}`                | Удалить запись                         |

#### Ведомость начислений (OPERATOR+)

| Метод | Путь                       | Параметры                    | Описание                        |
|-------|----------------------------|------------------------------|---------------------------------|
| GET   | `/charges`                 | `?year=&company_name=`       | Детализация по компании         |
| GET   | `/charges/total`           | `?year=&company_name=`       | Итог по компании                |
| GET   | `/charges/total-by-year`   | `?year=`                     | Итог по всем компаниям          |
| GET   | `/charges/statement`       | `?year=`                     | Полная ведомость за год         |

#### Пользователи (ADMIN)

| Метод  | Путь                              | Описание                          |
|--------|-----------------------------------|-----------------------------------|
| GET    | `/users`                          | Список пользователей              |
| GET    | `/users/role-request`             | Статус заявки текущего юзера      |
| GET    | `/users/role-requests`            | Ожидающие заявки                  |
| PUT    | `/users/role-requests/{id}/approve` | Одобрить заявку                 |
| PUT    | `/users/role-requests/{id}/deny`  | Отклонить заявку                  |
| PUT    | `/users/{id}/role`                | Сменить роль пользователя         |
| DELETE | `/users/{id}`                     | Удалить пользователя              |

## Фронтенд

### Страницы

| Путь           | Роль     | Описание                                              |
|----------------|----------|-------------------------------------------------------|
| `/`            | все      | Главная: инфо о системе, статус заявки для USER       |
| `/auth`        | гость    | Вход и регистрация, чекбокс «Запомнить меня»          |
| `/employees`   | ADMIN    | CRUD сотрудников                                      |
| `/categories`  | ADMIN    | CRUD категорий                                        |
| `/jobs`        | ADMIN    | CRUD работ                                            |
| `/timesheets`  | ADMIN    | CRUD табеля                                           |
| `/charges`     | OPERATOR+| Ведомость начислений с фильтром по году               |
| `/admin`       | ADMIN    | Заявки на роль оператора (одобрить / отклонить)       |

### Ключевые механизмы

**«Запомнить меня»** — управляет хранилищем токена:
- без галочки → `sessionStorage` (очищается при закрытии вкладки)
- с галочкой → `localStorage` (сохраняется между сессиями)

**Баннер приветствия** — показывается оператору один раз за сессию:
- первый вход как оператор: «Добро пожаловать!»
- повторный: «Вы зашли в N раз» + дата последнего посещения

**Роутинг-гард** (`AppShell`) — проверяет роль при каждой навигации, показывает «Недостаточно прав» если путь не разрешён для текущей роли.

## Локальная разработка без Docker

```bash
# API
cd audit
php -S localhost:8080

# UI
cd web-ui
npm install
npm run dev
```

> При локальной разработке в `audit/.env` укажите `DATABASE_HOST=127.0.0.1` и `DATABASE_PORT=3307` (если MySQL поднят через Docker).
