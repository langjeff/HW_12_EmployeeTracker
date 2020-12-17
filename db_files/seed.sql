DROP DATABASE IF EXISTS company_db;

CREATE DATABASE company_db;

USE company_db;

CREATE TABLE department (
-- id int AI PK
id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
-- name varchar
name VARCHAR (30)
);

CREATE TABLE roles (
-- id int AI PK
id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
-- title VARCHAR 
title VARCHAR (30),
-- salary DECIMAL 
salary  DECIMAL (10,2),
-- department_id int FK
department_id INT NOT NULL,
-- Foreign Key 
FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee (
-- id int AI PK
id INT AUTO_INCREMENT NOT NULL PRIMARY KEY, 
-- first_name varchar
first_name VARCHAR (30),
-- last_name varchar
last_name VARCHAR (30),
-- role_id int FK
role_id INT NOT NULL, 
-- manager_id int FK
manager_id INT,
FOREIGN KEY (role_id) REFERENCES roles(id), 
FOREIGN KEY (manager_id) REFERENCES employee(id)
);