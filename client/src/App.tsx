import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginScreen from './pages/LoginScreen';
import SignUpScreen from './pages/SignUpScreen';
import DashboardScreen from './pages/DashboardScreen';
import NotificationScreen from './pages/NotificationScreen';
import LeakReportScreen from './pages/LeakReportScreen';
import LeaksListScreen from './pages/LeaksListScreen';
import RepairStatusScreen from './pages/RepairStatusScreen';
import ProfileScreen from './pages/ProfileScreen';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/signup" element={<SignUpScreen />} />
        <Route path="/dashboard" element={<DashboardScreen />} />
        <Route path="/notifications" element={<NotificationScreen />} />
        <Route path="/leak-report" element={<LeakReportScreen />} />
        <Route path="/leaks" element={<LeaksListScreen />} />
        <Route path="/repair-status" element={<RepairStatusScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
