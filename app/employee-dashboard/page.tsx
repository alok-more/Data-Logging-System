'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false); // State for Help and Hints
  const [isLoading, setIsLoading] = useState(false); // State for loader

  const handleLogout = () => {
    setIsLoading(true);
    router.push('/'); // No .finally() here
  
    // Use a timeout to reset the loading state after a short delay
    setTimeout(() => {
      setIsLoading(false);
    }, 500); 
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const toggleHelp = () => {
    setIsHelpOpen((prev) => !prev); // Toggle Help and Hints section
  };

  const handleNavigation = (path) => {
    setIsLoading(true);
    router.push(path);
    
    // Set a timeout to reset the loading state after navigation
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };
  
  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <nav className="bg-gray-800 text-white p-4 flex items-center justify-between shadow">
        <button
          onClick={toggleSidebar}
          className="md:hidden p-2 text-white focus:outline-none"
        >
          {/* Hamburger Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
        <div className="text-[23px] font-bold">Operator Dashboard</div>
        <button
          onClick={handleLogout}
          className="py-2 px-4 bg-red-600 rounded-lg hover:bg-red-700 transition duration-300"
        >
          Logout
        </button>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`md:flex flex-col w-64 bg-gray-800 text-white shadow-lg ${
            isSidebarOpen ? 'block' : 'hidden'
          } md:block`}
        >
          <nav className="flex-1">
            <ul>
              <li>
                <button onClick={() => handleNavigation('/live-data-operator')} className="block w-full text-left p-4 hover:bg-gray-700 transition duration-300">Live Data</button>
              </li>
              <li>
                <button onClick={() => handleNavigation('/history-data-operator')} className="block w-full text-left p-4 hover:bg-gray-700 transition duration-300">History Data</button>
              </li>
              <li>
                <button onClick={() => handleNavigation('/graph-visualization-operator')} className="block w-full text-left p-4 hover:bg-gray-700 transition duration-300">Graph Visualize</button>
              </li>
              <li>
                <button onClick={() => handleNavigation('/analysis-operator')} className="block w-full text-left p-4 hover:bg-gray-700 transition duration-300">Analysis</button>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-gray-100 p-6 overflow-y-auto relative">
          {children}

          {/* Loading Spinner */}
          {isLoading && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
              <div className="w-16 h-16 border-4 border-t-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
            </div>
          )}
          
          {/* Help and Hints Section */}
          <div className={`transition-transform duration-300 ${isHelpOpen ? 'translate-x-0' : '-translate-x-full'} fixed top-0 left-0 w-full h-full max-w-xs bg-white shadow-lg p-4 text-gray-800 overflow-y-auto`}>
            <h2 className="font-bold text-lg mb-4">Help and Hints</h2>
            <ul className="list-disc list-inside">
              <li className='mb-1'>
                <b>Data_LogX</b> is a tool or dashboard to analyze
                and visualize the real-time data of the Data Logger.
              </li>
              <li className='mb-1'>
                A <b> Data Logger</b> is a small and relatively inexpensive electronic device that monitors and records data over time (such as voltage, temperature, or current) via an internal or external sensor.
              </li>
              <li className='mb-1'>
                <b>Live Data:</b> Real-time data monitoring of data logger device.
              </li>
              <li className='mb-1'>
                <b>History Data:</b> Get all historical data of sensor and get downloaded in CSV.
              </li>
              <li className='mb-1'>
                <b>Graph Visualization:</b> Graphical representation of values and analysis.
              </li>
              <li className='mb-1'>
                <b>Device Configuration:</b> Configure settings for data loggers and sensors.
              </li>
              <li className='mb-1'>
                <b>Analysis:</b> Get analysis of data and values like MIN, MAX & Standard Deviation, etc.
              </li>
              <li>
                <b>Users:</b> Add & manage all user's access here.
              </li>
            </ul>
          </div>

          {/* Help Button */}
          <button
            onClick={toggleHelp}
            className="fixed bottom-4 left-4 bg-white text-gray-800 rounded-full p-2 shadow-lg hover:bg-gray-300 transition duration-300"
          >
            Help & Hints
          </button>
        </main>
      </div>
    </div>
  );
}
