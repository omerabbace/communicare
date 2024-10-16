import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import Sidebar from './Sidebar';
import '../styles/ManageProfile.css';
import { BASE_URL } from '../config';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PollManagement = () => {
  const [activePolls, setActivePolls] = useState([]);
  const [endedPolls, setEndedPolls] = useState([]);
  const [pollResults, setPollResults] = useState({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showActivePolls, setShowActivePolls] = useState(true);
  const [openPollDetails, setOpenPollDetails] = useState({}); // Track open details for each poll

  // Fetch polls from the server
  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BASE_URL}/api/polls`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setActivePolls(response.data.polls.active);
        setEndedPolls(response.data.polls.ended);
      } catch (err) {
        setError('Failed to load polls. Please try again later.');
      }
    };

    fetchPolls();
  }, []);

  // Toggle voting status
  const toggleVoteStatus = async (pollId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `${BASE_URL}/api/polls/${pollId}/disable-votes`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(response.data.message);

      // Refresh polls after status change
      setActivePolls((prevPolls) =>
        prevPolls.map((poll) =>
          poll._id === pollId ? { ...poll, disableVotes: !poll.disableVotes } : poll
        )
      );
    } catch (err) {
      setError('Failed to update voting status. Please try again.');
    }
  };

  // Toggle between showing active and ended polls
  const togglePollView = () => {
    setShowActivePolls(!showActivePolls);
  };

  // Toggle individual poll details
  const togglePollDetails = (pollId) => {
    setOpenPollDetails((prevDetails) => ({
      ...prevDetails,
      [pollId]: !prevDetails[pollId],
    }));
  };

  // Toggle showing or hiding poll results
  const toggleResultsVisibility = (pollId) => {
    if (pollResults[pollId]) {
      // Hide results if already visible
      setPollResults((prevResults) => ({
        ...prevResults,
        [pollId]: null,
      }));
    } else {
      // Fetch and show results if not visible
      viewResults(pollId);
    }
  };

  // Function to view results of a poll
  const viewResults = async (pollId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/votes/count/${pollId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPollResults((prevResults) => ({
        ...prevResults,
        [pollId]: response.data.votes,
      }));
    } catch (err) {
      setError('Failed to load poll results.');
    }
  };

  // Function to create chart data
  const getChartData = (pollId) => {
    const results = pollResults[pollId];
    if (!Array.isArray(results) || results.length === 0) {
      return {
        labels: [],
        datasets: [
          {
            label: 'Votes',
            data: [],
            backgroundColor: [],
          },
        ],
      };
    }

    return {
      labels: results.map((r) => `${r.optionText} (${r.count} votes)`), // Display option text and number of votes
      datasets: [
        {
          label: 'Votes',
          data: results.map((r) => r.count || 0), // Use count instead of votes
          backgroundColor: [
            '#ff6384', '#36a2eb', '#ffcd56', '#4bc0c0', '#9966ff', '#ff9f40'
          ],
          hoverBackgroundColor: [
            '#ff8396', '#58c3ff', '#ffe083', '#66e6d8', '#b399ff', '#ffaf69'
          ],
          borderWidth: 1,
          borderColor: '#fff',
        },
      ],
    };
  };

  // Options to customize the pie chart
  const getChartOptions = () => {
    return {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            font: {
              size: 14,
            },
            color: '#444',
          },
        },
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              return `${tooltipItem.label}`;
            },
          },
        },
      },
    };
  };

  // Periodically update poll results
  useEffect(() => {
    // Interval for fetching poll results every 5 seconds
    const interval = setInterval(() => {
      Object.keys(openPollDetails).forEach((pollId) => {
        // If poll details are open, fetch its results
        if (openPollDetails[pollId]) {
          viewResults(pollId);
        }
      });
    }, 5000); // Fetch results every 5 seconds

    // Clear the interval on component unmount
    return () => clearInterval(interval);
  }, [openPollDetails]);

  return (
    <div className="manage-profile-container">
      <Sidebar />
      <div className="main-content">
        <header className="header">
          <h1>Manage Polls</h1>
          {/* Filter Button */}
          <button className="filter-button" onClick={togglePollView}>
            {showActivePolls ? 'Show Ended Polls' : 'Show Active Polls'}
          </button>
        </header>
        <div className="profile-form-container">
          {/* Conditionally Render Polls Based on State */}
          {showActivePolls ? (
            <>
              <h2>Active Polls</h2>
              {activePolls.length > 0 ? (
                activePolls.map((poll, index) => (
                  <div key={poll._id} className="poll-card">
                    <div
                      className="poll-name"
                      onClick={() => togglePollDetails(poll._id)}
                    >
                      <strong>{index + 1}. {poll.name}</strong>
                    </div>
                    {openPollDetails[poll._id] && (
                      <div className="poll-details">
                        <p>
                          <strong>Start Date:</strong> {new Date(poll.startDate).toLocaleDateString()}
                        </p>
                        <p>
                          <strong>End Date:</strong> {new Date(poll.endDate).toLocaleDateString()}
                        </p>
                        <p>
                          <strong>Status:</strong> {poll.disableVotes ? 'Voting Disabled' : 'Voting Enabled'}
                        </p>
                        <button
                          className="custom-button"
                          onClick={() => toggleVoteStatus(poll._id)}
                          disabled={new Date(poll.endDate) < new Date()}
                        >
                          {poll.disableVotes ? 'Enable Voting' : 'Disable Voting'}
                        </button>
                        <button
                          className="view-results-button"
                          onClick={() => toggleResultsVisibility(poll._id)}
                        >
                          {pollResults[poll._id] ? 'Hide Results' : 'View Results'}
                        </button>
                        {pollResults[poll._id] && (
                          <div className="chart-container">
                            <Pie data={getChartData(poll._id)} options={getChartOptions()} />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p>No active polls available.</p>
              )}
            </>
          ) : (
            <>
              <h2>Ended Polls</h2>
              {endedPolls.length > 0 ? (
                endedPolls.map((poll, index) => (
                  <div key={poll._id} className="poll-card">
                    <div
                      className="poll-name"
                      onClick={() => togglePollDetails(poll._id)}
                    >
                      <strong>{index + 1}. {poll.name}</strong>
                    </div>
                    {openPollDetails[poll._id] && (
                      <div className="poll-details">
                        <p>
                          <strong>Start Date:</strong> {new Date(poll.startDate).toLocaleDateString()}
                        </p>
                        <p>
                          <strong>End Date:</strong> {new Date(poll.endDate).toLocaleDateString()}
                        </p>
                        <p><strong>Status:</strong> Ended</p>
                        <p><strong>Voting:</strong> {poll.disableVotes ? 'Disabled' : 'Enabled'}</p>
                        <button
                          className="custom-button view-results-button"
                          onClick={() => toggleResultsVisibility(poll._id)}
                        >
                          {pollResults[poll._id] ? 'Hide Results' : 'View Results'}
                        </button>
                        {pollResults[poll._id] && (
                          <div className="chart-container">
                            <Pie data={getChartData(poll._id)} options={getChartOptions()} />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p>No ended polls available.</p>
              )}
            </>
          )}

          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default PollManagement;
