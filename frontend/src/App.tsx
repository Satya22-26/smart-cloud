import Sidebar from "./components/Sidebar";
import MyFilesView from "./pages/MyFilesView";
import UploadView from "./pages/UploadView";

function App() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <UploadView />
      </main>
    </div>
  );
}

export default App;