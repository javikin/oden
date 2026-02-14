#!/usr/bin/env node

async function postInstall() {
  // Only run auto-install for global installs
  if (!process.env.npm_config_global) {
    return; // Skip for local installs
  }

  try {
    // Check if dependencies are available
    const chalk = require('chalk');
    const { install } = require('./install.js');

    console.log(chalk.blue('\n🔄 Running post-install setup...'));

    await install({ force: false });

    // Check if CLI commands are available
    const { execSync } = require('child_process');
    let cliAvailable = false;
    try {
      execSync('oden-forge --version', { stdio: 'pipe' });
      cliAvailable = true;
    } catch (error) {
      // CLI not in PATH
    }

    console.log(chalk.blue('\n💡 Next Steps:'));

    if (!cliAvailable) {
      console.log(chalk.yellow('⚠️  CLI commands not in PATH (common with ASDF/NVM)'));
      console.log(chalk.white('   Fix: echo \'export PATH="$(npm config get prefix)/bin:$PATH"\' >> ~/.zshrc'));
      console.log(chalk.white('   Or use: npx oden-forge status'));
      console.log('');
    }

    console.log(chalk.white('   1. Verify: ' + (cliAvailable ? 'oden-forge status' : 'npx oden-forge status')));
    console.log(chalk.white('   2. Open Claude Code in your project'));
    console.log(chalk.white('   3. Run: /oden:init'));
    console.log('');
    console.log(chalk.gray('   📖 Documentation: https://javikin.github.io/oden-forge'));
    console.log(chalk.gray('   🆘 Help: ' + (cliAvailable ? 'oden-forge --help' : 'npx oden-forge --help')));
    console.log('');

  } catch (error) {
    // Fallback if dependencies aren't ready yet
    console.log('\n🔄 Oden Forge 2.0 installed!');
    console.log('');
    console.log('💡 Next Steps:');
    console.log('   1. Run: oden-forge install');
    console.log('   2. Open Claude Code in your project');
    console.log('   3. Run: /oden:init');
    console.log('');
    console.log('📖 Documentation: https://javikin.github.io/oden-forge');
    console.log('🆘 Help: oden-forge --help');
    console.log('');
  }
}

// Only run if called directly
if (require.main === module) {
  postInstall();
}

module.exports = { postInstall };