import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Layout from './Layout'; // Updated import path since they're in the same directory

const Dashboard = () => {
  // Sample data for the chart
  const data = [
    { name: 'January', issuesReported: 65, issuesResolved: 45 },
    { name: 'February', issuesReported: 59, issuesResolved: 49 },
    { name: 'March', issuesReported: 80, issuesResolved: 60 },
    { name: 'April', issuesReported: 81, issuesResolved: 71 },
    { name: 'May', issuesReported: 56, issuesResolved: 46 },
    { name: 'June', issuesReported: 55, issuesResolved: 45 }
  ];

  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Stats Cards */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Total Issues</h3>
          <p className="text-2xl font-bold text-gray-900">2,543</p>
          <p className="text-green-600 text-sm">+12.5% from last month</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Active Volunteers</h3>
          <p className="text-2xl font-bold text-gray-900">156</p>
          <p className="text-green-600 text-sm">+5.2% from last month</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Service Providers</h3>
          <p className="text-2xl font-bold text-gray-900">89</p>
          <p className="text-blue-600 text-sm">+3.1% from last month</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Resolved Issues</h3>
          <p className="text-2xl font-bold text-gray-900">1,869</p>
          <p className="text-green-600 text-sm">+18.2% from last month</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Issues Overview</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="issuesReported" fill="#8884d8" name="Issues Reported" />
                <Bar dataKey="issuesResolved" fill="#82ca9d" name="Issues Resolved" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Issues Table */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Issues</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Issue ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">#1234</td>
                  <td className="px-6 py-4 whitespace-nowrap">Infrastructure</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">#1235</td>
                  <td className="px-6 py-4 whitespace-nowrap">Community</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;