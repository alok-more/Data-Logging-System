// // app/history-data/page.tsx

// import DashboardLayout from '../organization-dashboard/page';

// export default function HistoryData() {
//   return (
//     <DashboardLayout>
//       <div className="bg-white p-6 rounded-lg shadow-md">
//         <h1 className="text-2xl font-semibold mb-4 text-gray-800">History Data</h1>
//         <p className="text-gray-600">Here you can view historical data logs.</p>
//         {/* Add specific components for History Data here */}
//       </div>
//     </DashboardLayout>
//   );
// }





"use client";

import { useEffect, useState } from 'react';
import DashboardLayout from '../organization-dashboard/page';
import { supabase } from '../../supabaseClient'; // Adjust the path as necessary

export default function HistoryData() {
  const [dataLogs, setDataLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startTimestamp, setStartTimestamp] = useState<string>('');
  const [endTimestamp, setEndTimestamp] = useState<string>('');

  useEffect(() => {
    fetchAllDataLogs();
  }, []);

  const fetchAllDataLogs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('Data_Log')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setDataLogs(data ? data.slice(0, 10) : []); // Keep only the latest 10 entries
    }
    setLoading(false);
  };

  const fetchFilteredDataLogs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('Data_Log')
      .select('*')
      .gte('timestamp', startTimestamp)
      .lte('timestamp', endTimestamp)
      .order('timestamp', { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setDataLogs(data ? data.slice(0, 10) : []); // Keep only the latest 10 entries
    }
    setLoading(false);
  };

  const exportToCSV = () => {
    const csvRows: string[] = [];
    const headers = ['Date', 'Time', 'Temperature (°C)', 'Humidity (%)'];
    csvRows.push(headers.join(',')); // Add headers to CSV

    dataLogs.forEach(log => {
      const timestamp = new Date(log.timestamp);
      const row = [
        timestamp.toLocaleDateString(),
        timestamp.toLocaleTimeString(),
        log.value1 !== undefined ? log.value1.toFixed(2) : 'N/A',
        log.value2 !== undefined ? log.value2.toFixed(2) : 'N/A',
      ];
      csvRows.push(row.join(',')); // Add data rows
    });

    const csvData = csvRows.join('\n');
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'data_logs.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="text-center py-4"><p className="text-xl animate-pulse">Loading...</p></div>;
  if (error) return <div className="text-center py-4"><p className="text-red-500">Error: {error}</p></div>;

  return (
    <DashboardLayout>
      <div className="bg-gray-100 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg mb-8">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-700 mb-4">History Data</h1>
              <p className="text-gray-600 mb-6">Explore historical records of temperature and humidity sensor data.</p>
            </div>

            {/* Date Range Inputs */}
            <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col">
                <label className="text-gray-700 font-medium">Start Timestamp</label>
                <input
                  type="datetime-local"
                  value={startTimestamp}
                  onChange={(e) => setStartTimestamp(e.target.value)}
                  className="mt-2 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-700 font-medium">End Timestamp</label>
                <input
                  type="datetime-local"
                  value={endTimestamp}
                  onChange={(e) => setEndTimestamp(e.target.value)}
                  className="mt-2 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
                />
              </div>
              <button
                onClick={fetchFilteredDataLogs}
                className="self-end bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition"
              >
                Filter Data
              </button>
            </div>

            {/* Export Button */}
            <button
              onClick={exportToCSV}
              className="mb-6 bg-green-600 text-white px-5 py-2 rounded-md font-medium hover:bg-green-700 transition flex justify-center"
            >
              Export to CSV
            </button>

            {/* Data Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full bg-gray-50 rounded-lg shadow-lg">
                <thead>
                  <tr className="bg-gray-800 text-white text-left">
                    <th className="py-3 px-4 sm:px-6 font-semibold">Date</th>
                    <th className="py-3 px-4 sm:px-6 font-semibold">Time</th>
                    <th className="py-3 px-4 sm:px-6 font-semibold">Temperature (°C)</th>
                    <th className="py-3 px-4 sm:px-6 font-semibold">Humidity (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {dataLogs.map((log) => (
                    <tr key={log.id} className="border-b">
                      <td className="py-4 px-4 sm:px-6 text-gray-700">{new Date(log.timestamp).toLocaleDateString()}</td>
                      <td className="py-4 px-4 sm:px-6 text-gray-700">{new Date(log.timestamp).toLocaleTimeString()}</td>
                      <td className="py-4 px-4 sm:px-6 text-gray-700">{log.value1.toFixed(2)}</td>
                      <td className="py-4 px-4 sm:px-6 text-gray-700">{log.value2.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {dataLogs.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No data available for the selected date range.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
