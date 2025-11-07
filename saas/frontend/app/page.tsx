"use client";
import { useState } from 'react';

export default function Home() {
  const [riskScore, setRiskScore] = useState(0);
  const [showForm, setShowForm] = useState(false);

  const handleAssess = (formData: FormData) => {
    const highRisk = (formData.get('personal_data') ? 1 : 0) + (formData.get('safety_impact') ? 1 : 0);
    const score = highRisk * 50;
    setRiskScore(score);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">[translate:AI 규정 준수 가디언]</h1>
          <p className="mt-1 text-gray-600">Korean AI Basic Act Compliance SaaS</p>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6">
        {showForm ? (
          <form onSubmit={(e) => { e.preventDefault(); handleAssess(new FormData(e.currentTarget)); }}>
            <label><input type="checkbox" name="personal_data" /> Uses personal data?</label><br/>
            <label><input type="checkbox" name="safety_impact" /> Impacts safety?</label><br/>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 mt-2">Calculate Risk</button>
            {riskScore > 0 && <p>Risk Score: {riskScore}/100 - {riskScore > 50 ? "High - Act Now" : "Low"}</p>}
          </form>
        ) : (
          <button onClick={() => setShowForm(true)} className="bg-blue-500 text-white px-6 py-3">
            Start Free Assessment
          </button>
        )}
      </main>
    </div>
  );
}