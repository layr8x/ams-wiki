import SyncScheduler from './sync/scheduler.js';
import SyncManager from './sync/sync-manager.js';
import config from './config.js';

console.log(`
╔════════════════════════════════════════╗
║   Workflow Sync Hub                    ║
║   Confluence + Jira + Obsidian + Claude║
╚════════════════════════════════════════╝
`);

// 초기화
const scheduler = new SyncScheduler(config);

// 프로세스 시그널 처리
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down...');
  scheduler.stop();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n👋 Shutting down...');
  scheduler.stop();
  process.exit(0);
});

// 커맨드라인 인자 처리
const command = process.argv[2];

switch (command) {
  case 'start':
    console.log('🚀 Starting Workflow Sync Hub');
    scheduler.start();
    break;

  case 'sync':
    console.log('🔄 Running manual sync');
    const manager = new SyncManager(config);
    manager.syncAll()
      .then(status => {
        manager.logSyncStatus(status);
        process.exit(status.success ? 0 : 1);
      })
      .catch(error => {
        console.error('❌ Sync failed:', error.message);
        process.exit(1);
      });
    break;

  case 'status':
    console.log('Status:', scheduler.getStatus());
    process.exit(0);
    break;

  case 'help':
  default:
    console.log(`
Usage: npm run dev [command]

Commands:
  start  - Start the scheduler (runs every hour)
  sync   - Run a manual sync immediately
  status - Show scheduler status
  help   - Show this help message

Examples:
  npm run dev start
  npm run dev sync
  npm run dev status

Or use npm scripts:
  npm run sync:all       - Manual sync
  npm run analyze        - Claude analysis
  npm run portfolio      - Generate portfolio
`);
    process.exit(0);
}

// Keep process alive
if (command === 'start') {
  setInterval(() => {
    // Periodic check to ensure scheduler is alive
    if (!scheduler.isRunning) {
      console.warn('⚠️  Scheduler died unexpectedly, restarting...');
      scheduler.start();
    }
  }, 60000);
}
