// 'use client';

// import { useRouter } from 'next/navigation';
// import { useEffect } from 'react';

// export default function OrganizationDashboard() {
//   const router = useRouter();

//   const handleLogout = () => {
//     router.push('/'); 
//   };

//   useEffect(() => {
//     // Fetch and load organization-specific data here if needed
//   }, []);

//   return (
//     <div className="flex flex-col h-screen"> {/* Use h-screen to fill the viewport height */}
//       {/* Navbar */}
//       <nav className="bg-gray-800 text-white p-4 flex items-center justify-between shadow">
//         <div className="text-[23px] font-bold">Admin Dashboard</div>
//         <button 
//           onClick={handleLogout} 
//           className="py-2 px-4 bg-red-600 rounded-lg hover:bg-red-700 transition duration-300"
//         >
//           Logout
//         </button>
//       </nav>

//       <div className="flex flex-1 overflow-hidden"> {/* Prevent overflow in the flex container */}
//         {/* Sidebar */}
//         <aside className="hidden md:flex flex-col w-64 bg-gray-800 text-white shadow-lg">
//           <nav className="flex-1">
//             <ul>
//               <li>
//                 <a href="#" className="text-gray-200 block p-4 hover:bg-gray-700 transition duration-300">Live Data</a>
//               </li>
//               <li>
//                 <a href="#" className="text-gray-200 block p-4 hover:bg-gray-700 transition duration-300">History Data</a>
//               </li>
//               <li>
//                 <a href="#" className="text-gray-200 block p-4 hover:bg-gray-700 transition duration-300">Graph Visualization</a>
//               </li>
//               <li>
//                 <a href="/users" className="text-gray-200 block p-4 hover:bg-gray-700 transition duration-300">Users</a>
//               </li>
//               <li>
//                 <a href="#" className="text-gray-200 block p-4 hover:bg-gray-700 transition duration-300">Device Configurations</a>
//               </li>
//               <li>
//                 <a href="#" className="text-gray-200 block p-4 hover:bg-gray-700 transition duration-300">Analysis</a>
//               </li>
//             </ul>
//           </nav>
//         </aside>

//         {/* Main Content */}
//         <main className="flex-1 bg-gray-100 p-6 overflow-y-auto"> {/* Allow vertical scroll only in the main content */}
//           <div className="bg-white p-6 rounded-lg shadow-md">
//             <h1 className="text-2xl font-semibold mb-4 text-gray-800">Welcome to the Admin Dashboard</h1>
//             <p className="text-gray-600">Manage your organization's data and configurations effectively.</p>
//             {/* You can add more components or content here */}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }





'use client';

import { useRouter } from 'next/navigation';
import { ReactNode, useState } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    router.push('/');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
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
              <li>
                <a href="/live-data" className="text-gray-200 block p-4 hover:bg-gray-700 transition duration-300">Live Data</a>
              </li>
              <li>
                <a href="/history-data" className="text-gray-200 block p-4 hover:bg-gray-700 transition duration-300">History Data</a>
              </li>
              <li>
                <a href="/graph-visualization" className="text-gray-200 block p-4 hover:bg-gray-700 transition duration-300">Graph Visualization</a>
              </li>
              <li>
                <a href="/device-configurations" className="text-gray-200 block p-4 hover:bg-gray-700 transition duration-300">Device Configurations</a>
              </li>
              <li>
                <a href="/analysis" className="text-gray-200 block p-4 hover:bg-gray-700 transition duration-300">Analysis</a>
              </li>
              <li>
                <a href="/users" className="text-gray-200 block p-4 hover:bg-gray-700 transition duration-300">Users</a>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-gray-100 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
