USE employee_tracker;
INSERT INTO department(department_name) VALUES ('sales'), ('engineering'), ('finance');
INSERT INTO role (title, salary, department_id) VALUES ('sales manager', 70000, 1), ('engineer', 90000, 2), ('cpa', 65000, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Kevin', 'Bacon', 1, NULL), ('Stacy', 'Madre', 2, 1), ('Ian', 'Stewart', 3, 2);