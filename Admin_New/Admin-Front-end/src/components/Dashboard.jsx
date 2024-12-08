// import Sidebar from './Sidebar';
// import '../styles/Dashboard.css'; // Updated CSS file
// import { Fragment } from 'react';

// const Dashboard = () => {
//   return (
//     <Fragment>
//       <div className="dashboard-container">
//         <Sidebar />
//         <div className="content">
//           {/* Header */}
//           <div className="header">
//             <h2>Dashboard</h2>
//           </div>

//           {/* Counters Section */}
//           <div className="dashboard-section">
//             <div className="counter-group">

//               <div className="counter-card">
//                 <div className="circle-chart blue" style={{ '--percentage': '68' }}></div>
//                 <div className="counter-content">
//                   <h3>Normal Users</h3>
//                   <p>68% Active</p>
//                 </div>
//               </div>
//               <div className="counter-card">
//                 <div className="circle-chart orange" style={{ '--percentage': '25' }}></div>
//                 <div className="counter-content">
//                   <h3>Volunteers</h3>
//                   <p>25% Active</p>
//                 </div>
//               </div>
//               <div className="counter-card">
//                 <div className="circle-chart purple" style={{ '--percentage': '17' }}></div>
//                 <div className="counter-content">
//                   <h3>Service Providers</h3>
//                   <p>17% Active</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//         </div>
//       </div>
//     </Fragment>
//   );
// };

// export default Dashboard;

/////////////////////// new Function ///////////////////////

// import React from 'react';
// import { Pie, Bar } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   ArcElement,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';
// import Sidebar from './Sidebar';

// import '../styles/Dashboard.css'; // Ensure correct path to your CSS file

// // Register ChartJS components
// ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// const Dashboard = () => {
//   const userRolesData = {
//     labels: ['Normal Users', 'Volunteers', 'Service Providers'],
//     datasets: [
//       {
//         data: [65, 20, 15],
//         backgroundColor: ['#4CAF50', '#2196F3', '#FFC107'],
//       },
//     ],
//   };

//   const registrationData = {
//     labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
//     datasets: [
//       {
//         label: 'Volunteers',
//         data: [12, 19, 15, 25, 22, 30],
//         backgroundColor: '#2196F3',
//       },
//       {
//         label: 'Service Providers',
//         data: [8, 15, 12, 18, 20, 25],
//         backgroundColor: '#FFC107',
//       },
//     ],
//   };

//   const chartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: { position: 'bottom' },
//     },
//   };

//   return (
//     <div className="dashboard-layout">

//       <div className="dashboard-main">
//         <Sidebar /> {/* Fixed Sidebar */}
//         <div className="dashboard-content">
//           {/* Pie Chart Section */}
//           <div className="dashboard-section">
//             <h2>User Role Distribution</h2>
//             <div className="chart-container">
//               <Pie data={userRolesData} options={chartOptions} />
//             </div>
//           </div>

