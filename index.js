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
    ]);

const generateHTML = (answers) => {
    const hasLicense = answers.license !== "None";
    const licenseName = encodeURIComponent(answers.license).replaceAll("-", "%E2%80%91");
    const licenseInfo = hasLicense
        ? `## License\r\n[${answers.license}](${licenses[answers.license]})`
        : ""

    return `
![License](https://img.shields.io/:License-${licenseName}-green.svg)
# ${answers.title}

## Table of Contents
* [License](#license)

${licenseInfo}

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
