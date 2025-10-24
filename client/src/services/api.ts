import axios, { type AxiosResponse } from 'axios';
import type { Leak, User, Repair } from '../types';

// Dynamically determine API URL
const getApiUrl = () => {
  // If running on mobile (not localhost), use the same host IP
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return `http://${window.location.hostname}:5000/api`;
  }
  // Default to localhost for development
  return import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
};

const API_BASE_URL = getApiUrl();

console.log('🌐 API URL:', API_BASE_URL); // Debug log

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response types
interface LoginResponse {
  token: string;
  user: User;
}

interface LeakResponse {
  id: number;
  message: string;
}

interface RepairResponse {
  id: number;
  message: string;
}

// Leak APIs
export const getLeaks = (): Promise<AxiosResponse<Leak[]>> => {
  return api.get<Leak[]>('/leaks');
};

export const createLeak = (data: FormData): Promise<AxiosResponse<LeakResponse>> => {
  return api.post<LeakResponse>('/leaks', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const updateLeakStatus = (
  id: number, 
  status: string
): Promise<AxiosResponse<{ message: string }>> => {
  return api.put<{ message: string }>(`/leaks/${id}`, { status });
};

// User APIs

export const login = (
  email: string,
  password: string,
  userType: 'public' | 'employee'
): Promise<AxiosResponse<LoginResponse>> => {
  return api.post<LoginResponse>('/users/login', { email, password, userType });
};



export const getProfile = (): Promise<AxiosResponse<User>> => {
  return api.get<User>('/users/profile');
};

// Repair APIs
export const getRepairs = (): Promise<AxiosResponse<Repair[]>> => {
  return api.get<Repair[]>('/repairs');
};

export const createRepair = (
  data: Partial<Repair>
): Promise<AxiosResponse<RepairResponse>> => {
  return api.post<RepairResponse>('/repairs', data);
};

export const updateRepair = (
  id: number, 
  data: Partial<Repair>
): Promise<AxiosResponse<{ message: string }>> => {
  return api.put<{ message: string }>(`/repairs/${id}`, data);
};

export default api;
