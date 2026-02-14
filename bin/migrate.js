#!/usr/bin/env node

const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const inquirer = require('inquirer');

async function migrate() {
  console.log('\n' + chalk.blue('🔄 Oden Forge Migration Tool'));
  console.log(chalk.blue('═'.repeat(50)));

  const claudeDir = path.join(process.env.HOME, '.claude');

  // Detect what needs migration
  const migrationPlan = await analyzeMigrationNeeds(claudeDir);

  if (migrationPlan.items.length === 0) {
    console.log(chalk.green('✅ No migration needed - you\'re already on v2!'));
    return;
  }

  console.log(chalk.yellow(`Found ${migrationPlan.items.length} items to migrate:\n`));

  migrationPlan.items.forEach(item => {
    console.log(chalk.white(`📁 ${item.type}:`));
    console.log(chalk.gray(`   From: ${item.from}`));
    console.log(chalk.gray(`   Action: ${item.action}`));
    console.log('');
  });

  const { proceed } = await inquirer.prompt([{
    type: 'confirm',
    name: 'proceed',
    message: 'Proceed with migration?',
    default: true
  }]);

  if (!proceed) {
    console.log(chalk.blue('❌ Migration cancelled'));
    return;
  }

  // Execute migration
  await executeMigration(migrationPlan);
}

async function analyzeMigrationNeeds(claudeDir) {
  const migrationItems = [];

  // Check for old command structures
  const oldCommands = [
    path.join(claudeDir, 'commands', 'pm'),
    path.join(claudeDir, 'commands', 'ccmp')
  ];

  oldCommands.forEach(dir => {
    if (fs.existsSync(dir)) {
      migrationItems.push({
        type: 'Legacy Commands',
        from: dir,
        action: 'Remove (replaced by /oden:* commands)',
        priority: 'high'
      });
    }
  });

  // Check for mixed legacy commands in /oden directory
  const odenDir = path.join(claudeDir, 'commands', 'oden');
  if (fs.existsSync(odenDir)) {
    const legacyCommands = [
      'analyze.md', 'blocked.md', 'clean.md', 'dev.md', 'epic-close.md',
      'epic-decompose.md', 'epic-edit.md', 'epic-list.md', 'epic-merge.md',
      'epic-oneshot.md', 'epic-refresh.md', 'epic-show.md', 'epic-start-worktree.md',
      'epic-start.md', 'epic-status.md', 'epic-sync.md', 'import.md', 'in-progress.md',
      'issue-analyze.md', 'issue-close.md', 'issue-edit.md', 'issue-reopen.md',
      'issue-show.md', 'issue-start.md', 'issue-status.md', 'issue-sync.md',
      'next.md', 'plan.md', 'prd-edit.md', 'prd-list.md', 'prd-new.md',
      'prd-parse.md', 'prd-status.md', 'search.md', 'standup.md', 'status.md',
      'test-reference-update.md', 'validate.md'
    ];

    const foundLegacy = legacyCommands.filter(cmd =>
      fs.existsSync(path.join(odenDir, cmd))
    );

    if (foundLegacy.length > 0) {
      migrationItems.push({
        type: 'Mixed Legacy Commands',
        from: odenDir,
        action: `Remove ${foundLegacy.length} legacy commands`,
        priority: 'high',
        legacyCommands: foundLegacy
      });
    }
  }

  // Check for old scripts
  const oldScripts = [
    path.join(claudeDir, 'scripts', 'pm'),
    path.join(claudeDir, 'scripts', 'ccpm')
  ];

  oldScripts.forEach(dir => {
    if (fs.existsSync(dir)) {
      migrationItems.push({
        type: 'Legacy Scripts',
        from: dir,
        action: 'Remove (replaced by new scripts)',
        priority: 'high'
      });
    }
  });

  // Check for CCPM installations
  const ccpmPath = path.join(process.env.HOME, '.ccpm');
  if (fs.existsSync(ccpmPath)) {
    migrationItems.push({
      type: 'CCMP Installation',
      from: ccpmPath,
      action: 'Archive and remove (now native)',
      priority: 'medium'
    });
  }

  // Check for old PRD/Epic structures
  const oldStructures = [
    path.join(claudeDir, 'pm'),
    path.join(claudeDir, 'ccpm')
  ];

  oldStructures.forEach(dir => {
    if (fs.existsSync(dir)) {
      migrationItems.push({
        type: 'Old Data Structure',
        from: dir,
        action: 'Migrate to new structure',
        priority: 'low'
      });
    }
  });

  return {
    items: migrationItems,
    hasHighPriority: migrationItems.some(i => i.priority === 'high'),
    hasData: migrationItems.some(i => i.priority === 'low')
  };
}

async function executeMigration(migrationPlan) {
  console.log(chalk.yellow('\n🔄 Executing migration...\n'));

  let completed = 0;
  let failed = 0;

  for (const item of migrationPlan.items) {
    try {
      console.log(chalk.white(`Processing: ${item.type}`));

      switch (item.priority) {
        case 'high':
          await removeOldInstallation(item);
          break;
        case 'medium':
          await archiveAndRemove(item);
          break;
        case 'low':
          await migrateDataStructure(item);
          break;
      }

      console.log(chalk.green(`   ✅ ${item.action}`));
      completed++;

    } catch (error) {
      console.log(chalk.red(`   ❌ Failed: ${error.message}`));
      failed++;
    }
    console.log('');
  }

  // Summary
  console.log(chalk.green('🎉 Migration Complete!'));
  console.log(chalk.green('═'.repeat(30)));
  console.log(chalk.white(`✅ Completed: ${completed}`));
  if (failed > 0) {
    console.log(chalk.red(`❌ Failed: ${failed}`));
  }
  console.log('');
  console.log(chalk.blue('Next Steps:'));
  console.log(chalk.white('   1. Open Claude Code'));
  console.log(chalk.white('   2. Run: /oden:init'));
  console.log(chalk.white('   3. Enjoy Oden Forge 2.0!'));
  console.log('');
}

async function removeOldInstallation(item) {
  if (item.type === 'Mixed Legacy Commands' && item.legacyCommands) {
    // Remove specific legacy commands from mixed directory
    let removed = 0;
    for (const cmd of item.legacyCommands) {
      const cmdPath = path.join(item.from, cmd);
      if (fs.existsSync(cmdPath)) {
        fs.removeSync(cmdPath);
        removed++;
      }
    }
    console.log(chalk.gray(`   Removed ${removed} legacy commands from oden directory`));
  } else if (fs.existsSync(item.from)) {
    fs.removeSync(item.from);
  }
}

async function archiveAndRemove(item) {
  if (fs.existsSync(item.from)) {
    const archivePath = item.from + '.bak.' + Date.now();
    fs.moveSync(item.from, archivePath);
    console.log(chalk.gray(`   Archived to: ${path.basename(archivePath)}`));
  }
}

async function migrateDataStructure(item) {
  // For now, just archive old data structures
  // In the future, we could implement smart migration of PRDs/Epics
  if (fs.existsSync(item.from)) {
    const backupPath = item.from + '.backup.' + Date.now();
    fs.copySync(item.from, backupPath);
    console.log(chalk.gray(`   Backed up to: ${path.basename(backupPath)}`));
    fs.removeSync(item.from);
  }
}

module.exports = { migrate };