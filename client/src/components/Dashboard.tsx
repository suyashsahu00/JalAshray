import { useEffect, useState } from 'react';
import { getLeaks } from '../services/api';
import type { Leak } from '../types';
import ImageUpload from './ImageUpload';


export default function Dashboard() {
  const [leaks, setLeaks] = useState<Leak[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaks();
  }, []);

  const fetchLeaks = async () => {
    try {
      const response = await getLeaks();
      setLeaks(response.data);
    } catch (error) {
      console.error('Error fetching leaks:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-600';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">JalAshray</h1>
        <p className="text-gray-600">स्मार्ट पाइपलाइन गार्डियन</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-600 text-sm font-medium">Active Leaks</h3>
          <p className="text-3xl font-bold text-red-600 mt-2">
            {leaks.filter(l => l.status === 'active').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-600 text-sm font-medium">In Progress</h3>
          <p className="text-3xl font-bold text-orange-600 mt-2">
            {leaks.filter(l => l.status === 'in_progress').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-600 text-sm font-medium">Resolved Today</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {leaks.filter(l => l.status === 'resolved').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-600 text-sm font-medium">Water Saved</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">2,450L</p>
        </div>
      </div>
      <ImageUpload />
      {/* Leaks Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Recent Leak Reports</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Severity</th>
                  <th className="text-left p-3">Location</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Reported</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leaks.map(leak => (
                  <tr key={leak.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <span className={`px-3 py-1 rounded-full text-white text-sm ${getStatusColor(leak.severity)}`}>
                        {leak.severity}
                      </span>
                    </td>
                    <td className="p-3">{leak.location}</td>
                    <td className="p-3">{leak.status}</td>
                    <td className="p-3">{new Date(leak.reported_at).toLocaleDateString()}</td>
                    <td className="p-3">
                      <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
