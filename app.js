// * notes from Ben on performing queries
// View All Employees -- SELECT  Left Join to get your data
// View All Employees By Department
// Add Employee -- INSERT INTO
// Update Employee Role -- UPDATE SET
// View All Roles -- SELECT Left Join
// Add Role -- INSERT INTO
// View All Departments -- SELECT Left Join
// Add Department - INSERT INTO

//dependencies
const express = require("express");
const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

const app = express();

// Set the port of our application
// process.env.PORT lets the port be set by Heroku
const PORT = process.env.PORT || 8080;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Sets up db connection
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "@uth3nt1c",
  database: "company_db",
});

connection.connect((err) => {
  if (err) {
    console.error(`error connecting: ${err.stack}`);
    return;
  }

  console.log(`connected as id ${connection.threadId}`);
  runMenu();
});

const runMenu = () => {
  inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "What would you like to do?",
      choices: [
        "Add a new:",
        "View:",
        "Update Employee Role",
        "Update Employee Manager",
        "View Employees by Manager",
        "Delete:",
        "View Department Budget:",
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case "Add a new:":
          addNew();
          break;
        case "View:":
          view();
          break;
        case "Update Employee Role":
          updateRole();
          break;
        case "Update Employee Manager":
          updateManager();
          break;
        case "View Employees by Manager":
          viewByManager();
          break;
        case "Delete:":
          deleteFromDB();
          break;
        case "View Department Budget:":
          budget();
          break;
      }
    });
};

const addNew = () => {
  inquirer
    .prompt({
      name: "table",
      type: "rawlist",
      choices: ["Employee", "Roles", "Department"],
    })
    .then((answer) => {
      switch (answer.table) {
        case "Employee":
          //* function for questions to add employee information
          break;
        case "Manager":
          //* function for questions to add manager information
          break;
        case "Department":
          //* function for questions to add department information
          inquirer
            .prompt({
              name: "department",
              type: "input",
              message: "What is the name of the new department?",
            })
            .then((answer) => {
              connection.query(
                `INSERT INTO department SET name = ?`,
                [answer.department],
                function (err, res) {
                  if (err) throw err;
                  console.log("Department Added");
                  runMenu();
                }
              );
            });
          break;
      }
    });
};

const view = () => {
  inquirer
    .prompt({
      name: "table",
      type: "rawlist",
      choices: ["Employee", "Roles", "Department"],
    })
    .then((answer) => {
      switch (answer.table) {
        case "Employee":
          let employeeQuery =
            // * selects elements from tables to return
            "SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.name AS department, roles.salary, ";
          employeeQuery +=
            // * concatenates the manager first_name, and manager last name as manager
            "CONCAT(manager.first_name, ' ', manager.last_name) AS manager ";
          employeeQuery +=
            // * left joins role to employee on roles.id
            "FROM employee LEFT JOIN roles on employee.role_id = roles.id ";
          employeeQuery +=
            // * left joins deparment to roles on department id
            "LEFT JOIN department on roles.department_id = department.id ";
          employeeQuery +=
            // * left joins employee on manager.id from above to employee id
            "LEFT JOIN employee manager on manager.id = employee.manager_id;";
          connection.query(employeeQuery, (err, res) => {
            if (err) throw err;
            // console.log(res);
            console.table(res);
            runMenu();
          });
          break;
        case "Roles":
          let rolesQuery =
            // * selects elements from tables to return
            "SELECT roles.id, roles.title, roles.salary, department.name AS department, ";
          rolesQuery +=
            // * left joins department to roles on department id
            "FROM roles LEFT JOIN department on roles.department_id = department.id";
          connection.query(rolesQuery, (err, res) => {
            if (err) throw err;
            // console.log(res);
            console.table(res);
            runMenu();
          });
          break;
        case "Department":
          let departmentQuery =
            // * selects elements from tables to return
            "SELECT department.name from department";
          connection.query(departmentQuery, (err, res) => {
            if (err) throw err;
            // console.log(res);
            console.table(res);
            runMenu();
          });
          break;
      }
    });
};

const updateRole = () => {
  // * return list of employees
};

const updateManager = () => {
  //* return list of employees
};

const viewByManager = () => {
  //* return list of managers
};

const deleteFromDB = () => {
  inquirer
    .prompt({
      name: "table",
      type: "rawlist",
      choices: ["Employee", "Roles", "Department"],
    })
    .then((answer) => {
      switch (answer.table) {
        case "Employee":
          break;
        case "Roles":
          break;
        case "Department":
          break;
      }
    });
};

const budget = () => {
  //* return list of departments
};

// Start our server so that it can begin listening to client requests.
// Log (server-side) when our server has started
app.listen(PORT, () =>
  console.log(`Server listening on: http://localhost:${PORT}`)
);
