import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getProfile } from '../services/api';
import type { User } from '../types';

export default function Navigation() {
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await getProfile();
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    window.location.href = '/';
  };

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/leak-report', label: 'Report Leak', icon: '📝' },
    { path: '/notifications', label: 'Notifications', icon: '🔔' },
    { path: '/repair-status', label: 'Repair Status', icon: '🛠️' },
    { path: '/profile', label: 'Profile', icon: '👤' },
  ];

  // Only show leak list for workers and admins
  if (user && (user.role === 'worker' || user.role === 'admin')) {
    navItems.splice(2, 0, { path: '/leaks', label: 'All Leaks', icon: '🚰' });
  }

  return (
    <nav className="bg-blue-900 text-white px-4 py-3 shadow-lg">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-xl font-bold">
            💧 JalAshray
          </Link>
          <div className="hidden md:flex gap-2 flex-wrap">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-blue-700 text-white'
                    : 'text-blue-100 hover:bg-blue-800'
                }`}
              >
                <span className="mr-1">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {!loading && user && (
            <span className="text-sm text-blue-100 hidden sm:inline">
              {user.name} ({user.role})
            </span>
          )}
          <button
            onClick={handleLogout}
            className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
      {/* Mobile menu */}
      <div className="md:hidden mt-3 flex gap-2 flex-wrap">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
              isActive(item.path)
                ? 'bg-blue-700 text-white'
                : 'text-blue-100 hover:bg-blue-800'
            }`}
          >
            <span className="mr-1">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

