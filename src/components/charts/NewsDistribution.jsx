import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const NewsDistribution = ({ news }) => {
  // Extract categories or sources for the chart
  const sourceCounts = news.reduce((acc, article) => {
    const source = article.source_id || 'Unknown';
    acc[source] = (acc[source] || 0) + 1;
    return acc;
  }, {});

  const data = {
    labels: Object.keys(sourceCounts),
    datasets: [
      {
        data: Object.values(sourceCounts),
        backgroundColor: [
          '#38bdf8', // neon-blue
          '#818cf8', // neon-purple
          '#f472b6', // neon-pink
          '#4ade80', // neon-green
          '#fbbf24', // amber
          '#2dd4bf', // teal
        ],
        borderColor: 'rgba(2, 6, 23, 0.5)',
        borderWidth: 2,
        hoverOffset: 10,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#94a3b8',
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 15,
          font: { size: 11 },
        },
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#38bdf8',
        bodyColor: '#e2e8f0',
        padding: 10,
        cornerRadius: 8,
      },
    },
    cutout: '70%',
  };

  return (
    <div className="glass-card p-6 h-64">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-300">News Sources</h3>
        <span className="text-xs text-slate-500">Distribution</span>
      </div>
      <div className="h-44">
        {news.length > 0 ? (
          <Doughnut data={data} options={options} />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-500 text-sm italic">
            No data available
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsDistribution;
