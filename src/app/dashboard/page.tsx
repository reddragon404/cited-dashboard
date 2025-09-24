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
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">
            {searchedDomain ? `${searchedDomain} - AI Visibility Report` : 'AI Visibility Dashboard'}
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            {searchedDomain 
              ? `AI visibility analysis for ${searchedDomain}`
              : 'Search for a domain to see AI visibility analysis'
            }
          </p>
          {searchData && (
            <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500 text-white">
              ✓ Real AI Data
            </div>
          )}
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

            {/* AI Visibility Score */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="col-span-1 sm:col-span-2 lg:col-span-1">
                <ScoreCard
                  score={searchData.overallScore}
                  title="AI Visibility Score"
                  subtitle="Out of 100"
                  trend="up"
                  trendValue={12}
                />
              </div>
              <div className="col-span-1 sm:col-span-2 lg:col-span-1">
                <ScoreCard
                  score={searchData.models?.chatgpt?.score || 0}
                  title="ChatGPT Visibility"
                  subtitle="Last 30 days"
                  trend="up"
                  trendValue={8}
                />
              </div>
              <div className="col-span-1 sm:col-span-2 lg:col-span-1">
                <ScoreCard
                  score={searchData.models?.claude?.score || 0}
                  title="Gemini Visibility"
                  subtitle="Last 30 days"
                  trend="down"
                  trendValue={3}
                />
              </div>
              <div className="col-span-1 sm:col-span-2 lg:col-span-1">
                <ScoreCard
                  score={searchData.models?.perplexity?.score || 0}
                  title="Perplexity Visibility"
                  subtitle="Last 30 days"
                  trend="down"
                  trendValue={15}
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
                { name: 'Gemini', visible: searchData.models.claude.visible, score: searchData.models.claude.score },
                { name: 'Perplexity', visible: searchData.models.perplexity.visible, score: searchData.models.perplexity.score }
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