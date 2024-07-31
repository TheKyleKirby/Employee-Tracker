const inquirer = require('inquirer');

const mainMenu = () => {
  return inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Exit'
      ]
    }
  ]);
}; 

const addDepartmentPrompt = () => {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'What is the name of the department?',
    }
  ]);
};
const addRolePrompt = (departments) => {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'What is the name of the role?',
    },
    {
      type: 'input',
      name: 'salary',
      message: 'What is the salary of the role?',
    },
    {
      type: 'list',
      name: 'department_id',
      message: 'Which department does the role belong to?',
      choices: departments.map(dept => ({ name: dept['Department Name'], value: dept['Department ID'] }))
    }
  ]);
};

// Employee Section
const addEmployeePrompt = (roles, employees) => {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'first_name',
      message: 'What is the employee\'s first name?',
    },
    {
      type: 'input',
      name: 'last_name',
      message: 'What is the employee\'s last name?',
    },
    {
      type: 'list',
      name: 'role_id',
      message: 'What is the employee\'s role?',
      choices: roles.map(role => ({ name: role['Job Title'], value: role['Role ID'] }))
    },
    {
      type: 'list',
      name: 'manager_id',
      message: 'Who is the employee\'s manager?',
      choices: employees.map(emp => ({ name: `${emp['First Name']} ${emp['Last Name']}`, value: emp['Employee ID'] })).concat([{ name: 'None', value: null }])
    }
  ]);
};
const updateEmployeeRolePrompt = (employees, roles) => {
  return inquirer.prompt([
    {
      type: 'list',
      name: 'employee_id',
      message: 'Which employee\'s role do you want to update?',
      choices: employees.map(emp => ({ name: `${emp['First Name']} ${emp['Last Name']}`, value: emp['Employee ID'] }))
    },
    {
      type: 'list',
      name: 'role_id',
      message: 'Which role do you want to assign the selected employee?',
      choices: roles.map(role => ({ name: role['Job Title'], value: role['Role ID'] }))
    }
  ]);
};

module.exports = {
  mainMenu,
  addDepartmentPrompt,
  addRolePrompt,
  addEmployeePrompt,
  updateEmployeeRolePrompt
};