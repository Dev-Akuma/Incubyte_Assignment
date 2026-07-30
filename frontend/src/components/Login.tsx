import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        if (Array.isArray(data.detail)) {
          setError(data.detail.map((err: any) => err.msg).join(', '));
        } else {
          setError(data.detail || 'Login failed');
        }
      } else {
        localStorage.setItem('token', data.access_token);
        navigate('/dashboard');
      }
    } catch (err) {
      setError('An error occurred during login');
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-gray-100 to-slate-200 min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-6 shadow-md">
            <svg className="w-6 h-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Welcome back</h1>
          <p className="text-gray-600 text-sm">Sign in to your account to continue</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 shadow-2xl rounded-2xl p-8">
          {error && (
            <div role="alert" className="mb-6 p-4 bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)] text-[#EF4444] rounded-xl text-sm font-medium flex items-center gap-3">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#A1A1AA] ml-1">Username</label>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition-all"
                required
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between ml-1">
                <label className="text-sm font-medium text-gray-400">Password</label>
                <a href="#" className="text-xs text-gray-400 hover:text-white transition-colors">Forgot password?</a>
              </div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition-all"
                required
              />
            </div>

            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-xl transition-all mt-6 shadow-lg shadow-indigo-500/30">
              Login
            </button>
          </form>
        </div>

        <p className="text-center text-gray-600 text-sm mt-8">
          Don't have an account? <Link to="/register" className="text-indigo-600 font-semibold hover:underline ml-1">Sign up</Link>
        </p>
      </div>
    </div>
  );
}