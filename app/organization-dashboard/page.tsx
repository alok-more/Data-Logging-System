'use client';

import { useRouter } from 'next/navigation';
import { ReactNode, useState } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false); // State for Help and Hints

  const handleLogout = () => {
    router.push('/');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleNavigation = (path: string) => {
    setIsLoading(true); // Start loading
    router.push(path); // Navigate to path
  };

  const toggleHelp = () => {
    setIsHelpOpen((prev) => !prev); // Toggle Help and Hints section
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <nav className="bg-gray-800 text-white p-4 flex items-center justify-between shadow">
        {/* Mobile Menu Button */}
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
        <div className="text-[23px] font-bold">Admin Dashboard</div>
        <button
          onClick={handleLogout}
          className="py-2 px-4 bg-red-600 rounded-lg hover:bg-red-700 transition duration-300"
        >
          Logout
        </button>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className={`md:flex flex-col w-64 bg-gray-800 text-white shadow-lg ${isSidebarOpen ? 'block' : 'hidden'} md:block`}>
          <nav className="flex-1">
            <ul>
              <li className="hover:bg-gray-700 transition duration-300">
                <button
                  onClick={() => handleNavigation('/live-data')}
                  className="text-gray-200 block w-full p-4 text-left"
                >
                  Live Data
                </button>
              </li>
              <li className="hover:bg-gray-700 transition duration-300">
                <button
                  onClick={() => handleNavigation('/history-data')}
                  className="text-gray-200 block w-full p-4 text-left"
                >
                  History Data
                </button>
              </li>
              <li className="hover:bg-gray-700 transition duration-300">
                <button
                  onClick={() => handleNavigation('/graph-visualization')}
                  className="text-gray-200 block w-full p-4 text-left"
                >
                  Graph Visualization
                </button>
              </li>
              <li className="hover:bg-gray-700 transition duration-300">
                <button
                  onClick={() => handleNavigation('/device-configurations')}
                  className="text-gray-200 block w-full p-4 text-left"
                >
                  Device Configurations
                </button>
              </li>
              <li className="hover:bg-gray-700 transition duration-300">
                <button
                  onClick={() => handleNavigation('/analysis')}
                  className="text-gray-200 block w-full p-4 text-left"
                >
                  Analysis
                </button>
              </li>
              <li className="hover:bg-gray-700 transition duration-300">
                <button
                  onClick={() => handleNavigation('/users')}
                  className="text-gray-200 block w-full p-4 text-left"
                >
                  Users
                </button>
              </li>
              {/* Help and Hints Button */}
              <li className="hover:bg-gray-700 transition duration-300">
                {/* <button
                  onClick={toggleHelp}
                  className="text-gray-200 block w-full p-4 text-left"
                >
                  Help and Hints
                </button> */}
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-gray-100 p-6 overflow-y-auto relative">
          {isLoading && (
            <div className="absolute inset-0 bg-gray-100 bg-opacity-80 flex items-center justify-center z-50">
              <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500"></div>
            </div>
          )}
          {children}
        </main>

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
              <b>Live Data:</b> Real time data monitoring of data logger device.
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
      </div>
    </div>
  );
}

export default DashboardLayout;