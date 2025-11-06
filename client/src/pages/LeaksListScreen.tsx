import { useState, useEffect } from 'react';
import { getLeaks, updateLeakStatus } from '../services/api';
import { getProfile } from '../services/api';
import type { Leak, User } from '../types';

export default function LeaksListScreen() {
  const [leaks, setLeaks] = useState<Leak[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [leaksResponse, profileResponse] = await Promise.all([
        getLeaks(),
        getProfile()
      ]);
      setLeaks(leaksResponse.data);
      setUser(profileResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkResolved = async (leakId: number) => {
    if (!confirm('Mark this leak as resolved?')) return;

    setUpdating(leakId);
    try {
      await updateLeakStatus(leakId, 'resolved');
      setLeaks(leaks.map(leak => 
        leak.id === leakId ? { ...leak, status: 'resolved' } : leak
      ));
    } catch (error) {
      console.error('Error updating leak:', error);
      alert('Failed to update leak status');
    } finally {
      setUpdating(null);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-red-600 font-bold';
      case 'in_progress': return 'text-orange-600 font-bold';
      case 'resolved': return 'text-green-600 font-bold';
      default: return 'text-gray-600';
    }
  };

  // Check if user has permission (only workers and admins)
  if (!user || (user.role !== 'worker' && user.role !== 'admin')) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md text-center">
          <div className="text-4xl mb-4">🔒</div>
          <h2 className="text-xl font-bold mb-2">Access Denied</h2>
          <p className="text-gray-600">
            Only repair workers and administrators can view leak reports.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading leaks...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
          <h1 className="text-2xl font-bold mb-4">All Leak Reports</h1>
          <div className="text-sm text-gray-600 mb-4">
            Total: {leaks.length} leaks | 
            Active: {leaks.filter(l => l.status === 'active').length} | 
            In Progress: {leaks.filter(l => l.status === 'in_progress').length} | 
            Resolved: {leaks.filter(l => l.status === 'resolved').length}
          </div>
        </div>

        <div className="space-y-4">
          {leaks.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
              No leaks reported yet.
            </div>
          ) : (
            leaks.map((leak) => (
              <div key={leak.id} className="bg-white rounded-lg shadow-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${getSeverityColor(leak.severity)}`}>
                        {leak.severity.toUpperCase()}
                      </span>
                      <span className={`text-sm ${getStatusColor(leak.status)}`}>
                        {leak.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg">{leak.location}</h3>
                    <p className="text-sm text-gray-600 mt-1">{leak.description}</p>
                    <div className="text-xs text-gray-500 mt-2">
                      Reported by: {leak.reported_by || 'Unknown'} | 
                      Reported at: {new Date(leak.reported_at).toLocaleString()}
                    </div>
                  </div>
                  {leak.photo_url && (
                    <img 
                      src={leak.photo_url} 
                      alt="Leak photo" 
                      className="w-20 h-20 object-cover rounded-lg ml-4"
                    />
                  )}
                </div>
                {leak.status !== 'resolved' && (
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleMarkResolved(leak.id)}
                      disabled={updating === leak.id}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium text-sm disabled:opacity-50 transition-colors"
                    >
                      {updating === leak.id ? 'Updating...' : 'Mark as Resolved'}
                    </button>
                    {leak.status === 'active' && (
                      <button
                        onClick={async () => {
                          setUpdating(leak.id);
                          try {
                            await updateLeakStatus(leak.id, 'in_progress');
                            setLeaks(leaks.map(l => 
                              l.id === leak.id ? { ...l, status: 'in_progress' } : l
                            ));
                          } catch (error) {
                            console.error('Error updating leak:', error);
                          } finally {
                            setUpdating(null);
                          }
                        }}
                        disabled={updating === leak.id}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm disabled:opacity-50 transition-colors"
                      >
                        Start Work
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

