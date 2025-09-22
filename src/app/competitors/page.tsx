"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/authClient';
import Layout from '@/components/Layout';
import { competitorComparison } from '@/lib/dummyData';

export default function CompetitorsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { success, user } = await getCurrentUser();
      if (!success || !user) {
        router.push('/');
        return;
      }
      setUser(user);
      setLoading(false);
    };
    getUser();
  }, [router]);

  const getChangeIcon = (change: string) => {
    switch (change) {
      case 'up':
        return '↗';
      case 'down':
        return '↘';
      default:
        return '→';
    }
  };

  const getChangeColor = (change: string) => {
    switch (change) {
      case 'up':
        return 'text-green-500';
      case 'down':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Competitors</h1>
          <p className="mt-1 text-sm text-gray-500">
            Compare your AI visibility against competitors across different models
          </p>
        </div>

        {/* Competitor Comparison Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Competitor vs You
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Citation frequency and visibility across AI models
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Competitor
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ChatGPT
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Claude
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Perplexity
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Citations
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Change
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {competitorComparison.map((competitor, index) => {
                  const totalCitations = competitor.chatgpt.frequency + competitor.claude.frequency + competitor.perplexity.frequency;
                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {competitor.competitor}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex flex-col items-center">
                          <span className={`text-sm font-medium ${competitor.chatgpt.visible ? 'text-green-600' : 'text-red-600'}`}>
                            {competitor.chatgpt.visible ? '✓' : '✗'}
                          </span>
                          <span className="text-xs text-gray-500">{competitor.chatgpt.frequency}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex flex-col items-center">
                          <span className={`text-sm font-medium ${competitor.claude.visible ? 'text-green-600' : 'text-red-600'}`}>
                            {competitor.claude.visible ? '✓' : '✗'}
                          </span>
                          <span className="text-xs text-gray-500">{competitor.claude.frequency}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex flex-col items-center">
                          <span className={`text-sm font-medium ${competitor.perplexity.visible ? 'text-green-600' : 'text-red-600'}`}>
                            {competitor.perplexity.visible ? '✓' : '✗'}
                          </span>
                          <span className="text-xs text-gray-500">{competitor.perplexity.frequency}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-900">
                        {totalCitations}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`text-sm font-medium ${getChangeColor(competitor.change)}`}>
                          {getChangeIcon(competitor.change)} {competitor.changeValue}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="text-2xl font-bold text-blue-600">3</div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Active Competitors
                    </dt>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="text-2xl font-bold text-green-600">2</div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Models Leading
                    </dt>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="text-2xl font-bold text-yellow-600">1</div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Models Behind
                    </dt>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="text-2xl font-bold text-purple-600">85</div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Your Total Score
                    </dt>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}