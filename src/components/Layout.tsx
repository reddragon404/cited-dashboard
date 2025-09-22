"use client";
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getCurrentUser, logout, searchDomain } from '@/lib/authClient';
import Link from 'next/link';
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
  const [user, setUser] = useState<any>(null);
  const [domain, setDomain] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
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
        // Navigate to dashboard to show results
        router.push('/dashboard');
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
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-slate-900">
          <div className="flex h-16 items-center justify-between px-4">
            <h1 className="text-xl font-bold text-white">Cited</h1>
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
                      ? 'bg-green-600 text-white'
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
        <div className="flex flex-col flex-grow bg-slate-900 pt-5">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-xl font-bold text-white">Cited</h1>
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
                        ? 'bg-green-600 text-white'
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
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
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
                    placeholder="Enter domain (e.g., example.com)"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    disabled={searching}
                    className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6 disabled:opacity-50"
                  />
                </div>
                {searching && (
                  <div className="mt-1 text-sm text-blue-600">
                    Analyzing AI visibility... This may take 30-60 seconds
                  </div>
                )}
                {searchError && (
                  <div className="mt-1 text-sm text-red-600">{searchError}</div>
                )}
              </div>
            </form>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <div className="flex items-center gap-x-2">
                <span className="text-sm text-gray-700">
                  {user?.email || 'Loading...'}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-x-2 text-sm text-gray-700 hover:text-gray-900"
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