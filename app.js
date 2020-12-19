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
  afterConnection();
  runMenu();
});

const runMenu = () => {
    inquirer.prompt({
name: "action",
type: "rawlist",
message: "What would you like to do?",
choices: [
    "Add a new:",
    // * add code for other choices here, dept, roles, empl.
    "View:",
    // * add code for dept., roles, empl.
    "Update Employee Role",
    "Update Employee Manger",
    "View Employees by Manager",
    "Delete:",
    // * add code for other choices here, dept, roles, empl.
    "View Department Budget:"
],
    })
    .then((answer) => {
        switch(answer.action) {


        }
    })
}

// Start our server so that it can begin listening to client requests.
// Log (server-side) when our server has started
app.listen(PORT, () =>
  console.log(`Server listening on: http://localhost:${PORT}`)
);
