import Anthropic from '@anthropic-ai/sdk';
import config from '../config.js';

export class PortfolioGenerator {
  constructor(cfg = config) {
    this.config = cfg;
    this.client = new Anthropic({
      apiKey: cfg.claude.apiKey,
    });
  }

  // 포트폴리오 마크다운 생성
  async generatePortfolio() {
    console.log('📝 Generating portfolio markdown...');

    const prompt = `
내 업무 경험을 바탕으로 포트폴리오 마크다운을 작성해주세요.

포함할 항목:
1. 소개 (1-2문단)
2. 핵심 프로젝트 (3-5개)
3. 기술 스택
4. 주요 성과
5. 연락처

마크다운 형식으로 작성하되, 포트폴리오 사이트에 바로 사용 가능하도록 해주세요.
`;

    try {
      const message = await this.client.messages.create({
        model: this.config.claude.model,
        max_tokens: 2048,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      return message.content[0].type === 'text' ? message.content[0].text : '';
    } catch (error) {
      console.error('❌ Portfolio generation failed:', error.message);
      throw error;
    }
  }

  // 프로젝트별 성과 문서화
  async documentProjectAchievements(projectName) {
    console.log(`📋 Documenting project achievements for ${projectName}...`);

    const prompt = `
"${projectName}" 프로젝트의 성과를 정리해주세요:

포함할 내용:
1. 프로젝트 개요
2. 나의 역할
3. 주요 기여도
4. 사용된 기술
5. 결과 및 영향
6. 배운 점

각 항목은 구체적이고 측정 가능하게 작성해주세요.
`;

    try {
      const message = await this.client.messages.create({
        model: this.config.claude.model,
        max_tokens: 1500,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      return message.content[0].type === 'text' ? message.content[0].text : '';
    } catch (error) {
      console.error('❌ Project documentation failed:', error.message);
      throw error;
    }
  }

  // LinkedIn 추천 콘텐츠
  async generateLinkedInContent() {
    console.log('💼 Generating LinkedIn post suggestions...');

    const prompt = `
최근 성과를 바탕으로 LinkedIn에 올릴 수 있는 게시물 3개를 작성해주세요.

각 게시물은:
- 어떤 성과나 배움인지
- 왜 중요한지
- 다른 사람들이 배울 점
- 적절한 해시태그

LinkedIn 톤으로 전문적이면서도 친근하게 작성해주세요.
`;

    try {
      const message = await this.client.messages.create({
        model: this.config.claude.model,
        max_tokens: 1200,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      return message.content[0].type === 'text' ? message.content[0].text : '';
    } catch (error) {
      console.error('❌ LinkedIn content generation failed:', error.message);
      throw error;
    }
  }

  // 경력 개발 리포트
  async generateCareerReport() {
    console.log('📊 Generating career development report...');

    const prompt = `
지난 기간의 경력 개발을 분석한 리포트를 작성해주세요:

포함할 내용:
1. 현재 경력 수준 평가
2. 성장 영역
3. 부족한 영역
4. 향후 3-6개월 목표
5. 추천 학습 및 개발 방향
6. 경력 경로 제안

구체적인 액션 아이템과 함께 작성해주세요.
`;

    try {
      const message = await this.client.messages.create({
        model: this.config.claude.model,
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      return message.content[0].type === 'text' ? message.content[0].text : '';
    } catch (error) {
      console.error('❌ Career report generation failed:', error.message);
      throw error;
    }
  }
}

export default PortfolioGenerator;
