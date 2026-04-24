import axios from 'axios';
import config from '../config.js';

export class JiraClient {
  constructor(cfg = config) {
    this.config = cfg;
    this.client = axios.create({
      baseURL: cfg.jira.baseUrl,
      auth: {
        username: cfg.jira.email,
        password: cfg.jira.apiToken,
      },
    });
  }

  // 할당된 이슈 조회
  async getMyIssues() {
    try {
      const response = await this.client.get('/search', {
        params: {
          jql: `assignee = currentUser() AND project = ${this.config.jira.projectKey}`,
          maxResults: 100,
          fields: '*all',
        },
      });

      return response.data.issues || [];
    } catch (error) {
      console.error('❌ Failed to fetch issues:', error.message);
      throw error;
    }
  }

  // 이슈 상세 조회
  async getIssueById(issueKey) {
    try {
      const response = await this.client.get(`/issues/${issueKey}`, {
        params: {
          fields: '*all',
        },
      });

      return response.data;
    } catch (error) {
      console.error(`❌ Failed to fetch issue ${issueKey}:`, error.message);
      throw error;
    }
  }

  // 메타데이터 추출
  async getIssueMetadata(issueKey) {
    const issue = await this.getIssueById(issueKey);
    const fields = issue.fields;

    return {
      key: issue.key,
      title: fields.summary,
      status: fields.status?.name,
      assignee: fields.assignee?.emailAddress,
      storyPoints: fields.customfield_10016,
      sprint: fields.customfield_10020?.[0]?.name,
      priority: fields.priority?.name,
      createdAt: fields.created,
      updatedAt: fields.updated,
      dueDate: fields.duedate,
      components: fields.components?.map(c => c.name) || [],
      labels: fields.labels || [],
    };
  }

  // 완료된 이슈 (포트폴리오용)
  async getCompletedIssues(since = 30) {
    try {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - since);
      const sinceDate = daysAgo.toISOString().split('T')[0];

      const response = await this.client.get('/search', {
        params: {
          jql: `assignee = currentUser()
                AND project = ${this.config.jira.projectKey}
                AND status = Done
                AND updated >= ${sinceDate}`,
          maxResults: 100,
        },
      });

      return response.data.issues || [];
    } catch (error) {
      console.error('❌ Failed to fetch completed issues:', error.message);
      return [];
    }
  }

  // Obsidian에 동기화
  async syncToObsidian(obsidianClient, issues) {
    const results = {
      success: 0,
      failed: 0,
      skipped: 0,
    };

    for (const issue of issues) {
      try {
        const metadata = await this.getIssueMetadata(issue.key);
        const frontmatter = this._generateFrontmatter(metadata);
        const content = this._convertToMarkdown(metadata);

        const filePath = `${this.config.obsidian.syncFolder}/Jira/${issue.key}.md`;

        await obsidianClient.writeFile(filePath, content, frontmatter);
        results.success++;
      } catch (error) {
        console.error(`❌ Failed to sync issue ${issue.key}:`, error.message);
        results.failed++;
      }
    }

    return results;
  }

  // Frontmatter 생성
  _generateFrontmatter(metadata) {
    return {
      type: 'jira_issue',
      date: new Date().toISOString().split('T')[0],
      source: 'jira',
      key: metadata.key,
      title: metadata.title,
      status: metadata.status,
      story_points: metadata.storyPoints || 0,
      sprint: metadata.sprint,
      priority: metadata.priority,
      assignee: metadata.assignee,
      due_date: metadata.dueDate,
      created_at: metadata.createdAt,
      updated_at: metadata.updatedAt,
      tags: ['jira', 'task', ...(metadata.labels || [])],
    };
  }

  // 마크다운으로 변환
  _convertToMarkdown(metadata) {
    return `# ${metadata.key} - ${metadata.title}\n\n**Status:** ${metadata.status}\n**Story Points:** ${metadata.storyPoints || '-'}\n**Sprint:** ${metadata.sprint || 'No Sprint'}\n**Priority:** ${metadata.priority || 'Medium'}\n**Due Date:** ${metadata.dueDate || 'No due date'}\n\n## Details\n\n- **Assignee:** ${metadata.assignee || 'Unassigned'}\n- **Created:** ${metadata.createdAt}\n- **Updated:** ${metadata.updatedAt}\n- **Components:** ${metadata.components.join(', ') || 'None'}\n- **Labels:** ${metadata.labels.join(', ') || 'None'}\n\n## Subtasks\n\n- [ ]\n\n## Notes\n\nAdd your notes here...\n`;
  }
}

export default JiraClient;
