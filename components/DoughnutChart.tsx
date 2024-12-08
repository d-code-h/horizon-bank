'use client';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Register ChartJS components for the doughnut chart
ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({ accounts }: DoughnutChartProps) => {
  // Extract account names and balances from the accounts prop
  const accountNames = accounts.map((a) => a.name);
  const balances = accounts.map((a) => a.currentBalance);

  // Define the data for the doughnut chart
  const data = {
    datasets: [
      {
        label: 'Banks', // Label for the dataset
        data: balances, // Chart data (balances)
        backgroundColor: ['#0747b6', '#2265d8', '#2f91fa'], // Background colors for each segment
      },
    ],
    labels: accountNames, // Labels for each segment (account names)
  };

  return (
    <Doughnut
      data={data} // Pass chart data
      options={{
        cutout: '60%', // Define the cutout percentage (creates the doughnut shape)
        plugins: {
          legend: {
            display: false, // Hide the legend
          },
        },
      }}
    />
  );
};

export default DoughnutChart;
