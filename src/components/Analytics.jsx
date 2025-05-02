import React from 'react';
import { Container } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './Analytics.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Analytics = () => {
  const data = {
    labels: [
      'Chapter 1', 'Chapter 2', 'Chapter 3', 'Chapter 4', 'Chapter 5', 
      'Chapter 6', 'Chapter 7', 'Chapter 8', 'Chapter 9', 'Chapter 10'
    ],
    datasets: [
      {
        label: 'Student Progress (%)',
        data: [75, 50, 90, 60, 85, 45, 70, 80, 55, 65],
        backgroundColor: '#00C1D4',
        borderColor: '#001B6C',
        borderWidth: 1,
        borderRadius: 6,
        hoverBackgroundColor: '#001B6C'
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#001B6C',
          font: {
            weight: 'bold'
          }
        }
      },
      title: {
        display: true,
        text: 'Student Progress by Chapter',
        color: '#001B6C',
        font: {
          size: 20,
          weight: 'bold'
        },
        padding: 20
      },
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#001B6C'
        }
      },
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(0, 193, 212, 0.1)'
        },
        ticks: {
          color: '#001B6C',
          callback: (value) => `${value}%`
        }
      },
    },
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart'
    }
  };

  return (
    <div className="analytics-container">
      <Container className="analytics-content">
        <h2 className="analytics-title">Analytics Dashboard</h2>
        <div className="chart-wrapper">
          <Bar data={data} options={options} />
        </div>
      </Container>
    </div>
  );
};

export default Analytics;