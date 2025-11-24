-- Korean AI Compliance Guardian Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    company_name TEXT,
    risk_score INTEGER DEFAULT 0,
    checklist_progress JSONB DEFAULT '[]'::jsonb,
    subscription_status TEXT DEFAULT 'free',
    subscription_plan TEXT,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    trial_end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Risk assessments table
CREATE TABLE IF NOT EXISTS risk_assessments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    email TEXT NOT NULL,
    ai_usage TEXT NOT NULL,
    processes_personal_data BOOLEAN DEFAULT FALSE,
    risk_score INTEGER NOT NULL,
    risk_level TEXT NOT NULL,
    recommendation TEXT,
    industry_category TEXT,
    consent_given BOOLEAN DEFAULT FALSE,
    ip_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Compliance checklist items (default template)
CREATE TABLE IF NOT EXISTS checklist_templates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    article TEXT NOT NULL,
    order_index INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default checklist items
INSERT INTO checklist_templates (title, description, article, order_index) VALUES
    ('AI 시스템 등록', '고위험 AI 시스템을 MSIT에 등록하세요', '제32조', 1),
    ('개인정보 처리 동의', 'PIPC 요구사항에 따른 사용자 동의 확보', '제33조', 2),
    ('감사 로그 시스템', '모든 AI 추론에 대한 감사 로그 구현', '제34조', 3),
    ('투명성 보고서', 'AI 시스템 작동 방식에 대한 투명성 문서 작성', '제35조', 4),
    ('데이터 거버넌스', '데이터 품질 및 보안 관리 체계 구축', '제36조', 5)
ON CONFLICT DO NOTHING;

-- Email queue table for automated campaigns
CREATE TABLE IF NOT EXISTS email_queue (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    template_name TEXT NOT NULL,
    template_data JSONB,
    scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'pending',
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment history table
CREATE TABLE IF NOT EXISTS payment_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    stripe_payment_id TEXT NOT NULL,
    amount INTEGER NOT NULL,
    currency TEXT NOT NULL,
    status TEXT NOT NULL,
    plan TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_risk_assessments_user_id ON risk_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_risk_assessments_created_at ON risk_assessments(created_at);
CREATE INDEX IF NOT EXISTS idx_email_queue_status ON email_queue(status);
CREATE INDEX IF NOT EXISTS idx_email_queue_scheduled_for ON email_queue(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_payment_history_user_id ON payment_history(user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for user_profiles
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles
CREATE POLICY "Users can view their own profile"
    ON user_profiles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
    ON user_profiles FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
    ON user_profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create policies for risk_assessments
CREATE POLICY "Users can view their own assessments"
    ON risk_assessments FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own assessments"
    ON risk_assessments FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create policies for payment_history
CREATE POLICY "Users can view their own payment history"
    ON payment_history FOR SELECT
    USING (auth.uid() = user_id);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
