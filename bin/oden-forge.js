#!/usr/bin/env node

const chalk = require('chalk');
const { program } = require('commander');
const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const pkg = require('../package.json');

program
  .name('oden-forge')
  .description('Documentation-First Development Toolkit for Claude Code')
  .version(pkg.version);

program
  .command('install')
  .description('Install Oden Forge skills to Claude Code')
  .option('-f, --force', 'Force reinstall, overwriting existing')
  .action(async (options) => {
    const { install } = require('./install.js');
    await install(options);
  });

program
  .command('uninstall')
  .description('Remove Oden Forge skills from Claude Code')
  .action(async () => {
    const { uninstall } = require('./pre-uninstall.js');
    await uninstall();
  });

program
  .command('status')
  .description('Check installation status')
  .action(() => {
    const claudeDir = path.join(process.env.HOME, '.claude');
    const odenCommands = path.join(claudeDir, 'commands', 'oden');

    console.log('\n' + chalk.blue('📋 Oden Forge Status'));
    console.log(chalk.blue('═'.repeat(50)));

    if (fs.existsSync(odenCommands)) {
      const commands = fs.readdirSync(odenCommands).filter(f => f.endsWith('.md'));
      console.log(chalk.green(`✅ Installed: ${commands.length} commands`));
      console.log(chalk.gray(`   Location: ${odenCommands}`));
    } else {
      console.log(chalk.red('❌ Not installed'));
      console.log(chalk.yellow('   Run: oden-forge install'));
    }

    // Check for legacy v1
    const legacyPaths = [
      path.join(claudeDir, 'commands', 'pm'),
      path.join(claudeDir, 'commands', 'ccpm'),
      path.join(process.env.HOME, '.ccpm')
    ];

    const legacyFound = legacyPaths.filter(p => fs.existsSync(p));
    if (legacyFound.length > 0) {
      console.log(chalk.yellow('\n⚠️  Legacy installations found:'));
      legacyFound.forEach(p => console.log(chalk.gray(`   ${p}`)));
      console.log(chalk.yellow('   Run: oden-forge migrate'));
    }

    console.log('\n' + chalk.blue('💡 Quick Start:'));
    console.log(chalk.white('   1. cd your-project'));
    console.log(chalk.white('   2. claude-code (or your Claude Code command)'));
    console.log(chalk.white('   3. /oden:init'));
    console.log('');
  });

program
  .command('migrate')
  .description('Migrate from Oden Forge v1 or CCPM')
  .action(async () => {
    const { migrate } = require('./migrate.js');
    await migrate();
  });

program
  .command('update')
  .description('Update to latest version')
  .action(() => {
    console.log(chalk.yellow('🔄 Updating Oden Forge...'));
    try {
      execSync('npm update -g oden-forge', { stdio: 'inherit' });
      console.log(chalk.green('✅ Updated successfully!'));
    } catch (error) {
      console.log(chalk.red('❌ Update failed:'), error.message);
    }
  });

// Default action
program
  .action(() => {
    console.log('\n' + chalk.blue('🔨 Oden Forge - Documentation-First Development'));
    console.log(chalk.blue('═'.repeat(50)));
    console.log(chalk.white('Usage: oden-forge <command>'));
    console.log('');
    console.log(chalk.yellow('Commands:'));
    console.log('  install   Install skills to Claude Code');
    console.log('  status    Check installation status');
    console.log('  migrate   Migrate from v1 or CCPM');
    console.log('  update    Update to latest version');
    console.log('  help      Show help');
    console.log('');
    console.log(chalk.gray('After installation, use /oden:init in Claude Code'));
    console.log('');
  });

if (process.argv.length === 2) {
  program.outputHelp();
}

program.parse();