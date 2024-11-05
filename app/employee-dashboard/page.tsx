// 'use client';

// import { useRouter } from 'next/navigation';
// import { useEffect, useState } from 'react';

// export default function EmployeeDashboard() {
//   const router = useRouter();
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   const handleLogout = () => {
//     router.push('/');
//   };

//   const toggleSidebar = () => {
//     setIsSidebarOpen((prev) => !prev);
//   };

//   useEffect(() => {
//     // Fetch and load employee-specific data here if needed
//   }, []);

//   return (
//     <div className="flex flex-col h-screen">
//       {/* Navbar */}
//       <nav className="bg-gray-800 text-white p-4 flex items-center justify-between shadow">
//         {/* Mobile Menu Button */}
//         <button
//           onClick={toggleSidebar}
//           className="md:hidden p-2 text-white focus:outline-none"
//         >
//           {/* Hamburger Icon */}
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-6 w-6"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//             aria-hidden="true"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M4 6h16M4 12h16m-7 6h7"
//             />
//           </svg>
//         </button>
//         <div className="text-[23px] font-bold">Operator Dashboard</div>
//         <button
//           onClick={handleLogout}
//           className="py-2 px-4 bg-red-600 rounded-lg hover:bg-red-700 transition duration-300"
//         >
//           Logout
//         </button>
//       </nav>

//       <div className="flex flex-1 overflow-hidden">
//         {/* Sidebar */}
//         <aside
//           className={`md:flex flex-col w-64 bg-gray-800 text-white shadow-lg ${
//             isSidebarOpen ? 'block' : 'hidden'
//           } md:block`}
//         >
//           <nav className="flex-1">
//             <ul>
//               <li>
//                 <a href="/live-data-operator" className="block p-4 hover:bg-gray-700 transition duration-300">Live Data</a>
//               </li>
//               <li>
//                 <a href="/history-data" className="block p-4 hover:bg-gray-700 transition duration-300">History Data</a>
//               </li>
//               <li>
//                 <a href="/graph-visualize" className="block p-4 hover:bg-gray-700 transition duration-300">Graph Visualize</a>
//               </li>
//               <li>
//                 <a href="/reports" className="block p-4 hover:bg-gray-700 transition duration-300">Reports</a>
//               </li>
//             </ul>
//           </nav>
//         </aside>

//         {/* Main Content */}
//         <main className="flex-1 bg-gray-100 p-6 overflow-y-auto">
//           <div className="bg-white p-6 rounded-lg shadow-md">
//             <h1 className="text-2xl font-semibold mb-4 text-gray-800">Welcome to Your Operator Dashboard</h1>
//             <p className="text-gray-600">Here you can view your tasks and progress effectively.</p>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }





// 'use client';

// import { useRouter } from 'next/navigation';
// import { useState } from 'react';

// export default function DashboardLayout({ children }: { children: React.ReactNode }) {
//   const router = useRouter();
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   const handleLogout = () => {
//     router.push('/');
//   };

//   const toggleSidebar = () => {
//     setIsSidebarOpen((prev) => !prev);
//   };

//   return (
//     <div className="flex flex-col h-screen">
//       {/* Navbar */}
//       <nav className="bg-gray-800 text-white p-4 flex items-center justify-between shadow">
//         <button
//           onClick={toggleSidebar}
//           className="md:hidden p-2 text-white focus:outline-none"
//         >
//           {/* Hamburger Icon */}
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-6 w-6"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//             aria-hidden="true"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M4 6h16M4 12h16m-7 6h7"
//             />
//           </svg>
//         </button>
//         <div className="text-[23px] font-bold">Operator Dashboard</div>
//         <button
//           onClick={handleLogout}
//           className="py-2 px-4 bg-red-600 rounded-lg hover:bg-red-700 transition duration-300"
//         >
//           Logout
//         </button>
//       </nav>

//       <div className="flex flex-1 overflow-hidden">
//         {/* Sidebar */}
//         <aside
//           className={`md:flex flex-col w-64 bg-gray-800 text-white shadow-lg ${
//             isSidebarOpen ? 'block' : 'hidden'
//           } md:block`}
//         >
//           <nav className="flex-1">
//             <ul>
//               <li>
//                 <a href="/live-data-operator" className="block p-4 hover:bg-gray-700 transition duration-300">Live Data</a>
//               </li>
//               <li>
//                 <a href="/history-data-operator" className="block p-4 hover:bg-gray-700 transition duration-300">History Data</a>
//               </li>
//               <li>
//                 <a href="/graph-visualization-operator" className="block p-4 hover:bg-gray-700 transition duration-300">Graph Visualize</a>
//               </li>
//               <li>
//                 <a href="/analysis-operator" className="block p-4 hover:bg-gray-700 transition duration-300">Reports</a>
//               </li>
//             </ul>
//           </nav>
//         </aside>

//         {/* Main Content */}
//         <main className="flex-1 bg-gray-100 p-6 overflow-y-auto">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }




'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false); // State for Help and Hints

  const handleLogout = () => {
    router.push('/');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const toggleHelp = () => {
    setIsHelpOpen((prev) => !prev); // Toggle Help and Hints section
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
                <a href="/live-data-operator" className="block p-4 hover:bg-gray-700 transition duration-300">Live Data</a>
              </li>
              <li>
                <a href="/history-data-operator" className="block p-4 hover:bg-gray-700 transition duration-300">History Data</a>
              </li>
              <li>
                <a href="/graph-visualization-operator" className="block p-4 hover:bg-gray-700 transition duration-300">Graph Visualize</a>
              </li>
              <li>
                <a href="/analysis-operator" className="block p-4 hover:bg-gray-700 transition duration-300">Reports</a>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-gray-100 p-6 overflow-y-auto relative">
          {children}
          
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
