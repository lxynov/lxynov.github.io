#!/usr/bin/env node

const { Command } = require('commander');
const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
const Ssg = require('../lib/index');
const config = require('../source/config')

const program = new Command();

program
  .version('0.1.0')
  .description('A lightweight, extensible static site generator');

program
  .command('build')
  .description('Build the static site')
  .action(async (options) => {
    try {
      console.log(chalk.blue('Building site...'));
      
      const ssg = new Ssg(config);
      await ssg.build();
      
      console.log(chalk.green('✓ Site built successfully!'));
    } catch (err) {
      console.error(chalk.red('Error building site:'), err);
      process.exit(1);
    }
  });

program
  .command('new')
  .description('Create a new post or page')
  .argument('<type>', 'type of content (post or page)')
  .argument('<title>', 'title of the content')
  .action(async (type, title, options) => {
    try {
      const slug = title
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, '-');
      
      const date = new Date().toISOString().split('T')[0];
      let filePath;
      
      if (type === 'post') {
        filePath = path.join(process.cwd(), config.sourceDir || 'content', 'posts', `${date}-${slug}.md`);
      } else if (type === 'page') {
        filePath = path.join(process.cwd(), config.sourceDir || 'content', 'pages', `${slug}.md`);
      } else {
        console.error(chalk.red('Invalid content type. Use "post" or "page".'));
        process.exit(1);
      }
      
      const content = `---
title: ${title}
date: ${new Date().toISOString()}
draft: false
---

Write your content here...
`;
      
      await fs.outputFile(filePath, content);
      console.log(chalk.green(`✓ Created ${type}: ${filePath}`));
    } catch (err) {
      console.error(chalk.red(`Error creating ${type}:`), err);
      process.exit(1);
    }
  });

program
  .command('serve')
  .description('Start development server')
  .option('-p, --port <number>', 'port to serve on', '3000')
  .action(async (options) => {
    try {
      config.port = options.port || config.port || 3000;
      
      console.log(chalk.blue(`Starting server on port ${config.port}...`));
      
      const server = require('../lib/server');
      await server.start(config);
    } catch (err) {
      console.error(chalk.red('Error starting server:'), err);
      process.exit(1);
    }
  });

program.parse(process.argv);

// If no command is provided, show help
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
