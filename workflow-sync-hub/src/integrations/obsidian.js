import axios from 'axios';
import path from 'path';
import config from '../config.js';

export class ObsidianClient {
  constructor(cfg = config) {
    this.config = cfg;
    this.client = axios.create({
      baseURL: cfg.obsidian.baseUrl,
      headers: {
        Authorization: `Bearer ${cfg.obsidian.apiKey}`,
      },
    });
  }

  // 파일 생성/업데이트
  async writeFile(filePath, content, frontmatter = {}) {
    try {
      const fullContent = this._addFrontmatter(content, frontmatter);

      await this.client.post('/vault/create', {
        path: filePath,
        content: fullContent,
      });

      console.log(`✅ File created: ${filePath}`);
      return true;
    } catch (error) {
      if (error.response?.status === 400) {
        return this.updateFile(filePath, content, frontmatter);
      }
      console.error(`❌ Failed to write file ${filePath}:`, error.message);
      throw error;
    }
  }

  // 파일 업데이트
  async updateFile(filePath, content, frontmatter = {}) {
    try {
      const fullContent = this._addFrontmatter(content, frontmatter);

      await this.client.post('/vault/modify', {
        path: filePath,
        content: fullContent,
      });

      console.log(`✅ File updated: ${filePath}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to update file ${filePath}:`, error.message);
      throw error;
    }
  }

  // 파일 조회
  async readFile(filePath) {
    try {
      const response = await this.client.post('/vault/read', {
        path: filePath,
      });

      return response.data.content || '';
    } catch (error) {
      console.error(`❌ Failed to read file ${filePath}:`, error.message);
      throw error;
    }
  }

  // 폴더 생성
  async createFolder(folderPath) {
    try {
      await this.client.post('/vault/create-folder', {
        path: folderPath,
      });

      console.log(`✅ Folder created: ${folderPath}`);
      return true;
    } catch (error) {
      if (error.response?.status === 400) {
        return true;
      }
      console.error(`❌ Failed to create folder:`, error.message);
      throw error;
    }
  }

  // 파일 삭제
  async deleteFile(filePath) {
    try {
      await this.client.post('/vault/delete', {
        path: filePath,
      });

      console.log(`✅ File deleted: ${filePath}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to delete file:`, error.message);
      throw error;
    }
  }

  // 파일 목록 조회
  async listFiles(folderPath) {
    try {
      const response = await this.client.post('/vault/list', {
        path: folderPath,
      });

      return response.data.files || [];
    } catch (error) {
      console.error(`❌ Failed to list files:`, error.message);
      return [];
    }
  }

  // 연결 테스트
  async testConnection() {
    try {
      const response = await this.client.post('/vault/list', {
        path: '',
      });

      console.log('✅ Obsidian connection successful');
      return true;
    } catch (error) {
      console.error('❌ Obsidian connection failed:', error.message);
      throw error;
    }
  }

  // Frontmatter 추가
  _addFrontmatter(content, frontmatter = {}) {
    const yamlLines = ['---'];

    for (const [key, value] of Object.entries(frontmatter)) {
      if (Array.isArray(value)) {
        yamlLines.push(`${key}: [${value.map(v => `"${v}"`).join(', ')}]`);
      } else if (typeof value === 'string') {
        yamlLines.push(`${key}: ${value}`);
      } else if (value !== null && value !== undefined) {
        yamlLines.push(`${key}: ${value}`);
      }
    }

    yamlLines.push('---');
    yamlLines.push('');

    return yamlLines.join('\n') + content;
  }

  // 필수 폴더 초기화
  async initializeVault() {
    const folders = [
      this.config.obsidian.syncFolder,
      `${this.config.obsidian.syncFolder}/Confluence`,
      `${this.config.obsidian.syncFolder}/Jira`,
      `${this.config.obsidian.syncFolder}/Analysis`,
    ];

    for (const folder of folders) {
      await this.createFolder(folder);
    }

    console.log('✅ Vault initialized');
  }
}

export default ObsidianClient;
