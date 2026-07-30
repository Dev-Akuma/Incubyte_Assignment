import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        if (Array.isArray(data.detail)) {
          setError(data.detail.map((err: any) => err.msg).join(', '));
        } else {
          setError(data.detail || 'Registration failed');
        }
      } else {
        navigate('/');
      }
    } catch (err) {
      setError('An error occurred during registration');
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
                <div className="auth-title">Create Account</div>
                <p className="auth-subtitle">Join us to get started.</p>
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
                    type="email"
                    className="input-field"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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

                <div style={{ height: '12px' }}></div>

                <button type="submit" className="btn-submit">Register</button>
              </form>

              <div className="signup-prompt relative z-20">
                Already have an account?
                <Link to="/login" className="toggle-link">Login</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
