// "use client";

// import { useEffect, useState } from 'react';
// import DashboardLayout from '../organization-dashboard/page';

// export default function LiveData() {
//   const [data, setData] = useState<number[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
  
//   // Previous values to detect changes
//   const [prevTemperature, setPrevTemperature] = useState<number | null>(null);
//   const [prevHumidity, setPrevHumidity] = useState<number | null>(null);

//   // Fetch data from the API
//   const fetchData = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await fetch("http://localhost:5000/read-holding-registers");
//       if (!response.ok) {
//         throw new Error('Failed to fetch data');
//       }
//       const result = await response.json();
//       setData(result);

//       // Update previous values
//       setPrevTemperature(data[0]);
//       setPrevHumidity(data[1]);
//     } catch (error: any) {
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//     const interval = setInterval(fetchData, 5000);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <DashboardLayout>
//       <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg transition-all duration-300">
//         <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800 text-center">Live Data</h1>
//         <p className="text-gray-600 mb-6 text-center text-lg">
//           Here you can view live data of the Temperature and Humidity sensors.
//         </p>

//         {loading && (
//           <div className="flex items-center justify-center">
//             <svg
//               className="animate-spin h-12 w-12 text-blue-600"
//               viewBox="0 0 24 24"
//             >
//               <circle className="opacity-25" cx="12" cy="12" r="10" fill="none" strokeWidth="4" stroke="currentColor" />
//               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v5l4-4-4-4v5a8 8 0 01-8 8z" />
//             </svg>
//           </div>
//         )}
//         {error && <p className="text-red-500 text-center">Error: {error}</p>}

//         {!loading && !error && (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
//             {/* Temperature Card */}
//             <div
//               className={`p-6 md:p-8 rounded-lg shadow-lg transition-transform transform 
//                 ${prevTemperature !== null && data[0] > prevTemperature ? 'bg-red-300' : 'bg-blue-300'}
//                 hover:scale-105 hover:shadow-xl duration-300`}
//             >
//               <h2 className="text-xl md:text-2xl font-semibold text-blue-800">Temperature</h2>
//               <p className={`text-5xl md:text-6xl font-bold text-blue-600 text-center transition-transform 
//                 ${prevTemperature !== null && data[0] !== prevTemperature ? 'animate-bounce' : ''}`}>
//                 {(data[0] / 10).toFixed(1)} °C
//               </p>
//             </div>

//             {/* Humidity Card */}
//             <div
//               className={`p-6 md:p-8 rounded-lg shadow-lg transition-transform transform 
//                 ${prevHumidity !== null && data[1] > prevHumidity ? 'bg-yellow-300' : 'bg-green-300'}
//                 hover:scale-105 hover:shadow-xl duration-300`}
//             >
//               <h2 className="text-xl md:text-2xl font-semibold text-green-800">Humidity</h2>
//               <p className={`text-5xl md:text-6xl font-bold text-green-600 text-center transition-transform 
//                 ${prevHumidity !== null && data[1] !== prevHumidity ? 'animate-bounce' : ''}`}>
//                 {(data[1] / 10).toFixed(1)} %
//               </p>
//             </div>
//           </div>
//         )}
//       </div>
//     </DashboardLayout>
//   );
// }






"use client";

import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import DashboardLayout from '../organization-dashboard/page';

// Register all necessary components
Chart.register(...registerables);

export default function LiveData() {
  const [data, setData] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Previous values to detect changes
  const [prevTemperature, setPrevTemperature] = useState<number | null>(null);
  const [prevHumidity, setPrevHumidity] = useState<number | null>(null);

  // Historical data for charts
  const [temperatureHistory, setTemperatureHistory] = useState<number[]>([]);
  const [humidityHistory, setHumidityHistory] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);

  // Fetch data from the API
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:5000/read-holding-registers");
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const result = await response.json();
      setData(result);

      // Update previous values
      setPrevTemperature(data[0]);
      setPrevHumidity(data[1]);

      // Update historical data for charts
      setTemperatureHistory((prev) => {
        const newHistory = [...prev, result[0] / 10]; // Store in °C
        if (newHistory.length > 20) newHistory.shift(); // Keep only the last 20 entries
        return newHistory;
      });
      setHumidityHistory((prev) => {
        const newHistory = [...prev, result[1] / 10]; // Store in %
        if (newHistory.length > 20) newHistory.shift(); // Keep only the last 20 entries
        return newHistory;
      });
      setLabels((prev) => {
        const newLabels = [...prev, new Date().toLocaleTimeString()];
        if (newLabels.length > 20) newLabels.shift(); // Keep only the last 20 entries
        return newLabels;
      });
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const temperatureChartData = {
    labels: labels,
    datasets: [
      {
        label: 'Temperature (°C)',
        data: temperatureHistory,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
        pointRadius: 5,
        borderWidth: 2,
      },
    ],
  };

  const humidityChartData = {
    labels: labels,
    datasets: [
      {
        label: 'Humidity (%)',
        data: humidityHistory,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: true,
      },
    ],
  };

  return (
    <DashboardLayout>
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg transition-all duration-300">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800 text-center">Live Data</h1>
        <p className="text-gray-600 mb-6 text-center text-lg">
          Here you can view live data of the Temperature and Humidity sensors.
        </p>

        {loading && (
          <div className="flex items-center justify-center">
            <svg
              className="animate-spin h-12 w-12 text-blue-600"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" fill="none" strokeWidth="4" stroke="currentColor" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v5l4-4-4-4v5a8 8 0 01-8 8z" />
            </svg>
          </div>
        )}
        {error && <p className="text-red-500 text-center">Error: {error}</p>}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Temperature Card */}
            <div
              className={`p-6 md:p-8 rounded-lg shadow-lg transition-transform transform 
                ${prevTemperature !== null && data[0] > prevTemperature ? 'bg-red-300' : 'bg-blue-300'}
                hover:scale-105 hover:shadow-xl duration-300`}
            >
              <h2 className="text-xl md:text-2xl font-semibold text-blue-800">Temperature</h2>
              <p className={`text-5xl md:text-6xl font-bold text-blue-600 text-center transition-transform 
                ${prevTemperature !== null && data[0] !== prevTemperature ? 'animate-bounce' : ''}`}>
                {(data[0] / 10).toFixed(1)} °C
              </p>
            </div>

            {/* Humidity Card */}
            <div
              className={`p-6 md:p-8 rounded-lg shadow-lg transition-transform transform 
                ${prevHumidity !== null && data[1] > prevHumidity ? 'bg-yellow-300' : 'bg-green-300'}
                hover:scale-105 hover:shadow-xl duration-300`}
            >
              <h2 className="text-xl md:text-2xl font-semibold text-green-800">Humidity</h2>
              <p className={`text-5xl md:text-6xl font-bold text-green-600 text-center transition-transform 
                ${prevHumidity !== null && data[1] !== prevHumidity ? 'animate-bounce' : ''}`}>
                {(data[1] / 10).toFixed(1)} %
              </p>
            </div>
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">Temperature Over Time</h2>
          <div className="w-full h-64">
            <Line data={temperatureChartData} options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  title: { display: true, text: 'Temperature (°C)' },
                },
                x: {
                  title: { display: true, text: 'Time' },
                },
              },
            }} />
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">Humidity Over Time</h2>
          <div className="w-full h-64">
            <Line data={humidityChartData} options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  title: { display: true, text: 'Humidity (%)' },
                },
                x: {
                  title: { display: true, text: 'Time' },
                },
              },
            }} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
