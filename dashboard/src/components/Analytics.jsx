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
  ArcElement,
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Analytics = ({ incidents }) => {
  // Severity Distribution Data
  const severityCounts = incidents.reduce((acc, incident) => {
    acc[incident.severity] = (acc[incident.severity] || 0) + 1;
    return acc;
  }, {});

  const pieData = {
    labels: ['High', 'Medium', 'Low'],
    datasets: [
      {
        data: [severityCounts.high || 0, severityCounts.medium || 0, severityCounts.low || 0],
        backgroundColor: ['#ef4444', '#f59e0b', '#3b82f6'],
        borderColor: ['#000', '#000', '#000'],
        borderWidth: 1,
      },
    ],
  };

  // Daily Accidents Logic (Last 7 days)
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  const dailyCounts = last7Days.map(date => {
    return incidents.filter(inc => (inc.timestamp || inc.createdAt || '').startsWith(date)).length;
  });

  const lineData = {
    labels: last7Days.map(d => d.split('-').slice(1).join('/')),
    datasets: [
      {
        label: 'Accidents',
        data: dailyCounts,
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#94a3b8', font: { family: 'Inter' } }
      },
    },
    scales: {
      y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
      x: { ticks: { color: '#94a3b8' }, grid: { display: false } },
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', height: '100%' }}>
      <div className="card glass" style={{ padding: '20px', borderRadius: '16px' }}>
        <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>Daily Accident Trends</h3>
        <div style={{ height: '240px' }}>
          <Line data={lineData} options={chartOptions} />
        </div>
      </div>
      <div className="card glass" style={{ padding: '20px', borderRadius: '16px' }}>
        <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>Severity Distribution</h3>
        <div style={{ height: '240px' }}>
          <Pie data={pieData} options={{ ...chartOptions, scales: { x: { display: false }, y: { display: false } } }} />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
