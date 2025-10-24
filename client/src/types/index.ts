export interface Leak {
  id: number;
  location: string;
  latitude: number;
  longitude: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'active' | 'in_progress' | 'resolved';
  reported_by: string;
  reported_at: string;
  description: string;
  photo_url?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'worker' | 'citizen';
  department: string;
}

export interface Repair {
  id: number;
  leak_id: number;
  worker_id: number;
  status: 'assigned' | 'in_progress' | 'completed';
  started_at?: string;
  completed_at?: string;
  before_photo?: string;
  after_photo?: string;
}
