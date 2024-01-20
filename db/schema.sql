DROP DATABASE IF EXISTS employee_tracker; 
CREATE DATABASE employee_tracker;
USE employee_tracker;

CREATE TABLE department(
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    department_name VARCHAR (32) NOT NULL
);
CREATE TABLE role(
     id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
     title VARCHAR (32) NOT NULL,
     salary DECIMAL (10,2) NOT NULL,
     department_id INT, 
     FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee(
     id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
     first_name VARCHAR (32) NOT NULL,
     last_name  VARCHAR (32) NOT NULL,
     role_id INT,
     FOREIGN KEY (role_id) REFERENCES role(id),
     manager_id INT,
     FOREIGN KEY (manager_id) REFERENCES employee(id)
);