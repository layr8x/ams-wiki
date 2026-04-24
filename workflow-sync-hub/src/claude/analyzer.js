import Anthropic from '@anthropic-ai/sdk';
import config from '../config.js';

export class WorkflowAnalyzer {
  constructor(cfg = config) {
    this.config = cfg;
    this.client = new Anthropic({
      apiKey: cfg.claude.apiKey,
    });
  }

  // 업무 데이터 분석
  async analyzeWorkflow(obsidianData) {
    console.log('🤖 Analyzing workflow with Claude...');

    const prompt = `
다음은 내 Confluence, Jira 데이터를 분석해줄 업무 정보입니다:

${JSON.stringify(obsidianData, null, 2)}

다음을 분석해주세요:
1. 핵심 성과 (Key achievements)
2. 수행한 작업의 영역 (Areas of work)
3. 기술 스택 및 도구 (Tech stack)
4. 의사결정 패턴 (Decision patterns)
5. 개선 영역 (Areas for improvement)

자세한 분석 결과를 마크다운 형식으로 제공해주세요.
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
      console.error('❌ Analysis failed:', error.message);
      throw error;
    }
  }

  // 성과 요약
  async summarizePerformance(period = 'monthly') {
    console.log(`📊 Generating ${period} performance summary...`);

    const prompt = `
사용자의 지난 ${period}간의 업무 성과를 요약해주세요:

- 완료한 주요 작업
- 해결한 문제들
- 협업 내용
- 성과 지표

정보: [작업 데이터를 여기에 입력]

간결한 요약을 마크다운으로 작성해주세요.
`;

    try {
      const message = await this.client.messages.create({
        model: this.config.claude.model,
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      return message.content[0].type === 'text' ? message.content[0].text : '';
    } catch (error) {
      console.error('❌ Summarization failed:', error.message);
      throw error;
    }
  }

  // 핵심 인사이트 추출
  async extractInsights() {
    console.log('💡 Extracting key insights...');

    const prompt = `
다음 업무 데이터에서 핵심 인사이트를 5가지만 추출해주세요:

[작업 데이터]

각 인사이트는:
- 핵심 내용
- 왜 중요한지
- 어떻게 활용할지

간결하게 작성해주세요.
`;

    try {
      const message = await this.client.messages.create({
        model: this.config.claude.model,
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      return message.content[0].type === 'text' ? message.content[0].text : '';
    } catch (error) {
      console.error('❌ Insight extraction failed:', error.message);
      throw error;
    }
  }

  // 스킬셋 분석
  async analyzeSkills() {
    console.log('🎯 Analyzing skill set...');

    const prompt = `
작업 이력을 분석하여 다음을 파악해주세요:

1. 기술 스킬
2. 업무 스킬
3. 소프트 스킬
4. 강점
5. 발전 가능 영역

각각 구체적인 예시와 함께 설명해주세요.
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
      console.error('❌ Skill analysis failed:', error.message);
      throw error;
    }
  }

  // 의사결정 트렌드 분석
  async analyzeTrends() {
    console.log('📈 Analyzing decision trends...');

    const prompt = `
최근 의사결정 트렌드를 분석해주세요:

1. 자주 내린 결정 유형
2. 의사결정 프로세스
3. 성공한 결정과 실패한 결정
4. 개선 가능한 부분
5. 앞으로의 방향

구체적인 예시와 함께 분석해주세요.
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
      console.error('❌ Trend analysis failed:', error.message);
      throw error;
    }
  }
}

export default WorkflowAnalyzer;
