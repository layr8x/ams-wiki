import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

export const config = {
  // Confluence
  confluence: {
    domain: process.env.CONFLUENCE_DOMAIN,
    email: process.env.CONFLUENCE_EMAIL,
    apiToken: process.env.CONFLUENCE_API_TOKEN,
    spaceKey: process.env.CONFLUENCE_SPACE_KEY || 'WORKSPACE',
    baseUrl: `https://${process.env.CONFLUENCE_DOMAIN}/wiki/rest/api/3`,
  },

  // Jira
  jira: {
    domain: process.env.JIRA_DOMAIN,
    email: process.env.JIRA_EMAIL,
    apiToken: process.env.JIRA_API_TOKEN,
    projectKey: process.env.JIRA_PROJECT_KEY,
    baseUrl: `https://${process.env.JIRA_DOMAIN}/rest/api/3`,
  },

  // Obsidian
  obsidian: {
    vaultPath: process.env.OBSIDIAN_VAULT_PATH,
    apiKey: process.env.OBSIDIAN_API_KEY,
    baseUrl: 'http://localhost:27123',
    syncFolder: process.env.OBSIDIAN_SYNC_FOLDER || 'Work',
  },

  // Claude
  claude: {
    apiKey: process.env.ANTHROPIC_API_KEY,
    model: 'claude-3-5-sonnet-20241022',
  },

  // Sync
  sync: {
    interval: parseInt(process.env.SYNC_INTERVAL || '3600000'),
    onStartup: process.env.SYNC_ON_STARTUP !== 'false',
    confluence: process.env.ENABLE_CONFLUENCE_SYNC !== 'false',
    jira: process.env.ENABLE_JIRA_SYNC !== 'false',
    claude: process.env.ENABLE_CLAUDE_ANALYSIS !== 'false',
  },

  // Development
  isDev: process.env.NODE_ENV === 'development',
  logLevel: process.env.LOG_LEVEL || 'info',
};

// Validation
function validateConfig() {
  const required = [
    'confluence.domain',
    'confluence.email',
    'confluence.apiToken',
    'jira.domain',
    'jira.email',
    'jira.apiToken',
    'obsidian.vaultPath',
    'obsidian.apiKey',
  ];

  const missing = required.filter(key => {
    const [section, field] = key.split('.');
    return !config[section][field];
  });

  if (missing.length > 0) {
    console.warn('⚠️  Missing configuration:', missing);
  }
}

validateConfig();

export default config;
