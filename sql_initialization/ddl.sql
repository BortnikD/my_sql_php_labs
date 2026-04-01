CREATE DATABASE IF NOT EXISTS audit_db
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_unicode_ci;

USE audit_db;


CREATE TABLE IF NOT EXISTS category
(
    id         INTEGER PRIMARY KEY AUTO_INCREMENT,
    name       VARCHAR(64)                         NOT NULL,
    rate       NUMERIC(13, 2)                      NOT NULL CHECK (rate > 0),
    is_deleted BOOL      DEFAULT FALSE,
    deleted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
) ENGINE=InnoDB;


CREATE TABLE IF NOT EXISTS job
(
    id           INTEGER PRIMARY KEY AUTO_INCREMENT,
    name         VARCHAR(255)                        NOT NULL,
    company_name VARCHAR(255)                        NOT NULL,
    start_at     DATETIME                            NOT NULL,
    is_completed BOOL      DEFAULT FALSE,
    completed_at DATETIME,
    is_deleted   BOOL      DEFAULT FALSE,
    deleted_at   TIMESTAMP,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at   TIMESTAMP
) ENGINE=InnoDB;


CREATE TABLE IF NOT EXISTS employee
(
    id          INTEGER PRIMARY KEY AUTO_INCREMENT,
    category_id INTEGER                             NOT NULL,
    first_name  VARCHAR(32)                         NOT NULL,
    last_name   VARCHAR(32)                         NOT NULL,
    middle_name VARCHAR(32),
    birth_date  DATE                                NOT NULL,
    is_deleted  BOOL      DEFAULT FALSE,
    deleted_at  TIMESTAMP,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at  TIMESTAMP,

    CONSTRAINT fk_employee_category
        FOREIGN KEY (category_id)
            REFERENCES category (id)
            ON DELETE RESTRICT
            ON UPDATE CASCADE
)ENGINE=InnoDB;


CREATE TABLE IF NOT EXISTS timesheet
(
    id          INTEGER PRIMARY KEY AUTO_INCREMENT,
    employee_id INTEGER                                  NOT NULL,
    job_id      INTEGER                                  NOT NULL,
    hours       NUMERIC(13, 2) DEFAULT 0.0 CHECK (hours > 0),
    is_deleted  BOOL           DEFAULT FALSE,
    deleted_at  TIMESTAMP,
    created_at  TIMESTAMP      DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at  TIMESTAMP,

    CONSTRAINT fk_timesheet_employee
        FOREIGN KEY (employee_id)
            REFERENCES employee (id)
            ON DELETE CASCADE
            ON UPDATE CASCADE,

    CONSTRAINT fk_timesheet_job
        FOREIGN KEY (job_id)
            REFERENCES job (id)
            ON DELETE CASCADE
            ON UPDATE CASCADE
) ENGINE=InnoDB;
