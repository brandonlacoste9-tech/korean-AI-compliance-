import { useState } from 'react';
import Head from 'next/head';
import { GetServerSideProps } from 'next';

interface ClassificationResult {
  classification: string;
  confidence: number;
  requirements: string[];
  triggers_found: {
    high_impact_indicators: number;
    generative_indicators: number;
  };
  next_steps: string[];
  deadline: string;
}

export default function ComplianceCheck() {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [error, setError] = useState('');

  const handleCheck = async () => {
    if (!description.trim()) {
      setError('AI 시스템 설명을 입력해주세요.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/v1/classification/classify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description }),
      });

      if (!response.ok) {
        throw new Error('분류 실패');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError('분류 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const getClassificationLabel = (classification: string) => {
    const labels: Record<string, { kr: string; color: string }> = {
      high_impact: { kr: '고위험 AI', color: 'red' },
      high_performance: { kr: '高性能 AI', color: 'orange' },
      generative: { kr: '생성형 AI', color: 'yellow' },
      low_risk: { kr: '저위험 AI', color: 'green' },
    };
    return labels[classification] || { kr: classification, color: 'gray' };
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#0a0a0a', 
      color: '#fff',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '20px'
    }}>
      <Head>
        <title>무료 AI 컴플라이언스 체크 | Korea AI Compliance</title>
      </Head>

      <header style={{ 
        maxWidth: '800px', 
        margin: '0 auto', 
        padding: '40px 0',
        textAlign: 'center'
      }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 'bold',
          marginBottom: '10px',
          background: 'linear-gradient(90deg, #667eea, #764ba2)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          AI 법규, 20분이면 충분합니다
        </h1>
        <p style={{ color: '#888', fontSize: '1.1rem' }}>
          한국 AI 스타트업 98%가 준비하지 못한 것. 지금 확인해보세요.
        </p>
      </header>

      <main style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Input Section */}
        <section style={{ 
          background: '#111', 
          borderRadius: '16px', 
          padding: '30px',
          marginBottom: '30px',
          border: '1px solid #222'
        }}>
          <h2 style={{ marginBottom: '15px', fontSize: '1.3rem' }}>
            🎯 AI 시스템 설명을 입력하세요
          </h2>
          <p style={{ color: '#666', marginBottom: '20px', fontSize: '0.9rem' }}>
            제품 설명, 사용 사례, 또는 API 엔드포인트를 입력하세요.
          </p>
          
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="예: 의료 진단을 돕는 AI 채팅봇, 사용자의 증상을 분석하여 의사결정을 지원합니다..."
            style={{
              width: '100%',
              height: '120px',
              padding: '15px',
              borderRadius: '12px',
              border: '1px solid #333',
              background: '#0a0a0a',
              color: '#fff',
              fontSize: '1rem',
              resize: 'vertical',
              marginBottom: '20px'
            }}
          />

          {error && (
            <p style={{ color: '#ff6b6b', marginBottom: '15px' }}>{error}</p>
          )}

          <button
            onClick={handleCheck}
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px 30px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              borderRadius: '12px',
              border: 'none',
              background: loading ? '#444' : 'linear-gradient(90deg, #667eea, #764ba2)',
              color: '#fff',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'transform 0.2s'
            }}
          >
            {loading ? '분석 중...' : '🚀 무료로 체크하기'}
          </button>
        </section>

        {/* Results Section */}
        {result && (
          <section style={{ 
            background: '#111', 
            borderRadius: '16px', 
            padding: '30px',
            border: '1px solid #222',
            animation: 'fadeIn 0.5s ease'
          }}>
            <div style={{ 
              textAlign: 'center', 
              marginBottom: '30px',
              padding: '20px',
              background: '#0a0a0a',
              borderRadius: '12px'
            }}>
              <p style={{ color: '#888', marginBottom: '10px' }}>분류 결과</p>
              <h2 style={{ 
                fontSize: '2rem', 
                fontWeight: 'bold',
                color: getClassificationLabel(result.classification).color === 'red' ? '#ff6b6b' :
                       getClassificationLabel(result.classification).color === 'orange' ? '#ffa502' :
                       getClassificationLabel(result.classification).color === 'yellow' ? '#ffd43b' : '#26de81'
              }}>
                {getClassificationLabel(result.classification).kr}
              </h2>
              <p style={{ color: '#666', marginTop: '10px' }}>
                신뢰도: {Math.round(result.confidence * 100)}%
              </p>
            </div>

            {/* Requirements */}
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ marginBottom: '15px', fontSize: '1.1rem' }}>
                📋 필수 준수 사항
              </h3>
              <ul style={{ 
                listStyle: 'none', 
                padding: 0,
                display: 'grid',
                gap: '10px'
              }}>
                {result.requirements.map((req, i) => (
                  <li key={i} style={{
                    padding: '12px 15px',
                    background: '#0a0a0a',
                    borderRadius: '8px',
                    borderLeft: '3px solid #667eea'
                  }}>
                    {req}
                  </li>
                ))}
              </ul>
            </div>

            {/* Next Steps */}
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ marginBottom: '15px', fontSize: '1.1rem' }}>
                ✅ 다음 단계
              </h3>
              <ol style={{ 
                paddingLeft: '20px',
                color: '#aaa'
              }}>
                {result.next_steps.map((step, i) => (
                  <li key={i} style={{ marginBottom: '8px' }}>{step}</li>
                ))}
              </ol>
            </div>

            {/* CTA */}
            <div style={{ 
              textAlign: 'center',
              padding: '20px',
              background: 'linear-gradient(90deg, rgba(102,126,234,0.1), rgba(118,75,162,0.1))',
              borderRadius: '12px'
            }}>
              <p style={{ marginBottom: '15px', fontSize: '1.1rem' }}>
                더 자세한 분석과 자동 문서가 필요하세요?
              </p>
              <a 
                href="/pricing"
                style={{
                  display: 'inline-block',
                  padding: '12px 30px',
                  background: '#667eea',
                  color: '#fff',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontWeight: 'bold'
                }}
              >
                ₩590,000/年 로 시작하기 →
              </a>
            </div>
          </section>
        )}

        {/* Grace Period Notice */}
        <section style={{ 
          textAlign: 'center', 
          marginTop: '40px',
          padding: '20px',
          color: '#666',
          fontSize: '0.9rem'
        }}>
          ⏰ 유예기간: 2027년 1월까지 — 벌금 없이 준비하세요
        </section>
      </main>

      <footer style={{ 
        textAlign: 'center', 
        marginTop: '60px', 
        padding: '20px',
        color: '#444',
        fontSize: '0.8rem'
      }}>
        © 2026 Korea AI Compliance. 한국 AI 스타트업의 컴플라이언스를 도와드립니다.
      </footer>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};
