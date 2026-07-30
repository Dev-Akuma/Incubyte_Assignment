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
    <div className="min-h-screen flex items-center justify-center bg-[#008080]">
      <form onSubmit={handleSubmit} className="bg-[#c0c0c0] p-1 border-2 border-t-white border-l-white border-b-black border-r-black w-full max-w-sm flex flex-col">
        <div className="bg-[#000080] text-white font-bold px-2 py-1 mb-4 flex justify-between items-center">
          <span>Login.exe</span>
          <div className="bg-[#c0c0c0] border-2 border-t-white border-l-white border-b-black border-r-black text-black px-1 text-xs cursor-default font-bold">X</div>
        </div>
        <div className="px-4 pb-4">
          {error && <div role="alert" className="mb-4 p-2 bg-red-600 text-white border-2 border-t-gray-600 border-l-gray-600 border-b-white border-r-white text-sm font-bold">{error}</div>}
          <div className="mb-4">
            <input 
              type="text" 
              placeholder="Username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-2 py-1 border-2 border-t-gray-600 border-l-gray-600 border-b-white border-r-white bg-white text-black outline-none"
            />
          </div>
          <div className="mb-6">
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-2 py-1 border-2 border-t-gray-600 border-l-gray-600 border-b-white border-r-white bg-white text-black outline-none"
            />
          </div>
          <button type="submit" className="w-full bg-[#c0c0c0] text-black font-bold py-1 px-4 border-2 border-t-white border-l-white border-b-black border-r-black active:border-t-black active:border-l-black active:border-b-white active:border-r-white mb-4">
            Login
          </button>
          <div className="text-center text-sm text-black">
            Need an account? <Link to="/register" className="text-blue-800 hover:underline">Register</Link>
          </div>
        </div>
      </form>
    </div>
  );
}