import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ChartComponent from './ChartComponent';

const Dashboard = () => {
  const [analysisData, setAnalysisData] = useState(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/analyze', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAnalysisData(response.data);
      } catch (error) {
        console.error('Error fetching analysis:', error);
      }
    };

    fetchAnalysis();
  }, []);

  if (!analysisData) {
    return <p>Loading data...</p>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Customer Behavior Dashboard</h2>
      <ChartComponent data={analysisData} />
    </div>
  );
};

export default Dashboard;
