const inquirer = require("inquirer");
const { Client } = require("pg");

const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "content_manager_db",
  password: "password",
  port: 3000,
});

async function promptUser() {
  const { action } = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "What would you like to do?",
      choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "Add a department",
        "Add a role",
        "Add an employee",
        "Update an employee role",
        "Exit",
      ],
    },
  ]);

  switch (action) {
    case "View all departments":
      console.log("You have selected to view all departments.");
      await viewAllDepartments();
      break;
    case "View all roles":
      console.log("You have selected to view all roles.");
      await viewAllRoles();
      break;
    case "View all employees":
      console.log("You have selected to view all employees.");
      await viewAllEmployees();
      break;
    case "Add a department":
      console.log("You have selected to add a department.");
      await addDepartment();
      break;
    case "Add a role":
      console.log("You have selected to add a role.");
      await addRole();
      break;
    case "Add an employee":
      console.log("You have selected to add an employee.");
      await addEmployee();
      break;
    case "Update an employee role":
      console.log("You have selected to update an employee role.");
      await updateEmployeeRole();
      break;
    case "Exit":
      client.end();
      process.exit();
  }
  promptUser();
}

async function viewAllDepartments() {
  try {
    const result = await client.query(
      "SELECT id, department_name AS department FROM department"
    );
    console.table(result.rows, ["id", "department"]);
  } catch (err) {
    console.error("Error viewing departments:", err);
  }
}

async function viewAllRoles() {
  try {
    const result = await client.query(`
      SELECT role.id, role.title AS role, department.department_name AS department, role.salary
      FROM role
      INNER JOIN department ON role.department_id = department.id
    `);
    console.table(result.rows);
  } catch (err) {
    console.error("Error viewing roles:", err);
  }
}

async function viewAllEmployees() {
  try {
    const result = await client.query(`
      SELECT e.id,  CONCAT(e.first_name, ' ', e.last_name) AS employee, r.title AS role, d.department_name AS Department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
      FROM employee e
      INNER JOIN role r ON e.role_id = r.id
      INNER JOIN department d ON r.department_id = d.id
      LEFT JOIN employee m ON e.manager_id = m.id
    `);
    console.table(result.rows);
  } catch (err) {
    console.error("Error viewing employees:", err);
  }
}

async function addDepartment() {
  try {
    const { departmentName } = await inquirer.prompt([
      {
        type: "input",
        name: "departmentName",
        message: "Enter the name of the department:",
      },
    ]);

    await client.query("INSERT INTO department (department_name) VALUES ($1)", [
      departmentName,
    ]);
    console.log("Department added successfully!");
  } catch (err) {
    console.error("Error adding department:", err);
  }
}

async function addRole() {
  try {
    const departments = await client.query("SELECT * FROM department");

    const { title, salary, departmentId } = await inquirer.prompt([
      {
        type: "input",
        name: "title",
        message: "Enter the title of the role:",
      },
      {
        type: "input",
        name: "salary",
        message: "Enter the salary for the role:",
      },
      {
        type: "list",
        name: "departmentId",
        message: "Select the department for the role:",
        choices: departments.rows.map((department) => ({
          name: department.department_name,
          value: department.id,
        })),
      },
    ]);

    await client.query(
      "INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)",
      [title, salary, departmentId]
    );
    console.log("Role added successfully!");
  } catch (err) {
    console.error("Error adding role:", err);
  }
}

async function addEmployee() {
  try {
    const roles = await client.query("SELECT * FROM role");
    const managers = await client.query("SELECT * FROM employee");

    const { firstName, lastName, roleId, managerId } = await inquirer.prompt([
      {
        type: "input",
        name: "firstName",
        message: "Enter the employee's first name:",
      },
      {
        type: "input",
        name: "lastName",
        message: "Enter the employee's last name:",
      },
      {
        type: "list",
        name: "roleId",
        message: "Select the employee's role:",
        choices: roles.rows.map((role) => ({
          name: role.title,
          value: role.id,
        })),
      },
      {
        type: "list",
        name: "managerId",
        message: "Select the employee's manager:",
        choices: [
          { name: "None", value: null },
          ...managers.rows.map((manager) => ({
            name: `${manager.first_name} ${manager.last_name}`,
            value: manager.id,
          })),
        ],
      },
    ]);

    await client.query(
      "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)",
      [firstName, lastName, roleId, managerId]
    );
    console.log("Employee added successfully!");
  } catch (err) {
    console.error("Error adding employee:", err);
  }
}

async function updateEmployeeRole() {
  try {
    const employees = await client.query("SELECT * FROM employee");
    const roles = await client.query("SELECT * FROM role");

    const { employeeId, roleId } = await inquirer.prompt([
      {
        type: "list",
        name: "employeeId",
        message: "Select the employee to update:",
        choices: employees.rows.map((employee) => ({
          name: `${employee.first_name} ${employee.last_name}`,
          value: employee.id,
        })),
      },
      {
        type: "list",
        name: "roleId",
        message: "Select the new role for the employee:",
        choices: roles.rows.map((role) => ({
          name: role.title,
          value: role.id,
        })),
      },
    ]);

    await client.query("UPDATE employee SET role_id = $1 WHERE id = $2", [
      roleId,
      employeeId,
    ]);
    console.log("Employee role updated successfully!");
  } catch (err) {
    console.error("Error updating employee role:", err);
  }
}

client
  .connect()
  .then(() => {
    console.log("Connected to the database");
    promptUser();
  })
  .catch((err) => {
    console.error("Connection error", err.stack);
  });
