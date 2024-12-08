// Dashboard.js
import React, { useState, useEffect } from "react";
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
import "../styles/Dashboard.css"; // Separate CSS file for dashboard styles
import { BASE_URL } from "../config";
import Donations from "./Donations";

// import Apps from "Donation.jsx"

// Register components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
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
        ], // Example colors - customize as needed
        borderColor: "rgba(0, 0, 0, 0.1)", // Light gray border
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
          font: {
            size: 12,
          },
          color: "#6b7280",
        },
        grid: {
          display: true,
          drawBorder: false,
          color: "#e5e7eb",
        },
      },
      x: {
        type: "category",
        ticks: {
          font: {
            size: 12,
          },
          color: "#6b7280",
        },
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
        align: "end",
        labels: {
          boxWidth: 12,
          boxHeight: 12,
          font: {
            size: 14,
          },
          color: "#6b7280",
        },
      },
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/issueReporting/dashboard-data`
        );
        setDashboardData(response.data); // No need for nested structure now
      } catch (err) {
        setErrorMessage(err);
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    setLoading(false);
    if (dashboardData) {
      // Only set chart data if dashboardData is available
      setChartData({
        labels: ["Reported", "Completed", "Canceled", "In Progress"],
        datasets: [
          {
            label: "Issue Counts",
            backgroundColor: [
              "#42a5f5", // Blue
              "#66bb6a", // Green
              "#ef5350", // Red
              "#ffb74d", // Orange
            ], // Example colors - customize as needed
            borderColor: "rgba(0, 0, 0, 0.1)", // Light gray border
            borderWidth: 1,
            data: [
              dashboardData.reportedIssuesCount,
              dashboardData.completedIssuesCount,
              dashboardData.canceledIssuesCount,
              dashboardData.inProgressIssuesCount,
            ],
          },
        ],
      });
    }
  }, [dashboardData]);

  if (loading) {
    return <div className="loading-spinner"></div>;
  }

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <header className="dashboard-header">
          <h1>Welcome back, Admin 👋</h1>
          <p>Overview of issues over the last 7 days.</p>
        </header>

        {/* Dashboard Stats */}
        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Reported Issues</h3>
            <h2>{dashboardData.reportedIssuesCount}</h2>{" "}
            {/* Directly access the count */}
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

        {/* Bar chart */}
        <div className="dashboard-charts">
          <div className="chart-container">
            <h3>Weekly Issue and Accident Statistics</h3>
            {chartData && <Bar data={chartData} options={options} />}
          </div>
        </div>
        
      </div>
    </div>
  );
};


export default Dashboard;
