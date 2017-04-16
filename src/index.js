#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const shell = require('shelljs');
const commander = require('commander');
const Spinner = require('cli-spinner').Spinner;
const colors = require('colors');
const packageJson = require('../package.json');
const newPackageJson = require('../template/package.json');
const validateName = require('validate-npm-package-name')

let projectName;

const validateProjectName = name => {
  const validationResult = validateName(name);
  if (!validationResult.validForNewPackages) {
    console.error(
      `NPM does not allow project names like ${colors.red(`"${name}"`)}`
    );
    process.exit(1);
  }
}

const program = new commander.Command(packageJson.name)
  .version(packageJson.version)
  .arguments('<project-name>')
  .usage(`${'<project-name>'} [options]`)
  .action((name, variables) => {
    projectName = name;

    validateProjectName(projectName)

    const rootPath =path.resolve()
    const pathName = path.resolve(projectName);
    shell.mkdir('-p', pathName);
    shell.cp('-R', __dirname+'/../template/*', pathName);
    shell.cp('-R', __dirname+'/../template/.*', pathName);
    shell.cd(pathName);
    console.log()
    const spinner = new Spinner(colors.green('%s Setting up your React project, this may take a couple of minutes..'));
    spinner.setSpinnerString(18);
    spinner.start();

    newPackageJson['name'] = projectName;

    if(variables.packageVersion) {
      newPackageJson['version'] = variables.packageVersion;
    }

    if(variables.desc) {
      newPackageJson['description'] =  variables.desc;
    }

    fs.writeFileSync(`${pathName}/package.json`, JSON.stringify(newPackageJson, null, 2));

    const executeNpm = shell.exec('npm install', data => {
      spinner.stop();
      console.log();
      console.log();
      console.log(colors.green('Your React project has been set up!'));
      console.log();
      console.log('Basic configurations of Webpack, Babel, ESLint, Jest have been set up for you!');
      console.log();
      console.log('You might want to do the following:');
      console.log();
      console.log(colors.green(`cd ${projectName}`));
      console.log();
      console.log('You can run the following commands from your project directory:');
      console.log();

      console.log(colors.yellow('npm run dev'));
      console.log('Run this to get started, go to localhost:8001 in your browser after running to see your project live!');
      console.log();

      console.log(colors.yellow('npm run build'));
      console.log('Build and bundles the project up for you using Webpack');
      console.log();

      console.log(colors.yellow('npm run build:prod'));
      console.log('Runs the build in production mode for minified assets and optimizations');
      console.log();

      console.log(colors.yellow('npm run lint'));
      console.log('Runs ESLint on your project folder');
      console.log();

      console.log(colors.yellow('npm run test'));
      console.log('Runs the unit tests for you');
      console.log();

      console.log(colors.yellow('npm run update-test'));
      console.log('Updates the Jest based tests / snapshots');
      console.log();

      console.log(colors.yellow('npm run cover'));
      console.log('Shows the unit tests coverage');
      console.log();

      console.log(colors.red('Build with love!'));
      console.log();
    })
  })
  .option('-p, --packageVersion [num]', 'Makes the project with the specified version number', '0.1.0')
  .option('-d, --desc [description]', 'Makes the project with the specified description', '')
  .on('--help', () => {
    console.log(colors.green(`Only ${'<project-name>'} is required.`));
  })
  .parse(process.argv);
