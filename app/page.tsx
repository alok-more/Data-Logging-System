'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignIn() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true); // Start loading

    try {
      const res = await fetch('/api/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong');
      } else {
        if (data.dashboard === 'organization') {
          router.push('/live-data');
        } else if (data.dashboard === 'employee') {
          router.push('/live-data-operator');
        }
      }
    } catch (err) {
      setError('Failed to sign in. Please try again.');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-600 to-gray-800 p-4">
      <div className="bg-white p-8 rounded-lg shadow-2xl flex flex-col md:flex-row w-full max-w-lg md:max-w-3xl transform transition-transform duration-500 hover:scale-105">
        {/* Logo Section */}
        <div className="flex items-center justify-center w-full md:w-1/2 p-4 animate__animated animate__fadeInLeft">
          <img 
            src="/logo.png" 
            alt="Company Logo" 
            className="w-full max-w-xs h-auto object-contain animate__animated animate__zoomIn" 
          />
        </div>

        {/* Sign-In Form Section */}
        <div className="w-full md:w-1/2 p-6 animate__animated animate__fadeInRight">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 animate__animated animate__fadeInDown">Welcome Back</h2>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 text-gray-800 px-3 py-2 border border-gray-300 rounded-lg shadow-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 text-gray-800 px-3 py-2 border border-gray-300 rounded-lg shadow-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className={`w-full py-2 px-4 bg-gray-700 text-white font-semibold rounded-lg shadow-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-300 transform ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <span className="animate-spin inline-block w-5 h-5 border-4 border-t-4 border-t-transparent border-white rounded-full"></span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
