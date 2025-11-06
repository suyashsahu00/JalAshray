import { useState, useEffect } from 'react';
import { getProfile, getLeaks } from '../services/api';
import type { User, Leak } from '../types';
import Navigation from '../components/Navigation';

export default function DashboardScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [leaks, setLeaks] = useState<Leak[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetchData();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchData = async () => {
    try {
      const [profileResponse, leaksResponse] = await Promise.all([
        getProfile(),
        getLeaks()
      ]);
      setUser(profileResponse.data);
      setLeaks(leaksResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const activeLeaks = leaks.filter(l => l.status === 'active').length;
  const inProgressLeaks = leaks.filter(l => l.status === 'in_progress').length;
  const resolvedToday = leaks.filter(l => {
    const resolvedDate = new Date(l.reported_at);
    return l.status === 'resolved' && 
           resolvedDate.toDateString() === currentTime.toDateString();
  }).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <nav className="bg-blue-900 text-white px-4 py-2">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-semibold">
              नमस्ते {getGreeting()}, {user?.name || 'User'}
            </span>
            <div className="text-xs flex items-center gap-3 mt-1">
              <span>🏠 Raipur, Chhattisgarh</span>
              <span>🕙 {currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="text-xs text-gray-200">
              {currentTime.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
          <div>📶</div>
        </div>
      </nav>
      <main className="p-4 max-w-lg mx-auto">
        <div className="grid grid-cols-2 gap-4">
          <DashboardCard title="Active Leaks | सक्रिय रिसाव" icon="⚠️" value={activeLeaks.toString()} danger />
          <DashboardCard title="Repairs Today | आज की मरम्मत" icon="🛠️" value={resolvedToday.toString()} />
          <DashboardCard title="In Progress | प्रगति में" icon="🔄" value={inProgressLeaks.toString()} />
          <DashboardCard title="Total Leaks | कुल रिसाव" icon="📊" value={leaks.length.toString()} />
        </div>
        <div className="mt-8 bg-white rounded-2xl p-4 shadow-md">
          <div className="font-bold text-gray-600 mb-2">Raipur Pipeline Network</div>
          <div className="text-xs text-gray-500 mb-2">
            <span className="mr-2"><span className="inline-block w-2 h-2 bg-red-500 rounded-full"></span> Critical (0-1 hour)</span>
            <span className="mr-2"><span className="inline-block w-2 h-2 bg-orange-400 rounded-full"></span> High (1-4 hours)</span>
            <span className="mr-2"><span className="inline-block w-2 h-2 bg-yellow-300 rounded-full"></span> Medium (4-24 hours)</span>
            <span className="mr-2"><span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span> Normal flow</span>
          </div>
          <div className="w-full bg-gray-100 rounded-lg h-32 flex items-center justify-center text-gray-400">
            [Pipeline Map Placeholder]
          </div>
        </div>
      </main>
    </div>
  );
}

function DashboardCard({ title, icon, value, danger, warning } : { title: string, icon: string, value: string, danger?: boolean, warning?: boolean }) {
  let color = "text-gray-800";
  if (danger) color = "text-red-600";
  if (warning) color = "text-orange-600";
  return (
    <div className="bg-white rounded-2xl shadow p-4 flex flex-col items-center">
      <span className="text-2xl mb-1">{icon}</span>
      <span className="text-sm font-semibold text-center">{title}</span>
      <span className={`text-2xl mt-2 font-bold ${color}`}>{value}</span>
    </div>
  )
}
