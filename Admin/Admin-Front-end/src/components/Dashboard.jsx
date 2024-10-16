// import React from 'react';
// import '../styles/Dashboard.css'; 
// import { Link } from 'react-router-dom';
// import Sidebar from './Sidebar';
// const Dashboard = () => {
//   return (
//     <div className="dashboard-container">
//       {/* Sidebar */}
//       <Sidebar />


//       {/* Main Content Area */}
//       <div className="main-content">
//         {/* Header */}
//         <header className="header">
//           <h1>Dashboard</h1>
//           <div className="header-buttons">
//             <button className="custom-button">Add New</button>
//             <button className="custom-button">Manage</button>
//           </div>
//         </header>

//         {/* Dashboard Content */}
//         <div className="content-grid">
//           <div className="card">
//             <h3>Users</h3>
//             <p>Manage user accounts, view stats, and more.</p>
//             <button className="custom-button">View Users</button>
//           </div>
//           <div className="card">
//             <h3>Reports</h3>
//             <p>View system reports and logs.</p>
//             <button className="custom-button">View Reports</button>
//           </div>
//           <div className="card">
//             <h3>Settings</h3>
//             <p>Adjust system settings.</p>
//             <button className="custom-button">View Settings</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

// Dashboard.js
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Sidebar from './Sidebar';
import '../styles/Dashboard.css'; // Separate CSS file for dashboard styles

// Register components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  // Data for the static bar chart
  const data = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    datasets: [
      {
        label: 'Reported Accidents',
        backgroundColor: '#ef5350', // Red color for reported accidents
        borderColor: '#c62828',
        borderWidth: 1,
        hoverBackgroundColor: '#e57373',
        hoverBorderColor: '#b71c1c',
        data: [150, 200, 170, 250, 220, 180, 300], // Example data
      },
      {
        label: 'Issue Reporting',
        backgroundColor: '#42a5f5', // Blue color for issue reporting
        borderColor: '#1976d2',
        borderWidth: 1,
        hoverBackgroundColor: '#64b5f6',
        hoverBorderColor: '#1565c0',
        data: [100, 120, 150, 170, 160, 180, 200], // Example data
      },
      {
        label: 'Solved Issues',
        backgroundColor: '#66bb6a', // Green color for solved issues
        borderColor: '#2e7d32',
        borderWidth: 1,
        hoverBackgroundColor: '#81c784',
        hoverBorderColor: '#1b5e20',
        data: [80, 100, 120, 150, 130, 160, 190], // Example data
      },
      {
        label: 'Pending Issues',
        backgroundColor: '#ffb74d', // Orange color for pending issues
        borderColor: '#ef6c00',
        borderWidth: 1,
        hoverBackgroundColor: '#ffcc80',
        hoverBorderColor: '#e65100',
        data: [70, 80, 60, 90, 100, 110, 130], // Example data
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 50,
          font: {
            size: 12,
          },
          color: '#6b7280',
        },
        grid: {
          display: true,
          drawBorder: false,
          color: '#e5e7eb',
        },
      },
      x: {
        type: 'category',
        ticks: {
          font: {
            size: 12,
          },
          color: '#6b7280',
        },
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        align: 'end',
        labels: {
          boxWidth: 12,
          boxHeight: 12,
          font: {
            size: 14,
          },
          color: '#6b7280',
        },
      },
    },
  };
  
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <header className="dashboard-header">
          <h1>Welcome back, Admin 👋</h1>
          <p>Overview of accident reports, issues, and donations over the last 7 days.</p>
        </header>

        {/* Dashboard Stats */}
        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Total Reported Accidents</h3>
            <h2>1,520 <span>+20.5%</span></h2>
            <p>Number of accidents reported in the last 7 days.</p>
          </div>
          <div className="stat-card">
            <h3>Issue Reporting</h3>
            <h2>980 <span>+15.7%</span></h2>
            <p>Issues reported by users over the last 7 days.</p>
          </div>
          <div className="stat-card">
            <h3>Solved Issues</h3>
            <h2>780 <span>+10.4%</span></h2>
            <p>Total number of issues resolved in the past week.</p>
          </div>
          <div className="stat-card">
            <h3>Total Donations</h3>
            <h2>12,3453 <span>+25.8%</span></h2>
            <p>Donations collected for all charity projects this week.</p>
          </div>
        </div>

        {/* Bar chart */}
        <div className="dashboard-charts">
          <div className="chart-container">
            <h3>Weekly Issue and Accident Statistics</h3>
            <Bar data={data} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
