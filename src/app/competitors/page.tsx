"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/authClient';
import Layout from '@/components/Layout';

export default function CompetitorsPage() {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchData, setSearchData] = useState<any>(null);
  const [searchedDomain, setSearchedDomain] = useState<string>('');
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

  useEffect(() => {
    // Check for search results in localStorage
    const storedResults = localStorage.getItem('searchResults');
    const storedDomain = localStorage.getItem('searchedDomain');
    
    if (storedResults && storedDomain) {
      try {
        const parsedData = JSON.parse(storedResults);
        setSearchData(parsedData);
        setSearchedDomain(storedDomain);
      } catch (error) {
        console.error('Error parsing search results:', error);
      }
    }
  }, []);

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
    return null; // Remove loading spinner
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">Competitors</h1>
          <p className="mt-1 text-sm text-gray-400">
            {searchedDomain ? `Compare ${searchedDomain} against competitors across different models` : 'Compare your AI visibility against competitors across different models'}
          </p>
        </div>

        {/* Show search prompt if no data */}
        {!searchData && (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <h2 className="text-xl font-semibold text-white mb-4">No Search Data Available</h2>
            <p className="text-gray-400 mb-6">Use the search bar above to analyze a domain's AI visibility</p>
            <div className="text-sm text-gray-500">
              <p>• Enter any domain (e.g., stripe.com, openai.com)</p>
              <p>• Get real AI visibility scores from ChatGPT, Gemini, and Perplexity</p>
              <p>• View detailed analysis and competitor insights</p>
            </div>
          </div>
        )}

        {/* Only show data if we have search results */}
        {searchData && (
          <>
            {/* Competitor Comparison Table */}
            <div className="bg-gray-800 shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-white">
                  Competitor vs {searchedDomain}
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-400">
                  Citation frequency and visibility across AI models
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Competitor
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                        ChatGPT
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Gemini
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Total Citations
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Change
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {searchData.competitors?.map((competitor: any, index: number) => {
                      const totalCitations = (competitor.chatgpt?.frequency || 0) + (competitor.claude?.frequency || 0);
                      return (
                        <tr key={index} className="hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                            {competitor.competitor}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="flex flex-col items-center">
                              <span className={`text-sm font-medium ${competitor.chatgpt?.visible ? 'text-green-500' : 'text-red-500'}`}>
                                {competitor.chatgpt?.visible ? '✓' : '✗'}
                              </span>
                              <span className="text-xs text-gray-400">{competitor.chatgpt?.frequency || 0}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="flex flex-col items-center">
                              <span className={`text-sm font-medium ${competitor.claude?.visible ? 'text-green-500' : 'text-red-500'}`}>
                                {competitor.claude?.visible ? '✓' : '✗'}
                              </span>
                              <span className="text-xs text-gray-400">{competitor.claude?.frequency || 0}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-white">
                            {totalCitations}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className={`text-sm font-medium ${getChangeColor(competitor.change || 'neutral')}`}>
                              {getChangeIcon(competitor.change || 'neutral')} {competitor.changeValue || 0}%
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
              <div className="bg-gray-800 overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="text-2xl font-bold text-blue-500">{searchData.competitors?.length || 0}</div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-400 truncate">
                          Active Competitors
                        </dt>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="text-2xl font-bold text-green-500">
                        {searchData.models ? Object.values(searchData.models).filter((model: any) => model?.visible).length : 0}
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-400 truncate">
                          Models Leading
                        </dt>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="text-2xl font-bold text-yellow-500">
                        {searchData.models ? Object.values(searchData.models).filter((model: any) => !model?.visible).length : 0}
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-400 truncate">
                          Models Behind
                        </dt>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="text-2xl font-bold text-purple-500">{searchData.overallScore || 0}</div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-400 truncate">
                          Your Total Score
                        </dt>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}