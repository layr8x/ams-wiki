import axios from 'axios';
import config from '../config.js';

export class ConfluenceClient {
  constructor(cfg = config) {
    this.config = cfg;
    this.client = axios.create({
      baseURL: cfg.confluence.baseUrl,
      auth: {
        username: cfg.confluence.email,
        password: cfg.confluence.apiToken,
      },
    });
  }

  // 현재 사용자의 페이지 조회
  async getMyPages() {
    try {
      const response = await this.client.get('/pages', {
        params: {
          'space.key': this.config.confluence.spaceKey,
          limit: 100,
        },
      });

      return response.data.results || [];
    } catch (error) {
      console.error('❌ Failed to fetch pages:', error.message);
      throw error;
    }
  }

  // 페이지 상세 정보 조회
  async getPageById(pageId) {
    try {
      const response = await this.client.get(`/pages/${pageId}`, {
        params: {
          'body-format': 'storage',
        },
      });

      return response.data;
    } catch (error) {
      console.error(`❌ Failed to fetch page ${pageId}:`, error.message);
      throw error;
    }
  }

  // 페이지 메타데이터 추출
  async getPageMetadata(pageId) {
    const page = await this.getPageById(pageId);
    return {
      id: page.id,
      title: page.title,
      status: page.status,
      createdAt: page.createdAt,
      updatedAt: page.version?.when,
      createdBy: page.createdBy?.email,
      updatedBy: page.version?.createdBy?.email,
    };
  }

  // 변경 이력 조회
  async getPageHistory(pageId) {
    try {
      const response = await this.client.get(`/pages/${pageId}/versions`, {
        params: {
          limit: 10,
        },
      });

      return response.data.results || [];
    } catch (error) {
      console.error(`❌ Failed to fetch page history:`, error.message);
      return [];
    }
  }

  // Obsidian에 동기화
  async syncToObsidian(obsidianClient, pages) {
    const results = {
      success: 0,
      failed: 0,
      skipped: 0,
    };

    for (const page of pages) {
      try {
        const metadata = await this.getPageMetadata(page.id);
        const frontmatter = this._generateFrontmatter(metadata);
        const content = this._convertToMarkdown(page);

        const filePath = `${this.config.obsidian.syncFolder}/Confluence/${page.title}.md`;

        await obsidianClient.writeFile(filePath, content, frontmatter);
        results.success++;
      } catch (error) {
        console.error(`❌ Failed to sync page ${page.title}:`, error.message);
        results.failed++;
      }
    }

    return results;
  }

  // Frontmatter 생성
  _generateFrontmatter(metadata) {
    return {
      type: 'confluence_page',
      date: new Date().toISOString().split('T')[0],
      source: 'confluence',
      id: metadata.id,
      title: metadata.title,
      status: metadata.status,
      created_at: metadata.createdAt,
      updated_at: metadata.updatedAt,
      author: metadata.createdBy,
      tags: ['confluence', 'documentation'],
    };
  }

  // 마크다운으로 변환
  _convertToMarkdown(page) {
    return `# ${page.title}\n\n${page.body?.storage?.value || '*(No content)*'}\n`;
  }
}

export default ConfluenceClient;
