#!/usr/bin/env node

const { execSync } = require('child_process');

const runCommand = command => {
    try {
        execSync(`${command}`, { stdio: 'inherit' })
    } catch (e) {
        console.error(`Failedd to execure ${command}`, e)
        return false;
    }
    return true;
}

const repoName = process.argv[2];
const gitCheckouCommand = `git clone --depth 1 https://github.com/ZKitcher/p5js-Boilerplate  ${repoName}`;
// const installDepsCommand = `cd ${repoName} && npm install`;

console.log(`Cloning the Repo with the name ${repoName}`);
const checkedOut = runCommand(gitCheckouCommand);

if(!checkedOut) precess.exit(-1);

console.log('Done')
