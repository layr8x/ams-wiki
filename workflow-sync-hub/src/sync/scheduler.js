import cron from 'node-cron';
import SyncManager from './sync-manager.js';
import config from '../config.js';

export class SyncScheduler {
  constructor(cfg = config) {
    this.config = cfg;
    this.syncManager = new SyncManager(cfg);
    this.job = null;
    this.isRunning = false;
  }

  // 주기적 동기화 시작
  start() {
    if (this.isRunning) {
      console.log('⚠️  Scheduler is already running');
      return;
    }

    console.log('⏰ Starting sync scheduler...');

    // 매시간 정각에 동기화
    this.job = cron.schedule('0 * * * *', async () => {
      console.log(`⏱️  Running scheduled sync at ${new Date().toLocaleString()}`);
      const status = await this.syncManager.syncAll();
      await this.syncManager.logSyncStatus(status);
    });

    this.isRunning = true;
    console.log('✅ Scheduler started (runs every hour)');

    // 시작 시 즉시 동기화
    if (this.config.sync.onStartup) {
      console.log('▶️  Running initial sync...');
      this.syncManager.syncAll()
        .then(status => this.syncManager.logSyncStatus(status))
        .catch(error => console.error('❌ Initial sync failed:', error.message));
    }
  }

  // 일시 중지
  pause() {
    if (this.job) {
      this.job.stop();
      this.isRunning = false;
      console.log('⏸️  Scheduler paused');
    }
  }

  // 재개
  resume() {
    if (!this.isRunning && this.job) {
      this.job.start();
      this.isRunning = true;
      console.log('▶️  Scheduler resumed');
    }
  }

  // 중지
  stop() {
    if (this.job) {
      this.job.stop();
      this.job.destroy();
      this.job = null;
      this.isRunning = false;
      console.log('🛑 Scheduler stopped');
    }
  }

  // 수동 동기화
  async runNow() {
    console.log('▶️  Running manual sync...');
    const status = await this.syncManager.syncAll();
    await this.syncManager.logSyncStatus(status);
    return status;
  }

  // 상태 조회
  getStatus() {
    return {
      running: this.isRunning,
      nextRun: this.job ? 'Every hour' : 'Not scheduled',
    };
  }
}

export default SyncScheduler;
