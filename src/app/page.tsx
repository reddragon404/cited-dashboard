"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, login } from '@/lib/authClient';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const checkUser = async () => {
      const { success, user } = await getCurrentUser();
      if (success && user) {
        router.push('/dashboard');
      }
    };
    checkUser();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { success, user, error: loginError } = await login(email, password);
    
    if (success && user) {
      router.push('/dashboard');
    } else {
      setError(loginError || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      <div className="text-center max-w-md mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            Cited
          </h1>
          <p className="text-xl text-gray-300 mb-2">Get seen by AI. Get chosen.</p>
          <p className="text-sm text-gray-400">
            Track your AI visibility across ChatGPT, Claude, and Perplexity
          </p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-3">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-3 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Sign In'
            )}
          </button>
          
          <div className="text-xs text-gray-500 mt-6">
            <div className="mb-2">Demo credentials:</div>
            <div>Email: admin@cited.com</div>
            <div>Password: password</div>
          </div>
        </form>
      </div>
    </main>
  );
}