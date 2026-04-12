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
│       │   ├── ChargesController.php
│       │   ├── EmployeeController.php
│       │   ├── JobController.php
│       │   └── TimesheetController.php
│       └── repository/
│           ├── CategoryRepository.php
│           ├── ChargesRepository.php
│           ├── EmployeeRepository.php
│           ├── JobRepository.php
│           └── TimesheetRepository.php
│
├── web-ui/                     # Next.js фронтенд (App Router)
│   ├── app/
│   │   ├── layout.tsx          # Корневой layout с Aside
│   │   ├── page.tsx            # Главная страница
│   │   ├── globals.css         # Темная тема, CSS-переменные, стили таблиц
│   │   ├── Aside.tsx           # Боковая навигация с SVG-иконками
│   │   ├── employees/page.tsx  # CRUD-страница сотрудников
│   │   ├── categories/page.tsx # CRUD-страница категорий
│   │   ├── jobs/page.tsx       # CRUD-страница работ
│   │   ├── timesheets/page.tsx # CRUD-страница табеля
│   │   ├── charges/page.tsx    # Ведомость начислений
│   │   └── components/
│   │       ├── DataTable.tsx   # Универсальная CRUD-таблица (generics)
│   │       ├── EntityModal.tsx # Универсальное модальное окно создания/редактирования
│   │       └── ConfirmModal.tsx# Модальное окно подтверждения удаления
│   └── lib/
│       ├── axiosInstance.ts    # Axios с baseURL из env
│       ├── types.ts            # Интерфейсы сущностей (Employee, Category, Job, ...)
│       ├── dto.ts              # DTO для создания и обновления
│       ├── CrudClient.ts       # Интерфейс CrudClient<T, CreateDto, UpdateDto>
│       ├── FieldDef.ts         # Описание полей таблицы/формы
│       └── webclients/
│           ├── EmployeeClient.ts
│           ├── CategoryClient.ts
│           ├── JobClient.ts
│           ├── TimesheetClient.ts
│           └── ChargesClient.ts
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

| Сервис      | Образ            | Порт        | Описание          |
|-------------|------------------|-------------|-------------------|
| `audit_db`  | `mysql:9`        | `3307:3306` | База данных MySQL |
| `audit_api` | `php:8.2-apache` | `8080:80`   | REST API          |
| `audit_ui`  | `node:20-alpine` | `3000:3000` | Next.js фронтенд  |

## Схема базы данных

- **category** — категории сотрудников (название, ставка ₽/ч)
- **employee** → category — сотрудники (ФИО, дата рождения, soft-delete)
- **job** — работы/задачи (название, компания, даты, статус выполнения)
- **timesheet** → employee + job — табель рабочего времени (часы, soft-delete)

## Запуск

### Требования

- [Docker](https://www.docker.com/) и Docker Compose

### Подготовка конфига

```bash
cp audit/.env.example audit/.env
```

### Запустить всё одной командой

```bash
docker compose up --build
```

После запуска:
- **UI** — `http://localhost:3000`
- **API** — `http://localhost:8080`
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

| Метод  | Путь                        | Описание                                          |
|--------|-----------------------------|---------------------------------------------------|
| GET    | `/employees`                | Список сотрудников                                |
| POST   | `/employees`                | Создать сотрудника                                |
| PUT    | `/employees/{id}`           | Обновить сотрудника                               |
| DELETE | `/employees/{id}`           | Soft-delete сотрудника                            |
| GET    | `/categories`               | Список категорий                                  |
| POST   | `/categories`               | Создать категорию                                 |
| PUT    | `/categories/{id}`          | Обновить категорию                                |
| DELETE | `/categories/{id}`          | Soft-delete категории                             |
| GET    | `/jobs`                     | Список работ                                      |
| POST   | `/jobs`                     | Создать работу                                    |
| PUT    | `/jobs/{id}`                | Обновить работу                                   |
| DELETE | `/jobs/{id}`                | Soft-delete работы                                |
| GET    | `/timesheets`               | Табель (фильтры: `?employee_id=`, `?job_id=`)     |
| POST   | `/timesheets`               | Добавить запись табеля                            |
| PUT    | `/timesheets/{id}`          | Обновить запись табеля                            |
| DELETE | `/timesheets/{id}`          | Soft-delete записи табеля                         |
| GET    | `/charges`                  | Детальная ведомость (`?company_name=&year=`)      |
| GET    | `/charges/total`            | Итого по компании (`?company_name=&year=`)        |
| GET    | `/charges/total-by-year`    | Итого по всем компаниям за год (`?year=`)         |

### Пример запросов

```bash
curl "http://localhost:8080/employees"
curl "http://localhost:8080/timesheets?employee_id=1"
curl "http://localhost:8080/charges?company_name=ООО+Ромашка&year=2024"
curl "http://localhost:8080/charges/total?company_name=ООО+Ромашка&year=2024"
curl "http://localhost:8080/charges/total-by-year?year=2024"
```

## Фронтенд

### Страницы

| Путь           | Описание                                               |
|----------------|--------------------------------------------------------|
| `/employees`   | Список сотрудников с созданием, редактированием, удалением |
| `/categories`  | Список категорий                                       |
| `/jobs`        | Список работ                                           |
| `/timesheets`  | Табель рабочего времени                                |
| `/charges`     | Ведомость начислений: фильтр по компании и году, детальная таблица с итогами |

### Ключевые паттерны

**`CrudClient<T, CreateDto, UpdateDto>`** — интерфейс для всех CRUD-клиентов:

```typescript
export interface CrudClient<T, CreateDto, UpdateDto = CreateDto> {
    getAll(): Promise<AxiosResponse<T[]>>
    create(dto: CreateDto): Promise<AxiosResponse<{ id: number }>>
    update(id: number, dto: UpdateDto): Promise<AxiosResponse<{ updated: boolean }>>
    delete(id: number): Promise<AxiosResponse<{ deleted: boolean }>>
}
```

**`FieldDef<T>`** — декларативное описание полей таблицы/формы:

```typescript
export interface FieldDef<T> {
    key: keyof T       // строгая типизация — только существующие поля
    label: string
    type?: 'text' | 'number' | 'date'
    readonly?: boolean // скрывается в форме создания/редактирования
}
```

**`DataTable<T, CreateDto, UpdateDto>`** — универсальная таблица с CRUD:
- принимает `client: CrudClient<T, CreateDto, UpdateDto>` и `fields: FieldDef<T>[]`
- автоматически рендерит таблицу, кнопки редактирования/удаления (появляются при наведении), модальные окна
- одна реализация для всех сущностей

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
