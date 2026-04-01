-- 1. Вывести все работы, которые выполнял сотрудник Х.

DELIMITER //

DROP PROCEDURE IF EXISTS get_employee_jobs_by_id //

CREATE PROCEDURE get_employee_jobs_by_id(IN p_employee_id INT)
BEGIN
    SELECT j.name         AS 'Вид работы',
           j.company_name AS 'Предприятие',
           j.start_at     AS 'Дата начала',
           j.completed_at AS 'Дата окончания',
           j.is_completed AS 'Статус завершения'
    FROM timesheet t
             JOIN job j ON t.job_id = j.id
    WHERE t.employee_id = p_employee_id
      AND t.is_deleted = FALSE;
END //

DELIMITER ;

-- Пример вызова для сотрудника с ID = 1 (Петров В.В.):
CALL get_employee_jobs_by_id(1);


-- 2. Изменить структуру таблицы базы данных для учета количества выполненных работ
-- каждым сотрудникам. Разработайте хранимый код для согласования данных и
-- отображения текущего количества выполненных работ каждым сотрудникам.

-- Изменение структуры таблицы (добавление поля счетчика)
ALTER TABLE employee
    ADD COLUMN completed_jobs_count INT UNSIGNED NOT NULL DEFAULT 0;

DELIMITER //

DROP PROCEDURE IF EXISTS sync_completed_jobs_count //

CREATE PROCEDURE sync_completed_jobs_count()
BEGIN
    -- Обновляем поле completed_jobs_count для каждого сотрудника
    UPDATE employee e
        LEFT JOIN (SELECT t.employee_id, COUNT(t.job_id) AS cnt
                   FROM timesheet t
                            JOIN job j ON t.job_id = j.id
                   WHERE j.is_completed = TRUE
                     AND t.is_deleted = FALSE
                     AND j.is_deleted = FALSE
                   GROUP BY t.employee_id) AS t_counts ON e.id = t_counts.employee_id
    SET e.completed_jobs_count = COALESCE(t_counts.cnt, 0);

    -- Отображаем текущее количество выполненных работ по каждому сотруднику
    SELECT id,
           CONCAT(last_name, ' ', first_name) AS 'Сотрудник',
           completed_jobs_count               AS 'Выполнено работ'
    FROM employee
    WHERE is_deleted = FALSE;
END //

DELIMITER ;

-- Запуск согласования данных:
CALL sync_completed_jobs_count();


-- 3. Подготовьте механизмы автоматического изменения количества выполненных работ
-- в зависимости от запросов пользователей.

DELIMITER //

SET GLOBAL log_bin_trust_function_creators = 1;

DROP TRIGGER IF EXISTS trg_job_after_update //

CREATE TRIGGER trg_job_after_update
    AFTER UPDATE
    ON job
    FOR EACH ROW
BEGIN
    -- Если статус работы изменился на "выполнена"
    IF NEW.is_completed = TRUE AND OLD.is_completed = FALSE THEN
        UPDATE employee e
            JOIN timesheet t ON e.id = t.employee_id
        SET e.completed_jobs_count = e.completed_jobs_count + 1
        WHERE t.job_id = NEW.id
          AND t.is_deleted = FALSE;

    -- Если статус работы случайно сняли (отменили выполнение)
    ELSEIF NEW.is_completed = FALSE AND OLD.is_completed = TRUE THEN
        UPDATE employee e
            JOIN timesheet t ON e.id = t.employee_id
        SET e.completed_jobs_count = e.completed_jobs_count - 1
        WHERE t.job_id = NEW.id
          AND t.is_deleted = FALSE;
    END IF;
END //

DELIMITER ;


-- 4. Запланируйте событие, которые бы раз в месяц перемещало всех сотрудников с
-- флагом «Удалено» в таблицу Архив.

-- Включаем планировщик событий в MySQL (если он выключен)
SET GLOBAL event_scheduler = ON;

-- Создаем таблицу Архив (копируем структуру employee)
CREATE TABLE IF NOT EXISTS employee_archive LIKE employee;

DELIMITER //

DROP EVENT IF EXISTS ev_archive_deleted_employees //

CREATE EVENT ev_archive_deleted_employees
    ON SCHEDULE EVERY 1 MONTH
        STARTS CURRENT_TIMESTAMP
    DO
    BEGIN
        -- 1. Копируем удаленных сотрудников в таблицу Архив
        INSERT INTO employee_archive
        SELECT *
        FROM employee
        WHERE is_deleted = TRUE;

        -- 2. Физически удаляем их из основной таблицы
        DELETE FROM employee WHERE is_deleted = TRUE;
    END //

DELIMITER ;