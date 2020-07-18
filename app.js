const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const util = require("util");
const writeFileAsync = util.promisify(fs.writeFile);

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

addTeamMember();

async function addTeamMember() {
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
        if (role === "Engineer") {
            await inquirer.prompt([
                {
                    type: "input",
                    name: "github",
                    message: "Enter your team member's GitHub username:"
                }
            ]);
        }
        else if (role === "Intern") {
            await inquirer.prompt([
                {
                    type: "input",
                    name: "school",
                    message: "Enter your team member's school name:"
                }
            ]);
        }
        else {
            await inquirer.prompt([
                {
                    type: "input",
                    name: "officeNumber",
                    message: "Enter your team member's office phone number:"
                }
            ]);
        }
        inquirer.prompt([
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
        .then(function({anotherTM, github, school, officeNumber}) {
            if (anotherTM === "yes") {
                addTeamMember();
            } else {
                console.log({name, role, id, email, github});
                // fix undefined github
                switch ({role}) {
                    case "Engineer":
                        const newEngineer = new Engineer(name, role, id, email, github);
                        render(newEngineer);
                        break;
                    case "Intern":
                        const newIntern = new Intern(name, role, id, email, school);
                        render(newIntern);
                        break;
                    case "Manager":
                        const newManager = new Manager(name, role, id, email, officeNumber);
                        render(newManager);
                        break;
                }
            }
        });
    });
}



// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!


// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// async function generateHTML() {
//     try {
//         await writeFileAsync(outputPath, render(employees));
//         console.log("You've successfully generated a Team Profile!");

//     //catch the error
//     } catch (err) {
//         console.log(err);
//     }
// }

// generateHTML();


// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```


