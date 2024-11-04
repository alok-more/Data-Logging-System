"use client";

import { useEffect, useState } from 'react';
import DashboardLayout from '../employee-dashboard/page'; // Adjust the import path as necessary
import { supabase } from '../../supabaseClient';

export default function HistoryDataOperator() {
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
      .from('Data_Log') // Adjust the table name as necessary
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
    link.setAttribute('download', 'data_logs_operator.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="text-center py-4"><p className="text-xl animate-pulse">Loading...</p></div>;
  if (error) return <div className="text-center py-4"><p className="text-red-500">Error: {error}</p></div>;

  return (
    <DashboardLayout>
      <div className="bg-gray-100">
        <div className="max-w-7xl mx-auto p-4">
          <div className="bg-white sm:p-8 rounded-lg shadow-lg mb-8">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-700 mb-4">History Data - Operator</h1>
              <p className="text-gray-600 mb-6">Explore historical records of temperature and humidity sensor data for operators.</p>
            </div>

            {/* Date Range Inputs */}
            <div className="mb-6 flex flex-col sm:flex-row justify-center items-center space-x-4">
              <div className="flex flex-col mx-2 mb-4 sm:mb-0">
                <label className="text-gray-700 font-medium">Start Timestamp</label>
                <input
                  type="datetime-local"
                  value={startTimestamp}
                  onChange={(e) => setStartTimestamp(e.target.value)}
                  className="mt-2 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
                />
              </div>
              <div className="flex flex-col mx-2 mb-4 sm:mb-0">
                <label className="text-gray-700 font-medium">End Timestamp</label>
                <input
                  type="datetime-local"
                  value={endTimestamp}
                  onChange={(e) => setEndTimestamp(e.target.value)}
                  className="mt-2 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
                />
              </div>
            </div>

            {/* Button Container */}
            <div className="flex justify-center mb-6">
              <button
                onClick={fetchFilteredDataLogs}
                className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition mx-2 shadow-md hover:shadow-lg"
              >
                Filter Data
              </button>
              <button
                onClick={exportToCSV}
                className="bg-green-600 text-white px-6 py-2 rounded-md font-medium hover:bg-green-700 transition mx-2 shadow-md hover:shadow-lg"
              >
                Export to CSV
              </button>
            </div>

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
