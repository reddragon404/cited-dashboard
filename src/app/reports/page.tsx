"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/authClient';
import Layout from '@/components/Layout';
import { Lock, FileText, TrendingUp, Target, Zap } from 'lucide-react';

export default function ReportsPage() {
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
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="mt-1 text-sm text-gray-500">
            Detailed improvement plans and optimization strategies
          </p>
        </div>

        {/* Locked Content */}
        <div className="relative">
          {/* Blurred Background */}
          <div className="filter blur-sm">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Optimization Plan Card */}
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center mb-4">
                  <FileText className="h-6 w-6 text-blue-500 mr-3" />
                  <h3 className="text-lg font-medium text-gray-900">Optimization Plan</h3>
                </div>
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-400 pl-4">
                    <h4 className="text-sm font-medium text-gray-900">Content Strategy</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Focus on creating content that addresses common AI prompts in your industry...
                    </p>
                  </div>
                  <div className="border-l-4 border-green-400 pl-4">
                    <h4 className="text-sm font-medium text-gray-900">Technical SEO</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Optimize your website structure and metadata for better AI crawling...
                    </p>
                  </div>
                  <div className="border-l-4 border-yellow-400 pl-4">
                    <h4 className="text-sm font-medium text-gray-900">Competitor Analysis</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Identify gaps in your competitor's AI visibility and capitalize...
                    </p>
                  </div>
                </div>
              </div>

              {/* Performance Metrics Card */}
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center mb-4">
                  <TrendingUp className="h-6 w-6 text-green-500 mr-3" />
                  <h3 className="text-lg font-medium text-gray-900">Performance Metrics</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Current Visibility Score</span>
                    <span className="text-lg font-semibold text-gray-900">85/100</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Projected Score (3 months)</span>
                    <span className="text-lg font-semibold text-green-600">92/100</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Potential Improvement</span>
                    <span className="text-lg font-semibold text-blue-600">+7 points</span>
                  </div>
                </div>
              </div>

              {/* Action Items Card */}
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center mb-4">
                  <Target className="h-6 w-6 text-purple-500 mr-3" />
                  <h3 className="text-lg font-medium text-gray-900">Action Items</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Update meta descriptions for 15 key pages</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Create 5 new blog posts targeting AI prompts</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Optimize homepage for "best [industry] tools" queries</span>
                  </div>
                </div>
              </div>

              {/* ROI Projection Card */}
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center mb-4">
                  <Zap className="h-6 w-6 text-yellow-500 mr-3" />
                  <h3 className="text-lg font-medium text-gray-900">ROI Projection</h3>
                </div>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">+47%</div>
                    <div className="text-sm text-gray-600">Expected visibility increase</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">+23%</div>
                    <div className="text-sm text-gray-600">Projected traffic growth</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lock Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 rounded-lg">
            <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md">
              <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Reports Locked</h3>
              <p className="text-sm text-gray-600 mb-6">
                Detailed improvement plans and optimization strategies are available with a premium subscription.
              </p>
              <button className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200">
                Request Optimization Plan
              </button>
            </div>
          </div>
        </div>

        {/* Free Insights */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Free Insights</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="border-l-4 border-blue-400 pl-4">
              <h4 className="text-sm font-medium text-gray-900">Quick Win</h4>
              <p className="text-sm text-gray-600 mt-1">
                Your visibility in ChatGPT is strong (85%), but you're missing opportunities in Perplexity.
              </p>
            </div>
            <div className="border-l-4 border-green-400 pl-4">
              <h4 className="text-sm font-medium text-gray-900">Opportunity</h4>
              <p className="text-sm text-gray-600 mt-1">
                Competitor A is gaining ground. Focus on "productivity tools" keywords to maintain your lead.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}