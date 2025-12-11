import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';


import Layout from './pages/Layout';
import MyFilesView from './pages/MyFilesView';
import DashboardView from './pages/DashboardView';
import UploadView from './pages/UploadView';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from "@/components/ui/sonner";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
        <AuthProvider>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/" element={<Layout />}>
                <Route index element={<UploadView />} />
                <Route path="dashboard" element={<DashboardView />} />
                <Route path="myfiles" element={<MyFilesView />} />
              </Route>
            </Routes>
            <Toaster position="top-right" richColors />
        </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);