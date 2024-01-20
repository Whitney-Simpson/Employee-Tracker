const mysql = require("mysql2");
require("dotenv").config();
const inquirer = require("inquirer");
const db = mysql.createConnection(
  {
    host: "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "employee_tracker",
  },
  console.log(`Connected to the employee_tracker_db database.`)
);

const mainMenu = () => {
  inquirer
    .prompt({
      type: "list",
      name: "choice",
      message: "Select task from list",
      choices: [
        "view departments",
        "view roles",
        "view employees",
        "add department",
        "add role",
        "add employee",
        "update employee role",
        "remove employee",
      ],
    })
    .then((answer) => {
      switch (answer.choice) {
        case "view departments":
          viewDepartments();
          break;
        case "view roles":
          viewRoles();
          break;
        case "view employees":
          viewEmployees();
          break;
        case "add department":
          addDepartment();
          break;
        case "add role":
          addRole();
          break;
        case "add employee":
          addEmployee();
          break;
          case "update employee role":
            updateEmployee();
            break;
        case "remove employee":
          removeEmployee();
          break;
        default:
          break;
      }
    });
};
const viewDepartments = () => {
  db.promise()
    .query("SELECT department.department_name AS Department FROM department")
    .then(([data]) => {
      console.table(data);
      mainMenu();
    });
};
const viewRoles = () => {
  db.promise()
    .query(
      "SELECT role.title AS Title, role.salary AS Salary, department.department_name AS Department FROM role LEFT JOIN department ON role.department_id = department.id"
    )
    .then(([data]) => {
      console.table(data);
      mainMenu();
    });
};
const viewEmployees = () => {
  db.promise()
    .query(
      `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.department_name AS department, role.salary FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id;`
    )
    .then(([data]) => {
      console.table(data);
      mainMenu();
    });
};

const addDepartment = () => {
  inquirer
    .prompt({
      type: "input",
      name: "department_name",
      message: "Please enter the department name",
    })
    .then(({ department_name }) => {
      console.log(department_name);
      db.promise()
        .query(`INSERT INTO department SET ? `, { department_name })
        .then(([response]) => {
          if (response.affectedRows > 0) {
            viewDepartments();
          } else {
            console.error("Failed to create department");
            mainMenu();
          }
        });
    });
};

const addRole = async () => {
  const [departments] = await db.promise().query("SELECT * FROM department");
  const departmentArray = departments.map((department) => ({
    name: department.department_name,
    value: department.id,
  }));
  console.log(departmentArray);
  inquirer
    .prompt([
      {
        type: "input",
        name: "title",
        message: "Please enter the role title name",
      },
      {
        type: "input",
        name: "salary",
        message: "Please enter the role salary",
      },
      {
        type: "list",
        name: "department_id",
        message: "Select department for role",
        choices: departmentArray,
      },
    ])
    .then(({ title, salary, department_id }) => {
      db.promise()
        .query(`INSERT INTO role SET ? `, { title, salary, department_id })
        .then((response) => {
          console.log(response);
          viewRoles();
        });
    });
};

const addEmployee = async () => {
  const [roles] = await db.promise().query("SELECT * FROM role");
  const roleArray = roles.map((role) => ({ name: role.title, value: role.id }));

  const [employees] = await db.promise().query("SELECT * FROM employee");
  const employeeArray = employees.map((emp) => ({
    name: emp.first_name + " " + emp.last_name,
    value: emp.id,
  }));

  const managerArray = [...employeeArray, { name: "none", value: null }];
  console.log(managerArray);
  inquirer
    .prompt([
      {
        type: "input",
        name: "first_name",
        message: "Please enter first name",
      },
      {
        type: "input",
        name: "last_name",
        message: "Please enter last name",
      },
      {
        type: "list",
        name: "role_id",
        message: "Select role for employee",
        choices: roleArray,
      },
      {
        type: "list",
        name: "manager_id",
        message: "Select manager",
        choices: managerArray,
      },
    ])
    .then(({ first_name, last_name, role_id, manager_id }) => {
      const employeeObject = { first_name, last_name, role_id, manager_id };
      db.promise()
        .query(`INSERT INTO employee SET ? `, employeeObject)
        .then((response) => {
          console.log(response);
          viewEmployees();
        });
    });
};

const updateEmployee = async () => {
  const [employees] = await db.promise().query("SELECT * FROM employee");
  const employeeArray = employees.map((emp) => ({
    name: emp.first_name + " " + emp.last_name,
    value: emp.id,
  }));
  const [roles] = await db.promise().query("SELECT * FROM role");
  const roleArray = roles.map((role) => ({ name: role.title, value: role.id }));
  inquirer
    .prompt([{
      type: "list",
      name: "id",
      message: "Select employee to update",
      choices: employeeArray,
    },
  { 
    type: "list",
    name: "role_id",
    message: "Select new role",
    choices: roleArray,
  }])
    .then(({ id, role_id }) => {
      db.promise()
        .query("UPDATE employee SET ? WHERE id = ?", [{role_id}, id])
        .then((response) => {
          console.log(response);
          viewEmployees();
        });
    });
};

const removeEmployee = async () => {
  const [employees] = await db.promise().query("SELECT * FROM employee");
  const employeeArray = employees.map((emp) => ({
    name: emp.first_name + " " + emp.last_name,
    value: emp.id,
  }));
  inquirer
    .prompt({
      type: "list",
      name: "id",
      message: "Select role for employee",
      choices: employeeArray,
    })
    .then(({ id }) => {
      db.promise()
        .query("DELETE FROM employee WHERE id = ?", id)
        .then((response) => {
          console.log(response);
          viewEmployees();
        });
    });
};

mainMenu();
