import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<'public' | 'employee'>('public');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Optionally send userType to backend for role validation if needed
      const response = await login(email, password, userType);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userType', userType);
      navigate('/dashboard');
    } catch {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">JalAshray</h1>
          <p className="text-gray-600 text-sm mt-2">स्मार्ट पाइपलाइन गार्डियन</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-3">
            <div className="flex gap-4 justify-center mb-3">
              <label>
                <input
                  type="radio"
                  value="public"
                  checked={userType === 'public'}
                  onChange={() => setUserType('public')}
                  className="mr-2 accent-blue-600"
                />
                Public
              </label>
              <label>
                <input
                  type="radio"
                  value="employee"
                  checked={userType === 'employee'}
                  onChange={() => setUserType('employee')}
                  className="mr-2 accent-blue-600"
                />
                Employee
              </label>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email / Employee ID
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Enter your password"
                required
              />
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              {loading ? 'Logging in...' : 'Login | लॉगिन'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
