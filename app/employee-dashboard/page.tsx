'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function EmployeeDashboard() {
  const router = useRouter();

  const handleLogout = () => {
    router.push('/'); 
  };

  useEffect(() => {
    // Fetch and load employee-specific data here if needed
  }, []);

  return (
    <div className="flex flex-col h-screen"> {/* Use h-screen to fill the viewport height */}
      {/* Navbar */}
      <nav className="bg-gray-800 text-white p-4 flex items-center justify-between shadow">
        <div className="text-[23px] font-bold">Operator Dashboard</div>
        <button 
          onClick={handleLogout} 
          className="py-2 px-4 bg-red-600 rounded-lg hover:bg-red-700 transition duration-300"
        >
          Logout
        </button>
      </nav>

      <div className="flex flex-1 overflow-hidden"> {/* Prevent overflow in the flex container */}
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-64 bg-gray-800 text-white min-h-screen shadow-lg">
          <nav className="flex-1">
            <ul>
              <li>
                <a href="/live-data" className="block p-4 hover:bg-gray-700 transition duration-300">Live Data</a>
              </li>
              <li>
                <a href="#" className="block p-4 hover:bg-gray-700 transition duration-300">History Data</a>
              </li>
              <li>
                <a href="#" className="block p-4 hover:bg-gray-700 transition duration-300">Graph Visualize</a>
              </li>
              <li>
                <a href="#" className="block p-4 hover:bg-gray-700 transition duration-300">Reports</a>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-gray-100 p-6 overflow-y-auto"> {/* Allow vertical scroll only in the main content */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-2xl font-semibold mb-4 text-gray-800">Welcome to Your Operator Dashboard</h1>
            <p className="text-gray-600">Here you can view your tasks and progress effectively.</p>
            
          </div>
        </main>
      </div>
    </div>
  );
}
