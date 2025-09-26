"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, login } from '@/lib/authClient';
import Logo from '@/components/Logo';

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
    <main className="flex items-center justify-center min-h-screen bg-black text-white relative overflow-hidden" data-version="2.0">
      {/* Grid pattern background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}></div>
      </div>
      
      <div className="text-center max-w-md mx-auto px-6 relative z-10">
        {/* Logo */}
        <div className="mb-12">
          <div className="text-6xl font-bold text-white mb-2" style={{
            fontFamily: 'monospace',
            textShadow: '0 0 10px rgba(255,255,255,0.5)',
            letterSpacing: '0.1em'
          }}>
            cited
          </div>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 hover:bg-white/10"
            disabled={loading}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Sign in'
            )}
          </button>
          
          <div className="text-xs text-gray-400 mt-8">
            <div className="mb-2">Demo credentials:</div>
            <div>Email: go@getcited.app</div>
            <div>Password: password</div>
          </div>
        </form>
        
        <footer className="mt-16 text-center">
          <p className="text-xs text-gray-500">CITED APP - ALL RIGHTS RESERVED 2025 GOGETCITED.APP</p>
        </footer>
      </div>
    </main>
  );
}