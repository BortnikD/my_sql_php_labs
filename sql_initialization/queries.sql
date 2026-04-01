-- 1. Подсчитать количество сотрудников каждой категории.
SELECT c.name, COUNT(e.id) AS "count"
FROM category c
         LEFT JOIN employee e ON c.id = e.category_id
WHERE c.is_deleted = 0
GROUP BY c.name;

-- 2. Найти категории, в которых нет ни одного сотрудника.
SELECT c.name
FROM category c
         LEFT JOIN employee e ON c.id = e.category_id
WHERE e.id IS NULL
  AND c.is_deleted = FALSE;

-- 3. Вывести все работы, которые выполнял сотрудник Петров В.В.
SELECT e.last_name, j.name, j.company_name, j.start_at, j.completed_at
FROM job j
         JOIN timesheet t ON j.id = t.job_id
         JOIN employee e ON e.id = t.employee_id
WHERE (e.first_name = 'Владимир' AND e.middle_name = 'Васильевич' AND e.last_name = 'Петров')
  AND j.is_completed
  AND e.is_deleted = FALSE;

# 4. Найти сотрудников, которые выполнили больше всего работ на предприятии
SELECT e.first_name, e.middle_name, e.last_name, COUNT(is_completed) AS completedJobCount
FROM job j
         JOIN timesheet t ON j.id = t.job_id
         JOIN employee e ON e.id = t.employee_id
WHERE j.is_completed = TRUE
GROUP BY e.first_name, e.middle_name, e.last_name
HAVING completedJobCount = (SELECT COUNT(*)
                            FROM timesheet t2
                                     JOIN job j2 ON t2.job_id = j2.id
                            WHERE j2.is_completed = TRUE
                            GROUP BY t2.employee_id
                            ORDER BY 1 DESC
                            LIMIT 1);

-- 5. Подсчитать количество часов, которые отработал Петров В.В.
SELECT SUM(t.hours) AS 'Всего отработано часов'
FROM timesheet t
         JOIN employee e ON t.employee_id = e.id
WHERE e.last_name = 'Петров'
  AND e.first_name LIKE 'В%'
  AND e.middle_name LIKE 'В%';

-- 6. Определить виды работ, которые Петров В.В. осуществлял в текущем месяце.
SELECT j.name     AS 'Вид работы',
       j.start_at AS 'Дата начала'
FROM timesheet t
         JOIN job j ON t.job_id = j.id
         JOIN employee e ON t.employee_id = e.id
WHERE e.last_name = 'Петров'
  AND e.first_name LIKE 'В%'
  AND e.middle_name LIKE 'В%'
  AND MONTH(j.start_at) = MONTH(CURRENT_DATE())
  AND YEAR(j.start_at) = YEAR(CURRENT_DATE());

-- 7. Вывести таблицу вида «Ф.И.О. сотрудника», «Категория». В списке должны быть категории, даже если к ним не относится ни один сотрудник.
SELECT IF(e.id IS NULL, '-',
          CONCAT(e.last_name, ' ', SUBSTRING(e.first_name, 1, 1), '.', SUBSTRING(e.middle_name, 1, 1),
                 '.')) AS 'Ф.И.О. сотрудника',
       c.name          AS 'Категория'
FROM category c
         LEFT JOIN employee e ON c.id = e.category_id AND e.is_deleted = FALSE;

-- 8. Создайте представление на хранение данных «Ведомость начислений сотрудникам
-- аудиторской фирмы»: «ФИО», «Категория», «Ставка», «Название предприятия»,
-- «Дата выполнения работы», «Количество отработанных часов», «Начислено за
-- выполненную работу»
CREATE OR REPLACE VIEW audit_payroll_statement AS
SELECT CONCAT_WS(' ', e.last_name, e.first_name, e.middle_name) AS 'ФИО',
       c.name                                                   AS 'Категория',
       c.rate                                                   AS 'Ставка',
       j.company_name                                           AS 'Название предприятия',
       j.completed_at                                           AS 'Дата выполнения работы',
       t.hours                                                  AS 'Количество отработанных часов',
       (c.rate * t.hours)                                       AS 'Начислено за выполненную работу'
FROM timesheet t
         JOIN employee e ON t.employee_id = e.id
         JOIN category c ON e.category_id = c.id
         JOIN job j ON t.job_id = j.id;

-- 9. Увеличьте ставку за 1 час старшего аудитора на 10%.
UPDATE category
SET rate = rate * 1.10
WHERE name = 'Старший аудитор';

-- 10. Удалите сотрудников, родившихся до 1955 года.
UPDATE employee
SET is_deleted = TRUE,
    deleted_at = CURRENT_TIMESTAMP
WHERE birth_date < '1955-01-01';