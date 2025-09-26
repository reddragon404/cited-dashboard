"use client";
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getCurrentUser, logout, searchDomain } from '@/lib/authClient';
import Link from 'next/link';
import Logo from './Logo';
import { 
  BarChart3, 
  MessageSquare, 
  Users, 
  FileText, 
  LogOut, 
  Menu,
  X,
  Search,
  Loader2
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [domain, setDomain] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string>('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const getUser = async () => {
      const { success, user } = await getCurrentUser();
      if (success && user) {
        setUser(user);
      } else {
        router.push('/');
      }
    };
    getUser();

    // Load search history from localStorage
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Error loading search history:', error);
      }
    }
  }, [router]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain.trim()) return;

    setSearching(true);
    setSearchError('');

    try {
      const { success, data, error } = await searchDomain(domain.trim());
      
      if (success && data) {
        // Store the search results in localStorage for the dashboard to use
        localStorage.setItem('searchResults', JSON.stringify(data));
        localStorage.setItem('searchedDomain', domain.trim());
        
        // Add to search history
        const newHistory = [domain.trim(), ...searchHistory.filter(d => d !== domain.trim())].slice(0, 10);
        setSearchHistory(newHistory);
        localStorage.setItem('searchHistory', JSON.stringify(newHistory));
        
        // Clear the search input
        setDomain('');
        
        // Navigate to dashboard to show results
        router.push('/dashboard');
        
        // Force a page refresh to ensure the dashboard updates
        window.location.reload();
      } else {
        setSearchError(error || 'Search failed. Please check your API keys in .env.local');
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchError('Search failed. Please try again.');
    } finally {
      setSearching(false);
    }
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Prompts', href: '/prompts', icon: MessageSquare },
    { name: 'Competitors', href: '/competitors', icon: Users },
    { name: 'Reports', href: '/reports', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-gray-900 border-r border-gray-700">
          <div className="flex h-16 items-center justify-between px-4">
            <Logo size="sm" />
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-gray-900 border-r border-gray-700 pt-5">
          <div className="flex items-center flex-shrink-0 px-4">
            <Logo size="sm" />
          </div>
          <div className="mt-5 flex-grow flex flex-col">
            <nav className="flex-1 space-y-1 px-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? 'bg-gray-700 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top navigation */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-700 bg-gray-900/95 backdrop-blur-sm px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-300 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <form onSubmit={handleSearch} className="relative flex flex-1 items-center">
              <div className="w-full max-w-lg">
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    {searching ? (
                      <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
                    ) : (
                      <Search className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder=""
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    onFocus={() => setShowHistory(true)}
                    onBlur={() => setTimeout(() => setShowHistory(false), 200)}
                    disabled={searching}
                    className="block w-full rounded-md border-0 py-2 pl-10 pr-3 text-white bg-gray-700/50 ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-500 sm:text-sm sm:leading-6 disabled:opacity-50"
                  />
                  
                  {/* Search History Dropdown */}
                  {showHistory && searchHistory.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600 rounded-md shadow-lg z-50">
                      <div className="py-1">
                        <div className="px-3 py-2 text-xs text-gray-400 border-b border-gray-600">
                          Recent searches
                        </div>
                        {searchHistory.map((historyDomain, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => {
                              setDomain(historyDomain);
                              setShowHistory(false);
                            }}
                            className="w-full text-left px-3 py-2 text-sm text-white hover:bg-gray-700"
                          >
                            {historyDomain}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {searching && (
                  <div className="mt-1 text-sm text-gray-400">
                    Analyzing AI visibility... This may take 30-60 seconds
                  </div>
                )}
                {searchError && (
                  <div className="mt-1 text-sm text-red-400">{searchError}</div>
                )}
              </div>
            </form>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <div className="flex items-center gap-x-2">
                <span className="text-sm text-gray-300">
                  {user?.email || 'Loading...'}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-x-2 text-sm text-gray-300 hover:text-white"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}