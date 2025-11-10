-- Research and Feedback Infrastructure
-- Strategic improvements for customer needs discovery and product development

-- User feedback table for embedded feedback loops
CREATE TABLE IF NOT EXISTS user_feedback (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    email TEXT,
    category TEXT NOT NULL CHECK (category IN ('feature_request', 'bug_report', 'improvement', 'documentation', 'support', 'other')),
    message TEXT NOT NULL,
    industry TEXT CHECK (industry IN ('banking', 'healthcare', 'retail', 'manufacturing', 'technology', 'education', 'government', 'other')),
    role TEXT CHECK (role IN ('compliance_officer', 'legal', 'it_security', 'executive', 'developer', 'consultant', 'other')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'reviewing', 'planned', 'in_progress', 'completed', 'wont_fix')),
    response TEXT,
    responded_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Regulatory updates tracking
CREATE TABLE IF NOT EXISTS regulatory_updates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    source TEXT, -- MSIT, PIPC, etc.
    article TEXT, -- Which article affected
    effective_date DATE,
    severity TEXT CHECK (severity IN ('critical', 'high', 'medium', 'low', 'informational')),
    content TEXT,
    url TEXT,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Competitor analysis tracking
CREATE TABLE IF NOT EXISTS competitor_features (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    competitor_name TEXT NOT NULL,
    feature_name TEXT NOT NULL,
    description TEXT,
    category TEXT, -- authentication, dashboard, reporting, etc.
    priority_score INTEGER DEFAULT 0, -- User vote on importance
    implemented BOOLEAN DEFAULT FALSE,
    implementation_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Industry-specific templates
CREATE TABLE IF NOT EXISTS industry_templates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    industry TEXT NOT NULL CHECK (industry IN ('banking', 'healthcare', 'retail', 'manufacturing', 'technology', 'education', 'government', 'other')),
    template_type TEXT NOT NULL CHECK (template_type IN ('checklist', 'report', 'policy', 'audit', 'training')),
    title TEXT NOT NULL,
    description TEXT,
    content JSONB NOT NULL,
    language TEXT DEFAULT 'ko' CHECK (language IN ('ko', 'en')),
    is_active BOOLEAN DEFAULT TRUE,
    version INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Document templates for MSIT submissions
CREATE TABLE IF NOT EXISTS document_templates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    template_type TEXT NOT NULL CHECK (template_type IN ('msit_submission', 'audit_report', 'privacy_notice', 'transparency_report', 'risk_assessment')),
    content TEXT NOT NULL, -- HTML or Markdown template
    variables JSONB, -- Variables that can be filled in
    language TEXT DEFAULT 'ko' CHECK (language IN ('ko', 'en')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customer interview notes (for research)
CREATE TABLE IF NOT EXISTS customer_interviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    interviewer TEXT,
    interview_date DATE NOT NULL,
    industry TEXT,
    company_size TEXT CHECK (company_size IN ('startup', 'small', 'medium', 'large', 'enterprise')),
    key_pain_points TEXT[],
    feature_requests TEXT[],
    compliance_bottlenecks TEXT[],
    willingness_to_pay INTEGER, -- 1-10 scale
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Feature usage analytics
CREATE TABLE IF NOT EXISTS feature_usage (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    feature_name TEXT NOT NULL,
    page_path TEXT,
    action TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Regulatory alert subscriptions
CREATE TABLE IF NOT EXISTS alert_subscriptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    alert_type TEXT NOT NULL CHECK (alert_type IN ('regulatory_update', 'deadline_reminder', 'feature_release', 'compliance_tip')),
    frequency TEXT DEFAULT 'immediate' CHECK (frequency IN ('immediate', 'daily', 'weekly', 'monthly')),
    channels TEXT[] DEFAULT ARRAY['email'], -- email, sms, dashboard
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, alert_type)
);

-- Insert sample regulatory updates
INSERT INTO regulatory_updates (title, description, source, article, effective_date, severity, content) VALUES
    (
        'AI 시스템 등록 의무화',
        '고위험 AI 시스템은 2026년 1월 22일까지 MSIT에 등록해야 합니다',
        'MSIT',
        '제32조',
        '2026-01-22',
        'critical',
        '고위험 AI 시스템 제공자는 해당 시스템을 출시하기 전에 과학기술정보통신부에 등록해야 합니다. 미등록 시 최대 3천만원의 과태료가 부과될 수 있습니다.'
    ),
    (
        '개인정보 처리 동의 강화',
        'AI가 개인정보를 처리하는 경우 명시적 동의가 필요합니다',
        'PIPC',
        '제33조',
        '2026-01-22',
        'high',
        '개인정보보호위원회는 AI 시스템이 개인정보를 처리하는 경우, 사용자로부터 명시적이고 구체적인 동의를 받아야 한다고 명시했습니다.'
    )
ON CONFLICT DO NOTHING;

-- Insert sample industry templates
INSERT INTO industry_templates (industry, template_type, title, description, content, language) VALUES
    (
        'banking',
        'checklist',
        '금융업 AI 준법 체크리스트',
        '금융권 특화 준법 점검 항목',
        '{
            "items": [
                {"id": "1", "title": "금융감독원 AI 가이드라인 준수", "article": "금융위원회 고시"},
                {"id": "2", "title": "신용평가 AI 투명성 확보", "article": "제35조"},
                {"id": "3", "title": "금융소비자 보호 조치", "article": "제36조"}
            ]
        }',
        'ko'
    ),
    (
        'healthcare',
        'checklist',
        '의료업 AI 준법 체크리스트',
        '의료 AI 시스템 특화 점검 항목',
        '{
            "items": [
                {"id": "1", "title": "의료기기법 준수 확인", "article": "의료기기법"},
                {"id": "2", "title": "환자 데이터 보안 강화", "article": "개인정보보호법"},
                {"id": "3", "title": "의료 AI 진단 기록 보관", "article": "제34조"}
            ]
        }',
        'ko'
    )
