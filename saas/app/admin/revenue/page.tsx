"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface RevenueData {
  today: number;
  thisWeek: number;
  thisMonth: number;
  total: number;
  purchases: number;
  conversionRate: number;
}

interface Purchase {
  id: string;
  date: string;
  email: string;
  documentType: string;
  amount: number;
  status: string;
}

export default function AdminRevenuePage() {
  const [revenue, setRevenue] = useState<RevenueData>({
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
    total: 0,
    purchases: 0,
    conversionRate: 0
  });

  const [recentPurchases, setRecentPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadRevenueData();
  }, []);

  const loadRevenueData = async () => {
    try {
      // In production, fetch from your backend/Supabase
      // For demo, using mock data

      // Mock data - replace with actual API call
      const mockRevenue: RevenueData = {
        today: 597,
        thisWeek: 2388,
        thisMonth: 12450,
        total: 47890,
        purchases: 167,
        conversionRate: 12.5
      };

      const mockPurchases: Purchase[] = [
        {
          id: '1',
          date: new Date().toISOString(),
          email: 'kim.minjun@example.com',
          documentType: 'full-package',
          amount: 299,
          status: 'completed'
        },
        {
          id: '2',
          date: new Date(Date.now() - 3600000).toISOString(),
          email: 'lee.seoyeon@company.kr',
          documentType: 'risk-assessment',
          amount: 149,
          status: 'completed'
        },
        {
          id: '3',
          date: new Date(Date.now() - 7200000).toISOString(),
          email: 'park.junho@startup.io',
          documentType: 'transparency-report',
          amount: 99,
          status: 'completed'
        },
        {
          id: '4',
          date: new Date(Date.now() - 10800000).toISOString(),
          email: 'choi.yuna@tech.kr',
          documentType: 'data-governance',
          amount: 129,
          status: 'completed'
        },
        {
          id: '5',
          date: new Date(Date.now() - 14400000).toISOString(),
          email: 'jung.hyunwoo@ai.co.kr',
          documentType: 'audit-log',
          amount: 79,
          status: 'completed'
        }
      ];

      setRevenue(mockRevenue);
      setRecentPurchases(mockPurchases);
    } catch (error) {
      console.error('Error loading revenue data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ko-KR');
  };

  const documentTypeNames: Record<string, string> = {
    'risk-assessment': 'Risk Assessment',
    'transparency-report': 'Transparency Report',
    'data-governance': 'Data Governance',
    'audit-log': 'Audit Log',
    'compliance-checklist': 'Compliance Checklist',
    'full-package': 'Full Package'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-2xl font-bold text-blue-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-black text-gray-900">
                💰 Admin Revenue Dashboard
              </h1>
              <p className="text-sm text-gray-600">ComplianceDocAI Analytics</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/docs')}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium text-sm"
              >
                Public Site
              </button>
              <button
                onClick={() => router.push('/dashboard')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm"
              >
                Dashboard
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Revenue Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="text-sm text-gray-600 mb-2">Today's Revenue</div>
            <div className="text-3xl font-black text-green-600">
              {formatCurrency(revenue.today)}
            </div>
            <div className="text-xs text-gray-500 mt-2">
              +15% from yesterday
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="text-sm text-gray-600 mb-2">This Week</div>
            <div className="text-3xl font-black text-blue-600">
              {formatCurrency(revenue.thisWeek)}
            </div>
            <div className="text-xs text-gray-500 mt-2">
              +8% from last week
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="text-sm text-gray-600 mb-2">This Month</div>
            <div className="text-3xl font-black text-purple-600">
              {formatCurrency(revenue.thisMonth)}
            </div>
            <div className="text-xs text-gray-500 mt-2">
              +23% from last month
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
            <div className="text-sm text-gray-600 mb-2">Total Revenue</div>
            <div className="text-3xl font-black text-orange-600">
              {formatCurrency(revenue.total)}
            </div>
            <div className="text-xs text-gray-500 mt-2">
              {revenue.purchases} purchases
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              📊 Key Metrics
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Purchases</span>
                <span className="font-bold text-xl text-gray-900">{revenue.purchases}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Avg. Order Value</span>
                <span className="font-bold text-xl text-gray-900">
                  {formatCurrency(revenue.total / revenue.purchases)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Conversion Rate</span>
                <span className="font-bold text-xl text-green-600">{revenue.conversionRate}%</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              📈 Growth Targets
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Monthly Goal: $20K</span>
                  <span className="text-sm font-bold text-purple-600">62%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-purple-600 h-3 rounded-full" style={{ width: '62%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Annual Goal: $180K</span>
                  <span className="text-sm font-bold text-blue-600">27%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-blue-600 h-3 rounded-full" style={{ width: '27%' }}></div>
                </div>
              </div>
              <div className="pt-3 border-t">
                <div className="text-sm text-gray-600">Projected Annual Revenue</div>
                <div className="text-2xl font-black text-green-600 mt-1">
                  {formatCurrency(revenue.thisMonth * 12 * 1.15)}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <h3 className="text-lg font-bold mb-4">🎯 MicroSaaS Goal</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Current MRR</span>
                <span className="font-bold text-2xl">$12.5K</span>
              </div>
              <div className="flex justify-between items-center text-sm opacity-90">
                <span>Target MRR</span>
                <span className="font-bold">$30K</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-4 mt-2">
                <div className="bg-white h-4 rounded-full" style={{ width: '42%' }}></div>
              </div>
              <div className="text-xs opacity-90 pt-2">
                💪 On track to hit $30K/mo in 4 months!
              </div>
            </div>
          </div>
        </div>

        {/* Recent Purchases */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b bg-gray-50">
            <h3 className="text-xl font-bold text-gray-900">
              🛒 Recent Purchases
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Document Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentPurchases.map((purchase) => (
                  <tr key={purchase.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(purchase.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {purchase.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {documentTypeNames[purchase.documentType]}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                      {formatCurrency(purchase.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {purchase.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* MicroSaaS Insights */}
        <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-black text-gray-900 mb-4">
            📊 MicroSaaS Performance Insights
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="text-4xl font-black text-green-600 mb-2">92%</div>
              <div className="text-sm text-gray-700">Profit Margin</div>
              <div className="text-xs text-gray-500 mt-1">Industry avg: 70-80%</div>
            </div>
            <div>
              <div className="text-4xl font-black text-blue-600 mb-2">2.3 min</div>
              <div className="text-sm text-gray-700">Avg. Time to Purchase</div>
              <div className="text-xs text-gray-500 mt-1">Lightning fast conversion</div>
            </div>
            <div>
              <div className="text-4xl font-black text-purple-600 mb-2">437</div>
              <div className="text-sm text-gray-700">Days Until Deadline</div>
              <div className="text-xs text-gray-500 mt-1">Urgency driving sales</div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-white rounded-lg border-2 border-green-200">
            <div className="flex items-start gap-3">
              <div className="text-3xl">🚀</div>
              <div>
                <div className="font-bold text-gray-900 mb-1">You're on track!</div>
                <div className="text-sm text-gray-600">
                  At current growth rate, you'll reach $30K MRR by month 6.
                  Keep focusing on SEO and building in public to compound growth.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
