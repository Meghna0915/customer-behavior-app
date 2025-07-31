import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, ArcElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, ArcElement, CategoryScale, LinearScale, Tooltip, Legend);

const ChartComponent = ({ data }) => {
  const barData = {
    labels: Object.keys(data.purchase_trends),
    datasets: [
      {
        label: 'Monthly Purchases',
        data: Object.values(data.purchase_trends),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const pieData = {
    labels: Object.keys(data.customer_segments),
    datasets: [
      {
        label: 'Customer Segments',
        data: Object.values(data.customer_segments),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#66BB6A'],
      },
    ],
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h3>Monthly Purchase Trends</h3>
        <Bar data={barData} />
      </div>
      <div>
        <h3>Customer Segments</h3>
        <Pie data={pieData} />
      </div>
    </div>
  );
};

export default ChartComponent;
