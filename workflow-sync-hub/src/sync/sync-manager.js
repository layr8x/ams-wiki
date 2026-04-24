import ConfluenceClient from '../integrations/confluence.js';
import JiraClient from '../integrations/jira.js';
import ObsidianClient from '../integrations/obsidian.js';
import config from '../config.js';

export class SyncManager {
  constructor(cfg = config) {
    this.config = cfg;
    this.confluence = new ConfluenceClient(cfg);
    this.jira = new JiraClient(cfg);
    this.obsidian = new ObsidianClient(cfg);
  }

  // 전체 동기화
  async syncAll() {
    console.log('\n🔄 Starting full sync...');
    const startTime = Date.now();

    try {
      // Obsidian 초기화
      await this.obsidian.initializeVault();

      // Confluence 동기화
      if (this.config.sync.confluence) {
        await this.syncConfluence();
      }

      // Jira 동기화
      if (this.config.sync.jira) {
        await this.syncJira();
      }

      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      console.log(`✅ Sync completed in ${duration}s\n`);

      return {
        success: true,
        duration: `${duration}s`,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('❌ Sync failed:', error.message);
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  // Confluence만 동기화
  async syncConfluence() {
    console.log('📄 Syncing Confluence...');

    try {
      const pages = await this.confluence.getMyPages();
      console.log(`  Found ${pages.length} pages`);

      const results = await this.confluence.syncToObsidian(this.obsidian, pages);

      console.log(`  ✅ Success: ${results.success}, Failed: ${results.failed}`);
      return results;
    } catch (error) {
      console.error('  ❌ Confluence sync failed:', error.message);
      throw error;
    }
  }

  // Jira만 동기화
  async syncJira() {
    console.log('🎯 Syncing Jira...');

    try {
      const issues = await this.jira.getMyIssues();
      console.log(`  Found ${issues.length} issues`);

      const results = await this.jira.syncToObsidian(this.obsidian, issues);

      console.log(`  ✅ Success: ${results.success}, Failed: ${results.failed}`);
      return results;
    } catch (error) {
      console.error('  ❌ Jira sync failed:', error.message);
      throw error;
    }
  }

  // 충돌 해결 (간단한 버전)
  async resolveConflicts() {
    console.log('⚔️  Resolving conflicts...');
    // TODO: 구현
  }

  // 동기화 상태 로깅
  async logSyncStatus(status) {
    const logPath = 'Work/.sync-status.md';
    const content = `# Sync Status\n\n**Last Sync:** ${status.timestamp}\n**Duration:** ${status.duration}\n**Status:** ${status.success ? '✅ Success' : '❌ Failed'}\n\n${status.error ? `**Error:** ${status.error}` : ''}\n\n---\n\nGenerated: ${new Date().toLocaleString()}\n`;

    try {
      await this.obsidian.writeFile(logPath, content);
    } catch (error) {
      console.warn('⚠️  Failed to log sync status:', error.message);
    }
  }
}

export default SyncManager;
