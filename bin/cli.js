#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const runCommand = command => {
    try {
        execSync(`${command}`, { stdio: 'inherit' });
    } catch (e) {
        console.error(`Failed to execute ${command}`, e);
        return false;
    }
    return true;
};

const repoName = process.argv[2];
if (!repoName) {
    console.error('Please provide a project name.');
    console.log('Usage: create-p5jsboilerplate <project-name>');
    process.exit(1);
}

console.log(`\nCloning the template into folder "${repoName}"...\n`);
const gitCheckoutCommand = `git clone --depth 1 https://github.com/ZKitcher/p5js-Boilerplate ${repoName}`;

const checkedOut = runCommand(gitCheckoutCommand);
if (!checkedOut) process.exit(-1);

// Remove the .git folder to decouple the repo
const gitFolder = path.join(process.cwd(), repoName, '.git');
if (fs.existsSync(gitFolder)) {
    fs.rmSync(gitFolder, { recursive: true, force: true });
}

console.log('\n✅ Template cloned successfully!');
console.log(`Navigate into your project folder: cd ${repoName}`);
