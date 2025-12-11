import { Link } from 'react-router-dom';
import { Folder, LayoutDashboard, LogIn, UserPlus, UploadCloud } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { LogOut } from 'lucide-react';


function Sidebar() {

  const { currentUser, logout } = useAuth();

  return (
    <aside className="w-64 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-xl font-bold">Smart Cloud</h2>
      </div>

      {currentUser && (
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/" className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <UploadCloud className="w-5 h-5 mr-3" />
            Upload Files
          </Link>
          <Link to="/myfiles" className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <Folder className="w-5 h-5 mr-3" />
            My Files
          </Link>
          <Link to="/dashboard" className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Dashboard
          </Link>
        </nav>
      )}

<div className="p-4 mt-auto border-t border-gray-200 dark:border-gray-800 space-y-2">
        {currentUser ? (
          <div>
            <p className="text-sm text-center text-gray-500 mb-2 truncate" title={currentUser.email}>
              {currentUser.email}
            </p>
           <Button 
              onClick={logout} 
              className="w-full bg-gray-900 text-white hover:bg-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
            >
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        ) : (
          
          <>
            <Link to="/login" className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              <LogIn className="w-5 h-5 mr-3" />
              Login
            </Link>
            <Link to="/signup" className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              <UserPlus className="w-5 h-5 mr-3" />
              Sign Up
            </Link>
          </>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;