import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppLayout from './layouts/AppLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Mentors from './pages/Mentors';
import Mentees from './pages/Mentees';
import Sessions from './pages/Sessions';
import Progress from './pages/Progress';
import Feedback from './pages/Feedback';
import Profile from './pages/Profile';
import Issues from './pages/Issues';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="mentors" element={<Mentors />} />
            <Route path="mentees" element={<Mentees />} />
            <Route path="sessions" element={<Sessions />} />
            <Route path="progress" element={<Progress />} />
            <Route path="feedback" element={<Feedback />} />
            <Route path="issues" element={<Issues />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
