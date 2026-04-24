/**
 * Example: Confluence to Obsidian Sync
 */

import ConfluenceClient from '../src/integrations/confluence.js';
import ObsidianClient from '../src/integrations/obsidian.js';
import config from '../src/config.js';

async function main() {
  console.log('📄 Confluence to Obsidian Sync Example\n');

  try {
    const confluence = new ConfluenceClient(config);
    const obsidian = new ObsidianClient(config);

    console.log('1️⃣  Initializing Obsidian vault...');
    await obsidian.initializeVault();

    console.log('2️⃣  Fetching Confluence pages...');
    const pages = await confluence.getMyPages();
    console.log(`   Found ${pages.length} pages\n`);

    console.log('3️⃣  Page details:');
    for (const page of pages.slice(0, 3)) {
      const metadata = await confluence.getPageMetadata(page.id);
      console.log(`   • ${metadata.title} (ID: ${metadata.id})`);
      console.log(`     Status: ${metadata.status}\n`);
    }

    if (pages.length > 0) {
      console.log('4️⃣  Syncing first page to Obsidian...');
      const results = await confluence.syncToObsidian(obsidian, pages.slice(0, 1));
      console.log(`   Success: ${results.success}, Failed: ${results.failed}\n`);
    }

    console.log('✅ Sync completed successfully!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
