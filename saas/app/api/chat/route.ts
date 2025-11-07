import { NextRequest, NextResponse } from 'next/server';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  message: string;
  language: 'ko' | 'en';
  riskScore?: number;
  conversationHistory?: Message[];
}

// Compliance knowledge base
const complianceKnowledge = {
  ko: {
    highRisk: '귀하의 AI 시스템은 100/100 고위험으로 분류됩니다. 한국 AI 기본법에 따라 즉각적인 조치가 필요합니다.',
    lowRisk: '귀하의 AI 시스템은 저위험으로 분류됩니다. 정기적인 모니터링과 문서화가 권장됩니다.',
    requiredDocs: {
      high: [
        '제32조: 위험 관리 계획서',
        '제33조: 배포 전 검토 보고서',
        '제31조: AI 시스템 등록 문서',
        '제36조: 사고 대응 절차서'
      ],
      low: [
        '제31조: AI 시스템 등록 문서',
        '연간 준수 보고서'
      ]
    },
    greeting: '안녕하세요! 한국 AI 기본법 규정 준수에 대해 도와드리겠습니다.',
  },
  en: {
    highRisk: 'Your AI system is classified as 100/100 high-risk. Immediate action is required under the Korean AI Basic Act.',
    lowRisk: 'Your AI system is classified as low-risk. Regular monitoring and documentation are recommended.',
    requiredDocs: {
      high: [
        'Article 32: Risk Management Plan',
        'Article 33: Pre-deployment Review Report',
        'Article 31: AI System Registration',
        'Article 36: Incident Response Procedures'
      ],
      low: [
        'Article 31: AI System Registration',
        'Annual Compliance Report'
      ]
    },
    greeting: 'Hello! I\'m here to help with Korean AI Basic Act compliance.',
  }
};

function generateResponse(request: ChatRequest): string {
  const { message, language, riskScore = 0 } = request;
  const kb = complianceKnowledge[language];
  const messageLower = message.toLowerCase();

  // Risk score queries
  if (messageLower.includes('위험') || messageLower.includes('점수') ||
      messageLower.includes('risk') || messageLower.includes('score')) {
    if (riskScore > 50) {
      return kb.highRisk;
    } else if (riskScore > 0) {
      return kb.lowRisk;
    } else {
      return language === 'ko'
        ? '아직 위험 평가를 완료하지 않으셨습니다. 무료 평가를 시작하시겠습니까?'
        : 'You haven\'t completed a risk assessment yet. Would you like to start a free assessment?';
    }
  }

  // Document queries
  if (messageLower.includes('문서') || messageLower.includes('서류') ||
      messageLower.includes('document') || messageLower.includes('paper')) {
    const docs = riskScore > 50 ? kb.requiredDocs.high : kb.requiredDocs.low;
    const intro = language === 'ko'
      ? `귀하의 위험 점수 ${riskScore}/100에 따라 다음 문서가 필요합니다:\n\n`
      : `Based on your risk score of ${riskScore}/100, you need:\n\n`;

    return intro + docs.map((doc, i) => `${i + 1}. ${doc}`).join('\n') +
      (language === 'ko' ? '\n\n이 문서들을 자동으로 생성해드릴까요?' : '\n\nWould you like me to generate these documents for you?');
  }

  // Compliance status
  if (messageLower.includes('준수') || messageLower.includes('상태') ||
      messageLower.includes('compliance') || messageLower.includes('status')) {
    if (riskScore > 50) {
      return language === 'ko'
        ? `현재 준수 상태: ⚠️ 조치 필요\n\n고위험 시스템으로 다음이 필요합니다:\n• 즉시 위험 관리 계획 수립\n• 배포 전 검토 수행\n• 정부 등록 완료\n\n도움이 필요하시면 데모를 예약하세요!`
        : `Current compliance status: ⚠️ Action Required\n\nAs a high-risk system, you need:\n• Immediate risk management planning\n• Pre-deployment review\n• Government registration\n\nBook a demo for assistance!`;
    } else {
      return language === 'ko'
        ? '현재 준수 상태: ✅ 양호\n\n정기 모니터링과 연간 보고서 제출을 권장합니다.'
        : 'Current compliance status: ✅ Good\n\nRegular monitoring and annual reporting are recommended.';
    }
  }

  // AI Basic Act info
  if (messageLower.includes('기본법') || messageLower.includes('법률') ||
      messageLower.includes('basic act') || messageLower.includes('law')) {
    return language === 'ko'
      ? 'AI 기본법은 2026년 1월부터 완전 시행됩니다. 주요 내용:\n\n• 고위험 AI 시스템 규제\n• 투명성 및 설명가능성 요구\n• 개인정보 보호 강화\n• 위반 시 최대 3천만원 벌금\n\n자세한 준수 가이드가 필요하신가요?'
      : 'The AI Basic Act takes full effect January 2026. Key points:\n\n• High-risk AI system regulation\n• Transparency and explainability requirements\n• Enhanced privacy protection\n• Penalties up to ₩30M (~$21K)\n\nWould you like a detailed compliance guide?';
  }

  // Pricing/demo
  if (messageLower.includes('가격') || messageLower.includes('요금') ||
      messageLower.includes('price') || messageLower.includes('cost')) {
    return language === 'ko'
      ? '우리의 요금제:\n\n• Starter: $99/월 (최대 5개 시스템)\n• Professional: $299/월 (최대 25개 시스템)\n• Enterprise: 맞춤 견적\n\n모든 요금제에는 위험 평가, 문서 생성, 자동 모니터링이 포함됩니다.'
      : 'Our pricing plans:\n\n• Starter: $99/month (up to 5 systems)\n• Professional: $299/month (up to 25 systems)\n• Enterprise: Custom pricing\n\nAll plans include risk assessment, document generation, and automated monitoring.';
  }

  // Timeline
  if (messageLower.includes('언제') || messageLower.includes('시간') ||
      messageLower.includes('when') || messageLower.includes('timeline')) {
    return language === 'ko'
      ? '중요 일정:\n\n• 2026년 1월: 법 전면 시행\n• 2026년 3월: 첫 규정 준수 감사\n• 2026년 6월: 처벌 집행 시작\n\n지금 바로 준비를 시작하는 것을 권장합니다!'
      : 'Key timeline:\n\n• January 2026: Full law enforcement\n• March 2026: First compliance audits\n• June 2026: Penalty enforcement begins\n\nWe recommend starting preparation now!';
  }

  // Default response
  return language === 'ko'
    ? '죄송합니다. 질문을 완전히 이해하지 못했습니다. 다음 주제에 대해 도와드릴 수 있습니다:\n\n• 위험 점수 확인\n• 필요 문서 안내\n• 준수 상태 점검\n• AI 기본법 정보\n• 요금제 문의\n\n구체적으로 무엇을 도와드릴까요?'
    : 'I\'m sorry, I didn\'t fully understand your question. I can help with:\n\n• Risk score information\n• Required documents\n• Compliance status\n• AI Basic Act details\n• Pricing information\n\nWhat specifically would you like to know?';
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { message, language, riskScore } = body;

    if (!message || !language) {
      return NextResponse.json(
        { error: 'Message and language are required' },
        { status: 400 }
      );
    }

    // Generate AI response based on context
    const response = generateResponse(body);

    return NextResponse.json({
      response,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
