import { useState, useEffect } from 'react';
import { getProfile } from '../services/api';
import Navigation from '../components/Navigation';
import type { User } from '../types';

export default function ProfileScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await getProfile();
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case 'worker': return 'Repair Worker';
      case 'admin': return 'Administrator';
      case 'citizen': return 'Citizen';
      default: return role;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <div className="flex flex-col items-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-blue-900 text-white px-4 py-2 rounded-t-2xl font-bold text-lg">Profile</div>
          <div className="bg-white rounded-b-2xl mb-6 p-5">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-3xl text-blue-900">
                👤
              </div>
              <div>
                <div className="font-bold text-xl">{user?.name || 'User'}</div>
                <div className="text-xs text-gray-600">Email: {user?.email || 'N/A'}</div>
                <div className="text-xs text-gray-600">Department: {user?.department || 'N/A'}</div>
                <div className="inline-block mt-1 bg-green-100 text-green-800 text-xs px-2 rounded">
                  {getRoleDisplay(user?.role || 'citizen')}
                </div>
              </div>
            </div>
            <div>
              <div className="font-bold text-sm mb-2 text-blue-800">Account Information</div>
              <div className="grid grid-cols-2 gap-2">
                <StatCard title="User ID" value={`#${user?.id || 'N/A'}`} />
                <StatCard title="Role" value={getRoleDisplay(user?.role || 'citizen')} />
                <StatCard title="Department" value={user?.department || 'N/A'} />
                <StatCard title="Member Since" value={user?.created_at ? new Date(user.created_at).getFullYear().toString() : 'N/A'} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center justify-center shadow">
      <div className="font-bold text-xl text-blue-900">{value}</div>
      <div className="text-xs text-gray-500">{title}</div>
    </div>
  );
}
