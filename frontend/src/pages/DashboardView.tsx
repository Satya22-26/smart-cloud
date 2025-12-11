import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, HardDrive, Clock, File, PieChart, User } from "lucide-react";
import apiClient from '@/lib/apiClient';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardStats {
  total_files: number;
  total_storage_mb: number;
  recent_files: Array<{
    id: number;
    original_filename: string;
    upload_date: string;
    file_size_bytes: number;
  }>;
  category_counts: Array<{ category: string; count: number }>;
  data_version: string;
}

function DashboardView() {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const cachedData = localStorage.getItem('dashboard_cache');
        let currentVersion = null;

        if (cachedData) {
          const parsedData = JSON.parse(cachedData);
          setStats(parsedData);
          currentVersion = parsedData.data_version;
          setLoading(false);
        }

        const response = await apiClient.get('/dashboard', {
          params: { current_version: currentVersion }
        });

        if (response.data.status !== "unchanged") {
          setStats(response.data);
          localStorage.setItem('dashboard_cache', JSON.stringify(response.data));
        }

      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, <span className="font-semibold text-foreground">{currentUser?.email}</span>
          </p>
        </div>
        <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
            <User className="h-6 w-6 text-gray-500" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Files</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_files || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_storage_mb || 0} MB</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
               {stats?.recent_files.length ? "Active" : "None"}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Files</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6"> 
              {stats?.recent_files.length === 0 ? (
                <p className="text-sm text-muted-foreground">No files uploaded yet.</p>
              ) : (
                stats?.recent_files.map((file) => (
                  <div key={file.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-4 min-w-0"> 
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center dark:bg-blue-900/50 flex-shrink-0">
                            <File className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="space-y-1 min-w-0"> 
                            <p className="text-sm font-medium leading-none text-gray-900 dark:text-gray-100 truncate">
                                {file.original_filename}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {(file.file_size_bytes / 1024).toFixed(1)} KB
                            </p>
                        </div>
                    </div>
                    <div className="text-xs text-muted-foreground font-medium whitespace-nowrap ml-4">
                        {new Date(file.upload_date).toLocaleDateString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="w-5 h-5 mr-2"/> 
              Category Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {stats?.category_counts.length === 0 ? (
               <p className="text-sm text-muted-foreground">No categories yet.</p>
            ) : (
              stats?.category_counts.map((item) => {
                const total = stats.total_files || 1; 
                const percentage = Math.max(5, Math.round((item.count / total) * 100));
                
                return (
                  <div key={item.category} className="flex items-center gap-3">
                    <span className="w-24 text-sm text-gray-600 dark:text-gray-400 font-medium truncate">
                        {item.category}
                    </span>
                    <div className="flex-1 h-3 bg-gray-100 rounded-full dark:bg-gray-800 overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 rounded-full transition-all duration-500" 
                        style={{ width: `${percentage}%` }} 
                      />
                    </div>
                    <span className="w-6 text-sm text-gray-900 dark:text-gray-100 font-semibold text-right">
                        {item.count}
                    </span>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default DashboardView;