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
    <div className="min-h-screen flex items-center justify-center bg-[#0d0f14]">
      <div className="login-wrapper">
        <div className="login-card">
          <div className="glow-blob blob-1"></div>
          <div className="glow-blob blob-2"></div>
          <div className="dark-overlay"></div>

          <div className="view-container">
            <div className="form-view">
              <div className="auth-header">
                <div className="decorative-dot"></div>
                <div className="auth-title">Welcome Back</div>
                <p className="auth-subtitle">Please enter your details to sign in.</p>
              </div>

              {error && (
                <div role="alert" className="mb-4 p-3 bg-[rgba(220,38,38,0.1)] border border-red-500 text-red-500 rounded-lg text-sm text-center relative z-20">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="relative z-20">
                <div className="input-group">
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>

                <div className="input-group">
                  <input
                    type="password"
                    className="input-field"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <a href="#" className="forgot-link">Forgot password?</a>

                <button type="submit" className="btn-submit">Login</button>
              </form>

              <div className="signup-prompt relative z-20">
                Don't have an account?
                <Link to="/register" className="toggle-link">Sign up</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}