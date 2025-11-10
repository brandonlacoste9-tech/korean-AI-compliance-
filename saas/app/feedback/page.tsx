"use client";
import { useState } from 'react';
import { createClient } from '@/lib/supabase';

export default function FeedbackPage() {
  const [formData, setFormData] = useState({
    category: '',
    message: '',
    industry: '',
    role: '',
    priority: 'medium',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Save feedback to database
      await supabase.from('user_feedback').insert({
        user_id: user?.id,
        email: user?.email,
        category: formData.category,
        message: formData.message,
        industry: formData.industry,
        role: formData.role,
        priority: formData.priority,
      });

      setSuccess(true);
      setFormData({
        category: '',
        message: '',
        industry: '',
        role: '',
        priority: 'medium',
      });

      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('피드백 제출에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border-2 border-blue-200">
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800 mb-4">
              💬 고객 피드백
            </h1>
            <p className="text-gray-600 mb-8">
              귀하의 의견은 우리 제품을 개선하는 데 매우 중요합니다. 필요한 기능, 개선 사항 또는 우려 사항을 공유해주세요.
            </p>

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                ✅ 피드백이 성공적으로 제출되었습니다! 감사합니다.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    카테고리 *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">선택하세요</option>
                    <option value="feature_request">기능 요청</option>
                    <option value="bug_report">버그 신고</option>
                    <option value="improvement">개선 제안</option>
                    <option value="documentation">문서 관련</option>
                    <option value="support">지원 요청</option>
                    <option value="other">기타</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    산업 분야 *
                  </label>
                  <select
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">선택하세요</option>
                    <option value="banking">금융/은행</option>
                    <option value="healthcare">의료/헬스케어</option>
                    <option value="retail">소매/유통</option>
                    <option value="manufacturing">제조</option>
                    <option value="technology">기술/IT</option>
                    <option value="education">교육</option>
                    <option value="government">정부/공공</option>
                    <option value="other">기타</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    직책/역할 *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">선택하세요</option>
                    <option value="compliance_officer">준법 담당자</option>
                    <option value="legal">법무팀</option>
                    <option value="it_security">IT/보안</option>
                    <option value="executive">임원</option>
                    <option value="developer">개발자</option>
                    <option value="consultant">컨설턴트</option>
                    <option value="other">기타</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    우선순위
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                  >
                    <option value="low">낮음</option>
                    <option value="medium">보통</option>
                    <option value="high">높음</option>
                    <option value="critical">긴급</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  피드백 내용 *
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={6}
                  placeholder="귀하의 피드백을 자세히 설명해주세요..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>💡 도움말:</strong> 구체적인 피드백일수록 더 빠르게 개선할 수 있습니다. 
                  예: "대시보드에 산업별 체크리스트 필터 기능이 있으면 좋겠습니다"
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              >
                {loading ? '제출 중...' : '피드백 제출'}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t-2 border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4">📊 최근 개선 사항</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <div>
                    <p className="font-semibold text-gray-800">대시보드 체크리스트 추가</p>
                    <p className="text-sm text-gray-600">사용자 피드백 기반으로 5개 핵심 항목 구현</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <div>
                    <p className="font-semibold text-gray-800">PDF 보고서 다운로드</p>
                    <p className="text-sm text-gray-600">준법 보고서 즉시 다운로드 기능 추가</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-blue-500 text-xl">🔄</span>
                  <div>
                    <p className="font-semibold text-gray-800">산업별 맞춤 가이드</p>
                    <p className="text-sm text-gray-600">개발 중 - 금융, 의료, 제조업 전용 템플릿</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
