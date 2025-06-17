
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import DashboardLayout from '../employee-dashboard/page';
import { Chart, registerables } from 'chart.js';
import { Line, Bar, Scatter } from 'react-chartjs-2';
import 'react-tooltip/dist/react-tooltip.css';

// Register all necessary components from Chart.js
Chart.register(...registerables);

export function AnalysisOperator() {
    const [data, setData] = useState<any[]>([]);
    const [predictions, setPredictions] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
  
    useEffect(() => {
      const fetchData = async () => {
        const { data, error } = await supabase
          .from('Data_Log')
          .select('*')
          .order('timestamp', { ascending: true });
  
        if (error) {
          console.error("Error fetching data:", error);
          setLoading(false);
          return;
        }
  
        if (data) {
          setData(data);
          analyzeData(data);
        }
        setLoading(false);
      };
  
      fetchData();
    }, []);
  
    const analyzeData = (data: any[]) => {
      const temperatures = data.map((log) => log.value1);
      const humidities = data.map((log) => log.value2);
  
      // Calculating metrics
      const averageTemperature = calculateAverage(temperatures);
      const averageHumidity = calculateAverage(humidities);
      const minTemperature = Math.min(...temperatures);
      const maxTemperature = Math.max(...temperatures);
      const minHumidity = Math.min(...humidities);
      const maxHumidity = Math.max(...humidities);
      const tempStandardDeviation = calculateStandardDeviation(temperatures);
      const humidStandardDeviation = calculateStandardDeviation(humidities);
      const correlation = calculateCorrelation(temperatures, humidities);
      const movingAverage = calculateMovingAverage(temperatures, 5);
      const linearPrediction = linearRegressionPrediction(temperatures);
      const tempChange = ((temperatures[temperatures.length - 1] - temperatures[0]) / temperatures[0]) * 100;
      const humidityChange = ((humidities[humidities.length - 1] - humidities[0]) / humidities[0]) * 100;
  
      // Setting predictions
      setPredictions([
        { label: 'Average Temperature', value: averageTemperature.toFixed(2), summary: 'Mean temperature over the data period.' },
        { label: 'Average Humidity', value: averageHumidity.toFixed(2), summary: 'Mean humidity over the data period.' },
        { label: 'Min Temperature', value: minTemperature.toFixed(2), summary: 'Lowest recorded temperature.' },
        { label: 'Max Temperature', value: maxTemperature.toFixed(2), summary: 'Highest recorded temperature.' },
        { label: 'Min Humidity', value: minHumidity.toFixed(2), summary: 'Lowest recorded humidity.' },
        { label: 'Max Humidity', value: maxHumidity.toFixed(2), summary: 'Highest recorded humidity.' },
        { label: 'Temperature Standard Deviation', value: tempStandardDeviation.toFixed(2), summary: 'Variation of temperature from the average.' },
        { label: 'Humidity Standard Deviation', value: humidStandardDeviation.toFixed(2), summary: 'Variation of humidity from the average.' },
        { label: 'Correlation', value: correlation.toFixed(2), summary: 'Relationship between temperature and humidity.' },
        { label: 'Next Temperature Prediction', value: linearPrediction.toFixed(2), summary: 'Predicted next temperature based on linear regression.' },
        { label: '5-Point Moving Average', value: movingAverage[movingAverage.length - 1].toFixed(2), summary: 'Smooths out short-term fluctuations.' },
        { label: 'Temperature Change (%)', value: tempChange.toFixed(2) + '%', summary: 'Percentage change in temperature from the first to the last data point.' },
        { label: 'Humidity Change (%)', value: humidityChange.toFixed(2) + '%', summary: 'Percentage change in humidity from the first to the last data point.' },
      ]);
    };
  
    const calculateAverage = (data: number[]) => {
      return data.reduce((sum, value) => sum + value, 0) / data.length;
    };
  
    const calculateStandardDeviation = (data: number[]) => {
      const mean = calculateAverage(data);
      const squaredDiffs = data.map(value => Math.pow(value - mean, 2));
      return Math.sqrt(calculateAverage(squaredDiffs));
    };
  
    const calculateCorrelation = (data1: number[], data2: number[]) => {
      const mean1 = calculateAverage(data1);
      const mean2 = calculateAverage(data2);
      const numerator = data1.reduce((acc, value, index) => acc + (value - mean1) * (data2[index] - mean2), 0);
      const denominator = Math.sqrt(data1.reduce((acc, value) => acc + Math.pow(value - mean1, 2), 0) * data2.reduce((acc, value) => acc + Math.pow(value - mean2, 2), 0));
      return denominator === 0 ? 0 : numerator / denominator;
    };
  
    const calculateMovingAverage = (data: number[], windowSize: number) => {
      const result = [];
      for (let i = 0; i <= data.length - windowSize; i++) {
        const window = data.slice(i, i + windowSize);
        const average = calculateAverage(window);
        result.push(average);
      }
      return result;
    };
  
    const linearRegressionPrediction = (temperatures: number[]) => {
      const n = temperatures.length;
      const x = Array.from({ length: n }, (_, i) => i); // x values as index
      const y = temperatures;
  
      const xMean = calculateAverage(x);
      const yMean = calculateAverage(y);
  
      const b1 = x.reduce((acc, xi, i) => acc + (xi - xMean) * (y[i] - yMean), 0) / x.reduce((acc, xi) => acc + Math.pow(xi - xMean, 2), 0);
      const b0 = yMean - b1 * xMean;
  
      const nextIndex = n; // Predict for the next index
      return b0 + b1 * nextIndex; // y = b0 + b1 * x
    };
  
    const chartData = {
      labels: data.map((log) => new Date(log.timestamp).toLocaleString()),
      datasets: [
        {
          label: 'Temperature (°C)',
          data: data.map((log) => log.value1),
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          fill: true,
        },
        {
          label: 'Humidity (%)',
          data: data.map((log) => log.value2),
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          fill: true,
        },
        {
          label: '5-Point Moving Average (Temperature)',
          data: calculateMovingAverage(data.map(log => log.value1), 5),
          borderColor: 'rgba(255, 206, 86, 1)',
          backgroundColor: 'rgba(255, 206, 86, 0.2)',
          fill: true,
        }
      ],
    };
  
    const averagesData = {
      labels: ['Average Temperature', 'Average Humidity'],
      datasets: [{
        label: 'Averages',
        data: [calculateAverage(data.map(log => log.value1)), calculateAverage(data.map(log => log.value2))],
        backgroundColor: ['rgba(255, 99, 132, 0.5)', 'rgba(54, 162, 235, 0.5)'],
      }]
    };
  
    const correlationData = {
      datasets: [{
        label: 'Temperature vs Humidity',
        data: data.map((log) => ({
          x: log.value1,
          y: log.value2
        })),
        backgroundColor: 'rgba(255, 206, 86, 1)',
      }]
    };
  
    const getCardBackground = (index) => {
      const colors = [
        'bg-red-100 border-red-200',
        'bg-blue-100 border-blue-200',
        'bg-green-100 border-green-200',
        'bg-yellow-100 border-yellow-200',
        'bg-purple-100 border-purple-200',
        'bg-pink-100 border-pink-200',
      ];
      return colors[index % colors.length];
    };
    
    const getIconClass = (label) => {
      const icons = {
        'Average Temperature': 'fas fa-thermometer-half text-red-500',
        'Average Humidity': 'fas fa-tint text-blue-500',
        'Min Temperature': 'fas fa-arrow-down text-green-500',
        'Max Temperature': 'fas fa-arrow-up text-orange-500',
        'Min Humidity': 'fas fa-tint text-blue-400',
        'Max Humidity': 'fas fa-tint text-orange-400',
        'Temperature Standard Deviation': 'fas fa-chart-line text-purple-500',
        'Humidity Standard Deviation': 'fas fa-chart-bar text-pink-500',
        'Correlation': 'fas fa-sync text-yellow-500',
        'Next Temperature Prediction': 'fas fa-chart-line text-teal-500',
        '5-Point Moving Average': 'fas fa-chart-area text-indigo-500',
        'Temperature Change (%)': 'fas fa-percent text-blue-600',
        'Humidity Change (%)': 'fas fa-percent text-blue-600',
      };
      return icons[label] || 'fas fa-info-circle text-gray-500';
    };
    
  
    return (
      <DashboardLayout>
        <div className="p-6 md:p-8 rounded-lg shadow-md flex flex-col items-center bg-gradient-to-r from-gray-50 to-gray-100">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900">Analysis & Predications</h1>
          <p className="text-gray-600 mb-4 text-center">Analyze and visualize data and get predictions here</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
          {loading ? (
            <p className="text-gray-600">Loading data...</p>
          ) : (
            predictions.map((prediction, index) => (
              <div key={index} className={`p-4 rounded-lg shadow-lg text-gray-700 transition-transform duration-300 hover:scale-105 ${getCardBackground(index)}`}>
                <div className="flex items-center">
                  <span className={`text-2xl mr-2 ${getIconClass(prediction.label)}`}></span>
                  <h3 className="text-lg font-bold">{prediction.label}</h3>
                </div>
                <p className="text-xl text-gray-800">{prediction.value}</p>
                <p className="text-gray-600">{prediction.summary}</p>
              </div>
            ))
          )}
        </div>
  
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Data Visualization</h2>
          <div className="w-full h-64 mb-6">
            <Line data={chartData} options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                tooltip: {
                  callbacks: {
                    label: (context) => {
                      return `${context.dataset.label}: ${context.parsed.y}`;
                    }
                  }
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Values',
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
  
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Average Temperature and Humidity</h2>
          <div className="w-full h-64 mb-6">
            <Bar data={averagesData} options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                tooltip: {
                  callbacks: {
                    label: (context) => {
                      return `${context.dataset.label}: ${context.parsed.y}`;
                    }
                  }
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }} />
          </div>
  
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Temperature vs Humidity Correlation</h2>
          <div className="w-full h-64 mb-6">
            <Scatter data={correlationData} options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                tooltip: {
                  callbacks: {
                    label: (context) => {
                      return `Temp: ${context.parsed.x}°C, Humidity: ${context.parsed.y}%`;
                    }
                  }
                }
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: 'Temperature (°C)',
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: 'Humidity (%)',
                  },
                },
              },
            }} />
          </div>
        </div>
      </DashboardLayout>
    );
  }
  