const path = require("path");

const promptsPath = path.join(__dirname, "library", "prompts");
console.log("Current working directory:", __dirname);
console.log("Absolute path to prompts.js:", promptsPath);

const {
  mainMenu,
  addDepartmentPrompt,
  addRolePrompt,
  addEmployeePrompt,
  updateEmployeeRolePrompt,
} = require(promptsPath);
const {
  getAllDepartments,
  getAllRoles,
  getAllEmployees,
  addDepartment,
  addRole,
  addEmployee,
  updateEmployeeRole,
} = require("./db/queries");
const client = require("./db/connection");

const runApp = async () => {
  let exit = false;

  while (!exit) {
    const { action } = await mainMenu();

    switch (action) {
      case "View all departments":
        const departments = await getAllDepartments();
        console.table(departments);
        break;

      case "View all roles":
        const roles = await getAllRoles();
        console.table(roles);
        break;

      case "View all employees":
        const employees = await getAllEmployees();
        console.table(employees);
        break;

      case "Add a department":
        const { name } = await addDepartmentPrompt();
        await addDepartment(name);
        console.log(`Added ${name} to the database`);
        break;

      case "Add a role":
        const depts = await getAllDepartments();
        const roleData = await addRolePrompt(depts);
        await addRole(roleData.title, roleData.salary, roleData.department_id);
        console.log(`Added ${roleData.title} to the database`);
        break;

      case "Add an employee":
        const rolesList = await getAllRoles();
        const employeesList = await getAllEmployees();
        const employeeData = await addEmployeePrompt(rolesList, employeesList);
        await addEmployee(
          employeeData.first_name,
          employeeData.last_name,
          employeeData.role_id,
          employeeData.manager_id
        );
        console.log(
          `Added ${employeeData.first_name} ${employeeData.last_name} to the database`
        );
        break;

      case "Update an employee role":
        const emps = await getAllEmployees();
        const rolesForUpdate = await getAllRoles();
        const updateData = await updateEmployeeRolePrompt(emps, rolesForUpdate);
        await updateEmployeeRole(updateData.employee_id, updateData.role_id);
        console.log(`Updated employee's role`);
        break;

      case "Exit":
        exit = true;
        client.end();
        break;
    }
  }
};

runApp();
