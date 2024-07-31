INSERT INTO department (department_name)
VALUES
  ('Sales'),
  ('Engineering'),
  ('Finance'),
  ('Human Resources'),
  ('Legal');

INSERT INTO role (title, salary, department_id)
VALUES
  ('Sales Lead', 100000, 1),
  ('Salesperson', 80000, 1),
  ('Lead Engineer', 150000, 2),
  ('Software Engineer', 120000, 2),
  ('Accountant', 125000, 3),
  ('HR Manager', 100000, 4),
  ('HR Coordinator', 75000, 4),
  ('Legal Team Lead', 250000, 5),
  ('Lawyer', 190000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
  ('John', 'Doe', 1, NULL),
  ('Mike', 'Chan', 2, 1),
  ('Ashley', 'Rodriguez', 3, NULL),
  ('Kevin', 'Tupik', 4, 3),
  ('Kunal', 'Singh', 5, NULL),
  ('Sarah', 'Johnson', 6, NULL),
  ('Emily', 'Davis', 7, 6),
  ('Malia', 'Brown', 8, NULL),
  ('Sarah', 'Lourd', 9, 8),
  ('Tom', 'Allen', 9, 8);