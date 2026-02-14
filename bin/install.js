#!/usr/bin/env node

const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const inquirer = require('inquirer');

async function install(options = {}) {
  console.log('\n' + chalk.blue('🔨 Installing Oden Forge 2.0'));
  console.log(chalk.blue('═'.repeat(50)));

  const claudeDir = path.join(process.env.HOME, '.claude');
  const packageDir = path.dirname(__dirname);

  // Check for legacy installations
  const legacyPaths = await checkLegacyInstallations();

  if (legacyPaths.length > 0 && !options.force) {
    console.log(chalk.yellow('\n⚠️  Legacy installations detected:'));
    legacyPaths.forEach(p => console.log(chalk.gray(`   ${p.path} (${p.type})`)));

    const { shouldMigrate } = await inquirer.prompt([{
      type: 'confirm',
      name: 'shouldMigrate',
      message: 'Would you like to clean up and migrate automatically?',
      default: true
    }]);

    if (shouldMigrate) {
      await cleanLegacyInstallations(legacyPaths);
    }
  }

  // Create Claude directory if it doesn't exist
  if (!fs.existsSync(claudeDir)) {
    console.log(chalk.yellow('📁 Creating ~/.claude directory...'));
    fs.ensureDirSync(claudeDir);
  }

  try {
    // Install commands
    console.log(chalk.yellow('📝 Installing commands...'));
    const commandsSource = path.join(packageDir, '.claude', 'commands', 'oden');
    const commandsTarget = path.join(claudeDir, 'commands', 'oden');

    if (fs.existsSync(commandsSource)) {
      fs.ensureDirSync(path.dirname(commandsTarget));
      fs.copySync(commandsSource, commandsTarget);
      const commandCount = fs.readdirSync(commandsTarget).filter(f => f.endsWith('.md')).length;
      console.log(chalk.green(`✅ ${commandCount} commands installed`));
    }

    // Install scripts
    console.log(chalk.yellow('🔧 Installing scripts...'));
    const scriptsSource = path.join(packageDir, '.claude', 'scripts', 'oden');
    const scriptsTarget = path.join(claudeDir, 'scripts', 'oden');

    if (fs.existsSync(scriptsSource)) {
      fs.ensureDirSync(path.dirname(scriptsTarget));
      fs.copySync(scriptsSource, scriptsTarget);
      // Make scripts executable
      const scripts = fs.readdirSync(scriptsTarget).filter(f => f.endsWith('.sh'));
      scripts.forEach(script => {
        fs.chmodSync(path.join(scriptsTarget, script), 0o755);
      });
      console.log(chalk.green(`✅ ${scripts.length} scripts installed`));
    }

    // Install rules
    console.log(chalk.yellow('📋 Installing rules...'));
    const rulesSource = path.join(packageDir, '.claude', 'rules');
    const rulesTarget = path.join(claudeDir, 'rules');

    if (fs.existsSync(rulesSource)) {
      fs.ensureDirSync(rulesTarget);
      fs.copySync(rulesSource, rulesTarget);
      const ruleCount = fs.readdirSync(rulesTarget).filter(f => f.endsWith('.md')).length;
      console.log(chalk.green(`✅ ${ruleCount} rules installed`));
    }

    // Create working directories
    console.log(chalk.yellow('📂 Creating working directories...'));
    const workDirs = ['prds', 'epics'];
    workDirs.forEach(dir => {
      const dirPath = path.join(claudeDir, dir);
      fs.ensureDirSync(dirPath);
      fs.ensureFileSync(path.join(dirPath, '.gitkeep'));
    });
    console.log(chalk.green(`✅ Working directories created`));

    // Success message
    console.log('\n' + chalk.green('🎉 Installation Complete!'));
    console.log(chalk.green('═'.repeat(30)));
    console.log(chalk.white('📍 Location: ' + chalk.gray(claudeDir)));
    console.log(chalk.white('🚀 Usage: Open Claude Code and run /oden:init'));
    console.log(chalk.white('📚 Help: /oden:help'));
    console.log(chalk.white('📖 Docs: https://javikin.github.io/oden-forge'));
    console.log('');

  } catch (error) {
    console.log(chalk.red('\n❌ Installation failed:'), error.message);
    process.exit(1);
  }
}

async function checkLegacyInstallations() {
  const claudeDir = path.join(process.env.HOME, '.claude');
  const legacyPaths = [];

  // Check for old Oden Forge v1
  const oldOdenPaths = [
    path.join(claudeDir, 'commands', 'pm'),
    path.join(claudeDir, 'commands', 'ccpm'),
    path.join(claudeDir, 'scripts', 'pm'),
    path.join(claudeDir, 'scripts', 'ccpm')
  ];

  oldOdenPaths.forEach(p => {
    if (fs.existsSync(p)) {
      legacyPaths.push({ path: p, type: 'Oden Forge v1' });
    }
  });

  // Check for CCPM installations
  const ccpmPaths = [
    path.join(process.env.HOME, '.ccpm'),
    path.join(claudeDir, 'ccpm')
  ];

  ccpmPaths.forEach(p => {
    if (fs.existsSync(p)) {
      legacyPaths.push({ path: p, type: 'CCPM' });
    }
  });

  return legacyPaths;
}

async function cleanLegacyInstallations(legacyPaths) {
  console.log(chalk.yellow('\n🧹 Cleaning legacy installations...'));

  for (const legacy of legacyPaths) {
    try {
      console.log(chalk.gray(`   Removing: ${legacy.path}`));
      fs.removeSync(legacy.path);
      console.log(chalk.green(`   ✅ Removed ${legacy.type}`));
    } catch (error) {
      console.log(chalk.red(`   ❌ Failed to remove ${legacy.path}: ${error.message}`));
    }
  }

  console.log(chalk.green('✅ Legacy cleanup complete'));
}

module.exports = { install, checkLegacyInstallations, cleanLegacyInstallations };