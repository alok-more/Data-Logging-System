'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '../organization-dashboard/page';
import { supabase } from '../../supabaseClient';
import { Chart, registerables } from 'chart.js';
import { Line, Bar, Scatter } from 'react-chartjs-2';
import 'react-tooltip/dist/react-tooltip.css';

// Register all necessary components from Chart.js
Chart.register(...registerables);

function Analysis(): JSX.Element {
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

  const knnPrediction = (data: number[], k: number) => {
    if (data.length < k) return null;
    const lastKPoints = data.slice(-k);
    const predictedValue = lastKPoints.reduce((sum, value) => sum + value, 0) / k;
    return predictedValue;
  };

  const analyzeData = (data: any[]) => {
    const temperatures = data.map((log) => log.value1);
    const humidities = data.map((log) => log.value2);

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
    const knnPredictedTemperature = knnPrediction(temperatures, 3);
    const tempChange = ((temperatures[temperatures.length - 1] - temperatures[0]) / temperatures[0]) * 100;
    const humidityChange = ((humidities[humidities.length - 1] - humidities[0]) / humidities[0]) * 100;

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
      { label: 'Next Temperature Prediction (Linear)', value: linearPrediction.toFixed(2), summary: 'Predicted next temperature based on linear regression.' },
      { label: 'Next Temperature Prediction (KNN)', value: knnPredictedTemperature ? knnPredictedTemperature.toFixed(2) : 'N/A', summary: 'Predicted next temperature based on KNN model with k=3.' },
      { label: '5-Point Moving Average', value: movingAverage[movingAverage.length - 1].toFixed(2), summary: 'Smooths out short-term fluctuations.' },
      { label: 'Temperature Change (%)', value: tempChange.toFixed(2) + '%', summary: 'Percentage change in temperature from the first to the last data point.' },
      { label: 'Humidity Change (%)', value: humidityChange.toFixed(2) + '%', summary: 'Percentage change in humidity from the first to the last data point.' },
    ]);
  };

  const calculateAverage = (data: number[]) => data.reduce((sum, value) => sum + value, 0) / data.length;

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
    const x = Array.from({ length: n }, (_, i) => i);
    const y = temperatures;

    const xMean = calculateAverage(x);
    const yMean = calculateAverage(y);

    const b1 = x.reduce((acc, xi, i) => acc + (xi - xMean) * (y[i] - yMean), 0) / x.reduce((acc, xi) => acc + Math.pow(xi - xMean, 2), 0);
    const b0 = yMean - b1 * xMean;

    const nextIndex = n;
    return b0 + b1 * nextIndex;
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

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
      },
    },
    scales: {
      x: {
        ticks: { autoSkip: true, maxTicksLimit: 10 },
      },
    },
  };

  const getCardBackground = (index: number) => {
    const colors = [
      'bg-red-100 border-red-200',
      'bg-blue-100 border-blue-200',
      'bg-green-100 border-green-200',
      'bg-yellow-100 border-yellow-200',
    ];
    return colors[index % colors.length];
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4">
        <h2 className="text-xl font-semibold my-4 text-gray-700">Data Analytics and Visualization</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            <p className="text-center">Loading...</p>
          ) : (
            predictions.map((prediction, index) => (
              <div key={index} className={`rounded-md border p-4 ${getCardBackground(index)}`}>
                <h3 className="font-semibold text-gray-800">{prediction.label}</h3>
                <p className="text-xl text-gray-600">{prediction.value}</p>
                <small className="text-gray-500">{prediction.summary}</small>
              </div>
            ))
          )}
        </div>

        <div className="my-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Temperature and Humidity Trends</h3>
          <div className="h-96">
            <Line data={chartData} options={options} />
          </div>
        </div>

        <div className="my-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Average Temperature vs Humidity</h3>
          <div className="h-96">
            <Bar data={averagesData} options={options} />
          </div>
        </div>

        <div className="my-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Scatter Plot: Temperature vs Humidity</h3>
          <div className="h-96">
            <Scatter data={correlationData} options={options} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Analysis;