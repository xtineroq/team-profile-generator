const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
const employeeInfo = [];


addTeamMember();

async function addTeamMember() {
    // prompt common info to all employees
    await inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "Enter your team member's name:"
        },
        {
            type: "list",
            name: "role",
            message: "Select your team member's role:",
            choices: [
                "Engineer",
                "Intern",
                "Manager"
            ]
        },
        {
            type: "input",
            name: "id",
            message: "Enter your team member's id:"
        },
        {
            type: "input",
            name: "email",
            message: "Enter your team member's email address:"
        }
    ])
    .then(async function({name, role, id, email}) {
        // prompt info specific to each employee type
        if (role === "Engineer") {
            await inquirer.prompt([
                {
                    type: "input",
                    name: "github",
                    message: "Enter your team member's GitHub username:"
                }
            ])
            .then(function({github}) {
                // create a new array of engineer
                const newEngineer = new Engineer(name, id, email, github);
                // push object to array holder
                employeeInfo.push(newEngineer);
            });
        } else if (role === "Intern") {
            await inquirer.prompt([
                {
                    type: "input",
                    name: "school",
                    message: "Enter your team member's school name:"
                }
            ])
            .then(function({school}) {
                // create a new array of intern
                const newIntern = new Intern(name, id, email, school);
                // push object to array holder
                employeeInfo.push(newIntern);
            });
        } else {
            await inquirer.prompt([
                {
                    type: "input",
                    name: "officeNumber",
                    message: "Enter your team member's office phone number:"
                }
            ])
            .then(function({officeNumber}) {
                // create a new array of manager
                const newManager = new Manager(name, id, email, officeNumber);
                // push object to array holder
                employeeInfo.push(newManager);
            });
        }
    })
    .then(async function() {
        // prompt if user would like to add another employee
        await inquirer.prompt([
            {
                type: "list",
                name: "anotherTM",
                message: "Would you like to add another team member?",
                choices: [
                    "yes",
                    "no"
                ]
            }
        ])
        .then(function({anotherTM}) {
            if (anotherTM === "yes") {
                // start over
                addTeamMember();
            } else {
                // generate html
                fs.writeFile(outputPath, render(employeeInfo), function(err){
                    if(err) {
                        return console.log(err);
                    } else {
                        console.log("You've successfully generated a Team Profile!");
                    }
                });
                return;
            }
        });
    });
}
