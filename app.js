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
        "Exit",
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
        case "Exit":
          connection.end();
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
          inquirer
            .prompt([
              {
                name: "employeeFirst",
                type: "input",
                message: "What is the employee's first name?",
                validate: (answer) => {
                  if (answer !== "") {
                    return true;
                  }
                  return "Please enter at least one character.";
                },
              },
              {
                name: "employeeLast",
                type: "input",
                message: "What is the employee's last name?",
                validate: (answer) => {
                  if (answer !== "") {
                    return true;
                  }
                  return "Please enter at least one character.";
                },
              },
              {
                name: "role",
                type: "input",
                message: "Please enter the role id",
              },
              {
                name: "manager",
                type: "input",
                message: "Please enter manager id",
              },
            ])
            .then((answer) => {
              if (answer.manager !== "") {
                connection.query(
                  "INSERT INTO employee set first_name = ?, last_name = ?, role_id = ?, manager_id = ?",
                  [
                    answer.employeeFirst,
                    answer.employeeLast,
                    answer.role,
                    answer.manager,
                  ],
                  function (err, res) {
                    if (err) throw err;
                    console.log("Employee Added");
                    runMenu();
                  }
                );
              } else {
                connection.query(
                  "INSERT INTO employee set first_name = ?, last_name = ?, role_id = ?",
                  [answer.employeeFirst, answer.employeeLast, answer.role],
                  function (err, res) {
                    if (err) throw err;
                    console.log("Employee Added");
                    runMenu();
                  }
                );
              }
            });
          break;
        case "Roles":
          //* function for questions to add manager information
          inquirer
            .prompt([
              {
                name: "roleTitle",
                type: "input",
                message: "What is the title of the new role?",
                validate: (answer) => {
                  if (answer !== "") {
                    return true;
                  }
                  return "Please enter at least one character.";
                },
              },
              {
                name: "roleSalary",
                type: "input",
                message: "What is the salary?",
                validate: (answer) => {
                  if (answer !== "") {
                    return true;
                  }
                  return "Please enter at least one character.";
                },
              },
              {
                name: "department",
                type: "input",
                message: "Please enter the department id",
              },
            ])
            .then((answer) => {
              connection.query(
                "INSERT INTO roles set title = ?, salary = ?, department_id = ?",
                [answer.roleTitle, answer.roleSalary, answer.department],
                function (err, res) {
                  if (err) throw err;
                  console.log("Role added.");
                  runMenu();
                }
              );
            });
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
            "SELECT roles.id, roles.title, roles.salary, department.name ";
          rolesQuery +=
            // * left joins department to roles on department id
            "FROM roles LEFT JOIN department on roles.department_id = department.id;";
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
            "SELECT department.id, department.name from department";
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
  inquirer
    .prompt([
      {
        name: "employeeId",
        type: "input",
        message: "Please enter employee id",
      },
      {
        name: "roleId",
        type: "input",
        message: "Please enter new roles id",
      },
    ])
    .then((answer) => {
      connection.query(
        "UPDATE employee SET role_id = ? WHERE id = ?",
        [answer.roleId, answer.employeeId],
        function (error, res) {
          if (err) throw err;
          console.log("Role updated!");
        }
      );
      runSearch();
    });
};

const updateManager = () => {
  inquirer
    .prompt([
      {
        name: "employeeId",
        type: "input",
        message: "Please enter employee id",
      },
      {
        name: "managerId",
        type: "input",
        message: "Please enter new manager id",
      },
    ])
    .then((answer) => {
      connection.query(
        "UPDATE employee SET manager_id = ? WHERE id = ?",
        [answer.managerId, answer.employeeId],
        function (err, res) {
          if (err) throw err;
          console.log("Manager Updated!");
        }
      );
      runSearch();
    });
};

const viewByManager = () => {
  //* return list of managers
};

const deleteFromDB = () => {
  // * complete this function.
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
