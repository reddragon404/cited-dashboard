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
      {/* Pixelated background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23000'/%3E%3Cg fill='%23fff'%3E%3C!-- Pixelated classical sculpture --%3E%3Ccircle cx='80' cy='60' r='2'/%3E%3Ccircle cx='84' cy='60' r='2'/%3E%3Ccircle cx='88' cy='60' r='2'/%3E%3Ccircle cx='92' cy='60' r='2'/%3E%3Ccircle cx='96' cy='60' r='2'/%3E%3Ccircle cx='100' cy='60' r='2'/%3E%3Ccircle cx='104' cy='60' r='2'/%3E%3Ccircle cx='108' cy='60' r='2'/%3E%3Ccircle cx='112' cy='60' r='2'/%3E%3Ccircle cx='116' cy='60' r='2'/%3E%3Ccircle cx='120' cy='60' r='2'/%3E%3Ccircle cx='124' cy='60' r='2'/%3E%3Ccircle cx='128' cy='60' r='2'/%3E%3Ccircle cx='132' cy='60' r='2'/%3E%3Ccircle cx='136' cy='60' r='2'/%3E%3Ccircle cx='140' cy='60' r='2'/%3E%3Ccircle cx='144' cy='60' r='2'/%3E%3Ccircle cx='148' cy='60' r='2'/%3E%3Ccircle cx='152' cy='60' r='2'/%3E%3Ccircle cx='156' cy='60' r='2'/%3E%3Ccircle cx='160' cy='60' r='2'/%3E%3Ccircle cx='164' cy='60' r='2'/%3E%3Ccircle cx='168' cy='60' r='2'/%3E%3Ccircle cx='172' cy='60' r='2'/%3E%3Ccircle cx='176' cy='60' r='2'/%3E%3Ccircle cx='180' cy='60' r='2'/%3E%3Ccircle cx='184' cy='60' r='2'/%3E%3Ccircle cx='188' cy='60' r='2'/%3E%3Ccircle cx='192' cy='60' r='2'/%3E%3Ccircle cx='196' cy='60' r='2'/%3E%3Ccircle cx='200' cy='60' r='2'/%3E%3Ccircle cx='204' cy='60' r='2'/%3E%3Ccircle cx='208' cy='60' r='2'/%3E%3Ccircle cx='212' cy='60' r='2'/%3E%3Ccircle cx='216' cy='60' r='2'/%3E%3Ccircle cx='220' cy='60' r='2'/%3E%3Ccircle cx='224' cy='60' r='2'/%3E%3Ccircle cx='228' cy='60' r='2'/%3E%3Ccircle cx='232' cy='60' r='2'/%3E%3Ccircle cx='236' cy='60' r='2'/%3E%3Ccircle cx='240' cy='60' r='2'/%3E%3Ccircle cx='244' cy='60' r='2'/%3E%3Ccircle cx='248' cy='60' r='2'/%3E%3Ccircle cx='252' cy='60' r='2'/%3E%3Ccircle cx='256' cy='60' r='2'/%3E%3Ccircle cx='260' cy='60' r='2'/%3E%3Ccircle cx='264' cy='60' r='2'/%3E%3Ccircle cx='268' cy='60' r='2'/%3E%3Ccircle cx='272' cy='60' r='2'/%3E%3Ccircle cx='276' cy='60' r='2'/%3E%3Ccircle cx='280' cy='60' r='2'/%3E%3Ccircle cx='284' cy='60' r='2'/%3E%3Ccircle cx='288' cy='60' r='2'/%3E%3Ccircle cx='292' cy='60' r='2'/%3E%3Ccircle cx='296' cy='60' r='2'/%3E%3Ccircle cx='300' cy='60' r='2'/%3E%3Ccircle cx='304' cy='60' r='2'/%3E%3Ccircle cx='308' cy='60' r='2'/%3E%3Ccircle cx='312' cy='60' r='2'/%3E%3Ccircle cx='316' cy='60' r='2'/%3E%3Ccircle cx='320' cy='60' r='2'/%3E%3Ccircle cx='324' cy='60' r='2'/%3E%3Ccircle cx='328' cy='60' r='2'/%3E%3Ccircle cx='332' cy='60' r='2'/%3E%3Ccircle cx='336' cy='60' r='2'/%3E%3Ccircle cx='340' cy='60' r='2'/%3E%3Ccircle cx='344' cy='60' r='2'/%3E%3Ccircle cx='348' cy='60' r='2'/%3E%3Ccircle cx='352' cy='60' r='2'/%3E%3Ccircle cx='356' cy='60' r='2'/%3E%3Ccircle cx='360' cy='60' r='2'/%3E%3Ccircle cx='364' cy='60' r='2'/%3E%3Ccircle cx='368' cy='60' r='2'/%3E%3Ccircle cx='372' cy='60' r='2'/%3E%3Ccircle cx='376' cy='60' r='2'/%3E%3Ccircle cx='380' cy='60' r='2'/%3E%3Ccircle cx='384' cy='60' r='2'/%3E%3Ccircle cx='388' cy='60' r='2'/%3E%3Ccircle cx='392' cy='60' r='2'/%3E%3Ccircle cx='396' cy='60' r='2'/%3E%3Ccircle cx='400' cy='60' r='2'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: 'cover',
          backgroundPosition: 'left center',
          backgroundRepeat: 'no-repeat'
        }}></div>
      </div>
      
      <div className="text-center max-w-md mx-auto px-6 relative z-10">
        {/* Logo */}
        <div className="mb-12">
          <div className="flex justify-center mb-6">
            <Logo size="lg" />
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
              className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
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
          
        </form>
        
        <footer className="mt-16 text-center">
          <p className="text-xs text-gray-500">CITED APP - ALL RIGHTS RESERVED 2025 GOGETCITED.APP</p>
        </footer>
      </div>
    </main>
  );
}