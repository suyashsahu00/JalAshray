import { useRef, useState } from 'react';
import { createLeak } from '../services/api';

export default function ImageUpload() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
    else setPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const file = fileInputRef.current?.files?.[0];
    if (!file) return setMessage('Please select an image to upload.');

    setUploading(true);
    setMessage('');

    // Add minimum data required for a leak (adjust as needed)
    const formData = new FormData();
    formData.append('location', 'Public Report - Mobile/Web Upload');
    formData.append('latitude', '0.000');
    formData.append('longitude', '0.000');
    formData.append('severity', 'medium');
    formData.append('description', 'Leakage photo submitted by user');
    formData.append('reported_by', localStorage.getItem('userType') || 'public');
    formData.append('photo', file);

    try {
      await createLeak(formData);
      setMessage('Image uploaded successfully!');
      setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch {
      setMessage('Failed to upload image.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mt-8 bg-white p-6 rounded-lg shadow">
      <h2 className="font-bold text-lg mb-3">Upload Pipeline Leakage Image</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label htmlFor="leakImage" className="font-medium">
          Select an image of the leakage
        </label>
        <input
          id="leakImage"
          title="Leakage photo"
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="mb-2"
        />
        {preview && <img src={preview} alt="Preview" className="w-64 h-auto rounded shadow mb-2" />}
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700"
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Upload Image'}
        </button>
        {message && <div className="text-sm mt-1">{message}</div>}
      </form>
    </div>
  );
}
