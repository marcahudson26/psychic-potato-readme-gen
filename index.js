import inquirer from 'inquirer';
import fs from 'fs';
import util from 'util';

const licenses = {
    "MIT License": "https://choosealicense.com/licenses/mit",
    "Apache License 2.0": "https://choosealicense.com/licenses/apache-2.0",
    "GNU General Public License v3.0": "https://choosealicense.com/licenses/gpl-3.0",
    "BSD 2-Clause \"Simplified\" License": "https://choosealicense.com/licenses/bsd-2-clause",
    "BSD 3-Clause \"New\" or \"Revised\" License": "https://opensource.org/license/bsd-3-clause",
    "Boost Software License 1.0": "https://choosealicense.com/licenses/bsl-1.0",
    "Creative Commons Zero v1.0 Universal": "https://choosealicense.com/licenses/cc0-1.0",
    "Eclipse Public License 2.0": "https://choosealicense.com/licenses/epl-2.0",
    "GNU Affero General Public License v3.0": "https://choosealicense.com/licenses/agpl-3.0",
    "GNU General Public License v2.0": "https://choosealicense.com/licenses/gpl-2.0",
    "GNU Lesser General Public License v2.1": "https://choosealicense.com/licenses/lgpl-2.1",
    "Mozilla Public License 2.0": "https://choosealicense.com/licenses/mpl-2.0",
    "The Unlicense": "https://choosealicense.com/licenses/unlicense",
}

const writeFileAsync = util.promisify(fs.writeFile);
const promptUser = () =>
    inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'The title of your project: ',
        },
        {
            type: "editor",
            name: "description",
            message: 'A description of your project: ',
        },
        {
            type: "input",
            name: "installation",
            message: 'How to install the app (eg: node index.js): ',
        },
        {
            type: "input",
            name: "usage",
            message: 'How to use the application: ',
        },
        {
            type: "list",
            name: "license",
            choices: [
                "None",
                "Apache License 2.0",
                "GNU General Public License v3.0",
                "MIT License",
                "BSD 2-Clause \"Simplified\" License",
                "BSD 3-Clause \"New\" or \"Revised\" License",
                "Boost Software License 1.0",
                "Creative Commons Zero v1.0 Universal",
                "Eclipse Public License 2.0",
                "GNU Affero General Public License v3.0",
                "GNU General Public License v2.0",
                "GNU Lesser General Public License v2.1",
                "Mozilla Public License 2.0",
                "The Unlicense"
            ],
            message: 'Select a license: ',
        },
        {
            type: "confirm",
            name: "allowContribution",
            message: 'Can others contribute?',
        },
        {
            type: "confirm",
            name: "prefillContribution",
            message: 'Use prefilled contribution instructions?',
        },
        {
            type: "editor",
            name: "contributing",
            message: 'Write instructions for how others can contribute: ',
            when: (answers) => {
                return answers.allowContribution && !answers.prefillContribution
            }
        },
        {
            type: "input",
            name: "contributors",
            message: 'Add list of existing contributors (separated by comma): ',
        },
        {
            type: "input",
            name: "tests",
            message: 'How to run tests (eg: npm run test): ',
        },
    ]);

const generateHTML = (answers) => {
    const hasLicense = answers.license !== "None";

    const contributors = answers.contributors.split(",")
        .map(name => name.trim().replace(/  +/g, " "))
        .map(name => `- ${name}`)
        .join("\r\n");
    const licenseName = encodeURIComponent(answers.license).replaceAll("-", "%E2%80%91");

    const licenseInfo = hasLicense
        ? `## License\r\n[${answers.license}](${licenses[answers.license]})`
        : ""

    let contributionInstructions = "";
    if (answers.allowContribution) {
        contributionInstructions = "## How to contribute\r\n"
        if (answers.prefillContribution) {
            contributionInstructions += `Please refer to each project's style and contribution guidelines for submitting patches and additions. In general, we follow the "fork-and-pull" Git workflow.\r\n- Fork the repo on GitHub\r\n- Clone the project to your own machine\r\n- Commit changes to your own branch\r\n- Push your work back up to your fork\r\n- Submit a Pull request so that we can review your changes\r\n- NOTE: Be sure to merge the latest from "upstream" before making a pull request!`
        } else {
            contributionInstructions += answers.contributing.replaceAll("\n", "\r\n")
        }
    }

    return `
![License](https://img.shields.io/:License-${licenseName}-green.svg)
# ${answers.title}

## Table of Contents
* [installation instructions](#installation)
* [Description of application](#description)
* [Usage of application](#usage)
* [License](#license)
* [How to contribute](#how-to-contribute)
* [application Tests](#tests-instructions)
* [application contributors](#contributors)
* [link to deployed application](#link-to-deployed-application)
* [Screenshots of deployed application](#screenshots)


## Description
${answers.description}

## Installation
\`\`\`
${answers.installation}
\`\`\`

## Usage
${answers.usage}

${licenseInfo}

${contributionInstructions}

## Tests instructions
${answers.tests}

## Contributors
${contributors}

## Link to deployed application
*** fill in here ***

## Screenshots
*** fill in here ***
`
}
promptUser()
    .then((answers) => writeFileAsync('README.md', generateHTML(answers)))
    .then(() => console.log('Successfully wrote to README.md'))
    .catch((err) => console.error(err));
