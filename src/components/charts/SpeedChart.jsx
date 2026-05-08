import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const SpeedChart = ({ history }) => {
  const data = {
    labels: history.map(h => h.time),
    datasets: [
      {
        label: 'ISS Speed (km/h)',
        data: history.map(h => h.speed),
        borderColor: '#38bdf8',
        backgroundColor: 'rgba(56, 189, 248, 0.05)',
        borderWidth: 3,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: '#38bdf8',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index',
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(2, 6, 23, 0.9)',
        titleColor: '#38bdf8',
        titleFont: { weight: 'bold', size: 12 },
        bodyColor: '#fff',
        bodyFont: { size: 12 },
        padding: 12,
        borderColor: 'rgba(56, 189, 248, 0.3)',
        borderWidth: 1,
        displayColors: false,
        callbacks: {
          label: (context) => `Velocity: ${Math.round(context.raw).toLocaleString()} km/h`
        }
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
        ticks: {
          color: '#475569',
          font: { size: 9 },
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 5,
        },
      },
      y: {
        position: 'right',
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
          drawBorder: false,
        },
        ticks: {
          color: '#64748b',
          font: { size: 10, weight: 'bold' },
          callback: (value) => `${(value / 1000).toFixed(1)}k`,
        },
        min: 27000,
        max: 28500,
      },
    },
  };

  return (
    <div className="glass-card p-6 h-72 border border-slate-700/50 shadow-xl group">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-black text-slate-200 uppercase tracking-tight text-sm">Velocity History</h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Real-time Telemetry (km/h)</p>
        </div>
        <div className="w-2 h-2 bg-neon-blue rounded-full animate-pulse shadow-[0_0_8px_rgba(56,189,248,0.5)]"></div>
      </div>
      <div className="h-44">
        {history.length > 0 ? (
          <Line data={data} options={options} />
        ) : (
          <div className="h-full flex items-center justify-center text-slate-600 text-xs italic font-medium">
            Synchronizing data streams...
          </div>
        )}
      </div>
    </div>
  );
};

export default SpeedChart;
