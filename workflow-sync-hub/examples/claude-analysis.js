/**
 * Example: Claude Analysis
 */

import WorkflowAnalyzer from '../src/claude/analyzer.js';
import PortfolioGenerator from '../src/claude/portfolio-generator.js';
import config from '../src/config.js';

async function main() {
  console.log('🤖 Claude Analysis Example\n');

  if (!config.claude.apiKey) {
    console.error('❌ ANTHROPIC_API_KEY not set in .env');
    process.exit(1);
  }

  try {
    const analyzer = new WorkflowAnalyzer(config);
    // NOTE: PortfolioGenerator는 향후 sampleData 기반 포트폴리오 생성에 사용 예정 (현재 예제는 분석 단계만 시연)

    const sampleData = {
      confluence_pages: [
        { title: 'API 설계 가이드', status: 'published' },
        { title: '배포 프로세스 문서화', status: 'published' },
      ],
      jira_issues: [
        { key: 'ABC-123', summary: '백엔드 성능 개선', status: 'Done', story_points: 8 },
        { key: 'ABC-124', summary: '인증 시스템 구현', status: 'In Progress', story_points: 13 },
      ],
    };

    console.log('📊 Analyzing workflow...');
    const workflow = await analyzer.analyzeWorkflow(sampleData);
    console.log(workflow);

    console.log('\n🎯 Analyzing skills...');
    const skills = await analyzer.analyzeSkills();
    console.log(skills);

    console.log('\n✅ Analysis completed!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