ON CONFLICT DO NOTHING;

-- Insert document templates
INSERT INTO document_templates (name, description, template_type, content, variables, language) VALUES
    (
        'MSIT AI 시스템 등록 신청서',
        'MSIT에 제출하는 고위험 AI 시스템 등록 신청서',
        'msit_submission',
        '<h1>AI 시스템 등록 신청서</h1>
        <p>신청일: {{submission_date}}</p>
        <h2>1. 사업자 정보</h2>
        <p>회사명: {{company_name}}</p>
        <p>사업자등록번호: {{business_number}}</p>
        <p>대표자: {{ceo_name}}</p>
        <h2>2. AI 시스템 정보</h2>
        <p>시스템명: {{system_name}}</p>
        <p>위험도: {{risk_level}}</p>
        <p>사용 목적: {{purpose}}</p>',
        '{"submission_date": "date", "company_name": "text", "business_number": "text", "ceo_name": "text", "system_name": "text", "risk_level": "text", "purpose": "textarea"}',
        'ko'
    ),
    (
        'AI 투명성 보고서',
        'AI 시스템의 작동 방식을 설명하는 투명성 보고서',
        'transparency_report',
        '<h1>AI 투명성 보고서</h1>
        <h2>시스템 개요</h2>
        <p>{{system_overview}}</p>
        <h2>데이터 사용</h2>
        <p>{{data_usage}}</p>
        <h2>의사결정 프로세스</h2>
        <p>{{decision_process}}</p>',
        '{"system_overview": "textarea", "data_usage": "textarea", "decision_process": "textarea"}',
        'ko'
    )
ON CONFLICT DO NOTHING;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_feedback_status ON user_feedback(status);
CREATE INDEX IF NOT EXISTS idx_user_feedback_priority ON user_feedback(priority);
CREATE INDEX IF NOT EXISTS idx_user_feedback_created_at ON user_feedback(created_at);
CREATE INDEX IF NOT EXISTS idx_regulatory_updates_effective_date ON regulatory_updates(effective_date);
CREATE INDEX IF NOT EXISTS idx_regulatory_updates_severity ON regulatory_updates(severity);
CREATE INDEX IF NOT EXISTS idx_industry_templates_industry ON industry_templates(industry);
CREATE INDEX IF NOT EXISTS idx_feature_usage_user_id ON feature_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_feature_usage_feature_name ON feature_usage(feature_name);

-- Enable RLS
ALTER TABLE user_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_usage ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_feedback
CREATE POLICY "Users can view their own feedback"
    ON user_feedback FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own feedback"
    ON user_feedback FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- RLS Policies for alert_subscriptions
CREATE POLICY "Users can manage their own alert subscriptions"
    ON alert_subscriptions FOR ALL
    USING (auth.uid() = user_id);

-- RLS Policies for feature_usage
CREATE POLICY "Users can view their own feature usage"
    ON feature_usage FOR SELECT
    USING (auth.uid() = user_id);

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON regulatory_updates TO anon, authenticated;
GRANT SELECT ON industry_templates TO anon, authenticated;
GRANT SELECT ON document_templates TO anon, authenticated;
