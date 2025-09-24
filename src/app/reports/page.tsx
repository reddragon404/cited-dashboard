"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/authClient';
import Layout from '@/components/Layout';
import { Lock, FileText, TrendingUp, Target, Zap } from 'lucide-react';

export default function ReportsPage() {
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

  if (loading) {
    return null; // Remove loading spinner
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">Reports</h1>
          <p className="mt-1 text-sm text-gray-400">
            {searchedDomain ? `Detailed improvement plans for ${searchedDomain}` : 'Detailed improvement plans and optimization strategies'}
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

            {/* Real Data Analysis */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Current Performance Card */}
              <div className="bg-gray-800 p-6 rounded-lg shadow">
                <div className="flex items-center mb-4">
                  <TrendingUp className="h-6 w-6 text-green-500 mr-3" />
                  <h3 className="text-lg font-medium text-white">Current Performance</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Overall Visibility Score</span>
                    <span className="text-lg font-semibold text-white">{searchData.overallScore}/100</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">ChatGPT Visibility</span>
                    <span className="text-lg font-semibold text-green-500">{searchData.models?.chatgpt?.score || 0}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Gemini Visibility</span>
                    <span className="text-lg font-semibold text-blue-500">{searchData.models?.claude?.score || 0}%</span>
                  </div>
                </div>
              </div>

              {/* Key Insights Card */}
              <div className="bg-gray-800 p-6 rounded-lg shadow">
                <div className="flex items-center mb-4">
                  <FileText className="h-6 w-6 text-blue-500 mr-3" />
                  <h3 className="text-lg font-medium text-white">Key Insights</h3>
                </div>
                <div className="space-y-4">
                  {searchData.highlights?.slice(0, 3).map((highlight: any, index: number) => (
                    <div key={index} className="border-l-4 border-green-400 pl-4">
                      <h4 className="text-sm font-medium text-white">{highlight.title}</h4>
                      <p className="text-sm text-gray-400 mt-1">{highlight.description}</p>
                      <div className="text-xs text-green-400 mt-1">{highlight.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Competitor Analysis Card */}
              <div className="bg-gray-800 p-6 rounded-lg shadow">
                <div className="flex items-center mb-4">
                  <Target className="h-6 w-6 text-purple-500 mr-3" />
                  <h3 className="text-lg font-medium text-white">Competitor Analysis</h3>
                </div>
                <div className="space-y-3">
                  {searchData.competitors?.slice(0, 3).map((competitor: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">{competitor.competitor}</span>
                      <div className="flex gap-2">
                        <span className={`text-xs px-2 py-1 rounded ${competitor.chatgpt?.visible ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                          ChatGPT
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${competitor.claude?.visible ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                          Gemini
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Items Card */}
              <div className="bg-gray-800 p-6 rounded-lg shadow">
                <div className="flex items-center mb-4">
                  <Zap className="h-6 w-6 text-yellow-500 mr-3" />
                  <h3 className="text-lg font-medium text-white">Recommended Actions</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-400">Improve visibility in underperforming models</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-400">Create content targeting high-value prompts</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-400">Monitor competitor performance regularly</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Premium Upgrade CTA */}
            <div className="bg-gradient-to-r from-green-600 to-blue-600 p-8 rounded-lg text-center">
              <Lock className="h-12 w-12 text-white mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Unlock Detailed Reports</h3>
              <p className="text-green-100 mb-6 max-w-2xl mx-auto">
                Get comprehensive optimization plans, competitor analysis, and actionable insights to boost your AI visibility.
              </p>
              <button className="bg-white text-green-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                Request Optimization Plan
              </button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}