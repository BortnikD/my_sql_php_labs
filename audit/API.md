# Audit API — документация

Base URL: `http://localhost/`

Все ответы в формате JSON (`Content-Type: application/json`).

---

## Общие коды ответов

| Код | Описание |
|-----|----------|
| 200 | Успех |
| 201 | Ресурс создан |
| 400 | Неверный запрос (нет ID, невалидный JSON) |
| 404 | Ресурс не найден |
| 405 | Метод не поддерживается |

---

## Employees `/employees`

### GET /employees
Получить всех сотрудников (soft-deleted исключены).

**Ответ 200:**
```json
[
  {
    "id": 1,
    "category_id": 2,
    "first_name": "Иван",
    "last_name": "Иванов",
    "middle_name": "Иванович",
    "birth_date": "1990-01-15",
    "is_deleted": false,
    "updated_at": "2024-01-01T00:00:00",
    "deleted_at": null
  }
]
```

### GET /employees/{id}
Получить сотрудника по ID.

**Ответ 200:** объект сотрудника (см. выше)  
**Ответ 404:** `{ "error": "Employee not found" }`

### POST /employees
Создать сотрудника.

**Тело запроса:**
```json
{
  "category_id": 2,
  "first_name": "Иван",
  "last_name": "Иванов",
  "middle_name": "Иванович",
  "birth_date": "1990-01-15"
}
```
> `middle_name` — необязательное поле.

**Ответ 201:** `{ "id": 5 }`

### PUT /employees/{id}
Обновить сотрудника. Тело запроса — те же поля, что и у POST.

**Ответ 200:** `{ "updated": true }`  
**Ответ 404:** `{ "error": "Employee not found" }`

### DELETE /employees/{id}
Soft-delete сотрудника (ставит `is_deleted = true`).

**Ответ 200:** `{ "deleted": true }`  
**Ответ 404:** `{ "error": "Employee not found" }`

---

## Categories `/categories`

### GET /categories
Получить все категории.

**Ответ 200:**
```json
[
  { "id": 1, "name": "Разработчики", ... }
]
```

### GET /categories/{id}
Получить категорию по ID.

**Ответ 404:** `{ "error": "Category not found" }`

### POST /categories
Создать категорию.

**Тело запроса:**
```json
{ "name": "Разработчики" }
```

**Ответ 201:** `{ "id": 3 }`

### PUT /categories/{id}
Обновить категорию. Тело — те же поля, что и у POST.

**Ответ 200:** `{ "updated": true }`

### DELETE /categories/{id}
Soft-delete категории.

**Ответ 200:** `{ "deleted": true }`

---

## Jobs `/jobs`

### GET /jobs
Получить все работы/задачи.

**Ответ 200:**
```json
[
  { "id": 1, "name": "Вёрстка главной", ... }
]
```

### GET /jobs/{id}
Получить работу по ID.

**Ответ 404:** `{ "error": "Job not found" }`

### POST /jobs
Создать работу.

**Тело запроса:**
```json
{ "name": "Вёрстка главной" }
```

**Ответ 201:** `{ "id": 7 }`

### PUT /jobs/{id}
Обновить работу.

**Ответ 200:** `{ "updated": true }`

### DELETE /jobs/{id}
Soft-delete работы.

**Ответ 200:** `{ "deleted": true }`

---

## Timesheets `/timesheets`

### GET /timesheets
Получить все записи табеля.

**Ответ 200:**
```json
[
  {
    "id": 1,
    "employee_id": 3,
    "job_id": 7,
    "hours": 8,
    "is_deleted": false,
    "updated_at": "2024-01-01T00:00:00",
    "deleted_at": null
  }
]
```

### GET /timesheets?employee_id={id}
Получить записи табеля конкретного сотрудника.

**Пример:** `GET /timesheets?employee_id=3`

### GET /timesheets?job_id={id}
Получить записи табеля по конкретной работе.

**Пример:** `GET /timesheets?job_id=7`

### GET /timesheets/{id}
Получить запись табеля по ID. Приоритет выше, чем у query-параметров.

**Ответ 404:** `{ "error": "Timesheet not found" }`

### POST /timesheets
Создать запись табеля.

**Тело запроса:**
```json
{
  "employee_id": 3,
  "job_id": 7,
  "hours": 8
}
```

**Ответ 201:** `{ "id": 12 }`

### PUT /timesheets/{id}
Обновить запись табеля. Тело — те же поля, что и у POST.

**Ответ 200:** `{ "updated": true }`

### DELETE /timesheets/{id}
Soft-delete записи табеля.

**Ответ 200:** `{ "deleted": true }`

---

## Charges `/charges`

### GET /charges
Получить ведомость начислений — только по завершённым работам (`is_completed = TRUE`).

**Ответ 200:**
```json
[
  {
    "full_name": "И.И.Иванов",
    "name": "Разработчики",
    "rate": 1000,
    "hours": 8,
    "completed_at": "2024-01-15T00:00:00",
    "paid_out": 8000
  }
]
```

| Поле | Описание |
|------|----------|
| `full_name` | Инициалы + фамилия сотрудника |
| `name` | Название категории |
| `rate` | Ставка категории |
| `hours` | Часы из табеля |
| `completed_at` | Дата завершения работы |
| `paid_out` | Итого (`rate * hours`) |
