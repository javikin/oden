#!/usr/bin/env node

const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const inquirer = require('inquirer');

async function uninstall() {
  console.log('\n' + chalk.yellow('🗑️  Uninstalling Oden Forge'));
  console.log(chalk.yellow('═'.repeat(40)));

  const claudeDir = path.join(process.env.HOME, '.claude');
  const pathsToRemove = [
    path.join(claudeDir, 'commands', 'oden'),
    path.join(claudeDir, 'scripts', 'oden'),
    path.join(claudeDir, 'prds'),
    path.join(claudeDir, 'epics')
  ];

  // Check what exists
  const existingPaths = pathsToRemove.filter(p => fs.existsSync(p));

  if (existingPaths.length === 0) {
    console.log(chalk.green('✅ Oden Forge is not installed'));
    return;
  }

  console.log(chalk.white('The following will be removed:'));
  existingPaths.forEach(p => {
    console.log(chalk.gray(`   ${p}`));
  });

  // Ask for confirmation in interactive mode
  if (process.stdout.isTTY) {
    const { confirm } = await inquirer.prompt([{
      type: 'confirm',
      name: 'confirm',
      message: 'Are you sure you want to remove Oden Forge?',
      default: false
    }]);

    if (!confirm) {
      console.log(chalk.blue('❌ Uninstall cancelled'));
      return;
    }
  }

  // Remove files
  console.log(chalk.yellow('\n🗑️  Removing files...'));
  let removed = 0;

  for (const p of existingPaths) {
    try {
      if (fs.existsSync(p)) {
        fs.removeSync(p);
        console.log(chalk.green(`   ✅ Removed: ${path.basename(p)}`));
        removed++;
      }
    } catch (error) {
      console.log(chalk.red(`   ❌ Failed to remove ${p}: ${error.message}`));
    }
  }

  // Don't remove ~/.claude/rules as other tools might use it
  // Just remove our specific rules
  const rulesDir = path.join(claudeDir, 'rules');
  if (fs.existsSync(rulesDir)) {
    try {
      const odenRules = [
        'oden-methodology.md',
        'worktree-operations.md',
        'agent-coordination.md',
        'standard-patterns.md',
        'github-operations.md',
        'frontmatter-operations.md',
        'datetime.md',
        'path-standards.md',
        'strip-frontmatter.md'
      ];

      let rulesRemoved = 0;
      odenRules.forEach(rule => {
        const rulePath = path.join(rulesDir, rule);
        if (fs.existsSync(rulePath)) {
          fs.removeSync(rulePath);
          rulesRemoved++;
        }
      });

      if (rulesRemoved > 0) {
        console.log(chalk.green(`   ✅ Removed: ${rulesRemoved} rules`));
      }
    } catch (error) {
      console.log(chalk.yellow(`   ⚠️  Could not clean rules: ${error.message}`));
    }
  }

  console.log(chalk.green(`\n✅ Uninstall complete (${removed + 1} items removed)`));
  console.log(chalk.gray('Your project files remain untouched.'));
  console.log('');
}

// Only run if called directly (not during npm uninstall)
if (require.main === module) {
  uninstall();
}

module.exports = { uninstall };