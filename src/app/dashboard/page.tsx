"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/authClient';
import Layout from '@/components/Layout';
import ScoreCard from '@/components/ScoreCard';
import TrendGraph from '@/components/TrendGraph';
import ModelVisibility from '@/components/ModelVisibility';
import PromptList from '@/components/PromptList';
import CompetitorTable from '@/components/CompetitorTable';
import Highlights from '@/components/Highlights';
// Removed dummy data imports - only using real search data

export default function Dashboard() {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchData, setSearchData] = useState<{ overallScore: number; models: any; trends: any[]; prompts: any[]; competitors: any[]; highlights: any[] } | null>(null);
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
      <div className="space-y-8 min-h-screen bg-gray-900">
        {/* Header */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
          <h1 className="text-3xl font-bold text-white">
            {searchedDomain ? `${searchedDomain} - AI Visibility Report` : 'AI Visibility Dashboard'}
          </h1>
          <p className="mt-2 text-gray-300">
            {searchedDomain 
              ? `AI visibility analysis for ${searchedDomain}`
              : 'Search for a domain to see AI visibility analysis'
            }
          </p>
          {searchData && (
            <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-600 text-white">
              ✓ Real AI Data
            </div>
          )}
        </div>

        {/* Show search prompt if no data */}
        {!searchData && (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-8 text-center border border-gray-700">
            <div className="mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-white font-bold text-2xl">C</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Welcome to Cited</h2>
              <p className="text-gray-300">AI Visibility Analysis Platform</p>
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">Ready to analyze your AI visibility?</h3>
            <p className="text-gray-400 mb-6">Use the search bar above to analyze any domain's AI visibility across major AI models</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300">
              <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                <div className="font-semibold text-blue-400 mb-2">🔍 Real AI Testing</div>
                <p>Test actual ChatGPT & Gemini responses</p>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                <div className="font-semibold text-purple-400 mb-2">📊 Detailed Analytics</div>
                <p>Get comprehensive visibility reports</p>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                <div className="font-semibold text-indigo-400 mb-2">🏆 Competitor Insights</div>
                <p>Compare against industry leaders</p>
              </div>
            </div>
            <div className="mt-6 text-xs text-gray-500">
              <p>Try searching for: stripe.com, notion.com, hltv.org, or any domain you're curious about</p>
            </div>
          </div>
        )}

        {/* Only show data if we have search results */}
        {searchData && (
          <>

            {/* AI Visibility Score */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="col-span-1 sm:col-span-2 lg:col-span-1">
                <ScoreCard
                  score={searchData.overallScore}
                  title="AI Visibility Score"
                  subtitle="Out of 100"
                />
              </div>
              <div className="col-span-1 sm:col-span-2 lg:col-span-1">
                <ScoreCard
                  score={searchData.models?.chatgpt?.score || 0}
                  title="ChatGPT Visibility"
                  subtitle="Current Score"
                />
              </div>
              <div className="col-span-1 sm:col-span-2 lg:col-span-1">
                <ScoreCard
                  score={searchData.models?.claude?.score || 0}
                  title="Gemini Visibility"
                  subtitle="Current Score"
                />
              </div>
            </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Visibility Trend */}
          <div className="lg:col-span-2">
            <TrendGraph 
              data={searchData.trends} 
              title="Visibility Trend (Last 3 Months)" 
            />
          </div>

          {/* Models Visibility */}
          <div>
            <ModelVisibility 
              models={[
                { name: 'ChatGPT', visible: searchData.models.chatgpt.visible, score: searchData.models.chatgpt.score },
                { name: 'Gemini', visible: searchData.models.claude.visible, score: searchData.models.claude.score }
              ]} 
            />
          </div>

            {/* Top Prompts */}
            <div>
              <PromptList prompts={searchData.prompts} />
            </div>

            {/* Competitor Leaderboard */}
            <div className="lg:col-span-2">
              <CompetitorTable competitors={searchData.competitors} />
            </div>

            {/* Highlights */}
            <div className="lg:col-span-2">
              <Highlights highlights={searchData.highlights} />
            </div>
          </div>
          </>
        )}
      </div>
    </Layout>
  );
}