-- Supabase PostgreSQL init for AI Compliance Guardian

CREATE TABLE ai_systems (
    id serial PRIMARY KEY,
    name text NOT NULL,
    industry text,
    use_case text,
    risk_score integer DEFAULT 0,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE evidence_snapshots (
    id serial PRIMARY KEY,
    system_id integer REFERENCES ai_systems(id),
    evidence jsonb,
    timestamp timestamptz DEFAULT now()
);