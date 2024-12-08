import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DefaultPage from './components/DefaultPage';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ProfileManage from './components/PorfileManage';
import Logout from './components/Logout';
import ProtectedRoute from './ProtectedRoute'; 
import ChangePassword from './components/ChangePassword';
import CreatePoll from './components/Poll';
import PollManagement from './components/PollManagement';
import CreateCharityProject from './components/CharityProject';
import IssuePage from './components/IssuePage';
import CharityProjects from './components/ManageCharity';
import NormalUsers from './screens/NormalUsers';
import ServiceProviders from './screens/ServiceProviders';
import Volunteers from './screens/Volunteers';
import UserForm from './components/userForm';
import VolunteerForm from './components/VolunteerForm';
import ServiceProviderForm from './components/ServiceProviderForm';
import EditUserForm from './components/EditUserForm';
import VolunteerApprovalScreen from './screens/VolunteerApprovalScreen';
import ServiceProviderApprovalScreen from './screens/ServiceProviderApprovalScreen';
import IssuesScreen from './screens/IssuesScreen';
import RejectedIssuesScreen from './screens/RejectedIssuesScreen';
import AssignedTasksScreen from './screens/AssignedTasksScreen';
import CompletedIssuesScreen from './screens/CompletedIssuesScreen';
import InProgressIssuesScreen from './screens/InProgressIssuesScreen';
import Donations from './components/Donations';
import Transactions from './components/Transactions';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DefaultPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />     
        {/* Protected */}
        <Route path="/dashboard" element={<ProtectedRoute element={Dashboard} />} />
        <Route path="/profileManage" element={<ProtectedRoute element={ProfileManage} />} />
        <Route path="/logout" element={<ProtectedRoute element={Logout} />} />
        <Route path="/ChangePassword" element={<ProtectedRoute element={ChangePassword} />} />
        <Route path="/poll" element={<ProtectedRoute element={CreatePoll} />} />
        <Route path="/pollManagement" element={<ProtectedRoute element={PollManagement} />} />
        <Route path="/charityProject" element={<ProtectedRoute element={CreateCharityProject} />} />
        <Route path="/charityProject" element={<ProtectedRoute element={CreateCharityProject} />} />
        <Route path="/issues" element={<ProtectedRoute element={IssuePage} />} />
        <Route path="/manageCharity" element={<ProtectedRoute element={CharityProjects} />} />
        <Route path="/normaluser" element={<ProtectedRoute element={NormalUsers} />} />
        <Route path="/serviceProviders" element={<ProtectedRoute element={ServiceProviders} />} />
        <Route path="/volunteers" element={<ProtectedRoute element={Volunteers} />} />
        <Route path="/UserForm" element={<ProtectedRoute element={UserForm} />} />
        <Route path="/volunteerForm" element={<ProtectedRoute element={VolunteerForm} />} />
        <Route path="/serviceproviderForm" element={<ProtectedRoute element={ServiceProviderForm} />} />
        <Route path="/edituserform" element={<ProtectedRoute element={EditUserForm} />} />
        <Route path="/serviceApprovals" element={<ProtectedRoute element={ServiceProviderApprovalScreen} />} />
        <Route path="/volunteerApprovals" element={<ProtectedRoute element={VolunteerApprovalScreen} />} />
        <Route path="/reportedissues" element={<ProtectedRoute element={IssuesScreen} />} />
        <Route path="/rejectedissues" element={<ProtectedRoute element={RejectedIssuesScreen} />} />
        <Route path="/assignedtasks" element={<ProtectedRoute element={AssignedTasksScreen} />} />
        <Route path="/completedIssues" element={<ProtectedRoute element={CompletedIssuesScreen} />} />
        <Route path="/inprogressIssues" element={<ProtectedRoute element={InProgressIssuesScreen} />} />
        <Route path='/donations' element={<Donations/>} />
        <Route path='/transactions' element={<Transactions/>} />

      </Routes>
    </Router>
  );
}

export default App;
