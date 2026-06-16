import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Loading from './components/Loading';
import Dashboard from './pages/Dashboard';
import Dashboards from './pages/Dashboards';
import Events from './pages/Events';
import Agents from './pages/Agents';
import AgentDetail from './pages/AgentDetail';
import Groups from './pages/Groups';
import Settings from './pages/Settings';
import Rules from './pages/Rules';

import Reporting from './pages/Reporting';
import Alerting from './pages/Alerting';
import AnomalyDetection from './pages/AnomalyDetection';
import ItHygiene from './pages/ItHygiene';
import Maps from './pages/Maps';
import Notifications from './pages/Notifications';
import ConfigurationAssessment from './pages/ConfigurationAssessment';
import FileIntegrityMonitoring from './pages/FileIntegrityMonitoring';
import MalwareDetection from './pages/MalwareDetection';
import VulnerabilityDetection from './pages/VulnerabilityDetection';
import MitreAttack from './pages/MitreAttack';
import ThreatHunting from './pages/ThreatHunting';
import Visualize from './pages/Visualize';
import PciDss from './pages/PciDss';
import Gdpr from './pages/Gdpr';
import Hipaa from './pages/Hipaa';
import Nist80053 from './pages/Nist80053';
import Tsc from './pages/Tsc';
import Docker from './pages/Docker';
import Aws from './pages/Aws';
import Gcp from './pages/Gcp';
import Github from './pages/Github';
import O365 from './pages/O365';
import MsGraph from './pages/MsGraph';
import { Toaster } from 'react-hot-toast';
import './index.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleLogin = (user: string) => {
    setIsLoading(true);
    setIsLoggedIn(true);
    setUsername(user);

    // Simulate loading screen delay (matching laoding.png transition)
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Router>
      <Toaster position="top-right" />
      <div className="wz-app-layout">
        <Navbar
          onToggleSidebar={toggleSidebar}
          onLogout={handleLogout}
          username={username || 'admin'}
        />
        <div className="wz-main-container">
          <Sidebar collapsed={sidebarCollapsed} />
          <div
            className="wz-content"
            style={{
              flex: 1,
              marginLeft: sidebarCollapsed ? '0px' : '260px',
              minHeight: 'calc(100vh - 48px)',
              transition: 'margin-left 0.25s ease-in-out',
              width: sidebarCollapsed ? '100%' : 'calc(100% - 260px)'
            }}
          >
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboards" element={<Dashboards />} />
              <Route path="/events" element={<Events />} />
              <Route path="/agents" element={<Agents />} />
              <Route path="/agents/detail" element={<AgentDetail />} />
              <Route path="/groups" element={<Groups />} />
              <Route path="/groups/:groupId" element={<Groups />} />
              <Route path="/groups/:groupId/:action" element={<Groups />} />
              <Route path="/rules" element={<Rules />} />
              <Route path="/settings" element={<Settings />} />

              <Route path="/reporting" element={<Reporting />} />
              <Route path="/alerting" element={<Alerting />} />
              <Route path="/anomaly-detection" element={<AnomalyDetection />} />
              <Route path="/hygiene" element={<ItHygiene />} />
              <Route path="/pci" element={<PciDss />} />
              <Route path="/gdpr" element={<Gdpr />} />
              <Route path="/hipaa" element={<Hipaa />} />
              <Route path="/nist" element={<Nist80053 />} />
              <Route path="/tsc" element={<Tsc />} />
              <Route path="/docker" element={<Docker />} />
              <Route path="/aws" element={<Aws />} />
              <Route path="/gcp" element={<Gcp />} />
              <Route path="/github" element={<Github />} />
              <Route path="/o365" element={<O365 />} />
              <Route path="/msgraph" element={<MsGraph />} />
              <Route path="/maps" element={<Maps />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/sca" element={<ConfigurationAssessment />} />
              <Route path="/fim" element={<FileIntegrityMonitoring />} />
              <Route path="/malware" element={<MalwareDetection />} />
              <Route path="/vulnerabilities" element={<VulnerabilityDetection />} />
              <Route path="/hunting" element={<ThreatHunting />} />
              <Route path="/mitre" element={<MitreAttack />} />
              <Route path="/visualize" element={<Visualize />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
