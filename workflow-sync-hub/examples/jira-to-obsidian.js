/**
 * Example: Jira to Obsidian Sync
 */

import JiraClient from '../src/integrations/jira.js';
import ObsidianClient from '../src/integrations/obsidian.js';
import config from '../src/config.js';

async function main() {
  console.log('🎯 Jira to Obsidian Sync Example\n');

  try {
    const jira = new JiraClient(config);
    const obsidian = new ObsidianClient(config);

    console.log('1️⃣  Initializing Obsidian vault...');
    await obsidian.initializeVault();

    console.log('2️⃣  Fetching assigned issues...');
    const issues = await jira.getMyIssues();
    console.log(`   Found ${issues.length} issues\n`);

    console.log('3️⃣  Issue details:');
    for (const issue of issues.slice(0, 3)) {
      const metadata = await jira.getIssueMetadata(issue.key);
      console.log(`   • ${metadata.key}: ${metadata.title}`);
      console.log(`     Status: ${metadata.status}`);
      console.log(`     Story Points: ${metadata.storyPoints || 'N/A'}\n`);
    }

    if (issues.length > 0) {
      console.log('4️⃣  Syncing first issue to Obsidian...');
      const results = await jira.syncToObsidian(obsidian, issues.slice(0, 1));
      console.log(`   Success: ${results.success}, Failed: ${results.failed}\n`);
    }

    console.log('5️⃣  Checking completed issues (last 30 days)...');
    const completedIssues = await jira.getCompletedIssues(30);
    console.log(`   Completed: ${completedIssues.length} issues\n`);

    console.log('✅ Sync completed successfully!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
