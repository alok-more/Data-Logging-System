'use client'

import { useEffect, useState } from 'react';
import { Line, Bar, Scatter, Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { DashboardLayout } from '../organization-dashboard/page';
import { supabase } from '../../supabaseClient';

// Register all necessary components
Chart.register(...registerables);

export function GraphVisualization() {
  const [temperatureData, setTemperatureData] = useState<number[]>([]);
  const [humidityData, setHumidityData] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [dataLimit, setDataLimit] = useState(10); // Default to show 10 data points

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('Data_Log')
        .select('*')
        .order('timestamp', { ascending: true });

      if (error) {
        console.error("Error fetching data:", error);
        return;
      }

      if (data) {
        const latestData = data.slice(-dataLimit);
        const tempData = latestData.map((log) => log.value1);
        const humidData = latestData.map((log) => log.value2);
        const timeLabels = latestData.map((log) => new Date(log.timestamp).toLocaleString());

        setTemperatureData(tempData);
        setHumidityData(humidData);
        setLabels(timeLabels);
      }
    };

    fetchData();
  }, [dataLimit]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setDataLimit(20); // Show 20 data points on larger screens
      } else {
        setDataLimit(10); // Show 10 data points on smaller screens
      }
    };

    handleResize(); // Set initial data limit
    window.addEventListener('resize', handleResize); // Add resize listener

    return () => {
      window.removeEventListener('resize', handleResize); // Cleanup listener on unmount
    };
  }, []);

  interface MovingAverageFn {
    (data: number[], windowSize: number): number[];
  }

  const movingAverage: MovingAverageFn = (data, windowSize) => {
    const result: number[] = [];
    for (let i = 0; i <= data.length - windowSize; i++) {
      const window: number[] = data.slice(i, i + windowSize);
      const average: number = window.reduce((sum, val) => sum + val, 0) / windowSize;
      result.push(average);
    }
    return result;
  };

  const movingAvgTemperature = movingAverage(temperatureData, 3);
  const movingAvgHumidity = movingAverage(humidityData, 3);

  const temperatureChartData = {
    labels: labels,
    datasets: [
      {
        label: 'Temperature (°C)',
        data: temperatureData,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
        pointRadius: 5,
        borderWidth: 2,
      },
      {
        label: 'Moving Avg Temperature',
        data: movingAvgTemperature,
        borderColor: 'rgba(255, 206, 86, 1)',
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        fill: false,
        borderWidth: 2,
      },
    ],
  };

  const humidityChartData = {
    labels: labels,
    datasets: [
      {
        label: 'Humidity (%)',
        data: humidityData,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: true,
      },
      {
        label: 'Moving Avg Humidity',
        data: movingAvgHumidity,
        borderColor: 'rgba(255, 206, 86, 1)',
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        fill: false,
        borderWidth: 2,
      },
    ],
  };

  const barChartData = {
    labels: labels,
    datasets: [
      {
        label: 'Temperature (°C)',
        data: temperatureData,
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
      {
        label: 'Humidity (%)',
        data: humidityData,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
    ],
  };

  const scatterData = {
    datasets: [
      {
        label: 'Temperature vs Humidity',
        data: labels.map((label, index) => ({
          x: temperatureData[index],
          y: humidityData[index],
        })),
        backgroundColor: 'rgba(75, 192, 192, 1)',
      },
    ],
  };

  const pieData = {
    labels: ['Average Temperature', 'Average Humidity'],
    datasets: [{
      data: [
        temperatureData.reduce((sum, val) => sum + val, 0) / temperatureData.length,
        humidityData.reduce((sum, val) => sum + val, 0) / humidityData.length,
      ],
      backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)'],
    }],
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-md mx-auto mb-6">
        <h1 className="text-2xl font-semibold mb-4 text-gray-800 text-center">Graph Visualization</h1>
        <p className="text-gray-600 text-center mb-2">Here you can visualize the graphs and charts of the temperature and humidity</p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 text-center">Temperature Over Time</h2>
        <div className="w-full h-64 overflow-x-auto">
          <Line data={temperatureChartData} options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Temperature (°C)',
                },
                ticks: {
                  stepSize: 5,
                },
              },
              x: {
                title: {
                  display: true,
                  text: 'Time',
                },
              },
            },
          }} />
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-gray-800 text-center">Humidity Over Time</h2>
        <div className="w-full h-64 overflow-x-auto">
          <Line data={humidityChartData} options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Humidity (%)',
                },
                ticks: {
                  stepSize: 5,
                },
              },
              x: {
                title: {
                  display: true,
                  text: 'Time',
                },
              },
            },
          }} />
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-gray-800 text-center">Temperature and Humidity Bar Chart</h2>
        <div className="w-full h-64 overflow-x-auto">
          <Bar data={barChartData} options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                title: { display: true, text: 'Values' },
              },
              x: {
                title: { display: true, text: 'Time' },
              },
            },
          }} />
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-gray-800 text-center">Temperature vs Humidity Scatter Plot</h2>
        <div className="w-full h-64 overflow-x-auto">
          <Scatter data={scatterData} options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                title: { display: true, text: 'Temperature (°C)' },
              },
              y: {
                title: { display: true, text: 'Humidity (%)' },
              },
            },
          }} />
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-gray-800 text-center">Average Temperature and Humidity Pie Chart</h2>
        <div className="w-full h-64 overflow-x-auto">
          <Pie data={pieData} options={{
            responsive: true,
            maintainAspectRatio: false,
          }} />
        </div>
      </div>
    </DashboardLayout>
  );
}