//           {/* Bar Chart Section */}
//           <div className="dashboard-section">
//             <h2>Monthly Registrations</h2>
//             <div className="chart-container">
//               <Bar data={registrationData} options={chartOptions} />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Sidebar from "./Sidebar";
import "../styles/Dashboard.css";
import { BASE_URL } from "../config";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [donations, setDonations] = useState([]);
  const [servicePayments, setServicePayments] = useState([]);
  const [dashboardData, setDashboardData] = useState({
    reportedIssuesCount: 0,
    completedIssuesCount: 0,
    canceledIssuesCount: 0,
    inProgressIssuesCount: 0,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState({
    labels: ["Reported", "Completed", "Canceled", "In Progress"],
    datasets: [
      {
        label: "Issue Counts",
        backgroundColor: [
          "#42a5f5", // Blue
          "#66bb6a", // Green
          "#ef5350", // Red
          "#ffb74d", // Orange
        ],
        borderColor: "rgba(0, 0, 0, 0.1)",
        borderWidth: 1,
        data: [0, 0, 0, 0],
      },
    ],
  });

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 50,
          font: { size: 12 },
          color: "#6b7280",
        },
        grid: { color: "#e5e7eb" },
      },
      x: {
        ticks: { font: { size: 12 }, color: "#6b7280" },
        grid: { display: false },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: { font: { size: 14 }, color: "#6b7280" },
      },
    },
  };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get(
  //         `${BASE_URL}/api/issueReporting/dashboard-data`
  //       );
  //       setDashboardData(response.data);
  //     } catch (err) {
  //       setErrorMessage("Failed to fetch dashboard data.");
  //       console.error(err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashboardResponse = await axios.get(
          `${BASE_URL}/api/issueReporting/dashboard-data`
        );
        setDashboardData(dashboardResponse.data);

        const donationsResponse = await axios.get(
          `${BASE_URL}/api/donations/donation-summaries`
        );
        setDonations(donationsResponse.data.data);

        const servicePaymentResponse = await axios.get(
          `${BASE_URL}/api/payments/all`
        );
        setServicePayments(servicePaymentResponse.data.data);
      } catch (err) {
        setErrorMessage("Failed to fetch data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setChartData({
      labels: ["Reported", "Completed", "Canceled", "In Progress"],
      datasets: [
        {
          label: "Issue Counts",
          backgroundColor: ["#42a5f5", "#66bb6a", "#ef5350", "#ffb74d"],
          data: [
            dashboardData.reportedIssuesCount,
            dashboardData.completedIssuesCount,
            dashboardData.canceledIssuesCount,
            dashboardData.inProgressIssuesCount,
          ],
        },
      ],
    });
  }, [dashboardData]);

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <Fragment>
      <div className="dashboard-container">
        <Sidebar />
        <div className="content">
          {/* Header */}
          <div className="header">
            <h2>Dashboard</h2>
          </div>

          {/* Stats Section */}
          <div className="dashboard-stats">
            <div className="stat-card">
              <h3>Reported Issues</h3>
              <h2>{dashboardData.reportedIssuesCount}</h2>
            </div>
            <div className="stat-card">
              <h3>Completed Issues</h3>
              <h2>{dashboardData.completedIssuesCount}</h2>
            </div>
            <div className="stat-card">
              <h3>Canceled Issues</h3>
              <h2>{dashboardData.canceledIssuesCount}</h2>
            </div>
            <div className="stat-card">
              <h3>In Progress Issues</h3>
              <h2>{dashboardData.inProgressIssuesCount}</h2>
            </div>
          </div>

          {/* Chart Section */}
          <div className="dashboard-charts">
            <div className="chart-container-dashboard">
              <h3>Weekly Issue and Accident Statistics</h3>
              <Bar data={chartData} options={options} />
            </div>
          </div>

          <br />
          <br />
          <br />
          <br />
          <div className="dashboard-charts-donations">
            <div className="chart-container-donations">
              <h3>Donations</h3>
              <div className="scrollable-donations">
                <table className="donations-table">
                  <thead>
                    <tr>
                      <th>Project</th>
                      <th>Amount</th>
                      <th>User</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donations.map((donation) => (
                      <tr key={donation._id} className="donation-item">
                        <td>{donation.projectId.title}</td>
                        <td>{donation.amount}</td>
                        <td>
                          {donation.userId ? donation.userId.name : "Anonymous"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <br />
          <br />
          <br />
          <br />

          <div className="dashboard-charts">
            <div className="chart-container-dashboard">
              <h3>Service Payments</h3>
              <div className="scrollable-payments">
                <table className="payments-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Service Provider</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Payment Method</th>
                    </tr>
                  </thead>
                  <tbody>
                    {servicePayments.map((payment) => (
                      <tr key={payment._id} className="payment-item">
                        <td>{payment.userId ? payment.userId.name : "N/A"}</td>
                        <td>
                          {payment.serviceProviderId
                            ? payment.serviceProviderId.name
                            : "N/A"}
                        </td>
                        <td>
                          {payment.amount} {payment.currency}
                        </td>
                        <td
                          className={`payment-status ${payment.status.toLowerCase()}`}
                        >
                          {payment.status}
                        </td>
                        <td>
                          {payment.paymentMethod
                            ? payment.paymentMethod
                            : "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Dashboard;
