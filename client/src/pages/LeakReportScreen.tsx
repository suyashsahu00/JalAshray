import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { createLeak, getProfile } from '../services/api';
import Navigation from '../components/Navigation';
import type { User } from '../types';

export default function LeakReportScreen() {
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [location, setLocation] = useState('');
  const [landmark, setLandmark] = useState('');
  const [latitude, setLatitude] = useState<number>(21.2513); // Default Raipur coordinates
  const [longitude, setLongitude] = useState<number>(81.6296);
  const [severity, setSeverity] = useState<'critical' | 'high' | 'medium' | 'low'>('medium');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
    getCurrentLocation();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await getProfile();
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Use default Raipur coordinates
        }
      );
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Photo size must be less than 5MB');
        return;
      }
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!location.trim()) {
      setError('Location is required');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('location', location);
      formData.append('latitude', latitude.toString());
      formData.append('longitude', longitude.toString());
      formData.append('severity', severity);
      formData.append('description', description || `${location}${landmark ? ` - ${landmark}` : ''}`);
      formData.append('reported_by', user?.name || 'Citizen');
      
      if (photo) {
        formData.append('photo', photo);
      }

      await createLeak(formData);
      alert('Leak reported successfully!');
      navigate('/dashboard');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to report leak. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <div className="flex flex-col items-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-blue-900 text-white px-4 py-2 rounded-t-2xl font-bold text-lg">Report Water Leak</div>
          <form onSubmit={handleSubmit} className="bg-white rounded-b-2xl p-5">
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>
            )}

            <div className="mb-4">
              <div className="font-bold mb-1 flex items-center gap-2">
                📷 Capture Leak Photo
              </div>
              {photoPreview ? (
                <div className="relative">
                  <img src={photoPreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => {
                      setPhoto(null);
                      setPhotoPreview(null);
                    }}
                    className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label className="bg-gray-100 border-dashed border-2 border-gray-300 rounded-lg flex items-center justify-center min-h-[100px] text-gray-400 cursor-pointer hover:bg-gray-200">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                  <span>Click to Upload Photo</span>
                </label>
              )}
            </div>

            <div className="mb-4">
              <label className="font-bold mb-1 block">Location *</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg mb-2"
                placeholder="Enter location (e.g., Pandri, Raipur)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                placeholder="Landmark (e.g., Near Metro Station)"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
              />
              <button
                type="button"
                onClick={getCurrentLocation}
                className="w-full bg-blue-50 text-blue-700 font-bold py-2 rounded-lg border mt-2 border-blue-200 hover:bg-blue-100"
              >
                📍 Use Current Location
              </button>
            </div>

            <div className="mb-4">
              <label className="font-bold mb-1 block" htmlFor="severity-select">Severity</label>
              <select
                id="severity-select"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                value={severity}
                onChange={(e) => setSeverity(e.target.value as 'critical' | 'high' | 'medium' | 'low')}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="font-bold mb-1 block">Description</label>
              <textarea
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                rows={3}
                placeholder="Describe the leak..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-3 rounded-lg font-bold"
            >
              {loading ? 'Submitting...' : 'Submit Report'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
