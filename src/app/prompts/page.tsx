"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/authClient';
import Layout from '@/components/Layout';

export default function PromptsPage() {
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

  const getStatusColor = (status: string) => {
    return status === 'visible' 
      ? 'bg-green-500 text-white' 
      : 'bg-red-500 text-white';
  };

  const getStatusText = (status: string) => {
    return status === 'visible' ? 'Visible' : 'Not Visible';
  };

  if (loading) {
    return null; // Remove loading spinner
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">Prompts</h1>
          <p className="mt-1 text-sm text-gray-400">
            {searchedDomain ? `All prompts run for ${searchedDomain}` : 'All prompts run for your brand with visibility status'}
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
            {/* Prompts Table */}
            <div className="bg-gray-800 shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-white">
                  Prompt History
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-400">
                  Complete list of prompts where {searchedDomain} was checked
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Prompt Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        First Shown In
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Date Checked
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {searchData.prompts?.map((prompt: any, index: number) => (
                      <tr key={index} className="hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                          {prompt.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(prompt.status)}`}>
                            {getStatusText(prompt.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                          {prompt.firstShownIn}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {prompt.dateChecked}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div className="bg-gray-800 overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="text-2xl font-bold text-green-500">
                        {searchData.prompts?.filter((p: any) => p.status === 'visible').length || 0}
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-400 truncate">
                          Visible Prompts
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
                      <div className="text-2xl font-bold text-red-500">
                        {searchData.prompts?.filter((p: any) => p.status === 'not-visible').length || 0}
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-400 truncate">
                          Not Visible
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
                      <div className="text-2xl font-bold text-blue-500">
                        {searchData.prompts?.length ? Math.round((searchData.prompts.filter((p: any) => p.status === 'visible').length / searchData.prompts.length) * 100) : 0}%
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-400 truncate">
                          Visibility Rate
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