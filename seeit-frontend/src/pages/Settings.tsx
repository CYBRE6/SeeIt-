import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  FiRefreshCw, FiServer, FiCpu, FiHardDrive, FiActivity, FiSettings,
  FiTerminal, FiLock, FiDatabase, FiAlertTriangle, FiInfo, FiEdit2,
  FiSearch, FiMaximize2, FiDownload, FiChevronLeft, FiHelpCircle, FiTrash2, FiPlus, FiChevronDown
} from 'react-icons/fi';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, Title as ChartTitle, Tooltip, Legend, ArcElement, Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import toast from 'react-hot-toast';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ChartTitle, Tooltip, Legend, ArcElement, Filler);

const Settings: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const tab = searchParams.get('tab') || 'status';

  // Sub-tabs for Statistics
  const [statsTab, setStatsTab] = useState<'listener' | 'analysis'>('listener');

  // Logs States
  const [logSearch, setLogSearch] = useState('');
  const [descendingSort, setDescendingSort] = useState(false);
  const [realtime, setRealtime] = useState(false);

  // Configuration States
  const [selectedConfig, setSelectedConfig] = useState<string | null>(null);
  const [globalSubTab, setGlobalSubTab] = useState<'global' | 'remote'>('global');
  const [alertsSubTab, setAlertsSubTab] = useState<'general' | 'labels' | 'email' | 'reports' | 'syslog'>('general');
  const [policySubTab, setPolicySubTab] = useState<'general' | 'audit' | 'ignored' | 'sca'>('general');
  const [openScapSubTab, setOpenScapSubTab] = useState<'general' | 'evaluations'>('general');
  const [cisCatSubTab, setCisCatSubTab] = useState<'general' | 'benchmarks'>('general');
  const [activeResponseSubTab, setActiveResponseSubTab] = useState<'active_response' | 'commands'>('active_response');
  const [activeResponseSelectedCommand, setActiveResponseSelectedCommand] = useState<string>('disable-account');
  const [logCollectionSubTab, setLogCollectionSubTab] = useState<'logs' | 'journald' | 'commands' | 'sockets'>('logs');
  const [logCollectionSelectedFile, setLogCollectionSelectedFile] = useState<string>('/var/log/nginx/access.log');
  const [logCollectionSelectedCommand, setLogCollectionSelectedCommand] = useState<string>('df -P');
  const [integrityMonitoringSubTab, setIntegrityMonitoringSubTab] = useState<'general' | 'monitored' | 'ignored' | 'nodiff' | 'whodata' | 'synchronization' | 'fileslimit'>('general');
  const [integrityMonitoringSelectedDir, setIntegrityMonitoringSelectedDir] = useState<string>('/bin');
  const [amazonS3SubTab, setAmazonS3SubTab] = useState<'general' | 'buckets' | 'services'>('general');
  const [devToolsTab, setDevToolsTab] = useState<'console' | 'api_reference'>('console');
  const [devToolsConsoleInput, setDevToolsConsoleInput] = useState<string>(
`GET _search
{
  "query": {
    "match_all": {}
  }
}`
  );
  const [devToolsConsoleOutput, setDevToolsConsoleOutput] = useState<string>('');
  const [devToolsShowWelcome, setDevToolsShowWelcome] = useState<boolean>(true);
  const [githubSubTab, setGithubSubTab] = useState<'general' | 'credentials'>('general');
  const [office365SubTab, setOffice365SubTab] = useState<'general' | 'credentials' | 'subscriptions'>('general');
  const [securitySubTab, setSecuritySubTab] = useState<'users' | 'roles' | 'policies' | 'roles_mapping'>('users');
  const [securityUsers, setSecurityUsers] = useState<{username: string; password: string; role: string}[]>(() => {
    try { return JSON.parse(localStorage.getItem('wz_security_users') || '[]'); } catch { return []; }
  });
  const [securityPolicyPage, setSecurityPolicyPage] = useState(1);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('administrator');
  const [passwordError, setPasswordError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [indexerSubView, setIndexerSubView] = useState<string>('state_policies');
  const [indexesPage, setIndexesPage] = useState<number>(1);
  const [selectedTemplateForComponents, setSelectedTemplateForComponents] = useState<string | null>(null);
  const [notifications, setNotifications] = useState({
    reindexFailed: false,
    reindexCompleted: false,
    shrinkFailed: false,
    shrinkCompleted: false,
    mergeFailed: false,
    mergeCompleted: false,
    openFailed: false,
    openCompleted: false
  });
  const [snapshotsSubTab, setSnapshotsSubTab] = useState<'snapshots' | 'restore'>('snapshots');
  const indexerSecuritySubTab = searchParams.get('subtab') || 'get_started';
  const [auditLoggingEnabled, setAuditLoggingEnabled] = useState<boolean>(true);
  const [appSettingsTab, setAppSettingsTab] = useState<'Configuration' | 'Miscellaneous'>('Configuration');
  const [showAddApiConnection, setShowAddApiConnection] = useState<boolean>(false);


  // Status Indicators data
  const services = [
    { name: 'wazuh-agentlessd', status: 'red' },
    { name: 'wazuh-analysisd', status: 'green' },
    { name: 'wazuh-authd', status: 'green' },
    { name: 'wazuh-csyslogd', status: 'red' },
    { name: 'wazuh-dbd', status: 'red' },
    { name: 'wazuh-monitord', status: 'green' },
    { name: 'wazuh-execd', status: 'green' },
    { name: 'wazuh-integratord', status: 'red' },
    { name: 'wazuh-logcollector', status: 'green' },
    { name: 'wazuh-maild', status: 'red' },
    { name: 'wazuh-remoted', status: 'green' },
    { name: 'wazuh-reportd', status: 'red' },
    { name: 'wazuh-syscheckd', status: 'green' },
    { name: 'wazuh-clusterd', status: 'red' },
    { name: 'wazuh-modulesd', status: 'green' },
    { name: 'wazuh-db', status: 'green' },
    { name: 'wazuh-apid', status: 'green' }
  ];

  // Mock Logs List matching Image 2
  const rawLogs = [
    'Jun 12, 2026 @ 01:00:10.000 wazuh-monitord INFO Starting new log after rotation.',
    'Jun 12, 2026 @ 01:00:11.000 wazuh-syscheckd INFO (6009): File integrity monitoring scan ended.',
    'Jun 12, 2026 @ 06:09:17.000 wazuh-syscheckd INFO (6008): File integrity monitoring scan started.',
    'Jun 12, 2026 @ 06:09:37.000 wazuh-syscheckd INFO (6009): File integrity monitoring scan ended.',
    'Jun 12, 2026 @ 06:10:31.000 wazuh-rootcheck INFO Ending rootcheck scan.',
    'Jun 12, 2026 @ 06:10:38.000 wazuh-syscheckd INFO (6008): File integrity monitoring scan started.',
    'Jun 12, 2026 @ 06:10:55.000 wazuh-syscheckd INFO (6009): File integrity monitoring scan ended.',
    'Jun 12, 2026 @ 06:11:32.000 wazuh-rootcheck INFO Starting rootcheck scan.',
    'Jun 12, 2026 @ 06:11:56.000 wazuh-syscheckd INFO (6008): File integrity monitoring scan started.',
    'Jun 12, 2026 @ 06:12:16.000 wazuh-syscheckd INFO (6009): File integrity monitoring scan ended.',
    'Jun 12, 2026 @ 06:13:17.000 wazuh-syscheckd INFO (6008): File integrity monitoring scan started.',
    'Jun 12, 2026 @ 06:13:35.000 wazuh-syscheckd INFO (6009): File integrity monitoring scan ended.',
    'Jun 12, 2026 @ 06:14:20.000 wazuh-rootcheck INFO Ending rootcheck scan.',
    'Jun 12, 2026 @ 06:14:36.000 wazuh-syscheckd INFO (6008): File integrity monitoring scan started.',
    'Jun 12, 2026 @ 06:14:54.000 wazuh-syscheckd INFO (6009): File integrity monitoring scan ended.',
    'Jun 12, 2026 @ 06:15:21.000 wazuh-rootcheck INFO Starting rootcheck scan.',
    'Jun 12, 2026 @ 06:15:55.000 wazuh-syscheckd INFO (6008): File integrity monitoring scan started.',
    'Jun 12, 2026 @ 06:16:13.000 wazuh-syscheckd INFO (6009): File integrity monitoring scan ended.'
  ];

  // ----------------------------------------------------
  // CHART DATA GENERATORS
  // ----------------------------------------------------
  const timeLabels = ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00', '22:00', '23:00'];

  const listenerBytesData = {
    labels: timeLabels,
    datasets: [{
      label: 'recv_bytes',
      data: [300000, 300000, 300000, 300000, 300000, 300000, 300000, 300000, 1000000, 260000],
      borderColor: '#06b6d4',
      backgroundColor: 'rgba(6, 182, 212, 0.05)',
      tension: 0.1,
      fill: true
    }]
  };

  const listenerEvtData = {
    labels: timeLabels,
    datasets: [{
      label: 'evt_count',
      data: [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 4200, 1300],
      borderColor: '#06b6d4',
      backgroundColor: 'rgba(6, 182, 212, 0.05)',
      tension: 0.1,
      fill: true
    }]
  };

  const listenerTcpData = {
    labels: timeLabels,
    datasets: [{
      label: 'tcp_sessions',
      data: [0, 0, 0, 0, 0, 0, 0, 0, 6, 2],
      borderColor: '#06b6d4',
      backgroundColor: 'rgba(6, 182, 212, 0.05)',
      tension: 0.1,
      fill: true
    }]
  };

  const analysisProcData = {
    labels: timeLabels,
    datasets: [{
      label: 'Events processed by rules',
      data: [0, 0, 0, 0, 0, 0, 0, 0, 23000, 23000],
      borderColor: '#8b5cf6',
      backgroundColor: 'rgba(139, 92, 246, 0.05)',
      tension: 0.1,
      fill: true
    }]
  };

  const analysisDropData = {
    labels: timeLabels,
    datasets: [{
      label: 'Events dropped by no rules',
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      borderColor: '#ec4899',
      backgroundColor: 'rgba(236, 72, 153, 0.05)',
      tension: 0.1,
      fill: true
    }]
  };

  const analysisQueueData = {
    labels: timeLabels,
    datasets: [
      { label: 'Event queue usage', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], borderColor: '#06b6d4', fill: false },
      { label: 'Rule matching queue', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], borderColor: '#ec4899', fill: false },
      { label: 'Alerts log queue usage', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], borderColor: '#10b981', fill: false },
      { label: 'Firewall log queue usage', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], borderColor: '#f59e0b', fill: false }
    ]
  };

  const analysisDecodedData = {
    labels: timeLabels,
    datasets: [
      { label: 'Rootcheck Events Decoded', data: [220000, 230000, 230000, 280000, 310000, 315000, 320000, 320000, 80000, 1000], borderColor: '#10b981', fill: false },
      { label: 'Other Events Decoded', data: [10000, 10000, 12000, 15000, 16000, 16000, 16000, 17000, 2000, 200], borderColor: '#8b5cf6', fill: false }
    ]
  };

  const syscheckData = {
    labels: timeLabels,
    datasets: [
      { label: 'Syscheck Events Decoded', data: [500, 500, 600, 700, 700, 700, 700, 700, 100, 0], borderColor: '#06b6d4', fill: false },
      { label: 'Queue Size', data: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100], borderColor: '#f87171', fill: false }
    ]
  };

  const syscollectorData = {
    labels: timeLabels,
    datasets: [
      { label: 'Syscollector Events Decoded', data: [2000, 2000, 2500, 3100, 3200, 3300, 3400, 3500, 200, 0], borderColor: '#06b6d4', fill: false },
      { label: 'Queue Size', data: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100], borderColor: '#f87171', fill: false }
    ]
  };

  const rootcheckData = {
    labels: timeLabels,
    datasets: [
      { label: 'Rootcheck Events Decoded', data: [220000, 230000, 230000, 280000, 310000, 315000, 320000, 320000, 80000, 1000], borderColor: '#06b6d4', fill: false },
      { label: 'Queue Size', data: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100], borderColor: '#f87171', fill: false }
    ]
  };

  const scaData = {
    labels: timeLabels,
    datasets: [
      { label: 'SCA Events Decoded', data: [100, 100, 100, 100, 100, 100, 100, 10, 0], borderColor: '#06b6d4', fill: false },
      { label: 'Queue Size', data: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100], borderColor: '#f87171', fill: false }
    ]
  };

  const hostinfoData = {
    labels: timeLabels,
    datasets: [
      { label: 'Host info Events Decoded', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], borderColor: '#06b6d4', fill: false },
      { label: 'Queue Size', data: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100], borderColor: '#f87171', fill: false }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          boxWidth: 8,
          font: { size: 11 }
        }
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 10 } } },
      y: { ticks: { font: { size: 10 } } }
    }
  };

  // ----------------------------------------------------
  // SUB-VIEW RENDERS
  // ----------------------------------------------------
  const renderStatus = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Title block */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', margin: 0 }}>Status</h2>
        <button style={{ background: 'none', border: 'none', color: '#005cca', fontSize: '13.5px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
          <FiRefreshCw size={14} /> Restart manager
        </button>
      </div>

      {/* Services Grid */}
      <div className="wz-pill-card" style={{ padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px 24px' }}>
        {services.map(s => (
          <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155' }}>
            <span style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              background: s.status === 'green' ? '#10b981' : '#ef4444',
              display: 'inline-block'
            }} />
            <span>{s.name}</span>
          </div>
        ))}
      </div>

      {/* Stat counters row */}
      <div className="wz-pill-card" style={{ padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0', display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '20px', alignItems: 'center', textAlign: 'center' }}>
        <div>
          <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '6px' }}>Total agents</div>
          <strong style={{ fontSize: '24px', color: '#005cca' }}>1</strong>
        </div>
        <div>
          <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '6px' }}>Active</div>
          <strong style={{ fontSize: '24px', color: '#10b981' }}>1</strong>
        </div>
        <div>
          <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '6px' }}>Disconnected</div>
          <strong style={{ fontSize: '24px', color: '#ef4444' }}>0</strong>
        </div>
        <div>
          <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '6px' }}>Pending</div>
          <strong style={{ fontSize: '24px', color: '#eab308' }}>0</strong>
        </div>
        <div>
          <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '6px' }}>Never connected</div>
          <strong style={{ fontSize: '24px', color: '#94a3b8' }}>0</strong>
        </div>
        <div style={{ borderLeft: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Agents coverage</div>
          <strong style={{ fontSize: '22px', color: '#1e293b' }}>100.00%</strong>
        </div>
      </div>

      {/* Details Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        
        {/* Manager info */}
        <div className="wz-pill-card" style={{ padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
          <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b', marginTop: 0, marginBottom: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
            Manager information
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Version</span>
              <strong style={{ color: '#334155' }}>v4.14.5</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Installation path</span>
              <strong style={{ color: '#334155' }}>/var/ossec</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Installation type</span>
              <strong style={{ color: '#334155' }}>server</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Agents</span>
              <strong style={{ color: '#334155' }}>1</strong>
            </div>
          </div>
        </div>

        {/* Last registered agent */}
        <div className="wz-pill-card" style={{ padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
          <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b', marginTop: 0, marginBottom: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
            Last registered agent
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Name</span>
              <strong style={{ color: '#334155' }}>Isgasaad</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>ID</span>
              <strong style={{ color: '#334155' }}>001</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Status</span>
              <span style={{ color: '#10b981', fontWeight: 600 }}>Active</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>IP address</span>
              <strong style={{ color: '#334155' }}>192.168.122.70</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Date added</span>
              <strong style={{ color: '#334155' }}>Jun 11, 2026 @ 12:42:25.000</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Version</span>
              <strong style={{ color: '#334155' }}>Wazuh v4.14.5</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Last keep alive</span>
              <strong style={{ color: '#334155' }}>Jun 12, 2026 @ 23:18:15.000</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Operating system</span>
              <strong style={{ color: '#334155' }}>Ubuntu20.04 LTS</strong>
            </div>
          </div>
        </div>

      </div>

    </div>
  );

  const renderStatistics = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', margin: 0 }}>Statistics</h2>
          <span style={{ fontSize: '13.5px', color: '#64748b' }}>From here you can see daemon statistics.</span>
        </div>
        <button style={{ background: 'none', border: 'none', color: '#005cca', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
          <FiSettings size={14} /> Settings
        </button>
      </div>

      {/* Statistics Tabs and Filters Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
        <div style={{ display: 'flex', gap: '24px' }}>
          <button 
            onClick={() => setStatsTab('listener')}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: statsTab === 'listener' ? '2.5px solid #005cca' : '2.5px solid transparent',
              paddingBottom: '8px',
              fontSize: '14px',
              fontWeight: statsTab === 'listener' ? 600 : 500,
              color: statsTab === 'listener' ? '#005cca' : '#64748b',
              cursor: 'pointer'
            }}
          >
            Listener Engine
          </button>
          <button 
            onClick={() => setStatsTab('analysis')}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: statsTab === 'analysis' ? '2.5px solid #005cca' : '2.5px solid transparent',
              paddingBottom: '8px',
              fontSize: '14px',
              fontWeight: statsTab === 'analysis' ? 600 : 500,
              color: statsTab === 'analysis' ? '#005cca' : '#64748b',
              cursor: 'pointer'
            }}
          >
            Analysis Engine
          </button>
        </div>

        {/* Filter Toolbar */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <select style={{ padding: '6px 10px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#ffffff', minWidth: '80px' }}>
            <option>All</option>
          </select>
          <select style={{ padding: '6px 10px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#ffffff', minWidth: '150px' }}>
            <option>Last 24 hours</option>
          </select>
          <span style={{ fontSize: '13px', color: '#005cca', cursor: 'pointer', fontWeight: 500 }}>Show dates</span>
          <button style={{
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '4px',
            padding: '6px 12px',
            fontSize: '13px',
            fontWeight: 600,
            color: '#334155',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer'
          }}>
            <FiRefreshCw size={12} /> Refresh
          </button>
        </div>
      </div>

      {/* Info Notice Box */}
      <div style={{ 
        background: '#e0f2fe', 
        borderLeft: '4px solid #0284c7', 
        padding: '12px 16px', 
        borderRadius: '4px',
        fontSize: '13px',
        color: '#0369a1',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <FiInfo size={16} style={{ flexShrink: 0 }} />
        <span>
          {statsTab === 'listener' 
            ? 'Remoted statistics are cumulative, this means that the information shown is since the data exists.'
            : 'Analysisd statistics refer to the data stored from the period indicated in the variable \'analysisd.state_interval\'.'
          }
        </span>
      </div>

      {/* ----------------- LISTENER ENGINE CHARTS ----------------- */}
      {statsTab === 'listener' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Row 1: Bytes Received & Events Sent */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="wz-pill-card" style={{ padding: '16px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
              <strong style={{ fontSize: '13px', color: '#1e293b', display: 'block', marginBottom: '12px' }}>Total number of bytes received</strong>
              <div style={{ height: '220px' }}>
                <Line data={listenerBytesData} options={chartOptions} />
              </div>
            </div>
            <div className="wz-pill-card" style={{ padding: '16px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
              <strong style={{ fontSize: '13px', color: '#1e293b', display: 'block', marginBottom: '12px' }}>Events sent to Analysisd</strong>
              <div style={{ height: '220px' }}>
                <Line data={listenerEvtData} options={chartOptions} />
              </div>
            </div>
          </div>
          {/* Row 2: TCP Sessions */}
          <div className="wz-pill-card" style={{ padding: '16px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
            <strong style={{ fontSize: '13px', color: '#1e293b', display: 'block', marginBottom: '12px' }}>TCP sessions</strong>
            <div style={{ height: '220px' }}>
              <Line data={listenerTcpData} options={chartOptions} />
            </div>
          </div>
        </div>
      )}

      {/* ----------------- ANALYSIS ENGINE CHARTS ----------------- */}
      {statsTab === 'analysis' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Row 1: Events Processed & Events Dropped */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="wz-pill-card" style={{ padding: '16px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
              <strong style={{ fontSize: '13px', color: '#1e293b', display: 'block', marginBottom: '12px' }}>Events processed</strong>
              <div style={{ height: '220px' }}>
                <Line data={analysisProcData} options={chartOptions} />
              </div>
            </div>
            <div className="wz-pill-card" style={{ padding: '16px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
              <strong style={{ fontSize: '13px', color: '#1e293b', display: 'block', marginBottom: '12px' }}>Events dropped</strong>
              <div style={{ height: '220px' }}>
                <Line data={analysisDropData} options={chartOptions} />
              </div>
            </div>
          </div>

          {/* Row 2: Queue Usage & Decoded Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="wz-pill-card" style={{ padding: '16px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
              <strong style={{ fontSize: '13px', color: '#1e293b', display: 'block', marginBottom: '12px' }}>Queue Usage</strong>
              <div style={{ height: '220px' }}>
                <Line data={analysisQueueData} options={chartOptions} />
              </div>
            </div>
            <div className="wz-pill-card" style={{ padding: '16px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
              <strong style={{ fontSize: '13px', color: '#1e293b', display: 'block', marginBottom: '12px' }}>Events decoded summary</strong>
              <div style={{ height: '220px' }}>
                <Line data={analysisDecodedData} options={chartOptions} />
              </div>
            </div>
          </div>

          {/* Row 3: Grid of Daemons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="wz-pill-card" style={{ padding: '16px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
              <strong style={{ fontSize: '13px', color: '#1e293b', display: 'block', marginBottom: '12px' }}>Syscheck</strong>
              <div style={{ height: '200px' }}>
                <Line data={syscheckData} options={chartOptions} />
              </div>
            </div>
            <div className="wz-pill-card" style={{ padding: '16px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
              <strong style={{ fontSize: '13px', color: '#1e293b', display: 'block', marginBottom: '12px' }}>Syscollector</strong>
              <div style={{ height: '200px' }}>
                <Line data={syscollectorData} options={chartOptions} />
              </div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="wz-pill-card" style={{ padding: '16px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
              <strong style={{ fontSize: '13px', color: '#1e293b', display: 'block', marginBottom: '12px' }}>Rootcheck</strong>
              <div style={{ height: '200px' }}>
                <Line data={rootcheckData} options={chartOptions} />
              </div>
            </div>
            <div className="wz-pill-card" style={{ padding: '16px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
              <strong style={{ fontSize: '13px', color: '#1e293b', display: 'block', marginBottom: '12px' }}>SCA</strong>
              <div style={{ height: '200px' }}>
                <Line data={scaData} options={chartOptions} />
              </div>
            </div>
          </div>
          {/* Host Info */}
          <div className="wz-pill-card" style={{ padding: '16px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
            <strong style={{ fontSize: '13px', color: '#1e293b', display: 'block', marginBottom: '12px' }}>Host Info</strong>
            <div style={{ height: '200px' }}>
              <Line data={hostinfoData} options={chartOptions} />
            </div>
          </div>
        </div>
      )}

    </div>
  );

  const renderLogs = () => {
    const filteredLogs = rawLogs.filter(log => log.toLowerCase().includes(logSearch.toLowerCase()));

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', margin: 0 }}>Logs</h2>
            <span style={{ fontSize: '13.5px', color: '#64748b' }}>List and filter logs.</span>
          </div>
          <button style={{ background: 'none', border: 'none', color: '#005cca', fontSize: '13.5px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <FiDownload size={14} /> Export formatted
          </button>
        </div>

        {/* Filter bar */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <select style={{ padding: '6px 12px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#ffffff', minWidth: '150px' }}>
            <option>All daemons</option>
          </select>
          <select style={{ padding: '6px 12px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#ffffff', minWidth: '150px' }}>
            <option>All log levels</option>
          </select>
          <select style={{ padding: '6px 12px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#ffffff', minWidth: '150px' }}>
            <option>node01 (master)</option>
          </select>

          {/* Toggle Descending sort */}
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#334155' }}>
            <input 
              type="checkbox" 
              checked={descendingSort} 
              onChange={e => setDescendingSort(e.target.checked)} 
              style={{ cursor: 'pointer' }}
            />
            <span>Descending sort</span>
          </label>

          {/* Toggle Realtime */}
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#334155' }}>
            <input 
              type="checkbox" 
              checked={realtime} 
              onChange={e => setRealtime(e.target.checked)} 
              style={{ cursor: 'pointer' }}
            />
            <span>Realtime</span>
          </label>
        </div>

        {/* Search bar */}
        <div style={{ position: 'relative' }}>
          <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Filter logs"
            value={logSearch}
            onChange={e => setLogSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 36px',
              borderRadius: '4px',
              border: '1px solid #cbd5e1',
              fontSize: '13.5px'
            }}
          />
        </div>

        {/* Scrollable logs box */}
        <div style={{ 
          background: '#ffffff', 
          border: '1px solid #cbd5e1', 
          borderRadius: '4px', 
          padding: '16px', 
          fontFamily: 'monospace', 
          fontSize: '12.5px', 
          color: '#334155',
          lineHeight: '1.8',
          height: '400px',
          overflowY: 'auto',
          whiteSpace: 'pre-wrap'
        }}>
          {filteredLogs.map((log, idx) => (
            <div key={idx} style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '4px', marginBottom: '4px' }}>
              {log}
            </div>
          ))}
        </div>

        {/* Bottom Load More */}
        <button style={{ background: 'none', border: 'none', color: '#005cca', fontSize: '13.5px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', justifyContent: 'center' }}>
          <FiRefreshCw size={13} /> Load more logs
        </button>
      </div>
    );
  };

  const renderConfiguration = () => {
    // ---------------------- 1. GLOBAL CONFIGURATION DETAIL ----------------------
    if (selectedConfig === 'Global Configuration') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button onClick={() => setSelectedConfig(null)} style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#475569' }}>
                <FiChevronLeft size={16} />
              </button>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', margin: 0 }}>Global Configuration</h2>
                <span style={{ fontSize: '13.5px', color: '#64748b' }}>Global and remote settings</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <button style={{ background: 'none', border: 'none', color: '#005cca', fontSize: '13.5px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <FiRefreshCw size={13} /> Refresh
              </button>
              <select style={{ padding: '6px 12px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#ffffff', minWidth: '150px' }}>
                <option>node01 (master)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', gap: '24px', margin: '0 0 10px 0' }}>
            <button onClick={() => setGlobalSubTab('global')} style={{ background: 'none', border: 'none', borderBottom: globalSubTab === 'global' ? '2.5px solid #005cca' : '2.5px solid transparent', paddingBottom: '8px', fontSize: '14.5px', fontWeight: globalSubTab === 'global' ? 600 : 500, color: globalSubTab === 'global' ? '#005cca' : '#64748b', cursor: 'pointer' }}>Global</button>
            <button onClick={() => setGlobalSubTab('remote')} style={{ background: 'none', border: 'none', borderBottom: globalSubTab === 'remote' ? '2.5px solid #005cca' : '2.5px solid transparent', paddingBottom: '8px', fontSize: '14.5px', fontWeight: globalSubTab === 'remote' ? 600 : 500, color: globalSubTab === 'remote' ? '#005cca' : '#64748b', cursor: 'pointer' }}>Remote</button>
          </div>

          {globalSubTab === 'global' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '24px' }}>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px', marginBottom: '16px' }}>Main settings</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '650px', marginLeft: 'auto', marginRight: 'auto' }}>
                  {[
                    { label: 'Write alerts to alerts.log file', value: 'yes' },
                    { label: 'Write JSON formatted alerts to alerts.json file', value: 'yes' },
                    { label: 'Archive all the alerts in plain text format', value: 'no' },
                    { label: 'Archive all the alerts in JSON format', value: 'no' },
                    { label: 'Write internal logs in plain text', value: 'yes' },
                    { label: 'Write internal logs in JSON format', value: 'no' },
                    { label: 'Size limit of alert files', value: '0' },
                    { label: 'File rotation interval', value: '0' }
                  ].map(item => (
                    <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
                      <span style={{ fontSize: '13px', color: '#475569', textAlign: 'right', flex: 1 }}>{item.label}</span>
                      <input type="text" readOnly value={item.value} style={{ width: '250px', padding: '6px 10px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#f8fafc' }} />
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px', marginBottom: '16px' }}>Email settings</h4>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', maxWidth: '650px', marginLeft: 'auto', marginRight: 'auto' }}>
                  <span style={{ fontSize: '13px', color: '#475569', textAlign: 'right', flex: 1 }}>Enable alerts sent by email</span>
                  <input type="text" readOnly value="no" style={{ width: '250px', padding: '6px 10px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#f8fafc' }} />
                </div>
              </div>

              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px', marginBottom: '16px' }}>Other settings</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '650px', marginLeft: 'auto', marginRight: 'auto' }}>
                  {[
                    { label: 'Severity level for alerts generated by statistical analysis', value: '4' },
                    { label: 'Severity level for alerts generated by host change monitor', value: '8' },
                    { label: 'Memory size for the alert correlation engine', value: '8192' }
                  ].map(item => (
                    <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
                      <span style={{ fontSize: '13px', color: '#475569', textAlign: 'right', flex: 1 }}>{item.label}</span>
                      <input type="text" readOnly value={item.value} style={{ width: '250px', padding: '6px 10px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#f8fafc' }} />
                    </div>
                  ))}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '20px' }}>
                    <span style={{ fontSize: '13px', color: '#475569', textAlign: 'right', flex: 1, marginTop: '6px' }}>White-listed IP addresses</span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '250px' }}>
                      <input type="text" readOnly value="127.0.0.1" style={{ padding: '6px 10px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#f8fafc' }} />
                      <input type="text" readOnly value="127.0.0.53" style={{ padding: '6px 10px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#f8fafc' }} />
                      <input type="text" readOnly value="localhost.localdomain" style={{ padding: '6px 10px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#f8fafc' }} />
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px', marginBottom: '16px' }}>Prelude and ZeroMQ output</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '650px', marginLeft: 'auto', marginRight: 'auto' }}>
                  {[
                    { label: 'Enable Prelude output', value: 'no' },
                    { label: 'Enable ZeroMQ output', value: 'no' }
                  ].map(item => (
                    <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
                      <span style={{ fontSize: '13px', color: '#475569', textAlign: 'right', flex: 1 }}>{item.label}</span>
                      <input type="text" readOnly value={item.value} style={{ width: '250px', padding: '6px 10px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#f8fafc' }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {globalSubTab === 'remote' && (
            <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
              <div style={{ padding: '16px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <h4 style={{ fontSize: '14.5px', fontWeight: 600, color: '#1e293b', margin: 0 }}>Remote settings</h4>
                <span style={{ fontSize: '12.5px', color: '#64748b' }}>Configuration to listen for events from the agents or a syslog client</span>
              </div>
              <table className="wz-table">
                <thead>
                  <tr>
                    <th>Connection</th>
                    <th>Port</th>
                    <th>Protocol</th>
                    <th>IPv6</th>
                    <th>Allowed IP addresses</th>
                    <th>Denied IP addresses</th>
                    <th>Local IP address</th>
                    <th>Queue size</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ fontWeight: 600, color: '#334155' }}>secure</td>
                    <td>1514</td>
                    <td>TCP</td>
                    <td>no</td>
                    <td>-</td>
                    <td>-</td>
                    <td>All interfaces</td>
                    <td>131072</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      );
    }

    // ---------------------- 2. CLUSTER CONFIGURATION DETAIL ----------------------
    if (selectedConfig === 'Cluster') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button onClick={() => setSelectedConfig(null)} style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#475569' }}>
                <FiChevronLeft size={16} />
              </button>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', margin: 0 }}>Cluster</h2>
                <span style={{ fontSize: '13.5px', color: '#64748b' }}>Master node configuration</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <button style={{ background: 'none', border: 'none', color: '#005cca', fontSize: '13.5px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <FiRefreshCw size={13} /> Refresh
              </button>
              <select style={{ padding: '6px 12px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#ffffff', minWidth: '150px' }}>
                <option>node01 (master)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '24px' }}>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px', marginBottom: '16px' }}>Main settings</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '650px', marginLeft: 'auto', marginRight: 'auto' }}>
                {[
                  { label: 'Cluster status', value: 'enabled' },
                  { label: 'Cluster name', value: 'wazuh' },
                  { label: 'Node name', value: 'node01' },
                  { label: 'Node type', value: 'master' },
                  { label: 'Master node IP address', value: '192.168.8.127' },
                  { label: 'Port to listen to cluster communications', value: '1516' },
                  { label: 'IP address to listen to cluster communications', value: '0.0.0.0' },
                  { label: 'Hide cluster information in alerts', value: 'no' }
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
                    <span style={{ fontSize: '13px', color: '#475569', textAlign: 'right', flex: 1 }}>{item.label}</span>
                    <input type="text" readOnly value={item.value} style={{ width: '250px', padding: '6px 10px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#f8fafc' }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // ---------------------- 3. REGISTRATION SERVICE DETAIL ----------------------
    if (selectedConfig === 'Registration Service') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button onClick={() => setSelectedConfig(null)} style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#475569' }}>
                <FiChevronLeft size={16} />
              </button>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', margin: 0 }}>Registration Service</h2>
                  <span style={{ background: '#10b981', color: '#ffffff', fontSize: '11px', fontWeight: 700, padding: '2px 6px', borderRadius: '3px' }}>ENABLED</span>
                </div>
                <span style={{ fontSize: '13.5px', color: '#64748b' }}>Automatic agent registration service</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <button style={{ background: 'none', border: 'none', color: '#005cca', fontSize: '13.5px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <FiRefreshCw size={13} /> Refresh
              </button>
              <select style={{ padding: '6px 12px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#ffffff', minWidth: '150px' }}>
                <option>node01 (master)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '24px' }}>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px', marginBottom: '16px' }}>Main settings</h4>
              <p style={{ fontSize: '12px', color: '#64748b', marginTop: '-8px', marginBottom: '16px' }}>General settings applied to the registration service</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '650px', marginLeft: 'auto', marginRight: 'auto' }}>
                {[
                  { label: 'Service status', value: 'enabled' },
                  { label: 'Listen to connections at port', value: '1515' },
                  { label: 'Use client\'s source IP address', value: 'no' },
                  { label: 'Use a password to register agents', value: 'no' },
                  { label: 'Purge agents list when removing agents', value: 'yes' },
                  { label: 'Force registration when using an existing IP address', value: 'yes' },
                  { label: 'Specifies agent replacement duration threshold (seconds)', value: '3600' },
                  { label: 'Avoid re-registering agents that already have valid keys', value: 'yes' },
                  { label: 'Specifies replacement only for disconnected agents', value: 'yes' },
                  { label: 'Seconds since an agent is in a disconnected state', value: '3600' }
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
                    <span style={{ fontSize: '13px', color: '#475569', textAlign: 'right', flex: 1 }}>{item.label}</span>
                    <input type="text" readOnly value={item.value} style={{ width: '250px', padding: '6px 10px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#f8fafc' }} />
                  </div>
                ))}
              </div>
            </div>

            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px', marginBottom: '16px' }}>Key request settings</h4>
              <p style={{ fontSize: '12px', color: '#64748b', marginTop: '-8px', marginBottom: '16px' }}>The key request feature allows to fetch agent keys from an external source, for example, a database</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', maxWidth: '650px', marginLeft: 'auto', marginRight: 'auto' }}>
                <span style={{ fontSize: '13px', color: '#475569', textAlign: 'right', flex: 1 }}>Key request status</span>
                <input type="text" readOnly value="disabled" style={{ width: '250px', padding: '6px 10px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#f8fafc' }} />
              </div>
            </div>

            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px', marginBottom: '16px' }}>SSL settings</h4>
              <p style={{ fontSize: '12px', color: '#64748b', marginTop: '-8px', marginBottom: '16px' }}>Applied when the registration service uses SSL certificates</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '650px', marginLeft: 'auto', marginRight: 'auto' }}>
                {[
                  { label: 'Verify host when a CA certificate is specified', value: 'no' },
                  { label: 'Auto-select the SSL negotiation method', value: 'no' },
                  { label: 'Server SSL certificate location', value: 'etc/sslmanager.cert' },
                  { label: 'Server SSL key location', value: 'etc/sslmanager.key' },
                  { label: 'Use the following SSL ciphers', value: 'HIGH:!ADH:!EXP:!MD5:!RC4:!3DES:!CAMELLIA:@STRENGTH' }
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
                    <span style={{ fontSize: '13px', color: '#475569', textAlign: 'right', flex: 1 }}>{item.label}</span>
                    <input type="text" readOnly value={item.value} style={{ width: '250px', padding: '6px 10px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#f8fafc' }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // ---------------------- 4. ALERTS DETAIL ----------------------
    if (selectedConfig === 'Alerts') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button onClick={() => setSelectedConfig(null)} style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#475569' }}>
                <FiChevronLeft size={16} />
              </button>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', margin: 0 }}>Alerts</h2>
                <span style={{ fontSize: '13.5px', color: '#64748b' }}>Settings related to the alerts and their format</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <button style={{ background: 'none', border: 'none', color: '#005cca', fontSize: '13.5px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <FiRefreshCw size={13} /> Refresh
              </button>
              <select style={{ padding: '6px 12px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#ffffff', minWidth: '150px' }}>
                <option>node01 (master)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', gap: '24px', margin: '0 0 10px 0' }}>
            {['general', 'labels', 'email', 'reports', 'syslog'].map(t => (
              <button 
                key={t}
                onClick={() => setAlertsSubTab(t as any)} 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  borderBottom: alertsSubTab === t ? '2.5px solid #005cca' : '2.5px solid transparent', 
                  paddingBottom: '8px', 
                  fontSize: '14.5px', 
                  fontWeight: alertsSubTab === t ? 600 : 500, 
                  color: alertsSubTab === t ? '#005cca' : '#64748b', 
                  cursor: 'pointer',
                  textTransform: 'capitalize'
                }}
              >
                {t === 'email' ? 'Email alerts' : t === 'syslog' ? 'Syslog output' : t}
              </button>
            ))}
          </div>

          {alertsSubTab === 'general' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '24px' }}>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px', marginBottom: '16px' }}>Main settings</h4>
                <p style={{ fontSize: '12px', color: '#64748b', marginTop: '-8px', marginBottom: '16px' }}>General alert settings</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '650px', marginLeft: 'auto', marginRight: 'auto' }}>
                  {[
                    { label: 'Minimum severity level to store the alert', value: '3' },
                    { label: 'Minimum severity level to send the alert by email', value: '12' },
                    { label: 'Enable GeoIP lookups', value: 'no' }
                  ].map(item => (
                    <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
                      <span style={{ fontSize: '13px', color: '#475569', textAlign: 'right', flex: 1 }}>{item.label}</span>
                      <input type="text" readOnly value={item.value} style={{ width: '250px', padding: '6px 10px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#f8fafc' }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {alertsSubTab !== 'general' && (
            <div className="wz-pill-card" style={{ padding: '24px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
              <p style={{ color: '#64748b', fontSize: '13.5px' }}>Custom settings rules for alerts section format.</p>
            </div>
          )}
        </div>
      );
    }

    // ---------------------- 5. INTEGRATIONS DETAIL ----------------------
    if (selectedConfig === 'Integrations') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button onClick={() => setSelectedConfig(null)} style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#475569' }}>
                <FiChevronLeft size={16} />
              </button>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', margin: 0 }}>Integrations</h2>
                <span style={{ fontSize: '13.5px', color: '#64748b' }}>Slack, VirusTotal and PagerDuty integrations with external APIs</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <button style={{ background: 'none', border: 'none', color: '#005cca', fontSize: '13.5px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <FiRefreshCw size={13} /> Refresh
              </button>
              <select style={{ padding: '6px 12px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#ffffff', minWidth: '150px' }}>
                <option>node01 (master)</option>
              </select>
            </div>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '36px', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '16px', maxWidth: '500px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: 600, color: '#334155' }}>
                <span>🌐 Configuration not available</span>
                <FiHelpCircle size={15} style={{ color: '#005cca', cursor: 'pointer' }} />
              </div>
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: '1.6' }}>
                There was a problem while fetching the configuration for this section. It may be a server problem or the configuration doesn't exist.
                Click on the ❓ icon for help. Check the documentation links to learn more about how to configure it.
              </p>
            </div>
          </div>
        </div>
      );
    }

    // ---------------------- 6. POLICY MONITORING DETAIL ----------------------
    if (selectedConfig === 'Policy monitoring') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button onClick={() => setSelectedConfig(null)} style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#475569' }}>
                <FiChevronLeft size={16} />
              </button>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', margin: 0 }}>Policy monitoring</h2>
                  <span style={{ background: '#10b981', color: '#ffffff', fontSize: '11px', fontWeight: 700, padding: '2px 6px', borderRadius: '3px' }}>ENABLED</span>
                </div>
                <span style={{ fontSize: '13.5px', color: '#64748b' }}>Configuration to ensure compliance with security policies, standards and hardening guides</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <button style={{ background: 'none', border: 'none', color: '#005cca', fontSize: '13.5px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <FiRefreshCw size={13} /> Refresh
              </button>
              <select style={{ padding: '6px 12px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#ffffff', minWidth: '150px' }}>
                <option>node01 (master)</option>
              </select>
            </div>
          </div>

          {/* Sub-tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', gap: '24px', margin: '0 0 10px 0' }}>
            {[
              { id: 'general', label: 'General' },
              { id: 'audit', label: 'System audit' },
              { id: 'ignored', label: 'Ignored' },
              { id: 'sca', label: 'SCA' }
            ].map(t => (
              <button 
                key={t.id}
                onClick={() => setPolicySubTab(t.id as any)} 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  borderBottom: policySubTab === t.id ? '2.5px solid #005cca' : '2.5px solid transparent', 
                  paddingBottom: '8px', 
                  fontSize: '14.5px', 
                  fontWeight: policySubTab === t.id ? 600 : 500, 
                  color: policySubTab === t.id ? '#005cca' : '#64748b', 
                  cursor: 'pointer'
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* General Tab */}
          {policySubTab === 'general' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '24px' }}>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px', marginBottom: '16px' }}>All settings</h4>
                <p style={{ fontSize: '12px', color: '#64748b', marginTop: '-8px', marginBottom: '16px' }}>General settings for the rootcheck daemon</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '650px', marginLeft: 'auto', marginRight: 'auto' }}>
                  {[
                    { label: 'Policy monitoring service status', value: 'enabled' },
                    { label: 'Scan the entire system', value: 'no' },
                    { label: 'Frequency (in seconds) to run the scan', value: '60' },
                    { label: 'Check /dev path', value: 'yes' },
                    { label: 'Check files', value: 'yes' },
                    { label: 'Check network interfaces', value: 'yes' },
                    { label: 'Check processes IDs', value: 'yes' },
                    { label: 'Check network ports', value: 'yes' },
                    { label: 'Check anomalous system objects', value: 'yes' },
                    { label: 'Check trojans', value: 'yes' },
                    { label: 'Check UNIX audit', value: 'no' },
                    { label: 'Skip scan on CIFS/NFS mounts', value: 'yes' },
                    { label: 'Rootkit files database path', value: 'etc/rootcheck/rootkit_files.txt' },
                    { label: 'Rootkit trojans database path', value: 'etc/rootcheck/rootkit_trojans.txt' }
                  ].map(item => (
                    <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
                      <span style={{ fontSize: '13px', color: '#475569', textAlign: 'right', flex: 1 }}>{item.label}</span>
                      <input type="text" readOnly value={item.value} style={{ width: '250px', padding: '6px 10px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#f8fafc' }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* System Audit Tab */}
          {policySubTab === 'audit' && (
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '36px', textAlign: 'center' }}>
              <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '16px', maxWidth: '500px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: 600, color: '#334155' }}>
                  <span>🌐 Configuration not available</span>
                  <FiHelpCircle size={15} style={{ color: '#005cca', cursor: 'pointer' }} />
                </div>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: '1.6' }}>
                  This section is not present on the configuration file.
                  Click on the ❓ icon for help. Check the documentation links to learn more about how to configure it.
                </p>
              </div>
            </div>
          )}

          {/* Ignored Tab */}
          {policySubTab === 'ignored' && (
            <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
              <div style={{ padding: '16px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <h4 style={{ fontSize: '14.5px', fontWeight: 600, color: '#1e293b', margin: 0 }}>Ignored files and directories</h4>
                <span style={{ fontSize: '12.5px', color: '#64748b' }}>These files and directories are ignored from the rootcheck scan</span>
              </div>
              <table className="wz-table">
                <thead>
                  <tr>
                    <th>Path</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>/var/lib/containerd</td></tr>
                  <tr><td>/var/lib/docker/overlay2</td></tr>
                </tbody>
              </table>
            </div>
          )}

          {/* SCA Tab */}
          {policySubTab === 'sca' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '24px' }}>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px', marginBottom: '16px' }}>Security configuration assessment status</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '650px', marginLeft: 'auto', marginRight: 'auto' }}>
                    {[
                      { label: 'Security configuration assessment status', value: 'enabled' },
                      { label: 'Interval', value: '43200' },
                      { label: 'Scan on start', value: 'yes' },
                      { label: 'Skip nfs', value: 'yes' }
                    ].map(item => (
                      <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
                        <span style={{ fontSize: '13px', color: '#475569', textAlign: 'right', flex: 1 }}>{item.label}</span>
                        <input type="text" readOnly value={item.value} style={{ width: '250px', padding: '6px 10px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#f8fafc' }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Policies Table */}
              <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{ padding: '16px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <h4 style={{ fontSize: '14.5px', fontWeight: 600, color: '#1e293b', margin: 0 }}>Policies</h4>
                </div>
                <table className="wz-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td>/var/ossec/ruleset/sca/cis_ubuntu24-04.yml</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      );
    }

    if (selectedConfig === 'OpenSCAP') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button onClick={() => setSelectedConfig(null)} style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#475569' }}>
                <FiChevronLeft size={16} />
              </button>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', margin: 0 }}>OpenSCAP</h2>
                <span style={{ fontSize: '13.5px', color: '#64748b' }}>Configuration assessment and automation of compliance monitoring using SCAP checks</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <button style={{ background: 'none', border: 'none', color: '#005cca', fontSize: '13.5px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <FiRefreshCw size={13} /> Refresh
              </button>
              <select style={{ padding: '6px 12px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#ffffff', minWidth: '150px' }}>
                <option>node01 (master)</option>
              </select>
            </div>
          </div>

          {/* Sub-tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', gap: '24px', margin: '0 0 10px 0' }}>
            {[
              { id: 'general', label: 'General' },
              { id: 'evaluations', label: 'Evaluations' }
            ].map(t => (
              <button 
                key={t.id}
                onClick={() => setOpenScapSubTab(t.id as any)} 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  borderBottom: openScapSubTab === t.id ? '2.5px solid #005cca' : '2.5px solid transparent', 
                  paddingBottom: '8px', 
                  fontSize: '14.5px', 
                  fontWeight: openScapSubTab === t.id ? 600 : 500, 
                  color: openScapSubTab === t.id ? '#005cca' : '#64748b', 
                  cursor: 'pointer'
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '36px', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '16px', maxWidth: '500px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: 600, color: '#334155' }}>
                <span>🌐 Configuration not available</span>
                <FiHelpCircle size={15} style={{ color: '#005cca', cursor: 'pointer' }} />
              </div>
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: '1.6' }}>
                This section is not present on the configuration file.
                Click on the ❓ icon for help. Check the documentation links to learn more about how to configure it.
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (selectedConfig === 'CIS-CAT') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button onClick={() => setSelectedConfig(null)} style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#475569' }}>
                <FiChevronLeft size={16} />
              </button>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', margin: 0 }}>CIS-CAT</h2>
                  <span style={{ background: '#10b981', color: '#ffffff', fontSize: '11px', fontWeight: 700, padding: '2px 6px', borderRadius: '3px' }}>ENABLED</span>
                </div>
                <span style={{ fontSize: '13.5px', color: '#64748b' }}>Configuration assessment using CIS scanner and SCAP checks</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <button style={{ background: 'none', border: 'none', color: '#005cca', fontSize: '13.5px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <FiRefreshCw size={13} /> Refresh
              </button>
              <select style={{ padding: '6px 12px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#ffffff', minWidth: '150px' }}>
                <option>node01 (master)</option>
              </select>
            </div>
          </div>

          {/* Sub-tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', gap: '24px', margin: '0 0 10px 0' }}>
            {[
              { id: 'general', label: 'General' },
              { id: 'benchmarks', label: 'Benchmarks' }
            ].map(t => (
              <button 
                key={t.id}
                onClick={() => setCisCatSubTab(t.id as any)} 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  borderBottom: cisCatSubTab === t.id ? '2.5px solid #005cca' : '2.5px solid transparent', 
                  paddingBottom: '8px', 
                  fontSize: '14.5px', 
                  fontWeight: cisCatSubTab === t.id ? 600 : 500, 
                  color: cisCatSubTab === t.id ? '#005cca' : '#64748b', 
                  cursor: 'pointer'
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {cisCatSubTab === 'general' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '24px' }}>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px', marginBottom: '16px' }}>Main settings</h4>
                <p style={{ fontSize: '12px', color: '#64748b', marginTop: '-8px', marginBottom: '16px' }}>General settings applied to all benchmarks</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '650px', marginLeft: 'auto', marginRight: 'auto' }}>
                  {[
                    { label: 'CIS-CAT integration status', value: 'enabled' },
                    { label: 'Timeout (in seconds) for scan executions', value: '1800' },
                    { label: 'Path to Java executable directory', value: 'wodles/java' },
                    { label: 'Path to CIS-CAT executable directory', value: 'wodles/ciscat' }
                  ].map(item => (
                    <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
                      <span style={{ fontSize: '13px', color: '#475569', textAlign: 'right', flex: 1 }}>{item.label}</span>
                      <input type="text" readOnly value={item.value} style={{ width: '250px', padding: '6px 10px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#f8fafc' }} />
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px', marginBottom: '16px' }}>Scheduling settings</h4>
                <p style={{ fontSize: '12px', color: '#64748b', marginTop: '-8px', marginBottom: '16px' }}>Customize CIS-CAT scans scheduling</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '650px', marginLeft: 'auto', marginRight: 'auto' }}>
                  {[
                    { label: 'Interval between scan executions', value: '86400' },
                    { label: 'Scan on start', value: 'yes' }
                  ].map(item => (
                    <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
                      <span style={{ fontSize: '13px', color: '#475569', textAlign: 'right', flex: 1 }}>{item.label}</span>
                      <input type="text" readOnly value={item.value} style={{ width: '250px', padding: '6px 10px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#f8fafc' }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '36px', textAlign: 'center' }}>
              <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '16px', maxWidth: '500px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: 600, color: '#334155' }}>
                  <span>🌐 Configuration not available</span>
                  <FiHelpCircle size={15} style={{ color: '#005cca', cursor: 'pointer' }} />
                </div>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: '1.6' }}>
                  This section is not present on the configuration file.
                  Click on the ❓ icon for help. Check the documentation links to learn more about how to configure it.
                </p>
              </div>
            </div>
          )}
        </div>
      );
    }

    if (selectedConfig === 'Vulnerabilities') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button onClick={() => setSelectedConfig(null)} style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#475569' }}>
                <FiChevronLeft size={16} />
              </button>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', margin: 0 }}>Vulnerabilities</h2>
                  <span style={{ background: '#10b981', color: '#ffffff', fontSize: '11px', fontWeight: 700, padding: '2px 6px', borderRadius: '3px' }}>ENABLED</span>
                </div>
                <span style={{ fontSize: '13.5px', color: '#64748b' }}>Discover what applications are affected by well-known vulnerabilities</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <button style={{ background: 'none', border: 'none', color: '#005cca', fontSize: '13.5px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <FiRefreshCw size={13} /> Refresh
              </button>
              <select style={{ padding: '6px 12px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#ffffff', minWidth: '150px' }}>
                <option>node01 (master)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '24px' }}>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px', marginBottom: '16px' }}>Main settings</h4>
              <p style={{ fontSize: '12px', color: '#64748b', marginTop: '-8px', marginBottom: '16px' }}>General settings applied to the vulnerability detector and its providers</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '650px', marginLeft: 'auto', marginRight: 'auto' }}>
                {[
                  { label: 'Enables the vulnerability detection module', value: 'enabled' },
                  { label: 'Time interval for periodic feed updates', value: '60m' }
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
                    <span style={{ fontSize: '13px', color: '#475569', textAlign: 'right', flex: 1 }}>{item.label}</span>
                    <input type="text" readOnly value={item.value} style={{ width: '250px', padding: '6px 10px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#f8fafc' }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (selectedConfig === 'Osquery') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button onClick={() => setSelectedConfig(null)} style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#475569' }}>
                <FiChevronLeft size={16} />
              </button>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', margin: 0 }}>Osquery</h2>
                  <span style={{ background: '#10b981', color: '#ffffff', fontSize: '11px', fontWeight: 700, padding: '2px 6px', borderRadius: '3px' }}>ENABLED</span>
                </div>
                <span style={{ fontSize: '13.5px', color: '#64748b' }}>Expose an operating system as a high-performance relational database</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <button style={{ background: 'none', border: 'none', color: '#005cca', fontSize: '13.5px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <FiRefreshCw size={13} /> Refresh
              </button>
              <select style={{ padding: '6px 12px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#ffffff', minWidth: '150px' }}>
                <option>node01 (master)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '24px' }}>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px', marginBottom: '16px' }}>Main settings</h4>
              <p style={{ fontSize: '12px', color: '#64748b', marginTop: '-8px', marginBottom: '16px' }}>General Osquery integration settings</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '650px', marginLeft: 'auto', marginRight: 'auto' }}>
                {[
                  { label: 'Osquery integration status', value: 'enabled' },
                  { label: 'Auto-run the Osquery daemon', value: 'yes' },
                  { label: 'Path to the Osquery results log file', value: '/var/log/osquery/osqueryd.results.log' },
                  { label: 'Path to the Osquery configuration file', value: '/etc/osquery/osquery.conf' },
                  { label: 'Use defined labels as decorators', value: 'yes' }
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
                    <span style={{ fontSize: '13px', color: '#475569', textAlign: 'right', flex: 1 }}>{item.label}</span>
                    <input type="text" readOnly value={item.value} style={{ width: '250px', padding: '6px 10px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#f8fafc' }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (selectedConfig === 'Inventory data') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button onClick={() => setSelectedConfig(null)} style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#475569' }}>
                <FiChevronLeft size={16} />
              </button>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', margin: 0 }}>Inventory data</h2>
                  <span style={{ background: '#10b981', color: '#ffffff', fontSize: '11px', fontWeight: 700, padding: '2px 6px', borderRadius: '3px' }}>ENABLED</span>
                </div>
                <span style={{ fontSize: '13.5px', color: '#64748b' }}>Gather relevant information about system operating system, hardware, networking and packages</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <button style={{ background: 'none', border: 'none', color: '#005cca', fontSize: '13.5px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <FiRefreshCw size={13} /> Refresh
              </button>
              <select style={{ padding: '6px 12px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#ffffff', minWidth: '150px' }}>
                <option>node01 (master)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '24px' }}>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px', marginBottom: '16px' }}>Main settings</h4>
              <p style={{ fontSize: '12px', color: '#64748b', marginTop: '-8px', marginBottom: '16px' }}>General settings applied to all the scans</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '650px', marginLeft: 'auto', marginRight: 'auto' }}>
                {[
                  { label: 'Syscollector integration status', value: 'enabled' },
                  { label: 'Interval between system scans', value: '3600' },
                  { label: 'Scan on start', value: 'yes' }
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
                    <span style={{ fontSize: '13px', color: '#475569', textAlign: 'right', flex: 1 }}>{item.label}</span>
                    <input type="text" readOnly value={item.value} style={{ width: '250px', padding: '6px 10px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#f8fafc' }} />
                  </div>
                ))}
              </div>
            </div>

            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px', marginBottom: '16px' }}>Scan settings</h4>
              <p style={{ fontSize: '12px', color: '#64748b', marginTop: '-8px', marginBottom: '16px' }}>Specific inventory scans to collect</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '650px', marginLeft: 'auto', marginRight: 'auto' }}>
                {[
                  { label: 'Scan hardware info', value: 'yes' },
                  { label: 'Scan current processes', value: 'yes' },
                  { label: 'Scan operating system info', value: 'yes' },
                  { label: 'Scan installed packages', value: 'yes' },
                  { label: 'Scan network interfaces', value: 'yes' },
                  { label: 'Scan listening network ports', value: 'yes' },
                  { label: 'Scan all network ports', value: 'yes' },
                  { label: 'Scan groups', value: 'yes' },
                  { label: 'Scan users', value: 'yes' },
                  { label: 'Scan services', value: 'yes' },
                  { label: 'Scan browser extensions', value: 'yes' },
                  { label: 'Maximum event reporting throughput', value: '10' }
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
                    <span style={{ fontSize: '13px', color: '#475569', textAlign: 'right', flex: 1 }}>{item.label}</span>
                    <input type="text" readOnly value={item.value} style={{ width: '250px', padding: '6px 10px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#f8fafc' }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (selectedConfig === 'Active response') {
      const commandsList = [
        { name: 'disable-account', exec: 'disable-account', reverted: 'disabled' },
        { name: 'restart-wazuh', exec: 'restart-wazuh', reverted: 'disabled' },
        { name: 'firewall-drop', exec: 'firewall-drop', reverted: 'disabled' },
        { name: 'host-deny', exec: 'host-deny', reverted: 'disabled' },
        { name: 'route-null', exec: 'route-null', reverted: 'disabled' },
        { name: 'win_route-null', exec: 'win_route-null', reverted: 'disabled' },
        { name: 'netsh', exec: 'netsh', reverted: 'disabled' }
      ];
      const activeCmd = commandsList.find(c => c.name === activeResponseSelectedCommand) || commandsList[0];

      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button onClick={() => setSelectedConfig(null)} style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#475569' }}>
                <FiChevronLeft size={16} />
              </button>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', margin: 0 }}>Active response</h2>
                <span style={{ fontSize: '13.5px', color: '#64748b' }}>Active threat addressing by immediate response</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <button style={{ background: 'none', border: 'none', color: '#005cca', fontSize: '13.5px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <FiRefreshCw size={13} /> Refresh
              </button>
              <select style={{ padding: '6px 12px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#ffffff', minWidth: '150px' }}>
                <option>node01 (master)</option>
              </select>
            </div>
          </div>

          {/* Sub-tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', gap: '24px', margin: '0 0 10px 0' }}>
            {[
              { id: 'active_response', label: 'Active response' },
              { id: 'commands', label: 'Commands' }
            ].map(t => (
              <button 
                key={t.id}
                onClick={() => setActiveResponseSubTab(t.id as any)} 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  borderBottom: activeResponseSubTab === t.id ? '2.5px solid #005cca' : '2.5px solid transparent', 
                  paddingBottom: '8px', 
                  fontSize: '14.5px', 
                  fontWeight: activeResponseSubTab === t.id ? 600 : 500, 
                  color: activeResponseSubTab === t.id ? '#005cca' : '#64748b', 
                  cursor: 'pointer'
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {activeResponseSubTab === 'active_response' ? (
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '36px', textAlign: 'center' }}>
              <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '16px', maxWidth: '500px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: 600, color: '#334155' }}>
                  <span>🌐 Configuration not available</span>
                  <FiHelpCircle size={15} style={{ color: '#005cca', cursor: 'pointer' }} />
                </div>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: '1.6' }}>
                  This section is not present on the configuration file.
                  Click on the ❓ icon for help. Check the documentation links to learn more about how to configure it.
                </p>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '16px 20px', borderBottom: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', margin: '0 0 4px 0' }}>Command definitions</h3>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Find here all the currently defined commands used for Active response</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '24px', alignItems: 'start' }}>
                {/* Left Sidebar */}
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {commandsList.map(cmd => (
                    <button
                      key={cmd.name}
                      onClick={() => setActiveResponseSelectedCommand(cmd.name)}
                      style={{
                        textAlign: 'left',
                        padding: '10px 14px',
                        borderRadius: '4px',
                        border: 'none',
                        background: activeResponseSelectedCommand === cmd.name ? '#f1f5f9' : 'transparent',
                        color: activeResponseSelectedCommand === cmd.name ? '#005cca' : '#475569',
                        fontWeight: activeResponseSelectedCommand === cmd.name ? 600 : 500,
                        fontSize: '13px',
                        cursor: 'pointer',
                        display: 'block',
                        width: '100%',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {cmd.name}
                    </button>
                  ))}
                </div>

                {/* Right Form */}
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[
                    { label: 'Command name', value: activeCmd.name },
                    { label: 'Name of executable file', value: activeCmd.exec },
                    { label: 'Allow this command to be reverted', value: activeCmd.reverted }
                  ].map(field => (
                    <div key={field.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
                      <span style={{ fontSize: '13px', color: '#475569', textAlign: 'right', flex: 1 }}>{field.label}</span>
                      <input type="text" readOnly value={field.value} style={{ width: '300px', padding: '6px 10px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#f8fafc' }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    if (selectedConfig === 'Commands') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button onClick={() => setSelectedConfig(null)} style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#475569' }}>
                <FiChevronLeft size={16} />
              </button>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', margin: 0 }}>Commands</h2>
                <span style={{ fontSize: '13.5px', color: '#64748b' }}>Configuration options of the Command wodle</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <button style={{ background: 'none', border: 'none', color: '#005cca', fontSize: '13.5px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <FiRefreshCw size={13} /> Refresh
              </button>
              <select style={{ padding: '6px 12px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#ffffff', minWidth: '150px' }}>
                <option>node01 (master)</option>
              </select>
            </div>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '36px', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '16px', maxWidth: '500px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: 600, color: '#334155' }}>
                <span>🌐 Configuration not available</span>
                <FiHelpCircle size={15} style={{ color: '#005cca', cursor: 'pointer' }} />
              </div>
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: '1.6' }}>
                This section is not present on the configuration file.
                Click on the ❓ icon for help. Check the documentation links to learn more about how to configure it.
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (selectedConfig === 'Docker listener') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button onClick={() => setSelectedConfig(null)} style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#475569' }}>
                <FiChevronLeft size={16} />
              </button>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', margin: 0 }}>Docker listener</h2>
                <span style={{ fontSize: '13.5px', color: '#64748b' }}>Monitor and collect the activity from Docker containers such as creation, running, starting, stopping or pausing events</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <button style={{ background: 'none', border: 'none', color: '#005cca', fontSize: '13.5px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <FiRefreshCw size={13} /> Refresh
              </button>
              <select style={{ padding: '6px 12px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#ffffff', minWidth: '150px' }}>
                <option>node01 (master)</option>
              </select>
            </div>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '36px', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '16px', maxWidth: '500px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: 600, color: '#334155' }}>
                <span>🌐 Configuration not available</span>
                <FiHelpCircle size={15} style={{ color: '#005cca', cursor: 'pointer' }} />
              </div>
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: '1.6' }}>
                This section is not present on the configuration file.
                Click on the ❓ icon for help. Check the documentation links to learn more about how to configure it.
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (selectedConfig === 'Log collection') {
      const filesList = [
        { path: '/var/log/nginx/access.log', format: 'apache', location: '/var/log/nginx/access.log', redirect: 'agent' },
        { path: '/var/log/nginx/error.log', format: 'nginx', location: '/var/log/nginx/error.log', redirect: 'agent' },
        { path: '/var/log/apache2/error.log', format: 'apache', location: '/var/log/apache2/error.log', redirect: 'agent' },
        { path: '/var/log/apache2/access.log', format: 'apache', location: '/var/log/apache2/access.log', redirect: 'agent' },
        { path: '/var/ossec/logs/active-responses.log', format: 'syslog', location: '/var/ossec/logs/active-responses.log', redirect: 'agent' },
        { path: '/var/log/dpkg.log', format: 'syslog', location: '/var/log/dpkg.log', redirect: 'agent' }
      ];
      const activeFile = filesList.find(f => f.path === logCollectionSelectedFile) || filesList[0];

      const commandsList = [
        { name: 'df -P', format: 'command', command: 'df -P', alias: 'df -P', interval: '360', redirect: 'agent' },
        { name: 'netstat listening ports', format: 'command', command: 'netstat -tulpn', alias: 'netstat listening ports', interval: '360', redirect: 'agent' },
        { name: 'last -n 20', format: 'command', command: 'last -n 20', alias: 'last -n 20', interval: '360', redirect: 'agent' }
      ];
      const activeCommand = commandsList.find(c => c.name === logCollectionSelectedCommand) || commandsList[0];

      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button onClick={() => setSelectedConfig(null)} style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#475569' }}>
                <FiChevronLeft size={16} />
              </button>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', margin: 0 }}>Log collection</h2>
                <span style={{ fontSize: '13.5px', color: '#64748b' }}>Log analysis from text files, Windows events or syslog outputs</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <button style={{ background: 'none', border: 'none', color: '#005cca', fontSize: '13.5px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <FiRefreshCw size={13} /> Refresh
              </button>
              <select style={{ padding: '6px 12px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#ffffff', minWidth: '150px' }}>
                <option>node01 (master)</option>
              </select>
            </div>
          </div>

          {/* Sub-tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', gap: '24px', margin: '0 0 10px 0' }}>
            {[
              { id: 'logs', label: 'Logs' },
              { id: 'journald', label: 'Journald' },
              { id: 'commands', label: 'Commands' },
              { id: 'sockets', label: 'Sockets' }
            ].map(t => (
              <button 
                key={t.id}
                onClick={() => setLogCollectionSubTab(t.id as any)} 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  borderBottom: logCollectionSubTab === t.id ? '2.5px solid #005cca' : '2.5px solid transparent', 
                  paddingBottom: '8px', 
                  fontSize: '14.5px', 
                  fontWeight: logCollectionSubTab === t.id ? 600 : 500, 
                  color: logCollectionSubTab === t.id ? '#005cca' : '#64748b', 
                  cursor: 'pointer'
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {logCollectionSubTab === 'logs' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '16px 20px', borderBottom: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', margin: '0 0 4px 0' }}>Logs files</h3>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>List of log files that will be analyzed</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '24px', alignItems: 'start' }}>
                {/* Left Sidebar */}
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {filesList.map(f => (
                    <button
                      key={f.path}
                      onClick={() => setLogCollectionSelectedFile(f.path)}
                      style={{
                        textAlign: 'left',
                        padding: '10px 14px',
                        borderRadius: '4px',
                        border: 'none',
                        background: logCollectionSelectedFile === f.path ? '#f1f5f9' : 'transparent',
                        color: logCollectionSelectedFile === f.path ? '#005cca' : '#475569',
                        fontWeight: logCollectionSelectedFile === f.path ? 600 : 500,
                        fontSize: '12px',
                        wordBreak: 'break-all',
                        cursor: 'pointer',
                        display: 'block',
                        width: '100%',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {f.path}
                    </button>
                  ))}
                </div>

                {/* Right Form */}
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[
                    { label: 'Log format', value: activeFile.format },
                    { label: 'Log location', value: activeFile.location },
                    { label: 'Redirect output to this socket', value: activeFile.redirect },
                    { label: 'If the expression matches, the log will be ignored', value: '-' },
                    { label: 'The log will only be processed if the expression matches', value: '-' }
                  ].map(field => (
                    <div key={field.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
                      <span style={{ fontSize: '13px', color: '#475569', textAlign: 'right', flex: 1 }}>{field.label}</span>
                      <input type="text" readOnly value={field.value} style={{ width: '300px', padding: '6px 10px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#f8fafc' }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {logCollectionSubTab === 'journald' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '24px' }}>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px', marginBottom: '16px' }}>Journald events logs</h4>
                <p style={{ fontSize: '12px', color: '#64748b', marginTop: '-8px', marginBottom: '16px' }}>List of journald logs that will be processed</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '650px', marginLeft: 'auto', marginRight: 'auto' }}>
                  {[
                    { label: 'Log format', value: 'journald' },
                    { label: 'Only future events', value: 'yes' },
                    { label: 'Filters Disabled', value: 'true' }
                  ].map(item => (
                    <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
                      <span style={{ fontSize: '13px', color: '#475569', textAlign: 'right', flex: 1 }}>{item.label}</span>
                      <input type="text" readOnly value={item.value} style={{ width: '250px', padding: '6px 10px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#f8fafc' }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {logCollectionSubTab === 'commands' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '16px 20px', borderBottom: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', margin: '0 0 4px 0' }}>Command monitoring</h3>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>All output from these commands will be read as one or more log messages depending on whether command or full_command is used.</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '24px', alignItems: 'start' }}>
                {/* Left Sidebar */}
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {commandsList.map(c => (
                    <button
                      key={c.name}
                      onClick={() => setLogCollectionSelectedCommand(c.name)}
                      style={{
                        textAlign: 'left',
                        padding: '10px 14px',
                        borderRadius: '4px',
                        border: 'none',
                        background: logCollectionSelectedCommand === c.name ? '#f1f5f9' : 'transparent',
                        color: logCollectionSelectedCommand === c.name ? '#005cca' : '#475569',
                        fontWeight: logCollectionSelectedCommand === c.name ? 600 : 500,
                        fontSize: '12px',
                        wordBreak: 'break-all',
                        cursor: 'pointer',
                        display: 'block',
                        width: '100%',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>

                {/* Right Form */}
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[
                    { label: 'Log format', value: activeCommand.format },
                    { label: 'Run this command', value: activeCommand.command },
                    { label: 'Command alias', value: activeCommand.alias },
                    { label: 'Interval between command executions', value: activeCommand.interval },
                    { label: 'Redirect output to this socket', value: activeCommand.redirect }
                  ].map(field => (
                    <div key={field.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
                      <span style={{ fontSize: '13px', color: '#475569', textAlign: 'right', flex: 1 }}>{field.label}</span>
                      <input type="text" readOnly value={field.value} style={{ width: '300px', padding: '6px 10px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#f8fafc' }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {logCollectionSubTab === 'sockets' && (
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '36px', textAlign: 'center' }}>
              <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '16px', maxWidth: '500px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: 600, color: '#334155' }}>
                  <span>🌐 Configuration not available</span>
                  <FiHelpCircle size={15} style={{ color: '#005cca', cursor: 'pointer' }} />
                </div>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: '1.6' }}>
                  This section is not present on the configuration file.
                  Click on the ❓ icon for help. Check the documentation links to learn more about how to configure it.
                </p>
              </div>
            </div>
          )}
        </div>
      );
    }

    if (selectedConfig === 'Integrity monitoring') {
      const dirsList = [
        { path: '/bin', realtime: 'no', auditing: 'no', changes: 'no', allChecksums: 'no', md5sha1: 'no', md5: 'yes', sha1: 'yes', sha256: 'yes', size: 'yes', owner: 'yes', groups: 'yes', permissions: 'yes', modificationTime: 'yes', inodes: 'yes', recursion: '256', symlink: 'no' },
        { path: '/boot', realtime: 'no', auditing: 'no', changes: 'no', allChecksums: 'no', md5sha1: 'no', md5: 'yes', sha1: 'yes', sha256: 'yes', size: 'yes', owner: 'yes', groups: 'yes', permissions: 'yes', modificationTime: 'yes', inodes: 'yes', recursion: '256', symlink: 'no' },
        { path: '/etc', realtime: 'no', auditing: 'no', changes: 'no', allChecksums: 'no', md5sha1: 'no', md5: 'yes', sha1: 'yes', sha256: 'yes', size: 'yes', owner: 'yes', groups: 'yes', permissions: 'yes', modificationTime: 'yes', inodes: 'yes', recursion: '256', symlink: 'no' },
        { path: '/sbin', realtime: 'no', auditing: 'no', changes: 'no', allChecksums: 'no', md5sha1: 'no', md5: 'yes', sha1: 'yes', sha256: 'yes', size: 'yes', owner: 'yes', groups: 'yes', permissions: 'yes', modificationTime: 'yes', inodes: 'yes', recursion: '256', symlink: 'no' },
        { path: '/usr/bin', realtime: 'no', auditing: 'no', changes: 'no', allChecksums: 'no', md5sha1: 'no', md5: 'yes', sha1: 'yes', sha256: 'yes', size: 'yes', owner: 'yes', groups: 'yes', permissions: 'yes', modificationTime: 'yes', inodes: 'yes', recursion: '256', symlink: 'no' },
        { path: '/usr/sbin', realtime: 'no', auditing: 'no', changes: 'no', allChecksums: 'no', md5sha1: 'no', md5: 'yes', sha1: 'yes', sha256: 'yes', size: 'yes', owner: 'yes', groups: 'yes', permissions: 'yes', modificationTime: 'yes', inodes: 'yes', recursion: '256', symlink: 'no' }
      ];
      const activeDir = dirsList.find(d => d.path === integrityMonitoringSelectedDir) || dirsList[0];

      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button onClick={() => setSelectedConfig(null)} style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#475569' }}>
                <FiChevronLeft size={16} />
              </button>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', margin: 0 }}>Integrity monitoring</h2>
                  <span style={{ background: '#10b981', color: '#ffffff', fontSize: '11px', fontWeight: 700, padding: '2px 6px', borderRadius: '3px' }}>ENABLED</span>
                </div>
                <span style={{ fontSize: '13.5px', color: '#64748b' }}>Identify changes in content, permissions, ownership, and attributes of files</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <button style={{ background: 'none', border: 'none', color: '#005cca', fontSize: '13.5px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <FiRefreshCw size={13} /> Refresh
              </button>
              <select style={{ padding: '6px 12px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#ffffff', minWidth: '150px' }}>
                <option>node01 (master)</option>
              </select>
            </div>
          </div>

          {/* Sub-tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', gap: '20px', margin: '0 0 10px 0', overflowX: 'auto', paddingBottom: '2px' }}>
            {[
              { id: 'general', label: 'General' },
              { id: 'monitored', label: 'Monitored' },
              { id: 'ignored', label: 'Ignored' },
              { id: 'nodiff', label: 'No diff' },
              { id: 'whodata', label: 'Who-data' },
              { id: 'synchronization', label: 'Synchronization' },
              { id: 'fileslimit', label: 'Files limit' }
            ].map(t => (
              <button 
                key={t.id}
                onClick={() => setIntegrityMonitoringSubTab(t.id as any)} 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  whiteSpace: 'nowrap',
                  borderBottom: integrityMonitoringSubTab === t.id ? '2.5px solid #005cca' : '2.5px solid transparent', 
                  paddingBottom: '8px', 
                  fontSize: '14px', 
                  fontWeight: integrityMonitoringSubTab === t.id ? 600 : 500, 
                  color: integrityMonitoringSubTab === t.id ? '#005cca' : '#64748b', 
                  cursor: 'pointer'
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {integrityMonitoringSubTab === 'general' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '24px' }}>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px', marginBottom: '16px' }}>General</h4>
                <p style={{ fontSize: '12px', color: '#64748b', marginTop: '-8px', marginBottom: '16px' }}>The settings shown below are applied globally</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px', maxWidth: '750px', marginLeft: 'auto', marginRight: 'auto' }}>
                  {[
                    { label: 'Integrity monitoring status', value: 'enabled' },
                    { label: 'Interval (in seconds) to run the integrity scan', value: '60' },
                    { label: 'Time of day to run integrity scans', value: '-' },
                    { label: 'Day of the week to run integrity scans', value: '-' },
                    { label: 'Ignore files that change too many times', value: 'no' },
                    { label: 'Alert when new files are created', value: 'no' },
                    { label: 'Scan on start', value: 'yes' },
                    { label: 'Skip scan on CIFS/NFS mounts', value: 'yes' },
                    { label: 'Skip scan of /dev directory', value: 'yes' },
                    { label: 'Skip scan of /sys directory', value: 'yes' },
                    { label: 'Skip scan of /proc directory', value: 'yes' },
                    { label: 'Remove old local snapshots', value: 'yes' },
                    { label: 'Interval (in seconds) to check directories\' SACLs', value: '300' },
                    { label: 'Command to prevent prelinking', value: '-' },
                    { label: 'Maximum event reporting throughput', value: '50' },
                    { label: 'Process priority', value: '10' },
                    { label: 'Database type', value: 'disk' }
                  ].map(item => (
                    <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
                      <span style={{ fontSize: '13px', color: '#475569', textAlign: 'right', flex: 1 }}>{item.label}</span>
                      <input type="text" readOnly value={item.value} style={{ width: '250px', padding: '6px 10px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#f8fafc' }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {integrityMonitoringSubTab === 'monitored' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '16px 20px', borderBottom: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', margin: '0 0 4px 0' }}>Monitored directories</h3>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>These directories are included on the integrity scan</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '24px', alignItems: 'start' }}>
                {/* Left Sidebar */}
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {dirsList.map(d => (
                    <button
                      key={d.path}
                      onClick={() => setIntegrityMonitoringSelectedDir(d.path)}
                      style={{
                        textAlign: 'left',
                        padding: '10px 14px',
                        borderRadius: '4px',
                        border: 'none',
                        background: integrityMonitoringSelectedDir === d.path ? '#f1f5f9' : 'transparent',
                        color: integrityMonitoringSelectedDir === d.path ? '#005cca' : '#475569',
                        fontWeight: integrityMonitoringSelectedDir === d.path ? 600 : 500,
                        fontSize: '13px',
                        cursor: 'pointer',
                        display: 'block',
                        width: '100%',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {d.path}
                    </button>
                  ))}
                </div>

                {/* Right Form */}
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[
                    { label: 'Selected item', value: activeDir.path },
                    { label: 'Enable realtime monitoring', value: activeDir.realtime },
                    { label: 'Enable auditing (who-data)', value: activeDir.auditing },
                    { label: 'Report file changes', value: activeDir.changes },
                    { label: 'Perform all checksums', value: activeDir.allChecksums },
                    { label: 'Check sums (MD5 & SHA1)', value: activeDir.md5sha1 },
                    { label: 'Check MD5 sum', value: activeDir.md5 },
                    { label: 'Check SHA1 sum', value: activeDir.sha1 },
                    { label: 'Check SHA256 sum', value: activeDir.sha256 },
                    { label: 'Check files size', value: activeDir.size },
                    { label: 'Check files owner', value: activeDir.owner },
                    { label: 'Check files groups', value: activeDir.groups },
                    { label: 'Check files permissions', value: activeDir.permissions },
                    { label: 'Check files modification time', value: activeDir.modificationTime },
                    { label: 'Check files inodes', value: activeDir.inodes },
                    { label: 'Recursion level', value: activeDir.recursion },
                    { label: 'Follow symbolic link', value: activeDir.symlink }
                  ].map(field => (
                    <div key={field.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
                      <span style={{ fontSize: '13px', color: '#475569', textAlign: 'right', flex: 1 }}>{field.label}</span>
                      <input type="text" readOnly value={field.value} style={{ width: '300px', padding: '6px 10px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#f8fafc' }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {integrityMonitoringSubTab === 'ignored' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '24px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', margin: '0 0 4px 0' }}>Ignored files and directories</h3>
                <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 20px 0' }}>These files and directories are ignored from the integrity scan</p>
                
                <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#475569', margin: '0 0 8px 0' }}>Path</h4>
                <div style={{ border: '1px solid #e2e8f0', borderRadius: '4px', overflow: 'hidden', marginBottom: '24px' }}>
                  {[
                    '/etc/mtab',
                    '/etc/hosts.deny',
                    '/etc/mail/statistics',
                    '/etc/random-seed',
                    '/etc/random.seed',
                    '/etc/adjtime',
                    '/etc/httpd/logs',
                    '/etc/utmpx',
                    '/etc/wtmpx',
                    '/etc/cups/certs',
                    '/etc/dumpdates',
                    '/etc/svc/volatile'
                  ].map((p, idx) => (
                    <div key={idx} style={{ 
                      padding: '10px 16px', 
                      fontSize: '13px', 
                      color: '#334155', 
                      background: idx % 2 === 0 ? '#f8fafc' : '#ffffff',
                      borderBottom: idx === 11 ? 'none' : '1px solid #e2e8f0'
                    }}>
                      {p}
                    </div>
                  ))}
                </div>

                <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#475569', margin: '0 0 8px 0' }}>Sregex</h4>
                <div style={{ border: '1px solid #e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ padding: '10px 16px', fontSize: '13px', color: '#334155', background: '#f8fafc' }}>
                    .log$|.swp$
                  </div>
                </div>
              </div>
            </div>
          )}

          {integrityMonitoringSubTab === 'nodiff' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '24px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', margin: '0 0 4px 0' }}>No diff directories</h3>
                <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 20px 0' }}>These files won't have their diff calculated</p>
                
                <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#475569', margin: '0 0 8px 0' }}>Path</h4>
                <div style={{ border: '1px solid #e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ padding: '10px 16px', fontSize: '13px', color: '#334155', background: '#f8fafc' }}>
                    /etc/ssl/private.key
                  </div>
                </div>
              </div>
            </div>
          )}

          {integrityMonitoringSubTab === 'whodata' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '24px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', margin: '0 0 4px 0' }}>Who-data audit keys</h3>
                <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 20px 0' }}>Server will include in its FIM baseline those events being monitored by Audit using audit_key.</p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '650px', marginLeft: 'auto', marginRight: 'auto' }}>
                  {[
                    { label: 'Restart audit', value: 'yes' },
                    { label: 'Startup healthcheck', value: 'yes' },
                    { label: 'Provider', value: 'audit' },
                    { label: 'Queue size', value: '16384' }
                  ].map(item => (
                    <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
                      <span style={{ fontSize: '13px', color: '#475569', textAlign: 'right', flex: 1 }}>{item.label}</span>
                      <input type="text" readOnly value={item.value} style={{ width: '250px', padding: '6px 10px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#f8fafc' }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {integrityMonitoringSubTab === 'synchronization' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '24px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', margin: '0 0 4px 0' }}>Synchronization</h3>
                <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 20px 0' }}>Database synchronization settings</p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '650px', marginLeft: 'auto', marginRight: 'auto' }}>
                  {[
                    { label: 'Synchronization status', value: 'enabled' },
                    { label: 'Maximum interval (in seconds) between every sync', value: '3600' },
                    { label: 'Interval (in seconds) between every sync', value: '300' },
                    { label: 'Response timeout (in seconds)', value: '30' },
                    { label: 'Queue size of the manager responses', value: '16384' },
                    { label: 'Maximum message throughput', value: '10' },
                    { label: 'Number of threads', value: '1' }
                  ].map(item => (
                    <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
                      <span style={{ fontSize: '13px', color: '#475569', textAlign: 'right', flex: 1 }}>{item.label}</span>
                      <input type="text" readOnly value={item.value} style={{ width: '250px', padding: '6px 10px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#f8fafc' }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {integrityMonitoringSubTab === 'fileslimit' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '24px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', margin: '0 0 4px 0' }}>Files limit</h3>
                <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 20px 0' }}>Limit the maximum files in the FIM database</p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '650px', marginLeft: 'auto', marginRight: 'auto' }}>
                  {[
                    { label: 'File limit status', value: 'enabled' },
                    { label: 'Maximum number of files to monitor', value: '100000' }
                  ].map(item => (
                    <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
                      <span style={{ fontSize: '13px', color: '#475569', textAlign: 'right', flex: 1 }}>{item.label}</span>
                      <input type="text" readOnly value={item.value} style={{ width: '250px', padding: '6px 10px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#f8fafc' }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {integrityMonitoringSubTab !== 'general' && integrityMonitoringSubTab !== 'monitored' && integrityMonitoringSubTab !== 'ignored' && integrityMonitoringSubTab !== 'nodiff' && integrityMonitoringSubTab !== 'whodata' && integrityMonitoringSubTab !== 'synchronization' && integrityMonitoringSubTab !== 'fileslimit' && (
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '36px', textAlign: 'center' }}>
              <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '16px', maxWidth: '500px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: 600, color: '#334155' }}>
                  <span>🌐 Configuration not available</span>
                  <FiHelpCircle size={15} style={{ color: '#005cca', cursor: 'pointer' }} />
                </div>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: '1.6' }}>
                  This section is not present on the configuration file.
                  Click on the ❓ icon for help. Check the documentation links to learn more about how to configure it.
                </p>
              </div>
            </div>
          )}
        </div>
      );
    }

    if (selectedConfig === 'Agentless') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button onClick={() => setSelectedConfig(null)} style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#475569' }}>
                <FiChevronLeft size={16} />
              </button>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', margin: 0 }}>Agentless</h2>
                <span style={{ fontSize: '13.5px', color: '#64748b' }}>Run integrity checks on devices such as routers, firewalls and switches</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <button style={{ background: 'none', border: 'none', color: '#005cca', fontSize: '13.5px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <FiRefreshCw size={13} /> Refresh
              </button>
              <select style={{ padding: '6px 12px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#ffffff', minWidth: '150px' }}>
                <option>node01 (master)</option>
              </select>
            </div>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '36px', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '16px', maxWidth: '600px', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', fontWeight: 600, color: '#334155' }}>
                <span style={{ fontSize: '18px' }}>🌐</span>
                <span>Configuration not available</span>
                <FiHelpCircle size={15} style={{ color: '#005cca', cursor: 'pointer' }} />
              </div>
              <div style={{ height: '1px', background: '#e2e8f0', width: '100%' }}></div>
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: '1.6' }}>
                There was a problem while fetching the configuration for this section. It may be a server problem or the configuration doesn't exist. Click on the ❓ icon for help. Check the documentation links to learn more about how to configure it.
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (selectedConfig === 'Amazon S3') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button onClick={() => setSelectedConfig(null)} style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#475569' }}>
                <FiChevronLeft size={16} />
              </button>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', margin: 0 }}>Amazon S3</h2>
                <span style={{ fontSize: '13.5px', color: '#64748b' }}>Security events related to Amazon AWS services, collected directly via AWS API</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <button style={{ background: 'none', border: 'none', color: '#005cca', fontSize: '13.5px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <FiRefreshCw size={13} /> Refresh
              </button>
              <select style={{ padding: '6px 12px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#ffffff', minWidth: '150px' }}>
                <option>node01 (master)</option>
              </select>
            </div>
          </div>

          {/* Sub-tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', gap: '20px', margin: '0 0 10px 0', overflowX: 'auto', paddingBottom: '2px' }}>
            {[
              { id: 'general', label: 'General' },
              { id: 'buckets', label: 'Buckets' },
              { id: 'services', label: 'Services' }
            ].map(t => (
              <button 
                key={t.id}
                onClick={() => setAmazonS3SubTab(t.id as any)} 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  whiteSpace: 'nowrap',
                  borderBottom: amazonS3SubTab === t.id ? '2.5px solid #005cca' : '2.5px solid transparent', 
                  paddingBottom: '8px', 
                  fontSize: '14px', 
                  fontWeight: amazonS3SubTab === t.id ? 600 : 500, 
                  color: amazonS3SubTab === t.id ? '#005cca' : '#64748b', 
                  cursor: 'pointer'
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '36px', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '16px', maxWidth: '600px', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', fontWeight: 600, color: '#334155' }}>
                <span style={{ fontSize: '18px' }}>🌐</span>
                <span>Configuration not available</span>
                <FiHelpCircle size={15} style={{ color: '#005cca', cursor: 'pointer' }} />
              </div>
              <div style={{ height: '1px', background: '#e2e8f0', width: '100%' }}></div>
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: '1.6' }}>
                This section is not present on the configuration file. Click on the ❓ icon for help. Check the documentation links to learn more about how to configure it.
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (selectedConfig === 'Azure Logs') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button onClick={() => setSelectedConfig(null)} style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#475569' }}>
                <FiChevronLeft size={16} />
              </button>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', margin: 0 }}>Azure Logs</h2>
                <span style={{ fontSize: '13.5px', color: '#64748b' }}>Configuration options of the Azure Logs wodle</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <button style={{ background: 'none', border: 'none', color: '#005cca', fontSize: '13.5px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <FiRefreshCw size={13} /> Refresh
              </button>
              <select style={{ padding: '6px 12px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#ffffff', minWidth: '150px' }}>
                <option>node01 (master)</option>
              </select>
            </div>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '36px', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '16px', maxWidth: '600px', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', fontWeight: 600, color: '#334155' }}>
                <span style={{ fontSize: '18px' }}>🌐</span>
                <span>Configuration not available</span>
                <FiHelpCircle size={15} style={{ color: '#005cca', cursor: 'pointer' }} />
              </div>
              <div style={{ height: '1px', background: '#e2e8f0', width: '100%' }}></div>
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: '1.6' }}>
                This section is not present on the configuration file. Click on the ❓ icon for help. Check the documentation links to learn more about how to configure it.
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (selectedConfig === 'Google Cloud Pub/Sub') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button onClick={() => setSelectedConfig(null)} style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#475569' }}>
                <FiChevronLeft size={16} />
              </button>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', margin: 0 }}>Google Cloud Pub/Sub</h2>
                <span style={{ fontSize: '13.5px', color: '#64748b' }}>Configuration options of the Google Cloud Pub/Sub module</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <button style={{ background: 'none', border: 'none', color: '#005cca', fontSize: '13.5px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <FiRefreshCw size={13} /> Refresh
              </button>
              <select style={{ padding: '6px 12px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#ffffff', minWidth: '150px' }}>
                <option>node01 (master)</option>
              </select>
            </div>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '36px', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '16px', maxWidth: '600px', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', fontWeight: 600, color: '#334155' }}>
                <span style={{ fontSize: '18px' }}>🌐</span>
                <span>Configuration not available</span>
                <FiHelpCircle size={15} style={{ color: '#005cca', cursor: 'pointer' }} />
              </div>
              <div style={{ height: '1px', background: '#e2e8f0', width: '100%' }}></div>
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: '1.6' }}>
                This section is not present on the configuration file. Click on the ❓ icon for help. Check the documentation links to learn more about how to configure it.
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (selectedConfig === 'GitHub') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button onClick={() => setSelectedConfig(null)} style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#475569' }}>
                <FiChevronLeft size={16} />
              </button>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', margin: 0 }}>GitHub</h2>
                <span style={{ fontSize: '13.5px', color: '#64748b' }}>Detect threats targeting GitHub organizations</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <button style={{ background: 'none', border: 'none', color: '#005cca', fontSize: '13.5px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <FiRefreshCw size={13} /> Refresh
              </button>
              <select style={{ padding: '6px 12px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#ffffff', minWidth: '150px' }}>
                <option>node01 (master)</option>
              </select>
            </div>
          </div>

          {/* Sub-tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', gap: '20px', margin: '0 0 10px 0', overflowX: 'auto', paddingBottom: '2px' }}>
            {[
              { id: 'general', label: 'General' },
              { id: 'credentials', label: 'Credentials' }
            ].map(t => (
              <button 
                key={t.id}
                onClick={() => setGithubSubTab(t.id as any)} 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  whiteSpace: 'nowrap',
                  borderBottom: githubSubTab === t.id ? '2.5px solid #005cca' : '2.5px solid transparent', 
                  paddingBottom: '8px', 
                  fontSize: '14px', 
                  fontWeight: githubSubTab === t.id ? 600 : 500, 
                  color: githubSubTab === t.id ? '#005cca' : '#64748b', 
                  cursor: 'pointer'
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '36px', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '16px', maxWidth: '600px', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', fontWeight: 600, color: '#334155' }}>
                <span style={{ fontSize: '18px' }}>🌐</span>
                <span>Configuration not available</span>
                <FiHelpCircle size={15} style={{ color: '#005cca', cursor: 'pointer' }} />
              </div>
              <div style={{ height: '1px', background: '#e2e8f0', width: '100%' }}></div>
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: '1.6' }}>
                This section is not present on the configuration file. Click on the ❓ icon for help. Check the documentation links to learn more about how to configure it.
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (selectedConfig === 'Office 365') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button onClick={() => setSelectedConfig(null)} style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#475569' }}>
                <FiChevronLeft size={16} />
              </button>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', margin: 0 }}>Office 365</h2>
                <span style={{ fontSize: '13.5px', color: '#64748b' }}>Configuration options of the Office 365 module</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <button style={{ background: 'none', border: 'none', color: '#005cca', fontSize: '13.5px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <FiRefreshCw size={13} /> Refresh
              </button>
              <select style={{ padding: '6px 12px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#ffffff', minWidth: '150px' }}>
                <option>node01 (master)</option>
              </select>
            </div>
          </div>

          {/* Sub-tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', gap: '20px', margin: '0 0 10px 0', overflowX: 'auto', paddingBottom: '2px' }}>
            {[
              { id: 'general', label: 'General' },
              { id: 'credentials', label: 'Credentials' },
              { id: 'subscriptions', label: 'Subscriptions' }
            ].map(t => (
              <button 
                key={t.id}
                onClick={() => setOffice365SubTab(t.id as any)} 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  whiteSpace: 'nowrap',
                  borderBottom: office365SubTab === t.id ? '2.5px solid #005cca' : '2.5px solid transparent', 
                  paddingBottom: '8px', 
                  fontSize: '14px', 
                  fontWeight: office365SubTab === t.id ? 600 : 500, 
                  color: office365SubTab === t.id ? '#005cca' : '#64748b', 
                  cursor: 'pointer'
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '36px', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '16px', maxWidth: '600px', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', fontWeight: 600, color: '#334155' }}>
                <span style={{ fontSize: '18px' }}>🌐</span>
                <span>Configuration not available</span>
                <FiHelpCircle size={15} style={{ color: '#005cca', cursor: 'pointer' }} />
              </div>
              <div style={{ height: '1px', background: '#e2e8f0', width: '100%' }}></div>
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: '1.6' }}>
                This section is not present on the configuration file. Click on the ❓ icon for help. Check the documentation links to learn more about how to configure it.
              </p>
            </div>
          </div>
        </div>
      );
    }

    const configSections = [
      {
        title: 'Main configurations',
        items: [
          { name: 'Global Configuration', desc: 'Global and remote settings' },
          { name: 'Cluster', desc: 'Master node configuration' },
          { name: 'Registration Service', desc: 'Automatic agent registration service' }
        ]
      },
      {
        title: 'Alerts and output management',
        items: [
          { name: 'Alerts', desc: 'Settings related to the alerts and their format' },
          { name: 'Integrations', desc: 'Slack, VirusTotal and PagerDuty integrations with external APIs' }
        ]
      },
      {
        title: 'Auditing and policy monitoring',
        items: [
          { name: 'Policy monitoring', desc: 'Configuration to ensure compliance with security policies, standards and hardening guides' },
          { name: 'OpenSCAP', desc: 'Configuration assessment and automation of compliance monitoring using SCAP checks' },
          { name: 'CIS-CAT', desc: 'Configuration assessment using CIS scanner and SCAP checks' }
        ]
      },
      {
        title: 'System threats and incident response',
        items: [
          { name: 'Vulnerabilities', desc: 'Discover what applications are affected by well-known vulnerabilities' },
          { name: 'Osquery', desc: 'Expose an operating system as a high-performance relational database' },
          { name: 'Inventory data', desc: 'Gather relevant information about system operating system, hardware, networking and packages' },
          { name: 'Active response', desc: 'Active threat addressing by immediate response' },
          { name: 'Commands', desc: 'Configuration options of the Command wodle' },
          { name: 'Docker listener', desc: 'Monitor and collect the activity from Docker containers such as creation, running, starting, stopping or pausing events' }
        ]
      },
      {
        title: 'Log data analysis',
        items: [
          { name: 'Log collection', desc: 'Log analysis from text files, Windows events or syslog outputs' },
          { name: 'Integrity monitoring', desc: 'Identify changes in content, permissions, ownership, and attributes of files' },
          { name: 'Agentless', desc: 'Run integrity checks on devices such as routers, firewalls and switches' }
        ]
      },
      {
        title: 'Cloud security monitoring',
        items: [
          { name: 'Amazon S3', desc: 'Security events related to Amazon AWS services, collected directly via AWS API' },
          { name: 'Azure Logs', desc: 'Configuration options of the Azure Logs wodle' },
          { name: 'Google Cloud Pub/Sub', desc: 'Configuration options of the Google Cloud Pub/Sub module' },
          { name: 'GitHub', desc: 'Detect threats targeting GitHub organizations' },
          { name: 'Office 365', desc: 'Configuration options of the Office 365 module' }
        ]
      }
    ];

    const clickableNames = ['Global Configuration', 'Cluster', 'Registration Service', 'Alerts', 'Integrations', 'Policy monitoring', 'OpenSCAP', 'CIS-CAT', 'Vulnerabilities', 'Osquery', 'Inventory data', 'Active response', 'Commands', 'Docker listener', 'Log collection', 'Integrity monitoring', 'Agentless', 'Amazon S3', 'Azure Logs', 'Google Cloud Pub/Sub', 'GitHub', 'Office 365'];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Header toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', margin: 0 }}>Configuration</h2>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <button style={{ background: 'none', border: 'none', color: '#005cca', fontSize: '13.5px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
              <FiRefreshCw size={13} /> Refresh
            </button>
            <button style={{ background: 'none', border: 'none', color: '#005cca', fontSize: '13.5px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
              <FiEdit2 size={13} /> Edit configuration
            </button>
            <select style={{ padding: '6px 12px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#ffffff', minWidth: '150px' }}>
              <option>node01 (master)</option>
            </select>
          </div>
        </div>

        {/* Configuration sections blocks */}
        {configSections.map((sec, idx) => (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h3 style={{ fontSize: '15.5px', fontWeight: 600, color: '#1e293b', margin: '10px 0 2px 0' }}>{sec.title}</h3>
            <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
              <table className="wz-table">
                <thead>
                  <tr>
                    <th style={{ width: '25%' }}>Name</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {sec.items.map(item => {
                    const isClickable = clickableNames.includes(item.name);
                    return (
                      <tr key={item.name}>
                        <td 
                          onClick={() => isClickable && setSelectedConfig(item.name)}
                          style={{ 
                            fontWeight: 600, 
                            color: '#005cca', 
                            cursor: isClickable ? 'pointer' : 'default',
                            textDecoration: isClickable ? 'underline' : 'none'
                          }}
                        >
                          {item.name}
                        </td>
                        <td style={{ color: '#475569' }}>{item.desc}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}

      </div>
    );
  };

  const renderTabContent = () => {
    switch (tab) {
      case 'status':
        return renderStatus();
      case 'cluster':
        return (
          <div className="wz-pill-card" style={{ padding: '24px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>Cluster Configuration</h3>
            <p style={{ color: '#64748b', fontSize: '13.5px' }}>Wazuh Manager cluster node01 is active. Currently connected to 1 worker node.</p>
          </div>
        );
      case 'stats':
        return renderStatistics();
      case 'logs':
        return renderLogs();
      case 'config':
        return renderConfiguration();
      case 'devtools':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)', minHeight: '600px', background: '#ffffff' }}>
            {/* Top Toolbar menu */}
            <div style={{ display: 'flex', gap: '20px', padding: '12px 24px', borderBottom: '1px solid #e2e8f0', background: '#ffffff', alignItems: 'center' }}>
              {['Console', 'History', 'Settings', 'Help', 'Export', 'Import'].map((item, idx) => (
                <span 
                  key={idx} 
                  style={{ 
                    fontSize: '13px', 
                    color: item === 'Console' ? '#1e293b' : '#94a3b8', 
                    fontWeight: item === 'Console' ? 600 : 500, 
                    cursor: 'pointer',
                    borderBottom: item === 'Console' ? '2.5px solid #005cca' : 'none',
                    paddingBottom: '4px',
                    marginTop: '2px',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
                  }}
                >
                  {item}
                </span>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0', borderBottom: '1px solid #cbd5e1', flex: 1, overflow: 'hidden' }}>
              {/* Left Pane: Editor */}
              <div style={{ display: 'flex', flexDirection: 'column', background: '#ffffff', position: 'relative', borderRight: '1px solid #cbd5e1' }}>
                {/* Editor Workspace */}
                <div style={{ display: 'flex', flex: 1, position: 'relative', overflow: 'hidden' }}>
                  {/* Line numbers gutter */}
                  <div style={{ background: '#ffffff', padding: '16px 8px 16px 12px', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', userSelect: 'none', textAlign: 'right', minWidth: '45px', gap: '0' }}>
                    {devToolsConsoleInput.split('\n').map((_, idx) => (
                      <div key={idx} style={{ fontSize: '13px', fontFamily: 'monospace', color: '#94a3b8', height: '20px', lineHeight: '20px' }}>
                        {idx + 1}
                      </div>
                    ))}
                  </div>

                  {/* Text area */}
                  <textarea 
                    value={devToolsConsoleInput}
                    onChange={(e) => setDevToolsConsoleInput(e.target.value)}
                    style={{ 
                      flex: 1, 
                      border: 'none', 
                      outline: 'none', 
                      resize: 'none', 
                      padding: '16px 16px', 
                      fontSize: '13px', 
                      fontFamily: 'monospace', 
                      lineHeight: '20px', 
                      color: '#1e293b',
                      background: '#ffffff',
                      overflowY: 'auto'
                    }}
                  />

                  {/* Execute helper buttons overlay */}
                  <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button 
                      onClick={() => {
                        const query = devToolsConsoleInput;
                        if (!query.trim()) {
                          toast.error('Please enter a query');
                          return;
                        }
                        const match = query.match(/(\w+(?:\.\w+)?)\s*:\s*"?([^"]+)"?/);
                        if (match) {
                          const [, field, value] = match;
                          toast.success(`Query parsed: ${field} = ${value}`);
                          navigate(`/events?search=${encodeURIComponent(value)}`);
                        } else {
                          navigate(`/events?search=${encodeURIComponent(query.trim())}`);
                        }
                        setDevToolsConsoleOutput(JSON.stringify({ took: 5, hits: { total: { value: 3 }, hits: [{ _source: { 'agent.id': '001' } }] } }, null, 2));
                        toast.success('Request executed successfully');
                      }}
                      title="Run request"
                      style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#00a853', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
                    >
                      <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="22" width="22" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 5v14l11-7z"></path>
                      </svg>
                    </button>
                    <button 
                      title="Options"
                      style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
                    >
                      <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="16" width="16" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Pane: Response */}
              <div style={{ display: 'flex', background: '#ffffff', overflow: 'hidden' }}>
                {/* Left part of Response pane: response output */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                  <pre style={{ 
                    flex: 1, 
                    margin: 0, 
                    padding: '16px 20px', 
                    fontSize: '13px', 
                    fontFamily: 'monospace', 
                    lineHeight: '20px', 
                    color: '#0f766e',
                    background: '#ffffff',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-all'
                  }}>
                    {devToolsConsoleOutput}
                  </pre>
                </div>

                {/* Right part: Welcome drawer (30%) */}
                {devToolsShowWelcome && (
                  <div style={{ 
                    width: '320px', 
                    borderLeft: '1px solid #cbd5e1', 
                    background: '#ffffff', 
                    padding: '24px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '16px',
                    overflowY: 'auto',
                    position: 'relative'
                  }}>
                    {/* Close button X */}
                    <button 
                      onClick={() => setDevToolsShowWelcome(false)}
                      style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'none', color: '#64748b', fontSize: '20px', cursor: 'pointer', outline: 'none' }}
                    >
                      ×
                    </button>

                    <h3 style={{ fontSize: '22px', fontWeight: 300, color: '#1e293b', margin: '0 0 4px 0', paddingRight: '20px' }}>Welcome to Console</h3>

                    <h4 style={{ fontSize: '13.5px', fontWeight: 600, color: '#1e293b', margin: 0 }}>Quick intro to the UI</h4>
                    <p style={{ fontSize: '12.5px', color: '#475569', margin: 0, lineHeight: '1.6' }}>
                      The Console UI is split into two panes: an editor pane (left) and a response pane (right). Use the editor to type requests and submit them to OpenSearch. The results will be displayed in the response pane on the right side.
                    </p>

                    <p style={{ fontSize: '12.5px', color: '#475569', margin: 0, lineHeight: '1.6' }}>
                      Console understands requests in a compact format, similar to cURL:
                    </p>

                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '12px', fontFamily: 'monospace', fontSize: '11.5px', color: '#334155', lineHeight: '1.5' }}>
                      <span style={{ color: '#94a3b8' }}># index a doc</span><br />
                      <span style={{ fontWeight: 600 }}>PUT index/_doc/1</span><br />
                      <span>{`{`}</span><br />
                      <span>&nbsp;&nbsp;"body": "here"</span><br />
                      <span>{`}`}</span><br /><br />
                      <span style={{ color: '#94a3b8' }}># and get it ...</span><br />
                      <span style={{ fontWeight: 600 }}>GET index/_doc/1</span>
                    </div>

                    <p style={{ fontSize: '12.5px', color: '#475569', margin: 0, lineHeight: '1.6' }}>
                      While typing a request, Console will make suggestions which you can then accept by hitting Enter/Tab. These suggestions are made based on the request structure as well as your indices and types.
                    </p>

                    <h4 style={{ fontSize: '13.5px', fontWeight: 600, color: '#1e293b', margin: '8px 0 0 0' }}>A few quick tips, while I have your attention</h4>

                    <button 
                      onClick={() => setDevToolsShowWelcome(false)}
                      style={{ background: '#005cca', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', outline: 'none', marginTop: '16px', alignSelf: 'flex-start' }}
                    >
                      Dismiss
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 'security':
        {
          const policies = [
            { id: 1, name: 'agents_all_resourceless', actions: 'agent:create, agent:uninstall, group:create', resources: '*:*:*', effect: 'allow', status: 'Reserved' },
            { id: 2, name: 'agents_all_agents', actions: 'agent:delete, agent:modify_group, agent:read, agent:reconnect, agent:restart, agent:upgrade', resources: 'agent:id:*, agent:group:*', effect: 'allow', status: 'Reserved' },
            { id: 3, name: 'agents_all_groups', actions: 'group:delete, group:modify_assignments, group:read, group:update_config', resources: 'group:id:*', effect: 'allow', status: 'Reserved' },
            { id: 4, name: 'agents_read_agents', actions: 'agent:read', resources: 'agent:id:*, agent:group:*', effect: 'allow', status: 'Reserved' },
            { id: 5, name: 'agents_read_groups', actions: 'group:read', resources: 'group:id:*', effect: 'allow', status: 'Reserved' },
            { id: 6, name: 'agents_commands_agents', actions: 'active-response:command', resources: 'agent:id:*', effect: 'allow', status: 'Reserved' },
            { id: 7, name: 'security_all_resourceless', actions: 'security:create, security:create_user, security:edit_run_as, security:read_config, security:revoke, security:update_config', resources: '*:*:*', effect: 'allow', status: 'Reserved' },
            { id: 8, name: 'security_all_security', actions: 'security:delete, security:read, security:update', resources: 'role:id:*, policy:id:*, user:id:*, rule:id:*', effect: 'allow', status: 'Reserved' },
            { id: 9, name: 'users_all_resourceless', actions: 'security:create_user, security:edit_run_as, security:revoke', resources: '*:*:*', effect: 'allow', status: 'Reserved' },
            { id: 10, name: 'users_all_users', actions: 'security:delete, security:read, security:update', resources: 'user:id:*', effect: 'allow', status: 'Reserved' },
            { id: 11, name: 'cluster_all_resourceless', actions: 'cluster:read', resources: '*:*:*', effect: 'allow', status: 'Reserved' },
            { id: 12, name: 'cluster_all_nodes', actions: 'cluster:status', resources: 'node:id:*', effect: 'allow', status: 'Reserved' },
            { id: 13, name: 'cluster_read_resourceless', actions: 'cluster:read', resources: '*:*:*', effect: 'allow', status: 'Reserved' },
            { id: 14, name: 'cluster_read_nodes', actions: 'cluster:status', resources: 'node:id:*', effect: 'allow', status: 'Reserved' },
            { id: 15, name: 'ciscat_read_ciscat', actions: 'ciscat:read', resources: 'agent:id:*', effect: 'allow', status: 'Reserved' },
            { id: 16, name: 'decoders_all_files', actions: 'decoders:delete, decoders:read, decoders:update, decoders:upload', resources: 'file:name:*', effect: 'allow', status: 'Reserved' },
            { id: 17, name: 'decoders_all_resourceless', actions: 'decoders:create', resources: '*:*:*', effect: 'allow', status: 'Reserved' },
            { id: 18, name: 'lists_all_rules', actions: 'rules:delete, rules:read, rules:update, rules:upload', resources: 'rule:id:*', effect: 'allow', status: 'Reserved' },
            { id: 19, name: 'lists_all_resourceless', actions: 'rules:create', resources: '*:*:*', effect: 'allow', status: 'Reserved' },
            { id: 20, name: 'rootcheck_all_rootcheck', actions: 'rootcheck:read, rootcheck:run', resources: 'agent:id:*', effect: 'allow', status: 'Reserved' }
          ];

          const roles = [
            { id: 1, name: 'administrator', policies: ['agents_all_resourceless', 'agents_all_agents', 'agents_all_groups', 'agents_commands_agents', 'security_all_resourceless', 'security_all_security', 'cluster_all_resourceless', 'cluster_all_nodes', 'ciscat_read_ciscat', 'decoders_all_files', 'decoders_all_resourceless', 'lists_all_rules', 'lists_all_resourceless', 'rootcheck_all_rootcheck', 'rules_all_files', 'rules_all_resourceless', 'mitre_read_mitre', 'sca_read_sca', 'syscheck_all_syscheck', 'syscollector_read_syscollector', 'logtest_all_logtest', 'task_status_task', 'events_ingest_resourceless'], status: 'Reserved' },
            { id: 2, name: 'readonly', policies: ['agents_read_agents', 'agents_read_groups', 'ciscat_read_ciscat', 'cluster_read_resourceless', 'cluster_read_nodes', 'decoders_read_decoders', 'lists_read_rules', 'rootcheck_read_rootcheck', 'rules_read_rules', 'mitre_read_mitre', 'sca_read_sca', 'syscheck_read_syscheck', 'syscollector_read_syscollector'], status: 'Reserved' },
            { id: 3, name: 'users_admin', policies: ['users_all_resourceless', 'users_all_users'], status: 'Reserved' },
            { id: 4, name: 'agents_readonly', policies: ['agents_read_agents', 'agents_read_groups'], status: 'Reserved' },
            { id: 5, name: 'agents_admin', policies: ['agents_all_resourceless', 'agents_all_agents', 'agents_all_groups'], status: 'Reserved' },
            { id: 6, name: 'cluster_readonly', policies: ['cluster_read_resourceless', 'cluster_read_nodes'], status: 'Reserved' },
            { id: 7, name: 'cluster_admin', policies: ['cluster_all_resourceless', 'cluster_all_nodes'], status: 'Reserved' }
          ];

          const rolesMapping = [
            { id: 1, name: 'wui_elastic_admin', roles: ['administrator'] },
            { id: 2, name: 'wui_opensearch_admin', roles: ['administrator'] }
          ];

          // Pagination logic for policies
          const policiesPerPage = 10;
          const totalPoliciesPages = Math.ceil(policies.length / policiesPerPage);
          const paginatedPolicies = policies.slice((securityPolicyPage - 1) * policiesPerPage, securityPolicyPage * policiesPerPage);

          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Tabs */}
              <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', gap: '24px', paddingBottom: '0' }}>
                {[
                  { id: 'users', label: 'Users' },
                  { id: 'roles', label: 'Roles' },
                  { id: 'policies', label: 'Policies' },
                  { id: 'roles_mapping', label: 'Roles mapping' }
                ].map(t => (
                  <button 
                    key={t.id}
                    onClick={() => setSecuritySubTab(t.id as any)} 
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      borderBottom: securitySubTab === t.id ? '2.5px solid #005cca' : '2.5px solid transparent', 
                      paddingBottom: '12px', 
                      fontSize: '14.5px', 
                      fontWeight: securitySubTab === t.id ? 600 : 500, 
                      color: securitySubTab === t.id ? '#005cca' : '#64748b', 
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Users Tab content */}
              {securitySubTab === 'users' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#1e293b', margin: 0 }}>Users</h2>
                    <button 
                      onClick={() => setShowCreateUserModal(true)}
                      style={{ background: '#005cca', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '8px 16px', fontSize: '13.5px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <FiPlus size={14} /> Create user
                    </button>
                  </div>

                  {/* Users Table */}
                  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#ffffff' }}>
                          <th style={{ padding: '14px 20px', color: '#475569', fontWeight: 600 }}>User ↑</th>
                          <th style={{ padding: '14px 20px', color: '#475569', fontWeight: 600 }}>Allow run as</th>
                          <th style={{ padding: '14px 20px', color: '#475569', fontWeight: 600 }}>Roles</th>
                          <th style={{ padding: '14px 20px', color: '#475569', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {securityUsers.map((user, idx) => (
                          <tr key={idx} style={{ borderBottom: idx === securityUsers.length - 1 ? 'none' : '1px solid #e2e8f0' }}>
                            <td style={{ padding: '14px 20px', color: '#1e293b', fontWeight: 500 }}>{user.username}</td>
                            <td style={{ padding: '14px 20px', color: '#475569' }}>{user.password.replace(/./g, '•')}</td>
                            <td style={{ padding: '14px 20px' }}>
                              <span style={{ background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>{user.role}</span>
                            </td>
                            <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                              <button 
                                onClick={() => {
                                  if (user.username === 'wazuh' || user.username === 'wazuh-wui') return;
                                  const updated = securityUsers.filter(u => u.username !== user.username);
                                  setSecurityUsers(updated);
                                  localStorage.setItem('wz_security_users', JSON.stringify(updated));
                                }}
                                disabled={user.username === 'wazuh' || user.username === 'wazuh-wui'}
                                style={{ background: 'none', border: 'none', color: user.username === 'wazuh' || user.username === 'wazuh-wui' ? '#cbd5e1' : '#ef4444', cursor: user.username === 'wazuh' || user.username === 'wazuh-wui' ? 'not-allowed' : 'pointer', padding: '4px' }}
                              >
                                <FiTrash2 size={15} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Create User Modal Overlay */}
                  {showCreateUserModal && (
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                      <div style={{ background: '#ffffff', padding: '24px', borderRadius: '6px', width: '400px', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                        <h3 style={{ margin: 0, fontSize: '16.5px', fontWeight: 600, color: '#1e293b' }}>Create user</h3>
                        <div>
                          <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#475569', marginBottom: '6px' }}>Username</label>
                          <input 
                            type="text" 
                            value={newUsername} 
                            onChange={e => {
                              setNewUsername(e.target.value);
                              setUsernameError('');
                            }}
                            style={{ width: '100%', padding: '8px 12px', fontSize: '13.5px', border: usernameError ? '1px solid #ef4444' : '1px solid #cbd5e1', borderRadius: '4px', outline: 'none' }}
                            placeholder="Type user name"
                          />
                          {usernameError && <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>{usernameError}</span>}
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#475569', marginBottom: '6px' }}>Password</label>
                          <input 
                            type="password" 
                            value={newPassword} 
                            onChange={e => {
                              setNewPassword(e.target.value);
                              setPasswordError('');
                            }}
                            style={{ width: '100%', padding: '8px 12px', fontSize: '13.5px', border: passwordError ? '1px solid #ef4444' : '1px solid #cbd5e1', borderRadius: '4px', outline: 'none' }}
                            placeholder="Type password"
                          />
                          {passwordError && <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>{passwordError}</span>}
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#475569', marginBottom: '6px' }}>Role</label>
                          <select 
                            value={newRole} 
                            onChange={e => setNewRole(e.target.value)}
                            style={{ width: '100%', padding: '8px 12px', fontSize: '13.5px', border: '1px solid #cbd5e1', borderRadius: '4px', outline: 'none', background: '#ffffff' }}
                          >
                            <option value="administrator">administrator</option>
                            <option value="readonly">readonly</option>
                            <option value="users_admin">users_admin</option>
                          </select>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                          <button 
                            onClick={() => {
                              setShowCreateUserModal(false);
                              setNewUsername('');
                              setNewPassword('');
                              setPasswordError('');
                              setUsernameError('');
                            }}
                            style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#475569', padding: '6px 16px', borderRadius: '4px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}
                          >
                            Cancel
                          </button>
                          <button 
                            onClick={() => {
                              if (!newUsername.trim()) {
                                setUsernameError('Username is required');
                                toast.error('Validation failed');
                                return;
                              }
                              if (newPassword.length < 8) {
                                setPasswordError('Password must be at least 8 characters');
                                toast.error('Validation failed');
                                return;
                              }
                              if (securityUsers.some(u => u.username === newUsername.trim())) {
                                setUsernameError('Username already exists');
                                toast.error('Validation failed');
                                return;
                              }
                              const updated = [...securityUsers, { username: newUsername.trim(), password: newPassword, role: newRole }];
                              setSecurityUsers(updated);
                              localStorage.setItem('wz_security_users', JSON.stringify(updated));
                              toast.success('User created successfully');
                              setNewUsername('');
                              setNewPassword('');
                              setPasswordError('');
                              setUsernameError('');
                              setShowCreateUserModal(false);
                            }}
                            style={{ background: '#005cca', border: 'none', color: '#ffffff', padding: '6px 16px', borderRadius: '4px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                          >
                            Create
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Roles Tab content */}
              {securitySubTab === 'roles' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#1e293b', margin: 0 }}>Roles</h2>
                    <button style={{ background: '#005cca', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '8px 16px', fontSize: '13.5px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <FiPlus size={14} /> Create role
                    </button>
                  </div>

                  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <th style={{ padding: '14px 20px', color: '#475569', fontWeight: 600 }}>ID ↑</th>
                          <th style={{ padding: '14px 20px', color: '#475569', fontWeight: 600 }}>Name</th>
                          <th style={{ padding: '14px 20px', color: '#475569', fontWeight: 600 }}>Policies</th>
                          <th style={{ padding: '14px 20px', color: '#475569', fontWeight: 600 }}>Status</th>
                          <th style={{ padding: '14px 20px', color: '#475569', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {roles.map((role, idx) => (
                          <tr key={role.id} style={{ borderBottom: idx === roles.length - 1 ? 'none' : '1px solid #e2e8f0' }}>
                            <td style={{ padding: '14px 20px', color: '#475569' }}>{role.id}</td>
                            <td style={{ padding: '14px 20px', color: '#1e293b', fontWeight: 500 }}>{role.name}</td>
                            <td style={{ padding: '14px 20px', maxWidth: '400px' }}>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                {role.policies.map(p => (
                                  <span key={p} style={{ background: '#f1f5f9', color: '#334155', border: '1px solid #e2e8f0', padding: '1px 6px', borderRadius: '3px', fontSize: '11px', fontFamily: 'monospace' }}>{p}</span>
                                ))}
                              </div>
                            </td>
                            <td style={{ padding: '14px 20px' }}>
                              <span style={{ background: '#eff6ff', color: '#1e40af', border: '1px solid #bfdbfe', padding: '2px 8px', borderRadius: '4px', fontSize: '11.5px', fontWeight: 600 }}>{role.status}</span>
                            </td>
                            <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                              <button disabled style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'not-allowed', padding: '4px' }}>
                                <FiTrash2 size={15} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Policies Tab content */}
              {securitySubTab === 'policies' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#1e293b', margin: 0 }}>Policies</h2>
                    <button style={{ background: '#005cca', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '8px 16px', fontSize: '13.5px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <FiPlus size={14} /> Create policy
                    </button>
                  </div>

                  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <th style={{ padding: '14px 20px', color: '#475569', fontWeight: 600 }}>ID ↑</th>
                          <th style={{ padding: '14px 20px', color: '#475569', fontWeight: 600 }}>Name</th>
                          <th style={{ padding: '14px 20px', color: '#475569', fontWeight: 600 }}>Actions</th>
                          <th style={{ padding: '14px 20px', color: '#475569', fontWeight: 600 }}>Resources</th>
                          <th style={{ padding: '14px 20px', color: '#475569', fontWeight: 600 }}>Effect</th>
                          <th style={{ padding: '14px 20px', color: '#475569', fontWeight: 600 }}>Status</th>
                          <th style={{ padding: '14px 20px', color: '#475569', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedPolicies.map((policy, idx) => (
                          <tr key={policy.id} style={{ borderBottom: idx === paginatedPolicies.length - 1 ? 'none' : '1px solid #e2e8f0' }}>
                            <td style={{ padding: '14px 20px', color: '#64748b' }}>{policy.id}</td>
                            <td style={{ padding: '14px 20px', color: '#1e293b', fontWeight: 600 }}>{policy.name}</td>
                            <td style={{ padding: '14px 20px', color: '#475569', maxWidth: '300px', wordBreak: 'break-all' }}>{policy.actions}</td>
                            <td style={{ padding: '14px 20px', color: '#475569', fontFamily: 'monospace' }}>{policy.resources}</td>
                            <td style={{ padding: '14px 20px', color: '#166534', fontWeight: 600 }}>{policy.effect}</td>
                            <td style={{ padding: '14px 20px' }}>
                              <span style={{ background: '#eff6ff', color: '#1e40af', border: '1px solid #bfdbfe', padding: '2px 8px', borderRadius: '4px', fontSize: '11.5px', fontWeight: 600 }}>{policy.status}</span>
                            </td>
                            <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                              <button disabled style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'not-allowed', padding: '4px' }}>
                                <FiTrash2 size={15} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Pagination matching Wazuh */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', borderTop: '1px solid #e2e8f0', fontSize: '13px', color: '#64748b', background: '#ffffff' }}>
                      <div>
                        Rows per page: 10
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <button 
                          onClick={() => setSecurityPolicyPage(1)}
                          disabled={securityPolicyPage === 1}
                          style={{ background: 'none', border: 'none', cursor: securityPolicyPage === 1 ? 'not-allowed' : 'pointer', color: securityPolicyPage === 1 ? '#cbd5e1' : '#005cca', fontSize: '15px', display: 'flex', alignItems: 'center' }}
                        >
                          ‹
                        </button>
                        <span style={{ fontWeight: 600, color: '#1e293b' }}>{securityPolicyPage}</span>
                        <button 
                          onClick={() => setSecurityPolicyPage(2)}
                          disabled={securityPolicyPage === totalPoliciesPages}
                          style={{ background: 'none', border: 'none', cursor: securityPolicyPage === totalPoliciesPages ? 'not-allowed' : 'pointer', color: securityPolicyPage === totalPoliciesPages ? '#cbd5e1' : '#005cca', fontSize: '15px', display: 'flex', alignItems: 'center' }}
                        >
                          ›
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Roles mapping Tab content */}
              {securitySubTab === 'roles_mapping' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#1e293b', margin: 0 }}>Roles mapping</h2>
                    <button style={{ background: '#ffffff', color: '#005cca', border: '1px solid #005cca', borderRadius: '4px', padding: '8px 16px', fontSize: '13.5px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Create Role mapping
                    </button>
                  </div>

                  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <th style={{ padding: '14px 20px', color: '#475569', fontWeight: 600 }}>ID ↑</th>
                          <th style={{ padding: '14px 20px', color: '#475569', fontWeight: 600 }}>Name</th>
                          <th style={{ padding: '14px 20px', color: '#475569', fontWeight: 600 }}>Roles</th>
                          <th style={{ padding: '14px 20px', color: '#475569', fontWeight: 600 }}>Status</th>
                          <th style={{ padding: '14px 20px', color: '#475569', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rolesMapping.map((mapping, idx) => (
                          <tr key={mapping.id} style={{ borderBottom: idx === rolesMapping.length - 1 ? 'none' : '1px solid #e2e8f0' }}>
                            <td style={{ padding: '14px 20px', color: '#64748b' }}>{mapping.id}</td>
                            <td style={{ padding: '14px 20px', color: '#1e293b', fontWeight: 600 }}>{mapping.name}</td>
                            <td style={{ padding: '14px 20px' }}>
                              {mapping.roles.map(r => (
                                <span key={r} style={{ background: '#48c78e', color: '#115e3b', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>{r}</span>
                              ))}
                            </td>
                            <td style={{ padding: '14px 20px' }}>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <span style={{ background: '#eff6ff', color: '#1e40af', border: '1px solid #bfdbfe', padding: '2px 8px', borderRadius: '4px', fontSize: '11.5px', fontWeight: 600 }}>Reserved</span>
                                <span style={{ background: '#ec4899', color: '#ffffff', padding: '2px 8px', borderRadius: '4px', fontSize: '11.5px', fontWeight: 600 }}>wazuh-wui</span>
                              </div>
                            </td>
                            <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                              <button disabled style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'not-allowed', padding: '4px' }}>
                                <FiTrash2 size={15} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Pagination footer */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', borderTop: '1px solid #e2e8f0', fontSize: '13px', color: '#64748b', background: '#ffffff' }}>
                      <div>
                        Rows per page: 10
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <button disabled style={{ background: 'none', border: 'none', cursor: 'not-allowed', color: '#cbd5e1', fontSize: '15px' }}>‹</button>
                        <span style={{ fontWeight: 600, color: '#1e293b' }}>1</span>
                        <button disabled style={{ background: 'none', border: 'none', cursor: 'not-allowed', color: '#cbd5e1', fontSize: '15px' }}>›</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        }
      case 'indices':
      case 'snapshots':
        {
          // Synchronize default subview based on current tab
          const activeSubView = tab === 'snapshots' && !['snapshot_policies', 'snapshots_list', 'repositories'].includes(indexerSubView)
            ? 'snapshot_policies'
            : tab === 'indices' && ['snapshot_policies', 'snapshots_list', 'repositories'].includes(indexerSubView)
              ? 'state_policies'
              : indexerSubView;

          const indexesData = [
            { name: 'wazuh-statistics-2026.24w', health: 'Green', datastream: '-', managed: 'No', status: 'Open', size: '570kb', priSize: '570kb', docs: 395, deletedDocs: 0, primaries: 1, replicas: 0 },
            { name: 'wazuh-states-vulnerabilities-wazuh', health: 'Green', datastream: '-', managed: 'No', status: 'Open', size: '208b', priSize: '208b', docs: 0, deletedDocs: 0, primaries: 1, replicas: 0 },
            { name: 'wazuh-states-vulnerabilities-saad-cyber6', health: 'Green', datastream: '-', managed: 'No', status: 'Open', size: '13.7mb', priSize: '13.7mb', docs: 18329, deletedDocs: 7070, primaries: 1, replicas: 0 },
            { name: 'wazuh-states-inventory-users-wazuh', health: 'Green', datastream: '-', managed: 'No', status: 'Open', size: '208b', priSize: '208b', docs: 0, deletedDocs: 0, primaries: 1, replicas: 0 },
            { name: 'wazuh-states-inventory-users-saad-cyber6', health: 'Green', datastream: '-', managed: 'No', status: 'Open', size: '78.7kb', priSize: '78.7kb', docs: 51, deletedDocs: 5, primaries: 1, replicas: 0 },
            { name: 'wazuh-states-inventory-system-wazuh', health: 'Green', datastream: '-', managed: 'No', status: 'Open', size: '208b', priSize: '208b', docs: 0, deletedDocs: 0, primaries: 1, replicas: 0 },
            { name: 'wazuh-states-inventory-system-saad-cyber6', health: 'Green', datastream: '-', managed: 'No', status: 'Open', size: '23.2kb', priSize: '23.2kb', docs: 1, deletedDocs: 0, primaries: 1, replicas: 0 },
            { name: 'wazuh-states-inventory-services-wazuh', health: 'Green', datastream: '-', managed: 'No', status: 'Open', size: '208b', priSize: '208b', docs: 0, deletedDocs: 0, primaries: 1, replicas: 0 },
            { name: 'wazuh-states-inventory-services-saad-cyber6', health: 'Green', datastream: '-', managed: 'No', status: 'Open', size: '105.2kb', priSize: '105.2kb', docs: 131, deletedDocs: 9, primaries: 1, replicas: 0 },
            { name: 'wazuh-states-inventory-protocols-wazuh', health: 'Green', datastream: '-', managed: 'No', status: 'Open', size: '208b', priSize: '208b', docs: 0, deletedDocs: 0, primaries: 1, replicas: 0 },
            { name: 'wazuh-states-inventory-protocols-saad-cyber6', health: 'Green', datastream: '-', managed: 'No', status: 'Open', size: '7.6kb', priSize: '7.6kb', docs: 2, deletedDocs: 0, primaries: 1, replicas: 0 },
            { name: 'wazuh-states-inventory-processes-wazuh', health: 'Green', datastream: '-', managed: 'No', status: 'Open', size: '14.1kb', priSize: '14.1kb', docs: 0, deletedDocs: 0, primaries: 1, replicas: 0 },
            { name: 'wazuh-states-inventory-processes-saad-cyber6', health: 'Green', datastream: '-', managed: 'No', status: 'Open', size: '102.8kb', priSize: '102.8kb', docs: 215, deletedDocs: 0, primaries: 1, replicas: 0 },
            { name: 'wazuh-states-inventory-ports-wazuh', health: 'Green', datastream: '-', managed: 'No', status: 'Open', size: '13.2kb', priSize: '13.2kb', docs: 0, deletedDocs: 0, primaries: 1, replicas: 0 },
            { name: 'wazuh-states-inventory-ports-saad-cyber6', health: 'Green', datastream: '-', managed: 'No', status: 'Open', size: '45.9kb', priSize: '45.9kb', docs: 54, deletedDocs: 7, primaries: 1, replicas: 0 },
            { name: 'wazuh-states-inventory-packages-wazuh', health: 'Green', datastream: '-', managed: 'No', status: 'Open', size: '208b', priSize: '208b', docs: 0, deletedDocs: 0, primaries: 1, replicas: 0 },
            { name: 'wazuh-states-inventory-packages-saad-cyber6', health: 'Green', datastream: '-', managed: 'No', status: 'Open', size: '536.8kb', priSize: '536.8kb', docs: 1703, deletedDocs: 8, primaries: 1, replicas: 0 },
            { name: 'wazuh-states-inventory-networks-wazuh', health: 'Green', datastream: '-', managed: 'No', status: 'Open', size: '208b', priSize: '208b', docs: 0, deletedDocs: 0, primaries: 1, replicas: 0 },
            { name: 'wazuh-states-inventory-networks-saad-cyber6', health: 'Green', datastream: '-', managed: 'No', status: 'Open', size: '8kb', priSize: '8kb', docs: 2, deletedDocs: 0, primaries: 1, replicas: 0 },
            { name: 'wazuh-states-inventory-interfaces-wazuh', health: 'Green', datastream: '-', managed: 'No', status: 'Open', size: '208b', priSize: '208b', docs: 0, deletedDocs: 0, primaries: 1, replicas: 0 }
          ];

          const templatesData = [
            { name: 'wazuh-states-vulnerabilities-saad-cyber6_template', type: 'Indexes', patterns: 'wazuh-states-vulnerabilities-*', priority: 1, componentsCount: 0 },
            { name: 'wazuh-states-inventory-users-saad-cyber6_template', type: 'Indexes', patterns: 'wazuh-states-inventory-users*', priority: 1, componentsCount: 0 },
            { name: 'wazuh-states-inventory-system-saad-cyber6_template', type: 'Indexes', patterns: 'wazuh-states-inventory-system*', priority: 1, componentsCount: 0 },
            { name: 'wazuh-states-inventory-services-saad-cyber6_template', type: 'Indexes', patterns: 'wazuh-states-inventory-services*', priority: 1, componentsCount: 0 },
            { name: 'wazuh-states-inventory-protocols-saad-cyber6_template', type: 'Indexes', patterns: 'wazuh-states-inventory-protocols*', priority: 1, componentsCount: 0 },
            { name: 'wazuh-states-inventory-processes-saad-cyber6_template', type: 'Indexes', patterns: 'wazuh-states-inventory-processes*', priority: 1, componentsCount: 0 },
            { name: 'wazuh-states-inventory-ports-saad-cyber6_template', type: 'Indexes', patterns: 'wazuh-states-inventory-ports*', priority: 1, componentsCount: 0 },
            { name: 'wazuh-states-inventory-packages-saad-cyber6_template', type: 'Indexes', patterns: 'wazuh-states-inventory-packages*', priority: 1, componentsCount: 0 },
            { name: 'wazuh-states-inventory-networks-saad-cyber6_template', type: 'Indexes', patterns: 'wazuh-states-inventory-networks*', priority: 1, componentsCount: 0 },
            { name: 'wazuh-states-inventory-interfaces-saad-cyber6_template', type: 'Indexes', patterns: 'wazuh-states-inventory-interfaces*', priority: 1, componentsCount: 0 },
            { name: 'wazuh-states-inventory-hotfixes-saad-cyber6_template', type: 'Indexes', patterns: 'wazuh-states-inventory-hotfixes*', priority: 1, componentsCount: 0 },
            { name: 'wazuh-states-inventory-hardware-saad-cyber6_template', type: 'Indexes', patterns: 'wazuh-states-inventory-hardware*', priority: 1, componentsCount: 0 },
            { name: 'wazuh-states-inventory-groups-saad-cyber6_template', type: 'Indexes', patterns: 'wazuh-states-inventory-groups*', priority: 1, componentsCount: 0 },
            { name: 'wazuh-states-inventory-browser-extensions-saad-cyber6_template', type: 'Indexes', patterns: 'wazuh-states-inventory-browser-extensions*', priority: 1, componentsCount: 0 }
          ];

          // Paginate indexes list
          const indexesPerPage = 20;
          const totalIndexesPages = Math.ceil(indexesData.length / indexesPerPage);
          const paginatedIndexes = indexesData.slice((indexesPage - 1) * indexesPerPage, indexesPage * indexesPerPage);

          return (
            <div style={{ display: 'flex', gap: '24px', width: '100%', minHeight: '600px' }}>
              {/* Left sidebar navigation links */}
              <div style={{ width: '240px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Index Management */}
                <div>
                  <h4 style={{ textTransform: 'none', fontSize: '13.5px', fontWeight: 700, color: '#1e293b', marginBottom: '8px', marginTop: 0 }}>Index Management</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {[
                      { id: 'state_policies', label: 'State management policies' },
                      { id: 'policy_indexes', label: 'Policy managed indexes' },
                      { id: 'indexes', label: 'Indexes' },
                      { id: 'datastreams', label: 'Data streams' },
                      { id: 'templates', label: 'Templates' },
                      { id: 'component_templates', label: 'Component templates', isNested: true },
                      { id: 'aliases', label: 'Aliases' },
                      { id: 'rollup', label: 'Rollup jobs' },
                      { id: 'transform', label: 'Transform jobs' },
                      { id: 'notifications', label: 'Notification settings' }
                    ].map(link => {
                      const isActive = activeSubView === link.id;
                      return (
                        <div 
                          key={link.id} 
                          onClick={() => setIndexerSubView(link.id)}
                          style={{
                            padding: '6px 12px',
                            paddingLeft: link.isNested ? '24px' : '12px',
                            fontSize: '13px',
                            color: isActive ? '#005cca' : '#475569',
                            fontWeight: isActive ? 600 : 500,
                            cursor: 'pointer',
                            borderRadius: '4px',
                            background: isActive ? '#eff6ff' : 'transparent',
                            transition: 'all 0.1s ease-in-out',
                            position: 'relative'
                          }}
                        >
                          {link.isNested && <span style={{ color: '#cbd5e1', marginRight: '6px' }}>└</span>}
                          {link.label}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Snapshot Management */}
                <div>
                  <h4 style={{ textTransform: 'none', fontSize: '13.5px', fontWeight: 700, color: '#1e293b', marginBottom: '8px', marginTop: 0 }}>Snapshot Management</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {[
                      { id: 'snapshot_policies', label: 'Snapshot policies' },
                      { id: 'snapshots_list', label: 'Snapshots' },
                      { id: 'repositories', label: 'Repositories' }
                    ].map(link => {
                      const isActive = activeSubView === link.id;
                      return (
                        <div 
                          key={link.id} 
                          onClick={() => setIndexerSubView(link.id)}
                          style={{
                            padding: '6px 12px',
                            fontSize: '13px',
                            color: isActive ? '#005cca' : '#475569',
                            fontWeight: isActive ? 600 : 500,
                            cursor: 'pointer',
                            borderRadius: '4px',
                            background: isActive ? '#eff6ff' : 'transparent',
                            transition: 'all 0.1s ease-in-out'
                          }}
                        >
                          {link.label}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Main Content card */}
              <div style={{ flexGrow: 1, minWidth: 0 }}>
                {activeSubView === 'state_policies' && (
                  <div className="wz-pill-card" style={{ padding: '20px 24px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', minHeight: '400px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h2 style={{ fontSize: '24px', fontWeight: 400, color: '#1e293b', margin: 0 }}>State management policies</h2>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button disabled style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#cbd5e1', borderRadius: '4px', padding: '8px 16px', fontSize: '13.5px', fontWeight: 500, cursor: 'not-allowed' }}>Delete</button>
                        <button disabled style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#cbd5e1', borderRadius: '4px', padding: '8px 16px', fontSize: '13.5px', fontWeight: 500, cursor: 'not-allowed' }}>Edit</button>
                        <button style={{ background: '#ffffff', border: '1px solid #005cca', color: '#005cca', borderRadius: '4px', padding: '8px 16px', fontSize: '13.5px', fontWeight: 600, cursor: 'pointer' }}>Create policy</button>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '6px 12px', background: '#ffffff', maxWidth: '400px' }}>
                      <FiSearch style={{ color: '#64748b', marginRight: '8px' }} size={16} />
                      <input type="text" placeholder="Search" style={{ border: 'none', outline: 'none', fontSize: '13px', width: '100%' }} />
                    </div>

                    <div style={{ border: '1px solid #e2e8f0', borderRadius: '6px', overflow: 'hidden', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                        <thead>
                          <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <th style={{ padding: '12px 20px', width: '40px' }}><input type="checkbox" disabled /></th>
                            <th style={{ padding: '12px 20px', color: '#475569', fontWeight: 600 }}>Policy ↓</th>
                            <th style={{ padding: '12px 20px', color: '#475569', fontWeight: 600 }}>Description</th>
                            <th style={{ padding: '12px 20px', color: '#475569', fontWeight: 600 }}>Last updated time</th>
                          </tr>
                        </thead>
                      </table>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexGrow: 1, padding: '60px 20px', textAlign: 'center' }}>
                        <span style={{ fontSize: '14px', color: '#64748b' }}>There are no existing policies. Create a policy to apply to your indices.</span>
                        <button style={{ background: '#005cca', border: 'none', color: '#ffffff', borderRadius: '4px', padding: '10px 20px', fontSize: '13.5px', fontWeight: 600, marginTop: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <FiPlus size={14} /> Create policy
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeSubView === 'policy_indexes' && (
                  <div className="wz-pill-card" style={{ padding: '20px 24px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', minHeight: '400px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h2 style={{ fontSize: '24px', fontWeight: 400, color: '#1e293b', margin: 0 }}>Policy managed indexes</h2>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button style={{ background: '#ffffff', border: '1px solid #005cca', color: '#005cca', borderRadius: '4px', padding: '8px 16px', fontSize: '13.5px', fontWeight: 600, cursor: 'pointer' }}>Refresh</button>
                        <button style={{ background: '#ffffff', border: '1px solid #005cca', color: '#005cca', borderRadius: '4px', padding: '8px 16px', fontSize: '13.5px', fontWeight: 600, cursor: 'pointer' }}>Change policy</button>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button disabled style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#cbd5e1', borderRadius: '4px', padding: '6px 12px', fontSize: '12.5px', fontWeight: 500, cursor: 'not-allowed' }}>Edit rollover alias</button>
                      <button disabled style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#cbd5e1', borderRadius: '4px', padding: '6px 12px', fontSize: '12.5px', fontWeight: 500, cursor: 'not-allowed' }}>Remove policy</button>
                      <button disabled style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#cbd5e1', borderRadius: '4px', padding: '6px 12px', fontSize: '12.5px', fontWeight: 500, cursor: 'not-allowed' }}>Retry policy</button>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '6px 12px', background: '#ffffff', width: '300px' }}>
                        <FiSearch style={{ color: '#64748b', marginRight: '8px' }} size={16} />
                        <input type="text" placeholder="Search index name" style={{ border: 'none', outline: 'none', fontSize: '13px', width: '100%' }} />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475569' }}>
                        <input type="checkbox" id="show_ds" defaultChecked />
                        <label htmlFor="show_ds" style={{ cursor: 'pointer' }}>Show data stream indexes</label>
                      </div>
                    </div>

                    <div style={{ border: '1px solid #e2e8f0', borderRadius: '6px', overflow: 'hidden', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                        <thead>
                          <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <th style={{ padding: '12px 20px', width: '40px' }}><input type="checkbox" disabled /></th>
                            <th style={{ padding: '12px 20px', color: '#475569', fontWeight: 600 }}>Index ↓</th>
                            <th style={{ padding: '12px 20px', color: '#475569', fontWeight: 600 }}>Policy</th>
                            <th style={{ padding: '12px 20px', color: '#475569', fontWeight: 600 }}>State</th>
                            <th style={{ padding: '12px 20px', color: '#475569', fontWeight: 600 }}>Action</th>
                            <th style={{ padding: '12px 20px', color: '#475569', fontWeight: 600 }}>Info</th>
                            <th style={{ padding: '12px 20px', color: '#475569', fontWeight: 600 }}>Job Status</th>
                          </tr>
                        </thead>
                      </table>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexGrow: 1, padding: '60px 20px', textAlign: 'center' }}>
                        <span style={{ fontSize: '14px', color: '#64748b' }}>There are no existing managed indexes. Create a policy to add to an index.</span>
                        <button style={{ background: '#005cca', border: 'none', color: '#ffffff', borderRadius: '4px', padding: '10px 20px', fontSize: '13.5px', fontWeight: 600, marginTop: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <FiPlus size={14} /> Create policy
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeSubView === 'indexes' && (
                  <div className="wz-pill-card" style={{ padding: '20px 24px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h2 style={{ fontSize: '24px', fontWeight: 400, color: '#1e293b', margin: 0 }}>Indexes (40)</h2>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#005cca', borderRadius: '4px', padding: '8px 16px', fontSize: '13.5px', fontWeight: 600, cursor: 'pointer' }}>Refresh</button>
                        <select style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#334155', borderRadius: '4px', padding: '8px 16px', fontSize: '13.5px', fontWeight: 500, outline: 'none' }}>
                          <option>Actions</option>
                          <option>Open</option>
                          <option>Close</option>
                          <option>Delete</option>
                        </select>
                        <button style={{ background: '#005cca', border: 'none', color: '#ffffff', borderRadius: '4px', padding: '8px 16px', fontSize: '13.5px', fontWeight: 600, cursor: 'pointer' }}>+ Create Index</button>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                      <div style={{ display: 'flex', gap: '12px', flexGrow: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '6px 12px', background: '#ffffff', width: '300px' }}>
                          <FiSearch style={{ color: '#64748b', marginRight: '8px' }} size={16} />
                          <input type="text" placeholder="Search" style={{ border: 'none', outline: 'none', fontSize: '13px', width: '100%' }} />
                        </div>
                        <select style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#475569', borderRadius: '4px', padding: '6px 12px', fontSize: '13px', outline: 'none' }}>
                          <option>Data streams</option>
                        </select>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475569', flexShrink: 0 }}>
                        <input type="checkbox" id="show_ds_ind" defaultChecked />
                        <label htmlFor="show_ds_ind" style={{ cursor: 'pointer' }}>Show data stream indexes</label>
                      </div>
                    </div>

                    <div style={{ border: '1px solid #e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
                        <thead>
                          <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <th style={{ padding: '12px 16px', width: '40px' }}><input type="checkbox" disabled /></th>
                            <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 600 }}>Index ↓</th>
                            <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 600 }}>Health</th>
                            <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 600 }}>Data stream</th>
                            <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 600 }}>Managed by...</th>
                            <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 600 }}>Status</th>
                            <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 600 }}>Total size</th>
                            <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 600 }}>Size of pri...</th>
                            <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 600 }}>Total docu...</th>
                            <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 600 }}>Deleted do...</th>
                            <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 600 }}>Primaries</th>
                            <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 600 }}>Replicas</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedIndexes.map((row, idx) => (
                            <tr key={idx} style={{ borderBottom: idx === paginatedIndexes.length - 1 ? 'none' : '1px solid #e2e8f0' }}>
                              <td style={{ padding: '12px 16px' }}><input type="checkbox" /></td>
                              <td style={{ padding: '12px 16px', color: '#005cca', fontWeight: 500 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="14" width="14" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                    <polyline points="14 2 14 8 20 8"></polyline>
                                    <line x1="16" y1="13" x2="8" y2="13"></line>
                                    <line x1="16" y1="17" x2="8" y2="17"></line>
                                    <polyline points="10 9 9 9 8 9"></polyline>
                                  </svg>
                                  {row.name}
                                </div>
                              </td>
                              <td style={{ padding: '12px 16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }}></span>
                                  {row.health}
                                </div>
                              </td>
                              <td style={{ padding: '12px 16px', color: '#64748b' }}>{row.datastream}</td>
                              <td style={{ padding: '12px 16px', color: '#64748b' }}>{row.managed}</td>
                              <td style={{ padding: '12px 16px', color: '#334155' }}>{row.status}</td>
                              <td style={{ padding: '12px 16px', color: '#334155' }}>{row.size}</td>
                              <td style={{ padding: '12px 16px', color: '#334155' }}>{row.priSize}</td>
                              <td style={{ padding: '12px 16px', color: '#334155' }}>{row.docs.toLocaleString()}</td>
                              <td style={{ padding: '12px 16px', color: '#334155' }}>{row.deletedDocs.toLocaleString()}</td>
                              <td style={{ padding: '12px 16px', color: '#334155' }}>{row.primaries}</td>
                              <td style={{ padding: '12px 16px', color: '#334155' }}>{row.replicas}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {/* Pagination Footer */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', borderTop: '1px solid #e2e8f0', fontSize: '13px', color: '#64748b', background: '#ffffff' }}>
                        <div>
                          Rows per page: 20
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <button 
                            onClick={() => setIndexesPage(1)}
                            disabled={indexesPage === 1}
                            style={{ background: 'none', border: 'none', cursor: indexesPage === 1 ? 'not-allowed' : 'pointer', color: indexesPage === 1 ? '#cbd5e1' : '#005cca', fontSize: '15px' }}
                          >
                            ‹
                          </button>
                          <span style={{ fontWeight: 600, color: '#1e293b' }}>{indexesPage}</span>
                          <button 
                            onClick={() => setIndexesPage(2)}
                            disabled={indexesPage === totalIndexesPages}
                            style={{ background: 'none', border: 'none', cursor: indexesPage === totalIndexesPages ? 'not-allowed' : 'pointer', color: indexesPage === totalIndexesPages ? '#005cca' : '#cbd5e1', fontSize: '15px' }}
                          >
                            ›
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeSubView === 'datastreams' && (
                  <div className="wz-pill-card" style={{ padding: '20px 24px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', minHeight: '400px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <h2 style={{ fontSize: '24px', fontWeight: 400, color: '#1e293b', margin: 0 }}>Data streams</h2>
                        <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>
                          Data streams simplify the management of time-series data. Data streams are composed of multiple backing indexes. Search requests are routed to all backing indexes, while indexing requests are routed to the latest write index. <span style={{ color: '#005cca', textDecoration: 'underline', cursor: 'pointer' }}>Learn more</span>
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: '12px', flexShrink: 0 }}>
                        <select style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#334155', borderRadius: '4px', padding: '8px 16px', fontSize: '13.5px', fontWeight: 500, outline: 'none' }}>
                          <option>Actions</option>
                        </select>
                        <button style={{ background: '#005cca', border: 'none', color: '#ffffff', borderRadius: '4px', padding: '8px 16px', fontSize: '13.5px', fontWeight: 600, cursor: 'pointer' }}>+ Create data stream</button>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '6px 12px', background: '#ffffff', maxWidth: '400px' }}>
                      <FiSearch style={{ color: '#64748b', marginRight: '8px' }} size={16} />
                      <input type="text" placeholder="Search..." style={{ border: 'none', outline: 'none', fontSize: '13px', width: '100%' }} />
                    </div>

                    <div style={{ border: '1px solid #e2e8f0', borderRadius: '6px', overflow: 'hidden', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                        <thead>
                          <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <th style={{ padding: '12px 20px', width: '40px' }}><input type="checkbox" disabled /></th>
                            <th style={{ padding: '12px 20px', color: '#475569', fontWeight: 600 }}>Data stream name ↓</th>
                            <th style={{ padding: '12px 20px', color: '#475569', fontWeight: 600 }}>Status</th>
                            <th style={{ padding: '12px 20px', color: '#475569', fontWeight: 600 }}>Template</th>
                            <th style={{ padding: '12px 20px', color: '#475569', fontWeight: 600 }}>Backing indexes count</th>
                            <th style={{ padding: '12px 20px', color: '#475569', fontWeight: 600 }}>Total size</th>
                          </tr>
                        </thead>
                      </table>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexGrow: 1, padding: '60px 20px', textAlign: 'center' }}>
                        <span style={{ fontSize: '14px', color: '#64748b' }}>You have no data streams.</span>
                        <button style={{ background: '#005cca', border: 'none', color: '#ffffff', borderRadius: '4px', padding: '10px 20px', fontSize: '13.5px', fontWeight: 600, marginTop: '16px', cursor: 'pointer' }}>
                          + Create data stream
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeSubView === 'templates' && (
                  <div className="wz-pill-card" style={{ padding: '20px 24px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <h2 style={{ fontSize: '24px', fontWeight: 400, color: '#1e293b', margin: 0 }}>Templates</h2>
                        <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>
                          Index templates let you initialize new indexes or data streams with predefined mappings and settings. <span style={{ color: '#005cca', textDecoration: 'underline', cursor: 'pointer' }}>Learn more</span>
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: '12px', flexShrink: 0 }}>
                        <select style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#334155', borderRadius: '4px', padding: '8px 16px', fontSize: '13.5px', fontWeight: 500, outline: 'none' }}>
                          <option>Actions</option>
                        </select>
                        <button style={{ background: '#005cca', border: 'none', color: '#ffffff', borderRadius: '4px', padding: '8px 16px', fontSize: '13.5px', fontWeight: 600, cursor: 'pointer' }}>+ Create template</button>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '6px 12px', background: '#ffffff', maxWidth: '400px' }}>
                      <FiSearch style={{ color: '#64748b', marginRight: '8px' }} size={16} />
                      <input type="text" placeholder="Search..." style={{ border: 'none', outline: 'none', fontSize: '13px', width: '100%' }} />
                    </div>

                    <div style={{ border: '1px solid #e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
                        <thead>
                          <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <th style={{ padding: '12px 16px', width: '40px' }}><input type="checkbox" disabled /></th>
                            <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 600 }}>Template name ↓</th>
                            <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 600 }}>Template type</th>
                            <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 600 }}>Index patterns</th>
                            <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 600 }}>Priority</th>
                            <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 600 }}>Associated component templ...</th>
                            <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {templatesData.map((row, idx) => (
                            <tr key={idx} style={{ borderBottom: idx === templatesData.length - 1 ? 'none' : '1px solid #e2e8f0' }}>
                              <td style={{ padding: '12px 16px' }}><input type="checkbox" /></td>
                              <td style={{ padding: '12px 16px', color: '#005cca', fontWeight: 500 }}>{row.name}</td>
                              <td style={{ padding: '12px 16px', color: '#334155' }}>{row.type}</td>
                              <td style={{ padding: '12px 16px', color: '#334155', fontFamily: 'monospace' }}>{row.patterns}</td>
                              <td style={{ padding: '12px 16px', color: '#334155' }}>{row.priority}</td>
                              <td style={{ padding: '12px 16px' }}>
                                <button 
                                  onClick={() => setSelectedTemplateForComponents(row.name)}
                                  style={{ background: 'none', border: 'none', color: '#005cca', textDecoration: 'none', cursor: 'pointer', padding: 0, fontSize: '13px', fontWeight: 500 }}
                                >
                                  {row.componentsCount}
                                </button>
                              </td>
                              <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', alignItems: 'center' }}>
                                  <button style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }} title="Link component template">
                                    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="14" width="14" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                                    </svg>
                                  </button>
                                  <button style={{ background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer' }} title="Delete template">
                                    <FiTrash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {/* Pagination Footer */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', borderTop: '1px solid #e2e8f0', fontSize: '13px', color: '#64748b', background: '#ffffff' }}>
                        <div>
                          Rows per page: 20
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <button disabled style={{ background: 'none', border: 'none', cursor: 'not-allowed', color: '#cbd5e1', fontSize: '15px' }}>‹</button>
                          <span style={{ fontWeight: 600, color: '#1e293b' }}>1</span>
                          <button disabled style={{ background: 'none', border: 'none', cursor: 'not-allowed', color: '#cbd5e1', fontSize: '15px' }}>›</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeSubView === 'component_templates' && (
                  <div className="wz-pill-card" style={{ padding: '20px 24px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', minHeight: '400px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <h2 style={{ fontSize: '24px', fontWeight: 400, color: '#1e293b', margin: 0 }}>Component templates</h2>
                        <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>
                          Component templates are reusable building blocks that you can associate with index templates to define mappings and settings.
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: '12px', flexShrink: 0 }}>
                        <select style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#334155', borderRadius: '4px', padding: '8px 16px', fontSize: '13.5px', fontWeight: 500, outline: 'none' }}>
                          <option>Actions</option>
                        </select>
                        <button style={{ background: '#005cca', border: 'none', color: '#ffffff', borderRadius: '4px', padding: '8px 16px', fontSize: '13.5px', fontWeight: 600, cursor: 'pointer' }}>+ Create component template</button>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '6px 12px', background: '#ffffff', maxWidth: '400px' }}>
                      <FiSearch style={{ color: '#64748b', marginRight: '8px' }} size={16} />
                      <input type="text" placeholder="Search..." style={{ border: 'none', outline: 'none', fontSize: '13px', width: '100%' }} />
                    </div>

                    <div style={{ border: '1px solid #e2e8f0', borderRadius: '6px', overflow: 'hidden', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                        <thead>
                          <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <th style={{ padding: '12px 20px', width: '40px' }}><input type="checkbox" disabled /></th>
                            <th style={{ padding: '12px 20px', color: '#475569', fontWeight: 600 }}>Component template name ↓</th>
                            <th style={{ padding: '12px 20px', color: '#475569', fontWeight: 600 }}>Last updated time</th>
                          </tr>
                        </thead>
                      </table>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexGrow: 1, padding: '60px 20px', textAlign: 'center' }}>
                        <span style={{ fontSize: '14px', color: '#64748b' }}>You have no component templates.</span>
                        <button style={{ background: '#005cca', border: 'none', color: '#ffffff', borderRadius: '4px', padding: '10px 20px', fontSize: '13.5px', fontWeight: 600, marginTop: '16px', cursor: 'pointer' }}>
                          + Create component template
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeSubView === 'aliases' && (
                  <div className="wz-pill-card" style={{ padding: '20px 24px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <h2 style={{ fontSize: '24px', fontWeight: 400, color: '#1e293b', margin: 0 }}>Aliases</h2>
                        <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>
                          An alias is a virtual index name that can point to one or more indexes. If your data is spread across multiple indexes, you can create and query an alias instead of keeping track of which indexes to query. <span style={{ color: '#005cca', textDecoration: 'none', cursor: 'pointer' }}>Learn more ↗</span>
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: '12px', flexShrink: 0 }}>
                        <select style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#334155', borderRadius: '4px', padding: '8px 16px', fontSize: '13.5px', fontWeight: 500, outline: 'none' }}>
                          <option>Actions</option>
                        </select>
                        <button style={{ background: '#005cca', border: 'none', color: '#ffffff', borderRadius: '4px', padding: '8px 16px', fontSize: '13.5px', fontWeight: 600, cursor: 'pointer' }}>+ Create alias</button>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '6px 12px', background: '#ffffff', width: '300px' }}>
                        <FiSearch style={{ color: '#64748b', marginRight: '8px' }} size={16} />
                        <input type="text" placeholder="Search..." style={{ border: 'none', outline: 'none', fontSize: '13px', width: '100%' }} />
                      </div>
                      <select style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#475569', borderRadius: '4px', padding: '6px 12px', fontSize: '13px', outline: 'none' }}>
                        <option>Status</option>
                      </select>
                    </div>

                    <div style={{ border: '1px solid #e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
                        <thead>
                          <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <th style={{ padding: '12px 16px', width: '40px' }}><input type="checkbox" disabled /></th>
                            <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 600 }}>Alias name ↓</th>
                            <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 600 }}>Write index</th>
                            <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 600 }}>Index name</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr style={{ borderBottom: 'none' }}>
                            <td style={{ padding: '12px 16px' }}><input type="checkbox" /></td>
                            <td style={{ padding: '12px 16px', color: '#005cca', fontWeight: 500, cursor: 'pointer' }}>.kibana</td>
                            <td style={{ padding: '12px 16px', color: '#005cca', fontWeight: 500, cursor: 'pointer' }}>.kibana_1</td>
                            <td style={{ padding: '12px 16px', color: '#475569' }}>.kibana_1</td>
                          </tr>
                        </tbody>
                      </table>

                      {/* Pagination Footer */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', borderTop: '1px solid #e2e8f0', fontSize: '13px', color: '#64748b', background: '#ffffff' }}>
                        <div>
                          Rows per page: 20 ∨
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <button disabled style={{ background: 'none', border: 'none', cursor: 'not-allowed', color: '#cbd5e1', fontSize: '15px' }}>‹</button>
                          <span style={{ fontWeight: 600, color: '#1e293b' }}>1</span>
                          <button disabled style={{ background: 'none', border: 'none', cursor: 'not-allowed', color: '#cbd5e1', fontSize: '15px' }}>›</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeSubView === 'rollup' && (
                  <div className="wz-pill-card" style={{ padding: '20px 24px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', minHeight: '400px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h2 style={{ fontSize: '24px', fontWeight: 400, color: '#1e293b', margin: 0 }}>Rollup jobs (0)</h2>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <button style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#334155', borderRadius: '4px', padding: '8px 16px', fontSize: '13.5px', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="14" width="14" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
                          </svg>
                          Refresh
                        </button>
                        <button disabled style={{ background: '#ffffff', border: '1px solid #e2e8f0', color: '#94a3b8', borderRadius: '4px', padding: '8px 16px', fontSize: '13.5px', fontWeight: 500, cursor: 'not-allowed' }}>Disable</button>
                        <button disabled style={{ background: '#ffffff', border: '1px solid #e2e8f0', color: '#94a3b8', borderRadius: '4px', padding: '8px 16px', fontSize: '13.5px', fontWeight: 500, cursor: 'not-allowed' }}>Enable</button>
                        <select disabled style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#94a3b8', borderRadius: '4px', padding: '8px 16px', fontSize: '13.5px', fontWeight: 500, outline: 'none', cursor: 'not-allowed' }}>
                          <option>Actions</option>
                        </select>
                        <button style={{ background: '#005cca', border: 'none', color: '#ffffff', borderRadius: '4px', padding: '8px 16px', fontSize: '13.5px', fontWeight: 600, cursor: 'pointer' }}>+ Create rollup job</button>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '6px 12px', background: '#ffffff', maxWidth: '400px' }}>
                      <FiSearch style={{ color: '#64748b', marginRight: '8px' }} size={16} />
                      <input type="text" placeholder="Search" style={{ border: 'none', outline: 'none', fontSize: '13px', width: '100%' }} />
                    </div>

                    <div style={{ border: '1px solid #e2e8f0', borderRadius: '6px', overflow: 'hidden', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                        <thead>
                          <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <th style={{ padding: '12px 20px', width: '40px' }}><input type="checkbox" disabled /></th>
                            <th style={{ padding: '12px 20px', color: '#475569', fontWeight: 600 }}>Name ↓</th>
                            <th style={{ padding: '12px 20px', color: '#475569', fontWeight: 600 }}>Source index</th>
                            <th style={{ padding: '12px 20px', color: '#475569', fontWeight: 600 }}>Target index</th>
                            <th style={{ padding: '12px 20px', color: '#475569', fontWeight: 600 }}>Job state</th>
                            <th style={{ padding: '12px 20px', color: '#475569', fontWeight: 600 }}>Continuous</th>
                            <th style={{ padding: '12px 20px', color: '#475569', fontWeight: 600 }}>Next rollup window</th>
                            <th style={{ padding: '12px 20px', color: '#475569', fontWeight: 600 }}>Rollup job status</th>
                          </tr>
                        </thead>
                      </table>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexGrow: 1, padding: '60px 20px', textAlign: 'center' }}>
                        <span style={{ fontSize: '14px', color: '#64748b' }}>Rollup jobs help you conserve storage space for historical time series data while preserving the specific information you need.</span>
                        <button style={{ background: '#005cca', border: 'none', color: '#ffffff', borderRadius: '4px', padding: '10px 20px', fontSize: '13.5px', fontWeight: 600, marginTop: '16px', cursor: 'pointer' }}>
                          + Create rollup job
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeSubView === 'transform' && (
                  <div className="wz-pill-card" style={{ padding: '20px 24px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', minHeight: '400px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h2 style={{ fontSize: '24px', fontWeight: 400, color: '#1e293b', margin: 0 }}>Transform jobs (0)</h2>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <button style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#334155', borderRadius: '4px', padding: '8px 16px', fontSize: '13.5px', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="14" width="14" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
                          </svg>
                          Refresh
                        </button>
                        <button disabled style={{ background: '#ffffff', border: '1px solid #e2e8f0', color: '#94a3b8', borderRadius: '4px', padding: '8px 16px', fontSize: '13.5px', fontWeight: 500, cursor: 'not-allowed' }}>Disable</button>
                        <button disabled style={{ background: '#ffffff', border: '1px solid #e2e8f0', color: '#94a3b8', borderRadius: '4px', padding: '8px 16px', fontSize: '13.5px', fontWeight: 500, cursor: 'not-allowed' }}>Enable</button>
                        <select disabled style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#94a3b8', borderRadius: '4px', padding: '8px 16px', fontSize: '13.5px', fontWeight: 500, outline: 'none', cursor: 'not-allowed' }}>
                          <option>Actions</option>
                        </select>
                        <button style={{ background: '#005cca', border: 'none', color: '#ffffff', borderRadius: '4px', padding: '8px 16px', fontSize: '13.5px', fontWeight: 600, cursor: 'pointer' }}>+ Create transform job</button>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '6px 12px', background: '#ffffff', maxWidth: '400px' }}>
                      <FiSearch style={{ color: '#64748b', marginRight: '8px' }} size={16} />
                      <input type="text" placeholder="Search" style={{ border: 'none', outline: 'none', fontSize: '13px', width: '100%' }} />
                    </div>

                    <div style={{ border: '1px solid #e2e8f0', borderRadius: '6px', overflow: 'hidden', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                        <thead>
                          <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <th style={{ padding: '12px 20px', width: '40px' }}><input type="checkbox" disabled /></th>
                            <th style={{ padding: '12px 20px', color: '#475569', fontWeight: 600 }}>Name ↓</th>
                            <th style={{ padding: '12px 20px', color: '#475569', fontWeight: 600 }}>Source index</th>
                            <th style={{ padding: '12px 20px', color: '#475569', fontWeight: 600 }}>Target index</th>
                            <th style={{ padding: '12px 20px', color: '#475569', fontWeight: 600 }}>Job state</th>
                            <th style={{ padding: '12px 20px', color: '#475569', fontWeight: 600 }}>Continuous</th>
                            <th style={{ padding: '12px 20px', color: '#475569', fontWeight: 600 }}>Last updated time</th>
                            <th style={{ padding: '12px 20px', color: '#475569', fontWeight: 600 }}>Transform job status</th>
                          </tr>
                        </thead>
                      </table>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexGrow: 1, padding: '60px 20px', textAlign: 'center' }}>
                        <span style={{ fontSize: '14px', color: '#64748b' }}>Transform jobs help you create a materialized view on top of existing data.</span>
                        <button style={{ background: '#005cca', border: 'none', color: '#ffffff', borderRadius: '4px', padding: '10px 20px', fontSize: '13.5px', fontWeight: 600, marginTop: '16px', cursor: 'pointer' }}>
                          + Create transform
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeSubView === 'notifications' && (
                  <div className="wz-pill-card" style={{ padding: '20px 24px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <h2 style={{ fontSize: '24px', fontWeight: 400, color: '#1e293b', margin: 0 }}>Notification settings</h2>
                        <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>
                          Configure the default notification settings on index operation statuses, such as failed or completed. You can configure additional notification settings while performing an index operation.
                        </p>
                      </div>
                      <button style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#005cca', borderRadius: '4px', padding: '8px 16px', fontSize: '13.5px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                        Manage channels ↗
                      </button>
                    </div>

                    <div style={{ border: '1px solid #e2e8f0', borderRadius: '6px', padding: '24px', background: '#ffffff' }}>
                      <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: 600, color: '#1e293b' }}>Defaults for index operations</h3>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {/* Reindex */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <span style={{ fontWeight: 600, color: '#1e293b', fontSize: '14px' }}>Reindex</span>
                            <span style={{ color: '#64748b', fontSize: '13px' }}>Notify when any reindex operation has failed or completed.</span>
                          </div>
                          <div style={{ display: 'flex', gap: '32px', alignItems: 'center', paddingTop: '4px' }}>
                            <div style={{ fontSize: '13px', color: '#475569', fontWeight: 500 }}>Notify when operation</div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155', cursor: 'pointer' }}>
                              <input 
                                type="checkbox" 
                                checked={notifications.reindexFailed} 
                                onChange={e => setNotifications(prev => ({ ...prev, reindexFailed: e.target.checked }))} 
                              />
                              Has failed
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155', cursor: 'pointer' }}>
                              <input 
                                type="checkbox" 
                                checked={notifications.reindexCompleted} 
                                onChange={e => setNotifications(prev => ({ ...prev, reindexCompleted: e.target.checked }))} 
                              />
                              Has completed
                            </label>
                          </div>
                        </div>

                        {/* Shrink, split, clone */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <span style={{ fontWeight: 600, color: '#1e293b', fontSize: '14px' }}>Shrink, split, clone</span>
                            <span style={{ color: '#64748b', fontSize: '13px' }}>Notify when any shrink, split, or clone operation has failed or completed.</span>
                          </div>
                          <div style={{ display: 'flex', gap: '32px', alignItems: 'center', paddingTop: '4px' }}>
                            <div style={{ fontSize: '13px', color: '#475569', fontWeight: 500 }}>Notify when operation</div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155', cursor: 'pointer' }}>
                              <input 
                                type="checkbox" 
                                checked={notifications.shrinkFailed} 
                                onChange={e => setNotifications(prev => ({ ...prev, shrinkFailed: e.target.checked }))} 
                              />
                              Has failed
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155', cursor: 'pointer' }}>
                              <input 
                                type="checkbox" 
                                checked={notifications.shrinkCompleted} 
                                onChange={e => setNotifications(prev => ({ ...prev, shrinkCompleted: e.target.checked }))} 
                              />
                              Has completed
                            </label>
                          </div>
                        </div>

                        {/* Force merge */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <span style={{ fontWeight: 600, color: '#1e293b', fontSize: '14px' }}>Force merge</span>
                            <span style={{ color: '#64748b', fontSize: '13px' }}>Notify when any force merge operation has failed or completed.</span>
                          </div>
                          <div style={{ display: 'flex', gap: '32px', alignItems: 'center', paddingTop: '4px' }}>
                            <div style={{ fontSize: '13px', color: '#475569', fontWeight: 500 }}>Notify when operation</div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155', cursor: 'pointer' }}>
                              <input 
                                type="checkbox" 
                                checked={notifications.mergeFailed} 
                                onChange={e => setNotifications(prev => ({ ...prev, mergeFailed: e.target.checked }))} 
                              />
                              Has failed
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155', cursor: 'pointer' }}>
                              <input 
                                type="checkbox" 
                                checked={notifications.mergeCompleted} 
                                onChange={e => setNotifications(prev => ({ ...prev, mergeCompleted: e.target.checked }))} 
                              />
                              Has completed
                            </label>
                          </div>
                        </div>

                        {/* Open */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: '8px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <span style={{ fontWeight: 600, color: '#1e293b', fontSize: '14px' }}>Open</span>
                            <span style={{ color: '#64748b', fontSize: '13px' }}>Notify when any open operation has failed or completed.</span>
                          </div>
                          <div style={{ display: 'flex', gap: '32px', alignItems: 'center', paddingTop: '4px' }}>
                            <div style={{ fontSize: '13px', color: '#475569', fontWeight: 500 }}>Notify when operation</div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155', cursor: 'pointer' }}>
                              <input 
                                type="checkbox" 
                                checked={notifications.openFailed} 
                                onChange={e => setNotifications(prev => ({ ...prev, openFailed: e.target.checked }))} 
                              />
                              Has failed
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155', cursor: 'pointer' }}>
                              <input 
                                type="checkbox" 
                                checked={notifications.openCompleted} 
                                onChange={e => setNotifications(prev => ({ ...prev, openCompleted: e.target.checked }))} 
                              />
                              Has completed
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeSubView === 'snapshot_policies' && (
                  <div className="wz-pill-card" style={{ padding: '20px 24px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', minHeight: '400px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <h2 style={{ fontSize: '24px', fontWeight: 400, color: '#1e293b', margin: 0 }}>Snapshot policies</h2>
                        <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>
                          Define an automated snapshot schedule and retention period with a snapshot policy. <span style={{ color: '#005cca', textDecoration: 'none', cursor: 'pointer' }}>Learn more ↗</span>
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexShrink: 0 }}>
                        <button style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#334155', borderRadius: '4px', padding: '8px 16px', fontSize: '13.5px', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="14" width="14" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
                          </svg>
                          Refresh
                        </button>
                        <button disabled style={{ background: '#ffffff', border: '1px solid #e2e8f0', color: '#94a3b8', borderRadius: '4px', padding: '8px 16px', fontSize: '13.5px', fontWeight: 500, cursor: 'not-allowed' }}>Disable</button>
                        <button disabled style={{ background: '#ffffff', border: '1px solid #e2e8f0', color: '#94a3b8', borderRadius: '4px', padding: '8px 16px', fontSize: '13.5px', fontWeight: 500, cursor: 'not-allowed' }}>Enable</button>
                        <select disabled style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#94a3b8', borderRadius: '4px', padding: '8px 16px', fontSize: '13.5px', fontWeight: 500, outline: 'none', cursor: 'not-allowed' }}>
                          <option>Actions</option>
                        </select>
                        <button style={{ background: '#005cca', border: 'none', color: '#ffffff', borderRadius: '4px', padding: '8px 16px', fontSize: '13.5px', fontWeight: 600, cursor: 'pointer' }}>+ Create policy</button>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '6px 12px', background: '#ffffff', maxWidth: '400px' }}>
                      <FiSearch style={{ color: '#64748b', marginRight: '8px' }} size={16} />
                      <input type="text" placeholder="Search snapshot policies" style={{ border: 'none', outline: 'none', fontSize: '13px', width: '100%' }} />
                    </div>

                    <div style={{ border: '1px solid #e2e8f0', borderRadius: '6px', overflow: 'hidden', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                        <thead>
                          <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <th style={{ padding: '12px 20px', width: '40px' }}><input type="checkbox" disabled /></th>
                            <th style={{ padding: '12px 20px', color: '#475569', fontWeight: 600 }}>Policy name ↓</th>
                            <th style={{ padding: '12px 20px', color: '#475569', fontWeight: 600 }}>Status</th>
                            <th style={{ padding: '12px 20px', color: '#475569', fontWeight: 600 }}>Indices</th>
                            <th style={{ padding: '12px 20px', color: '#475569', fontWeight: 600 }}>Snapshot schedule</th>
                            <th style={{ padding: '12px 20px', color: '#475569', fontWeight: 600 }}>Time last updated</th>
                            <th style={{ padding: '12px 20px', color: '#475569', fontWeight: 600 }}>Description</th>
                          </tr>
                        </thead>
                      </table>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexGrow: 1, padding: '60px 20px', textAlign: 'center' }}>
                        <span style={{ fontSize: '14px', color: '#64748b' }}>There are no existing policies.</span>
                        <button style={{ background: '#005cca', border: 'none', color: '#ffffff', borderRadius: '4px', padding: '10px 20px', fontSize: '13.5px', fontWeight: 600, marginTop: '16px', cursor: 'pointer' }}>
                          + Create policy
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeSubView === 'snapshots_list' && (
                  <div className="wz-pill-card" style={{ padding: '0', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', minHeight: '500px', display: 'flex', flexDirection: 'column' }}>
                    {/* Sub-tabs header */}
                    <div style={{ display: 'flex', gap: '20px', borderBottom: '1px solid #e2e8f0', padding: '16px 24px 0 24px' }}>
                      <span 
                        onClick={() => setSnapshotsSubTab('snapshots')}
                        style={{ 
                          borderBottom: snapshotsSubTab === 'snapshots' ? '2.5px solid #005cca' : '2.5px solid transparent', 
                          paddingBottom: '12px', 
                          color: snapshotsSubTab === 'snapshots' ? '#005cca' : '#64748b', 
                          fontWeight: snapshotsSubTab === 'snapshots' ? 600 : 500, 
                          fontSize: '14px', 
                          cursor: 'pointer' 
                        }}
                      >
                        Snapshots
                      </span>
                      <span 
                        onClick={() => setSnapshotsSubTab('restore')}
                        style={{ 
                          borderBottom: snapshotsSubTab === 'restore' ? '2.5px solid #005cca' : '2.5px solid transparent', 
                          paddingBottom: '12px', 
                          color: snapshotsSubTab === 'restore' ? '#005cca' : '#64748b', 
                          fontWeight: snapshotsSubTab === 'restore' ? 600 : 500, 
                          fontSize: '14px', 
                          cursor: 'pointer' 
                        }}
                      >
                        Restore activities in progress
                      </span>
                    </div>

                    {snapshotsSubTab === 'snapshots' ? (
                      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', flexGrow: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxWidth: '70%' }}>
                            <h2 style={{ fontSize: '28px', fontWeight: 300, color: '#1e293b', margin: 0 }}>Snapshots</h2>
                            <p style={{ color: '#64748b', fontSize: '13px', margin: 0, lineHeight: '1.5' }}>
                              Snapshots of indices are taken automatically from snapshot policies, or you can initiate manual snapshots to save to a repository. You can restore indices by selecting a snapshot.
                            </p>
                          </div>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
                            <button style={{ background: '#ffffff', border: '1px solid #005cca', color: '#005cca', borderRadius: '4px', padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', outline: 'none' }}>
                              <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="14" width="14" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
                              </svg>
                              Refresh
                            </button>
                            <button disabled style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#cbd5e1', borderRadius: '4px', padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: 'not-allowed', outline: 'none' }}>
                              Delete
                            </button>
                            <button disabled style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#cbd5e1', borderRadius: '4px', padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: 'not-allowed', outline: 'none' }}>
                              Restore
                            </button>
                            <button style={{ background: '#005cca', border: 'none', color: '#ffffff', borderRadius: '4px', padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', outline: 'none' }}>
                              + Take snapshot
                            </button>
                          </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '6px 12px', background: '#ffffff', width: '360px' }}>
                            <FiSearch style={{ color: '#64748b', marginRight: '8px' }} size={16} />
                            <input type="text" placeholder="Search snapshot" style={{ border: 'none', outline: 'none', fontSize: '13px', width: '100%' }} />
                          </div>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <select style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#334155', borderRadius: '4px', padding: '6px 12px', fontSize: '13px', outline: 'none', cursor: 'pointer' }}>
                              <option>Repository</option>
                            </select>
                            <select style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#334155', borderRadius: '4px', padding: '6px 12px', fontSize: '13px', outline: 'none', cursor: 'pointer' }}>
                              <option>Status</option>
                            </select>
                            <select style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#334155', borderRadius: '4px', padding: '6px 12px', fontSize: '13px', outline: 'none', cursor: 'pointer' }}>
                              <option>Policy</option>
                            </select>
                          </div>
                        </div>

                        <div style={{ border: '1px solid #e2e8f0', borderRadius: '6px', overflow: 'hidden', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                            <thead>
                              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                <th style={{ padding: '12px 20px', width: '40px' }}><input type="checkbox" disabled /></th>
                                <th style={{ padding: '12px 20px', color: '#475569', fontWeight: 600 }}>Name</th>
                                <th style={{ padding: '12px 20px', color: '#475569', fontWeight: 600 }}>Snapshot status</th>
                                <th style={{ padding: '12px 20px', color: '#475569', fontWeight: 600 }}>Policy</th>
                                <th style={{ padding: '12px 20px', color: '#475569', fontWeight: 600 }}>Repository</th>
                                <th style={{ padding: '12px 20px', color: '#475569', fontWeight: 600 }}>Time last updated ↓</th>
                              </tr>
                            </thead>
                          </table>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexGrow: 1, padding: '80px 20px', textAlign: 'center', background: '#ffffff' }}>
                            <span style={{ fontSize: '13.5px', color: '#64748b' }}>No items found</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', flexGrow: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <h2 style={{ fontSize: '28px', fontWeight: 300, color: '#1e293b', margin: 0 }}>Restore activities in progress</h2>
                          <button style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#005cca', borderRadius: '4px', padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', outline: 'none' }}>
                            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="14" width="14" xmlns="http://www.w3.org/2000/svg">
                              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
                            </svg>
                            Refresh
                          </button>
                        </div>

                        <div style={{ border: '1px solid #e2e8f0', borderRadius: '6px', overflow: 'hidden', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                            <thead>
                              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                <th style={{ padding: '12px 20px', color: '#475569', fontWeight: 600 }}>Start time</th>
                                <th style={{ padding: '12px 20px', color: '#475569', fontWeight: 600 }}>Completion time</th>
                                <th style={{ padding: '12px 20px', color: '#475569', fontWeight: 600 }}>Snapshot name</th>
                                <th style={{ padding: '12px 20px', color: '#475569', fontWeight: 600 }}>Status</th>
                                <th style={{ padding: '12px 20px', color: '#475569', fontWeight: 600 }}>Indices being restored</th>
                              </tr>
                            </thead>
                          </table>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexGrow: 1, padding: '80px 20px', textAlign: 'center', background: '#ffffff' }}>
                            <span style={{ fontSize: '13.5px', color: '#64748b' }}>There are no restore activities.</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeSubView === 'repositories' && (
                  <div className="wz-pill-card" style={{ padding: '24px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', minHeight: '500px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxWidth: '70%' }}>
                        <h2 style={{ fontSize: '28px', fontWeight: 300, color: '#1e293b', margin: 0 }}>Repositories</h2>
                        <p style={{ color: '#64748b', fontSize: '13px', margin: 0, lineHeight: '1.5' }}>
                          Repositories are remote storage locations used to store snapshots.
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
                        <button style={{ background: '#ffffff', border: '1px solid #005cca', color: '#005cca', borderRadius: '4px', padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', outline: 'none' }}>
                          <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="14" width="14" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
                          </svg>
                          Refresh
                        </button>
                        <button disabled style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#cbd5e1', borderRadius: '4px', padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: 'not-allowed', outline: 'none' }}>
                          Delete
                        </button>
                        <button style={{ background: '#005cca', border: 'none', color: '#ffffff', borderRadius: '4px', padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', outline: 'none' }}>
                          + Create repository
                        </button>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '6px 12px', background: '#ffffff', width: '360px' }}>
                        <FiSearch style={{ color: '#64748b', marginRight: '8px' }} size={16} />
                        <input type="text" placeholder="Search repository" style={{ border: 'none', outline: 'none', fontSize: '13px', width: '100%' }} />
                      </div>
                      <select style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#334155', borderRadius: '4px', padding: '6px 12px', fontSize: '13px', outline: 'none', cursor: 'pointer' }}>
                        <option>Type</option>
                      </select>
                    </div>

                    <div style={{ border: '1px solid #e2e8f0', borderRadius: '6px', overflow: 'hidden', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                        <thead>
                          <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <th style={{ padding: '12px 20px', width: '40px' }}><input type="checkbox" disabled /></th>
                            <th style={{ padding: '12px 20px', color: '#475569', fontWeight: 600 }}>Repository name</th>
                            <th style={{ padding: '12px 20px', color: '#475569', fontWeight: 600 }}>Type</th>
                            <th style={{ padding: '12px 20px', color: '#475569', fontWeight: 600 }}>Snapshot count</th>
                          </tr>
                        </thead>
                      </table>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexGrow: 1, padding: '80px 20px', textAlign: 'center', background: '#ffffff' }}>
                        <span style={{ fontSize: '13.5px', color: '#64748b' }}>No items found</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Associated Component Templates Drawer Sheet */}
              {selectedTemplateForComponents && (
                <>
                  <div 
                    onClick={() => setSelectedTemplateForComponents(null)}
                    style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.3)', zIndex: 999 }}
                  />
                  <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '450px', background: '#ffffff', boxShadow: '-4px 0 16px rgba(0,0,0,0.15)', zIndex: 1000, padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
                      <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#1e293b' }}>Associated component templates</h3>
                      <button 
                        onClick={() => setSelectedTemplateForComponents(null)}
                        style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '24px', lineHeight: 1, padding: 0 }}
                      >
                        ×
                      </button>
                    </div>
                    <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                        <thead>
                          <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 600 }}>Component template</th>
                            <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td colSpan={2} style={{ padding: '40px 16px', textAlign: 'center', color: '#64748b' }}>
                              No items found
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        }
      case 'indexsecurity':
        return (
          <div style={{ display: 'flex', gap: '24px', width: '100%', minHeight: '600px' }}>
            {/* Left sidebar navigation links */}
            <div style={{ width: '240px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <h4 style={{ textTransform: 'none', fontSize: '13.5px', fontWeight: 700, color: '#1e293b', marginBottom: '8px', marginTop: 0 }}>Security</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {[
                    { id: 'get_started', label: 'Get Started' },
                    { id: 'authentication', label: 'Authentication' },
                    { id: 'roles', label: 'Roles' },
                    { id: 'internal_users', label: 'Internal users' },
                    { id: 'permissions', label: 'Permissions' },
                    { id: 'audit_logs', label: 'Audit logs' }
                  ].map(link => {
                    const isActive = indexerSecuritySubTab === link.id;
                    return (
                      <div 
                        key={link.id} 
                        onClick={() => navigate(`/settings?tab=indexsecurity&subtab=${link.id}`)}
                        style={{
                          padding: '6px 12px',
                          fontSize: '13px',
                          color: isActive ? '#005cca' : '#475569',
                          fontWeight: isActive ? 600 : 500,
                          cursor: 'pointer',
                          borderRadius: '4px',
                          background: isActive ? '#eff6ff' : 'transparent',
                          transition: 'all 0.1s ease-in-out'
                        }}
                      >
                        {link.label}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right content panel */}
            <div style={{ flexGrow: 1, minWidth: 0 }}>
              {indexerSecuritySubTab === 'get_started' && (
                <div className="wz-pill-card" style={{ padding: '24px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', minHeight: '500px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Title & "Open in new window" button */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxWidth: '75%' }}>
                      <h2 style={{ fontSize: '28px', fontWeight: 300, color: '#1e293b', margin: 0 }}>Get started</h2>
                      <p style={{ color: '#64748b', fontSize: '13px', margin: 0, lineHeight: '1.5' }}>
                        The OpenSearch security plugin lets you define the API calls that users can make and the data they can access. The most basic configuration consists of these steps.
                      </p>
                    </div>
                    <button style={{ background: '#ffffff', border: '1px solid #005cca', color: '#005cca', borderRadius: '4px', padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', outline: 'none' }}>
                      Open in new window
                      <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="14" width="14" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                      </svg>
                    </button>
                  </div>

                  {/* Beautiful CSS Diagram representing the workflow */}
                  <div style={{ 
                    border: '1px solid #e2e8f0', 
                    borderRadius: '6px', 
                    padding: '30px 20px', 
                    background: '#f8fafc', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    gap: '40px',
                    position: 'relative'
                  }}>
                    {/* Circle 2: Role */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', zIndex: 2 }}>
                      <div style={{ position: 'relative' }}>
                        <div style={{ 
                          width: '50px', 
                          height: '50px', 
                          borderRadius: '50%', 
                          background: '#ffffff', 
                          border: '1px solid #cbd5e1', 
                          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                          display: 'flex', 
                          justifyContent: 'center', 
                          alignItems: 'center',
                          color: '#475569'
                        }}>
                          {/* Key/Role Icon */}
                          <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="24" width="24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M688 160c-128.1 0-232 103.9-232 232 0 32.1 6.5 62.7 18.3 90.7l-320.9 321c-6.2 6.2-6.2 16.4 0 22.6l90.5 90.5c6.2 6.2 16.4 6.2 22.6 0l90.5-90.5 90.5 90.5c6.2 6.2 16.4 6.2 22.6 0l45.2-45.2c6.2-6.2 6.2-16.4 0-22.6l-45.2-45.2 90.5-90.5c28 11.8 58.6 18.3 90.7 18.3 128.1 0 232-103.9 232-232S816.1 160 688 160zm0 320c-48.6 0-88-39.4-88-88s39.4-88 88-88 88 39.4 88 88-39.4 88-88 88z"></path>
                          </svg>
                        </div>
                        <div style={{ 
                          position: 'absolute', 
                          top: '-6px', 
                          right: '-6px', 
                          width: '18px', 
                          height: '18px', 
                          borderRadius: '50%', 
                          background: '#005cca', 
                          color: '#ffffff', 
                          fontSize: '11px', 
                          fontWeight: 700, 
                          display: 'flex', 
                          justifyContent: 'center', 
                          alignItems: 'center' 
                        }}>
                          2
                        </div>
                      </div>
                      <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#334155' }}>Role</span>
                    </div>

                    {/* Arrow / Line to Backends */}
                    <div style={{ flexGrow: 1, height: '2px', borderTop: '2px dashed #cbd5e1', maxWidth: '80px', position: 'relative' }}></div>

                    {/* Circle 1: Backends (authc & authz) */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', zIndex: 2 }}>
                      <div style={{ position: 'relative' }}>
                        <div style={{ 
                          width: '140px', 
                          height: '50px', 
                          borderRadius: '4px', 
                          background: '#ffffff', 
                          border: '2px dashed #94a3b8', 
                          display: 'flex', 
                          flexDirection: 'column',
                          justifyContent: 'center', 
                          alignItems: 'center',
                          padding: '4px 8px'
                        }}>
                          <span style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b' }}>Backends</span>
                          <span style={{ fontSize: '9px', color: '#64748b', fontFamily: 'monospace' }}>(authc & authz)</span>
                        </div>
                        <div style={{ 
                          position: 'absolute', 
                          top: '-6px', 
                          right: '-6px', 
                          width: '18px', 
                          height: '18px', 
                          borderRadius: '50%', 
                          background: '#005cca', 
                          color: '#ffffff', 
                          fontSize: '11px', 
                          fontWeight: 700, 
                          display: 'flex', 
                          justifyContent: 'center', 
                          alignItems: 'center' 
                        }}>
                          1
                        </div>
                      </div>
                    </div>

                    {/* Forked Arrow / Line from Backends to Users & Roles Mapping */}
                    <div style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      justifyContent: 'center', 
                      height: '60px', 
                      position: 'relative', 
                      width: '60px' 
                    }}>
                      <div style={{ height: '30px', borderLeft: '2px dashed #cbd5e1', borderTop: '2px dashed #cbd5e1', borderTopRightRadius: '4px', position: 'absolute', top: '0', right: '0', left: '0' }} />
                      <div style={{ height: '30px', borderLeft: '2px dashed #cbd5e1', borderBottom: '2px dashed #cbd5e1', borderBottomRightRadius: '4px', position: 'absolute', bottom: '0', right: '0', left: '0' }} />
                    </div>

                    {/* Right side options: Map internal users, Map backend roles */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', zIndex: 2 }}>
                      {/* Map internal users */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ position: 'relative' }}>
                          <div style={{ 
                            width: '50px', 
                            height: '50px', 
                            borderRadius: '50%', 
                            background: '#ffffff', 
                            border: '1px solid #cbd5e1', 
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                            display: 'flex', 
                            justifyContent: 'center', 
                            alignItems: 'center',
                            color: '#475569'
                          }}>
                            {/* Users Icon */}
                            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="20" width="20" xmlns="http://www.w3.org/2000/svg">
                              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                              <circle cx="9" cy="7" r="4"></circle>
                              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                          </div>
                          <div style={{ 
                            position: 'absolute', 
                            top: '-6px', 
                            right: '-6px', 
                            width: '18px', 
                            height: '18px', 
                            borderRadius: '50%', 
                            background: '#005cca', 
                            color: '#ffffff', 
                            fontSize: '11px', 
                            fontWeight: 700, 
                            display: 'flex', 
                            justifyContent: 'center', 
                            alignItems: 'center' 
                          }}>
                            3
                          </div>
                        </div>
                        <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#334155' }}>Map internal users</span>
                      </div>

                      {/* Map backend roles */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ 
                          width: '50px', 
                          height: '50px', 
                          borderRadius: '50%', 
                          background: '#ffffff', 
                          border: '1px solid #cbd5e1', 
                          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                          display: 'flex', 
                          justifyContent: 'center', 
                          alignItems: 'center',
                          color: '#475569'
                        }}>
                          {/* Backend Roles Icon */}
                          <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="20" width="20" xmlns="http://www.w3.org/2000/svg">
                            <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
                            <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                            <line x1="6" y1="6" x2="6.01" y2="6"></line>
                            <line x1="6" y1="18" x2="6.01" y2="18"></line>
                          </svg>
                        </div>
                        <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#334155' }}>Map backend roles</span>
                      </div>
                    </div>
                  </div>

                  {/* Step sections */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '10px' }}>
                    {/* Step 1 */}
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                      <div style={{ 
                        width: '28px', 
                        height: '28px', 
                        borderRadius: '50%', 
                        background: '#005cca', 
                        color: '#ffffff', 
                        fontSize: '13px', 
                        fontWeight: 700, 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center',
                        flexShrink: 0
                      }}>
                        1
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', margin: 0 }}>Add backends</h3>
                        <p style={{ color: '#64748b', fontSize: '13px', margin: 0, lineHeight: '1.5' }}>
                          Add authentication <code style={{ background: '#f1f5f9', padding: '2px 4px', borderRadius: '4px', fontSize: '12px' }}>(authc)</code> and authorization <code style={{ background: '#f1f5f9', padding: '2px 4px', borderRadius: '4px', fontSize: '12px' }}>(authz)</code> information to <code style={{ background: '#f1f5f9', padding: '2px 4px', borderRadius: '4px', fontSize: '12px' }}>config/opensearch-security/config.yml</code>. The <code style={{ background: '#f1f5f9', padding: '2px 4px', borderRadius: '4px', fontSize: '12px' }}>authc</code> section contains the backends to check user credentials against. The <code style={{ background: '#f1f5f9', padding: '2px 4px', borderRadius: '4px', fontSize: '12px' }}>authz</code> section contains any backends to fetch backend roles from. The most common example of a backend role is an LDAP group. <span style={{ color: '#005cca', cursor: 'pointer', textDecoration: 'none' }}>Learn more ↗</span>
                        </p>
                        <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                          <button style={{ background: '#005cca', border: 'none', color: '#ffffff', borderRadius: '4px', padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', outline: 'none' }}>
                            Config.yml documentation ↗
                          </button>
                          <button style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#334155', borderRadius: '4px', padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', outline: 'none' }}>
                            Review authentication and authorization
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                      <div style={{ 
                        width: '28px', 
                        height: '28px', 
                        borderRadius: '50%', 
                        background: '#005cca', 
                        color: '#ffffff', 
                        fontSize: '13px', 
                        fontWeight: 700, 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center',
                        flexShrink: 0
                      }}>
                        2
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', margin: 0 }}>Create roles</h3>
                        <p style={{ color: '#64748b', fontSize: '13px', margin: 0, lineHeight: '1.5' }}>
                          Roles are reusable collections of permissions. The default roles are a great starting point, but you might need to create custom roles that meet your exact needs. <span style={{ color: '#005cca', cursor: 'pointer', textDecoration: 'none' }}>Learn more ↗</span>
                        </p>
                        <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                          <button style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#334155', borderRadius: '4px', padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', outline: 'none' }}>
                            Explore existing roles
                          </button>
                          <button style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#334155', borderRadius: '4px', padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', outline: 'none' }}>
                            Create new role
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                      <div style={{ 
                        width: '28px', 
                        height: '28px', 
                        borderRadius: '50%', 
                        background: '#005cca', 
                        color: '#ffffff', 
                        fontSize: '13px', 
                        fontWeight: 700, 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center',
                        flexShrink: 0
                      }}>
                        3
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', margin: 0 }}>Map users</h3>
                        <p style={{ color: '#64748b', fontSize: '13px', margin: 0, lineHeight: '1.5' }}>
                          After a user successfully authenticates, the security plugin retrieves that user's roles. You can map roles directly to users, but you can also map them to backend roles. <span style={{ color: '#005cca', cursor: 'pointer', textDecoration: 'none' }}>Learn more ↗</span>
                        </p>
                        <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                          <button style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#334155', borderRadius: '4px', padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', outline: 'none' }}>
                            Map users to a role
                          </button>
                          <button style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#334155', borderRadius: '4px', padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', outline: 'none' }}>
                            Create internal user
                          </button>
                        </div>
                      </div>
                    </div>

                    <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '10px 0' }} />

                    {/* Optional: Configure audit logs card */}
                    <div style={{ 
                      border: '1px solid #e2e8f0', 
                      borderRadius: '6px', 
                      padding: '20px', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: '12px',
                      background: '#ffffff'
                    }}>
                      <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b', margin: 0 }}>Optional: Configure audit logs</h3>
                      <p style={{ color: '#64748b', fontSize: '13px', margin: 0, lineHeight: '1.5' }}>
                        Audit logs let you track user access to your OpenSearch cluster and are useful for compliance purposes. <span style={{ color: '#005cca', cursor: 'pointer', textDecoration: 'none' }}>Learn more ↗</span>
                      </p>
                      <button style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#334155', borderRadius: '4px', padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', outline: 'none', width: 'fit-content' }}>
                        Review Audit Log Configuration
                      </button>
                    </div>

                    {/* Optional: Purge cache card */}
                    <div style={{ 
                      border: '1px solid #e2e8f0', 
                      borderRadius: '6px', 
                      padding: '20px', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: '12px',
                      background: '#ffffff'
                    }}>
                      <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b', margin: 0 }}>Optional: Purge cache</h3>
                      <p style={{ color: '#64748b', fontSize: '13px', margin: 0, lineHeight: '1.5' }}>
                        By default, the security plugin caches authenticated users, along with their roles and permissions. This option will purge cached users, roles and permissions.
                      </p>
                      <button style={{ 
                        background: '#ffffff', 
                        border: '1px solid #cbd5e1', 
                        color: '#334155', 
                        borderRadius: '4px', 
                        padding: '8px 16px', 
                        fontSize: '13px', 
                        fontWeight: 600, 
                        cursor: 'pointer', 
                        outline: 'none', 
                        width: 'fit-content',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="14" width="14" xmlns="http://www.w3.org/2000/svg">
                          <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
                        </svg>
                        Purge cache
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {indexerSecuritySubTab === 'authentication' && (
                <div className="wz-pill-card" style={{ padding: '24px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', minHeight: '500px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {/* Title and top-right button */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h2 style={{ fontSize: '28px', fontWeight: 300, color: '#1e293b', margin: 0 }}>Authentication and authorization</h2>
                    <button style={{ background: '#ffffff', border: '1px solid #005cca', color: '#005cca', borderRadius: '4px', padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', outline: 'none' }}>
                      Manage via config.yml
                      <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="14" width="14" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                      </svg>
                    </button>
                  </div>

                  {/* Section 1: Authentication sequences (6) */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b', margin: 0 }}>Authentication sequences</h3>
                      <span style={{ fontSize: '16px', color: '#64748b', fontWeight: 500 }}>(6)</span>
                    </div>
                    <p style={{ color: '#64748b', fontSize: '13px', margin: 0, lineHeight: '1.5' }}>
                      An authentication module specifies where to get the user credentials from, and against which backend they should be authenticated. When there are multiple authentication domains, the plugin will authenticate the user sequentially against each backend until one succeeds. <span style={{ color: '#005cca', cursor: 'pointer', textDecoration: 'none' }}>Learn more ↗</span>
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '6px 12px', background: '#ffffff', maxWidth: '400px', marginTop: '4px' }}>
                      <FiSearch style={{ color: '#64748b', marginRight: '8px' }} size={16} />
                      <input type="text" placeholder="Search authentication domain" style={{ border: 'none', outline: 'none', fontSize: '13px', width: '100%' }} />
                    </div>

                    <div style={{ border: '1px solid #e2e8f0', borderRadius: '6px', overflow: 'hidden', marginTop: '4px' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                        <thead>
                          <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 600 }}>Execution order ↓</th>
                            <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 600 }}>Domain name</th>
                            <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 600 }}>HTTP</th>
                            <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 600 }}>TRANSPORT</th>
                            <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 600 }}>HTTP type</th>
                            <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 600 }}>HTTP challenge</th>
                            <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 600 }}>HTTP configuration</th>
                            <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 600 }}>Backend type</th>
                            <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 600 }}>Backend configuration</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { order: '6', name: 'kerberos_auth_domain', http: 'Disabled', transport: 'Disabled', type: 'kerberos', challenge: 'True', httpConfig: 'View expression', backendType: 'noop', backendConfig: '—' },
                            { order: '5', name: 'ldap', http: 'Disabled', transport: 'Disabled', type: 'basic', challenge: 'False', httpConfig: '—', backendType: 'ldap', backendConfig: 'View expression' },
                            { order: '4', name: 'basic_internal_auth_domain', http: 'Enabled', transport: 'Disabled', type: 'basic', challenge: 'True', httpConfig: '—', backendType: 'intern', backendConfig: '—' },
                            { order: '3', name: 'proxy_auth_domain', http: 'Disabled', transport: 'Disabled', type: 'proxy', challenge: 'False', httpConfig: 'View expression', backendType: 'noop', backendConfig: '—' },
                            { order: '2', name: 'clientcert_auth_domain', http: 'Disabled', transport: 'Disabled', type: 'clientcert', challenge: 'False', httpConfig: 'View expression', backendType: 'noop', backendConfig: '—' },
                            { order: '0', name: 'jwt_auth_domain', http: 'Disabled', transport: 'Disabled', type: 'jwt', challenge: 'False', httpConfig: 'View expression', backendType: 'noop', backendConfig: '—' }
                          ].map((row, idx) => (
                            <tr key={idx} style={{ borderBottom: idx < 5 ? '1px solid #e2e8f0' : 'none' }}>
                              <td style={{ padding: '12px 16px', color: '#475569' }}>{row.order}</td>
                              <td style={{ padding: '12px 16px', color: '#1e293b', fontWeight: 500 }}>{row.name}</td>
                              <td style={{ padding: '12px 16px', color: '#475569' }}>{row.http}</td>
                              <td style={{ padding: '12px 16px', color: '#475569' }}>{row.transport}</td>
                              <td style={{ padding: '12px 16px', color: '#475569' }}>{row.type}</td>
                              <td style={{ padding: '12px 16px', color: '#475569' }}>{row.challenge}</td>
                              <td style={{ padding: '12px 16px', color: row.httpConfig === 'View expression' ? '#005cca' : '#475569', fontWeight: row.httpConfig === 'View expression' ? 600 : 400, cursor: row.httpConfig === 'View expression' ? 'pointer' : 'default' }}>{row.httpConfig}</td>
                              <td style={{ padding: '12px 16px', color: '#475569' }}>{row.backendType}</td>
                              <td style={{ padding: '12px 16px', color: row.backendConfig === 'View expression' ? '#005cca' : '#475569', fontWeight: row.backendConfig === 'View expression' ? 600 : 400, cursor: row.backendConfig === 'View expression' ? 'pointer' : 'default' }}>{row.backendConfig}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {/* Table Footer */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#ffffff', borderTop: '1px solid #e2e8f0', fontSize: '13px', color: '#64748b' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>Rows per page:</span>
                          <select style={{ border: 'none', background: 'transparent', outline: 'none', color: '#334155', fontWeight: 600, cursor: 'pointer' }}>
                            <option>10</option>
                          </select>
                        </div>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                          <span style={{ cursor: 'not-allowed', color: '#cbd5e1' }}>&lt;</span>
                          <span style={{ fontWeight: 600, color: '#005cca' }}>1</span>
                          <span style={{ cursor: 'not-allowed', color: '#cbd5e1' }}>&gt;</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Authorization (2) */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b', margin: 0 }}>Authorization</h3>
                      <span style={{ fontSize: '16px', color: '#64748b', fontWeight: 500 }}>(2)</span>
                    </div>
                    <p style={{ color: '#64748b', fontSize: '13px', margin: 0, lineHeight: '1.5' }}>
                      After the user authenticates, the security plugin can collect backend roles, such as LDAP groups, from authorization backends. These backends have no execution order; the plugin tries to collect backend roles from all of them. <span style={{ color: '#005cca', cursor: 'pointer', textDecoration: 'none' }}>Learn more ↗</span>
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '6px 12px', background: '#ffffff', maxWidth: '400px', marginTop: '4px' }}>
                      <FiSearch style={{ color: '#64748b', marginRight: '8px' }} size={16} />
                      <input type="text" placeholder="Search authorization domain" style={{ border: 'none', outline: 'none', fontSize: '13px', width: '100%' }} />
                    </div>

                    <div style={{ border: '1px solid #e2e8f0', borderRadius: '6px', overflow: 'hidden', marginTop: '4px' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                        <thead>
                          <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 600 }}>Domain name</th>
                            <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 600 }}>HTTP</th>
                            <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 600 }}>TRANSPORT</th>
                            <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 600 }}>Backend type</th>
                            <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 600 }}>Backend configuration</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { name: 'roles_from_another_ldap', http: 'Disabled', transport: 'Disabled', backendType: 'ldap', backendConfig: '—' },
                            { name: 'roles_from_myldap', http: 'Disabled', transport: 'Disabled', backendType: 'ldap', backendConfig: 'View expression' }
                          ].map((row, idx) => (
                            <tr key={idx} style={{ borderBottom: idx < 1 ? '1px solid #e2e8f0' : 'none' }}>
                              <td style={{ padding: '12px 16px', color: '#1e293b', fontWeight: 500 }}>{row.name}</td>
                              <td style={{ padding: '12px 16px', color: '#475569' }}>{row.http}</td>
                              <td style={{ padding: '12px 16px', color: '#475569' }}>{row.transport}</td>
                              <td style={{ padding: '12px 16px', color: '#475569' }}>{row.backendType}</td>
                              <td style={{ padding: '12px 16px', color: row.backendConfig === 'View expression' ? '#005cca' : '#475569', fontWeight: row.backendConfig === 'View expression' ? 600 : 400, cursor: row.backendConfig === 'View expression' ? 'pointer' : 'default' }}>{row.backendConfig}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {/* Table Footer */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#ffffff', borderTop: '1px solid #e2e8f0', fontSize: '13px', color: '#64748b' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>Rows per page:</span>
                          <select style={{ border: 'none', background: 'transparent', outline: 'none', color: '#334155', fontWeight: 600, cursor: 'pointer' }}>
                            <option>10</option>
                          </select>
                        </div>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                          <span style={{ cursor: 'not-allowed', color: '#cbd5e1' }}>&lt;</span>
                          <span style={{ fontWeight: 600, color: '#005cca' }}>1</span>
                          <span style={{ cursor: 'not-allowed', color: '#cbd5e1' }}>&gt;</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {indexerSecuritySubTab === 'roles' && (
                <div className="wz-pill-card" style={{ padding: '24px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', minHeight: '500px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Title and top-right buttons */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h2 style={{ fontSize: '28px', fontWeight: 300, color: '#1e293b', margin: 0 }}>Roles</h2>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <button style={{ background: '#ffffff', border: '1px solid #005cca', color: '#005cca', borderRadius: '4px', padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', outline: 'none' }}>
                        Actions
                        <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="14" width="14" xmlns="http://www.w3.org/2000/svg">
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </button>
                      <button style={{ background: '#005cca', border: 'none', color: '#ffffff', borderRadius: '4px', padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', outline: 'none' }}>
                        Create role
                      </button>
                    </div>
                  </div>

                  {/* Section Title & Description */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b', margin: 0 }}>Roles</h3>
                      <span style={{ fontSize: '16px', color: '#64748b', fontWeight: 500 }}>(45)</span>
                    </div>
                    <p style={{ color: '#64748b', fontSize: '13px', margin: 0, lineHeight: '1.5' }}>
                      Roles are the core way of controlling access to your cluster. Roles contain any combination of cluster-wide permission, index-specific permissions, document- and field-level security, and tenants. Then you map users to these roles so that users gain those permissions. <span style={{ color: '#005cca', cursor: 'pointer', textDecoration: 'none' }}>Learn more ↗</span>
                    </p>
                  </div>

                  {/* Filters row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '6px 12px', background: '#ffffff', width: '280px' }}>
                      <FiSearch style={{ color: '#64748b', marginRight: '8px' }} size={16} />
                      <input type="text" placeholder="Search..." style={{ border: 'none', outline: 'none', fontSize: '13px', width: '100%' }} />
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {['Cluster permissions', 'Index permissions', 'Internal users', 'Backend roles', 'Tenants', 'Customization'].map((filter, fIdx) => (
                        <select key={fIdx} style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#334155', borderRadius: '4px', padding: '6px 12px', fontSize: '13px', outline: 'none', cursor: 'pointer' }}>
                          <option>{filter}</option>
                        </select>
                      ))}
                    </div>
                  </div>

                  {/* Table */}
                  <div style={{ border: '1px solid #e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                      <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                          <th style={{ padding: '12px 16px', width: '40px' }}><input type="checkbox" disabled /></th>
                          <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 600 }}>Role</th>
                          <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 600 }}>Cluster permissions</th>
                          <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 600 }}>Index permissions</th>
                          <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 600 }}>Internal users</th>
                          <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 600 }}>Backend roles</th>
                          <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 600 }}>Tenants</th>
                          <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 600 }}>Customization</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { role: 'security_analytics_ack_alerts', cluster: 'cluster:admin/opensearch/securityanalytics/alerts/*', index: '—', internal: '—', backend: '—', tenants: '—' },
                          { role: 'observability_read_access', cluster: 'cluster:admin/opensearch/observability/get', index: '—', internal: '—', backend: '—', tenants: '—' },
                          { role: 'kibana_user', cluster: 'cluster_composite_ops', index: '.kibana \n .kibana-6 \n .kibana_* \n ...', internal: '—', backend: 'kibanaserver', tenants: '—' },
                          { role: 'own_index', cluster: 'cluster_composite_ops', index: '${user_name}', internal: '*', backend: '—', tenants: '—' },
                          { role: 'alerting_full_access', cluster: 'cluster_monitor \n cluster:admin/opendistro/alerting/* \n cluster:admin/opensearch/alerting/* \n ...', index: '*', internal: '—', backend: '—', tenants: '—' },
                          { role: 'snapshot_management_read_access', cluster: 'cluster:admin/opensearch/snapshot_management/policy/get \n cluster:admin/opensearch/snapshot_management/policy/search \n cluster:admin/opensearch/snapshot_management/policy/explain \n ...', index: '—', internal: '—', backend: '—', tenants: '—' },
                          { role: 'all_access', cluster: '*', index: '*', internal: '—', backend: 'admin', tenants: '*' },
                          { role: 'alerting_read_access', cluster: 'cluster:admin/opendistro/alerting/alerts/get \n cluster:admin/opendistro/alerting/destination/get \n cluster:admin/opendistro/alerting/monitor/get \n ...', index: '—', internal: '—', backend: '—', tenants: '—' },
                          { role: 'cross_cluster_replication_follower_full_access', cluster: 'cluster:admin/plugins/replication/autofollow/update', index: '*', internal: '—', backend: '—', tenants: '—' },
                          { role: 'manage_snapshots', cluster: 'manage_snapshots', index: '*', internal: '—', backend: 'snapshotrestore', tenants: '—' }
                        ].map((row, idx) => (
                          <tr key={idx} style={{ borderBottom: idx < 9 ? '1px solid #e2e8f0' : 'none' }}>
                            <td style={{ padding: '12px 16px' }}><input type="checkbox" disabled /></td>
                            <td style={{ padding: '12px 16px', color: '#005cca', fontWeight: 600, cursor: 'pointer' }}>{row.role}</td>
                            <td style={{ padding: '12px 16px', color: '#475569', whiteSpace: 'pre-line', lineHeight: '1.4' }}>{row.cluster}</td>
                            <td style={{ padding: '12px 16px', color: '#475569', whiteSpace: 'pre-line', lineHeight: '1.4' }}>{row.index}</td>
                            <td style={{ padding: '12px 16px', color: '#475569' }}>{row.internal}</td>
                            <td style={{ padding: '12px 16px', color: '#475569' }}>{row.backend}</td>
                            <td style={{ padding: '12px 16px', color: '#475569' }}>{row.tenants}</td>
                            <td style={{ padding: '12px 16px', color: '#64748b' }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="12" width="12" xmlns="http://www.w3.org/2000/svg" style={{ color: '#64748b' }}>
                                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                </svg>
                                Reserved
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Table Footer */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#ffffff', borderTop: '1px solid #e2e8f0', fontSize: '13px', color: '#64748b' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>Rows per page:</span>
                        <select style={{ border: 'none', background: 'transparent', outline: 'none', color: '#334155', fontWeight: 600, cursor: 'pointer' }}>
                          <option>10</option>
                        </select>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{ cursor: 'not-allowed', color: '#cbd5e1', padding: '2px 6px' }}>&lt;</span>
                        <span style={{ fontWeight: 600, color: '#005cca', background: '#eff6ff', borderRadius: '4px', padding: '2px 8px' }}>1</span>
                        <span style={{ cursor: 'pointer', color: '#475569', padding: '2px 6px' }}>2</span>
                        <span style={{ cursor: 'pointer', color: '#475569', padding: '2px 6px' }}>3</span>
                        <span style={{ cursor: 'pointer', color: '#475569', padding: '2px 6px' }}>4</span>
                        <span style={{ cursor: 'pointer', color: '#475569', padding: '2px 6px' }}>5</span>
                        <span style={{ cursor: 'pointer', color: '#475569', padding: '2px 6px' }}>&gt;</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {indexerSecuritySubTab === 'internal_users' && (
                <div className="wz-pill-card" style={{ padding: '24px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', minHeight: '500px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Title and top-right buttons */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h2 style={{ fontSize: '28px', fontWeight: 300, color: '#1e293b', margin: 0 }}>Internal users</h2>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <button style={{ background: '#ffffff', border: '1px solid #005cca', color: '#005cca', borderRadius: '4px', padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', outline: 'none' }}>
                        Actions
                        <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="14" width="14" xmlns="http://www.w3.org/2000/svg">
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </button>
                      <button style={{ background: '#005cca', border: 'none', color: '#ffffff', borderRadius: '4px', padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', outline: 'none' }}>
                        Create internal user
                      </button>
                    </div>
                  </div>

                  {/* Section Title & Description */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b', margin: 0 }}>Internal users</h3>
                      <span style={{ fontSize: '16px', color: '#64748b', fontWeight: 500 }}>(7)</span>
                    </div>
                    <p style={{ color: '#64748b', fontSize: '13px', margin: 0, lineHeight: '1.5' }}>
                      The Security plugin includes an internal user database. Use this database in place of, or in addition to, an external authentication system such as LDAP server or Active Directory. You can map an internal user to a role from <span style={{ color: '#005cca', cursor: 'pointer', textDecoration: 'none' }}>Roles</span>. First, click into the detail page of the role. Then, under "Mapped users", click "Manage mapping" <span style={{ color: '#005cca', cursor: 'pointer', textDecoration: 'none' }}>Learn more ↗</span>
                    </p>
                  </div>

                  {/* Filters row */}
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '6px 12px', background: '#ffffff', maxWidth: '360px' }}>
                    <FiSearch style={{ color: '#64748b', marginRight: '8px' }} size={16} />
                    <input type="text" placeholder="Search internal users" style={{ border: 'none', outline: 'none', fontSize: '13px', width: '100%' }} />
                  </div>

                  {/* Table */}
                  <div style={{ border: '1px solid #e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                      <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                          <th style={{ padding: '12px 16px', width: '40px' }}><input type="checkbox" disabled /></th>
                          <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 600 }}>Username</th>
                          <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 600 }}>Backend roles</th>
                          <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 600 }}>Attributes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { username: 'logstash', backend: 'logstash', attributes: '—', badge: false },
                          { username: 'snapshotrestore', backend: 'snapshotrestore', attributes: '—', badge: false },
                          { username: 'admin', backend: 'admin', attributes: '—', badge: true },
                          { username: 'kibanaserver', backend: '—', attributes: '—', badge: false },
                          { username: 'kibanaro', backend: 'kibanauser \n readall', attributes: 'attribute1: "value1" \n attribute2: "value2" \n attribute3: "value3"', badge: false },
                          { username: 'readall', backend: 'readall', attributes: '—', badge: false },
                          { username: 'anomalyadmin', backend: '—', attributes: '—', badge: false }
                        ].map((row, idx) => (
                          <tr key={idx} style={{ borderBottom: idx < 6 ? '1px solid #e2e8f0' : 'none' }}>
                            <td style={{ padding: '12px 16px' }}><input type="checkbox" disabled /></td>
                            <td style={{ padding: '12px 16px', color: '#005cca', fontWeight: 600, cursor: 'pointer' }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {row.username}
                                {row.badge && (
                                  <span style={{ background: '#e2e8f0', color: '#475569', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>
                                    Current
                                  </span>
                                )}
                              </span>
                            </td>
                            <td style={{ padding: '12px 16px', color: '#475569', whiteSpace: 'pre-line', lineHeight: '1.4' }}>{row.backend}</td>
                            <td style={{ padding: '12px 16px', color: '#475569', whiteSpace: 'pre-line', lineHeight: '1.4' }}>{row.attributes}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Table Footer */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#ffffff', borderTop: '1px solid #e2e8f0', fontSize: '13px', color: '#64748b' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>Rows per page:</span>
                        <select style={{ border: 'none', background: 'transparent', outline: 'none', color: '#334155', fontWeight: 600, cursor: 'pointer' }}>
                          <option>10</option>
                        </select>
                      </div>
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <span style={{ cursor: 'not-allowed', color: '#cbd5e1' }}>&lt;</span>
                        <span style={{ fontWeight: 600, color: '#005cca' }}>1</span>
                        <span style={{ cursor: 'not-allowed', color: '#cbd5e1' }}>&gt;</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {indexerSecuritySubTab === 'permissions' && (
                <div className="wz-pill-card" style={{ padding: '24px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', minHeight: '500px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxWidth: '70%' }}>
                      <h2 style={{ fontSize: '28px', fontWeight: 300, color: '#1e293b', margin: 0 }}>Permissions</h2>
                      <p style={{ color: '#64748b', fontSize: '13px', margin: 0, lineHeight: '1.5' }}>
                        Manage cluster and index action groups. Action groups are sets of permissions that can be mapped to roles.
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '6px 12px', background: '#ffffff', maxWidth: '360px' }}>
                    <FiSearch style={{ color: '#64748b', marginRight: '8px' }} size={16} />
                    <input type="text" placeholder="Search action groups" style={{ border: 'none', outline: 'none', fontSize: '13px', width: '100%' }} />
                  </div>

                  <div style={{ border: '1px solid #e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                      <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                          <th style={{ padding: '12px 20px', color: '#475569', fontWeight: 600 }}>Action group</th>
                          <th style={{ padding: '12px 20px', color: '#475569', fontWeight: 600 }}>Allowed actions</th>
                          <th style={{ padding: '12px 20px', color: '#475569', fontWeight: 600 }}>Type</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '12px 20px', color: '#005cca', fontWeight: 600 }}>cluster_composite_ops</td>
                          <td style={{ padding: '12px 20px', color: '#475569' }}>indices:data/write/bulk*, indices:data/write/delete*</td>
                          <td style={{ padding: '12px 20px' }}>Cluster</td>
                        </tr>
                        <tr>
                          <td style={{ padding: '12px 20px', color: '#005cca', fontWeight: 600 }}>cluster_monitor</td>
                          <td style={{ padding: '12px 20px', color: '#475569' }}>cluster:monitor/*</td>
                          <td style={{ padding: '12px 20px' }}>Cluster</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {indexerSecuritySubTab === 'audit_logs' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
                  <h2 style={{ fontSize: '28px', fontWeight: 300, color: '#1e293b', margin: 0 }}>Audit logging</h2>
                  
                  {/* Card 1: Storage location */}
                  <div className="wz-pill-card" style={{ padding: '24px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b', margin: '0 0 8px 0' }}>Storage location</h3>
                      <p style={{ color: '#64748b', fontSize: '13px', margin: 0, lineHeight: '1.5' }}>
                        Configure the output location and storage types in <code style={{ background: '#f1f5f9', padding: '2px 4px', borderRadius: '4px', fontSize: '12px' }}>opensearch.yml</code>. The default storage location is <code style={{ background: '#f1f5f9', padding: '2px 4px', borderRadius: '4px', fontSize: '12px' }}>internal_opensearch</code>, which stores the logs in an index on this cluster. <span style={{ color: '#005cca', cursor: 'pointer', fontWeight: 500 }}>Learn more ↗</span>
                      </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <h4 style={{ fontSize: '13.5px', fontWeight: 600, color: '#1e293b', margin: 0 }}>Enable audit logging</h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {/* Toggle Switch */}
                        <div 
                          onClick={() => setAuditLoggingEnabled(!auditLoggingEnabled)}
                          style={{ 
                            width: '40px', 
                            height: '22px', 
                            borderRadius: '11px', 
                            background: auditLoggingEnabled ? '#005cca' : '#cbd5e1', 
                            position: 'relative', 
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            transition: 'background 0.2s ease'
                          }}
                        >
                          <div style={{ 
                            width: '16px', 
                            height: '16px', 
                            borderRadius: '50%', 
                            background: '#ffffff', 
                            position: 'absolute',
                            left: auditLoggingEnabled ? '22px' : '2px',
                            transition: 'left 0.2s ease'
                          }} />
                        </div>
                        <span style={{ fontSize: '13px', color: '#1e293b', fontWeight: 500 }}>
                          {auditLoggingEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: General settings */}
                  <div className="wz-pill-card" style={{ padding: '24px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b', margin: 0 }}>General settings</h3>
                      <button style={{ background: '#ffffff', border: '1px solid #005cca', color: '#005cca', borderRadius: '4px', padding: '6px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', outline: 'none' }}>
                        Configure
                      </button>
                    </div>

                    {/* Layer settings */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <h4 style={{ fontSize: '14.5px', fontWeight: 600, color: '#1e293b', margin: 0 }}>Layer settings</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
                        <div>
                          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>REST layer</div>
                          <div style={{ fontSize: '13px', color: '#1e293b' }}>Enabled</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>REST disabled categories</div>
                          <div style={{ fontSize: '13px', color: '#1e293b' }}>AUTHENTICATED, GRANTED_PRIVILEGES</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Transport layer</div>
                          <div style={{ fontSize: '13px', color: '#1e293b' }}>Enabled</div>
                        </div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
                        <div>
                          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Transport disabled categories</div>
                          <div style={{ fontSize: '13px', color: '#1e293b' }}>AUTHENTICATED, GRANTED_PRIVILEGES</div>
                        </div>
                      </div>
                    </div>

                    {/* Attribute settings */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                      <h4 style={{ fontSize: '14.5px', fontWeight: 600, color: '#1e293b', margin: 0 }}>Attribute settings</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
                        <div>
                          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Bulk requests</div>
                          <div style={{ fontSize: '13px', color: '#1e293b' }}>Disabled</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Request body</div>
                          <div style={{ fontSize: '13px', color: '#1e293b' }}>Enabled</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Resolve indices</div>
                          <div style={{ fontSize: '13px', color: '#1e293b' }}>Enabled</div>
                        </div>
                      </div>
                    </div>

                    {/* Ignore settings */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                      <h4 style={{ fontSize: '14.5px', fontWeight: 600, color: '#1e293b', margin: 0 }}>Ignore settings</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
                        <div>
                          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Ignored users</div>
                          <div style={{ fontSize: '13px', color: '#1e293b' }}>kibanaserver</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Ignored requests</div>
                          <div style={{ fontSize: '13px', color: '#64748b' }}>—</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Compliance settings */}
                  <div className="wz-pill-card" style={{ padding: '24px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b', margin: 0 }}>Compliance settings</h3>
                      <button style={{ background: '#ffffff', border: '1px solid #005cca', color: '#005cca', borderRadius: '4px', padding: '6px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', outline: 'none' }}>
                        Configure
                      </button>
                    </div>

                    {/* Compliance mode */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <h4 style={{ fontSize: '14.5px', fontWeight: 600, color: '#1e293b', margin: 0 }}>Compliance mode</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
                        <div>
                          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Compliance logging</div>
                          <div style={{ fontSize: '13px', color: '#1e293b' }}>Enabled</div>
                        </div>
                      </div>
                    </div>

                    {/* Config */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                      <h4 style={{ fontSize: '14.5px', fontWeight: 600, color: '#1e293b', margin: 0 }}>Config</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
                        <div>
                          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Internal config logging</div>
                          <div style={{ fontSize: '13px', color: '#1e293b' }}>Enabled</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>External config logging</div>
                          <div style={{ fontSize: '13px', color: '#1e293b' }}>Disabled</div>
                        </div>
                      </div>
                    </div>

                    {/* Read */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                      <h4 style={{ fontSize: '14.5px', fontWeight: 600, color: '#1e293b', margin: 0 }}>Read</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
                        <div>
                          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Read metadata</div>
                          <div style={{ fontSize: '13px', color: '#1e293b' }}>Enabled</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Ignored users</div>
                          <div style={{ fontSize: '13px', color: '#1e293b' }}>kibanaserver</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Watched fields</div>
                          <div style={{ fontSize: '13px', color: '#64748b' }}>—</div>
                        </div>
                      </div>
                    </div>

                    {/* Write */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                      <h4 style={{ fontSize: '14.5px', fontWeight: 600, color: '#1e293b', margin: 0 }}>Write</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
                        <div>
                          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Write metadata</div>
                          <div style={{ fontSize: '13px', color: '#1e293b' }}>Enabled</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Log diffs</div>
                          <div style={{ fontSize: '13px', color: '#1e293b' }}>Disabled</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Ignored users</div>
                          <div style={{ fontSize: '13px', color: '#1e293b' }}>kibanaserver</div>
                        </div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
                        <div>
                          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Watch indices</div>
                          <div style={{ fontSize: '13px', color: '#64748b' }}>—</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      case 'app_settings':
        return (
          <div className="wz-pill-card" style={{ padding: '0', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', minHeight: '600px', display: 'flex', flexDirection: 'column' }}>
            {/* Top Tabs */}
            <div style={{ display: 'flex', gap: '24px', padding: '0 24px', borderBottom: '1px solid #e2e8f0' }}>
              {['Configuration', 'Miscellaneous'].map((t) => (
                <div 
                  key={t}
                  onClick={() => setAppSettingsTab(t as any)}
                  style={{
                    padding: '16px 0',
                    fontSize: '14px',
                    fontWeight: appSettingsTab === t ? 600 : 500,
                    color: appSettingsTab === t ? '#005cca' : '#475569',
                    borderBottom: appSettingsTab === t ? '2px solid #005cca' : '2px solid transparent',
                    cursor: 'pointer'
                  }}
                >
                  {t}
                </div>
              ))}
            </div>
            
            <div style={{ flexGrow: 1, padding: '24px', background: '#f8fafc' }}>
              {appSettingsTab === 'Configuration' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {/* Task:Statistics */}
                  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '24px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 300, color: '#1e293b', margin: '0 0 16px 0' }}>Task:Statistics</h2>
                    <p style={{ color: '#64748b', fontSize: '14px', margin: '0 0 32px 0' }}>Options related to the daemons manager monitoring job and their storage in indexes.</p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '24px', alignItems: 'start' }}>
                        <div>
                          <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b', margin: '0 0 8px 0' }}>Includes APIs</h3>
                          <p style={{ color: '#64748b', fontSize: '13px', margin: 0, lineHeight: '1.5' }}>Enter the ID of the hosts you want to save data from, leave this empty to run the task on every host.</p>
                        </div>
                        <div>
                          <div style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>cron.statistics.apis</div>
                          <div style={{ background: '#e2e8f0', padding: '8px 12px', borderRadius: '4px', fontSize: '13px', color: '#1e293b', display: 'flex', gap: '16px', maxWidth: '600px' }}>
                            <span style={{ color: '#64748b' }}>1</span>
                            <span>[ ]</span>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '24px', alignItems: 'start' }}>
                        <div>
                          <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b', margin: '0 0 8px 0' }}>Index creation</h3>
                          <p style={{ color: '#64748b', fontSize: '13px', margin: 0, lineHeight: '1.5' }}>Define the interval in which a new index will be created. Allowed values: h (Hourly), d (Daily), w (Weekly), m (Monthly).</p>
                        </div>
                        <div>
                          <div style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>cron.statistics.index.creation</div>
                          <div style={{ position: 'relative', width: '100%', maxWidth: '600px' }}>
                            <select style={{ width: '100%', padding: '8px 32px 8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', color: '#1e293b', outline: 'none', appearance: 'none', background: '#ffffff' }}>
                              <option>Weekly</option>
                            </select>
                            <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#94a3b8' }}><FiChevronDown size={14} /></span>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '24px', alignItems: 'start' }}>
                        <div>
                          <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b', margin: '0 0 8px 0' }}>Index name</h3>
                          <p style={{ color: '#64748b', fontSize: '13px', margin: 0, lineHeight: '1.5' }}>Define the name of the index in which the documents will be saved.</p>
                        </div>
                        <div>
                          <div style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>cron.statistics.index.name</div>
                          <input defaultValue="statistics" style={{ width: '100%', maxWidth: '600px', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', color: '#1e293b', outline: 'none', boxSizing: 'border-box' }} />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '24px', alignItems: 'start' }}>
                        <div>
                          <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b', margin: '0 0 8px 0' }}>Index replicas</h3>
                          <p style={{ color: '#64748b', fontSize: '13px', margin: 0, lineHeight: '1.5' }}>Define the number of replicas to use for the statistics indices. Minimum value: 0.</p>
                        </div>
                        <div>
                          <div style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>cron.statistics.index.replicas</div>
                          <input defaultValue="0" style={{ width: '100%', maxWidth: '600px', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', color: '#1e293b', outline: 'none', boxSizing: 'border-box' }} />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '24px', alignItems: 'start' }}>
                        <div>
                          <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b', margin: '0 0 8px 0' }}>Index shards</h3>
                          <p style={{ color: '#64748b', fontSize: '13px', margin: 0, lineHeight: '1.5' }}>Define the number of shards to use for the statistics indices. Minimum value: 1.</p>
                        </div>
                        <div>
                          <div style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>cron.statistics.index.shards</div>
                          <input defaultValue="1" style={{ width: '100%', maxWidth: '600px', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', color: '#1e293b', outline: 'none', boxSizing: 'border-box' }} />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '24px', alignItems: 'start' }}>
                        <div>
                          <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b', margin: '0 0 8px 0' }}>Interval</h3>
                          <p style={{ color: '#64748b', fontSize: '13px', margin: 0, lineHeight: '1.5' }}>Define the frequency of task execution using cron schedule expressions.</p>
                        </div>
                        <div>
                          <div style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>cron.statistics.interval</div>
                          <input defaultValue="0 */5 * * * *" style={{ width: '100%', maxWidth: '600px', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', color: '#1e293b', outline: 'none', boxSizing: 'border-box' }} />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '24px', alignItems: 'start' }}>
                        <div>
                          <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b', margin: '0 0 8px 0' }}>Status</h3>
                          <p style={{ color: '#64748b', fontSize: '13px', margin: 0, lineHeight: '1.5' }}>Enable or disable the statistics tasks. Allowed values: true, false.</p>
                        </div>
                        <div>
                          <div style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>cron.statistics.status</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '36px', height: '20px', borderRadius: '10px', background: '#005cca', position: 'relative', cursor: 'pointer' }}>
                              <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: '#ffffff', position: 'absolute', left: '19px', top: '3px' }} />
                            </div>
                            <span style={{ fontSize: '13px', color: '#1e293b' }}>true</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Custom branding */}
                  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '24px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 300, color: '#1e293b', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Custom branding <FiInfo size={14} color="#005cca" />
                    </h2>
                    <p style={{ color: '#64748b', fontSize: '14px', margin: '0 0 32px 0' }}>If you want to use custom branding elements such as logos, you can do so by editing the settings below.</p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '24px', alignItems: 'start' }}>
                        <div>
                          <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b', margin: '0 0 8px 0' }}>Status</h3>
                          <p style={{ color: '#64748b', fontSize: '13px', margin: 0, lineHeight: '1.5' }}>Enable or disable the customization. Allowed values: true, false.</p>
                        </div>
                        <div>
                          <div style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>customization.enabled</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '36px', height: '20px', borderRadius: '10px', background: '#005cca', position: 'relative', cursor: 'pointer' }}>
                              <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: '#ffffff', position: 'absolute', left: '19px', top: '3px' }} />
                            </div>
                            <span style={{ fontSize: '13px', color: '#1e293b' }}>true</span>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '24px', alignItems: 'start' }}>
                        <div>
                          <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b', margin: '0 0 8px 0' }}>App main logo</h3>
                          <p style={{ color: '#64748b', fontSize: '13px', margin: 0, lineHeight: '1.5' }}>This logo is used as loading indicator while the user is logging into Wazuh API. Supported extensions: .jpeg, .jpg, .png, .svg. Recommended dimensions: 300x70px. Maximum file size: 1 MB.</p>
                        </div>
                        <div>
                          <div style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>customization.logo.app</div>
                          <div style={{ width: '100%', maxWidth: '600px', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#f8fafc', color: '#64748b', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                            <FiDownload size={14} /> Select or drag the file
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '24px', alignItems: 'start' }}>
                        <div>
                          <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b', margin: '0 0 8px 0' }}>Healthcheck logo</h3>
                          <p style={{ color: '#64748b', fontSize: '13px', margin: 0, lineHeight: '1.5' }}>This logo is displayed during the Healthcheck routine of the app. Supported extensions: .jpeg, .jpg, .png, .svg. Recommended dimensions: 300x70px. Maximum file size: 1 MB.</p>
                        </div>
                        <div>
                          <div style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>customization.logo.healthcheck</div>
                          <div style={{ width: '100%', maxWidth: '600px', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#f8fafc', color: '#64748b', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                            <FiDownload size={14} /> Select or drag the file
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '24px', alignItems: 'start' }}>
                        <div>
                          <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b', margin: '0 0 8px 0' }}>PDF reports logo</h3>
                          <p style={{ color: '#64748b', fontSize: '13px', margin: 0, lineHeight: '1.5' }}>This logo is used in the PDF reports generated by the app. It's placed at the top left corner of every page of the PDF. Supported extensions: .jpeg, .jpg, .png. Recommended dimensions: 190x40px. Maximum file size: 1 MB.</p>
                        </div>
                        <div>
                          <div style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>customization.logo.reports</div>
                          <div style={{ width: '100%', maxWidth: '600px', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#f8fafc', color: '#64748b', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                            <FiDownload size={14} /> Select or drag the file
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '24px', alignItems: 'start' }}>
                        <div>
                          <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b', margin: '0 0 8px 0' }}>Reports footer</h3>
                          <p style={{ color: '#64748b', fontSize: '13px', margin: 0, lineHeight: '1.5' }}>Set the footer of the reports. Maximum amount of lines: 2. Maximum lines length is 50 characters.</p>
                        </div>
                        <div>
                          <div style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>customization.reports.footer</div>
                          <textarea rows={3} style={{ width: '100%', maxWidth: '600px', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', color: '#1e293b', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }} />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '24px', alignItems: 'start' }}>
                        <div>
                          <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b', margin: '0 0 8px 0' }}>Reports header</h3>
                          <p style={{ color: '#64748b', fontSize: '13px', margin: 0, lineHeight: '1.5' }}>Set the header of the reports. Maximum amount of lines: 3. Maximum lines length is 40 characters.</p>
                        </div>
                        <div>
                          <div style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>customization.reports.header</div>
                          <textarea rows={3} style={{ width: '100%', maxWidth: '600px', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', color: '#1e293b', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }} />
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              )}

              {appSettingsTab === 'Miscellaneous' && (
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '24px' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: 300, color: '#1e293b', margin: '0 0 4px 0' }}>Miscellaneous</h2>
                  <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 24px 0' }}>App utils</p>

                  <div style={{ border: '1px solid #e2e8f0', borderRadius: '4px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: 300, color: '#1e293b', margin: '0 0 12px 0' }}>Health check</h3>
                      <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b', margin: '0 0 8px 0' }}>Execute in debug mode</h4>
                      <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>Run health check and no redirect when all checks are ready</p>
                    </div>
                    <button style={{ background: '#005cca', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '8px 24px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                      Run
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      case 'apis':
        return (
          <div style={{ position: 'relative' }}>
            <div className="wz-pill-card" style={{ padding: '24px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', minHeight: '600px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: 300, color: '#1e293b', margin: '0 0 12px 0' }}>API Connections</h2>
                  <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>From here you can manage and configure the API entries. You can also check their connection and status.</p>
                </div>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <button 
                    onClick={() => setShowAddApiConnection(true)}
                    style={{ background: 'none', border: 'none', color: '#005cca', fontSize: '13.5px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                  >
                    <FiPlus size={14} /> Add API connection
                  </button>
                  <button style={{ background: 'none', border: 'none', color: '#005cca', fontSize: '13.5px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <FiRefreshCw size={14} /> Refresh
                  </button>
                  <button style={{ background: 'none', border: 'none', color: '#005cca', fontSize: '13.5px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <FiRefreshCw size={14} /> Check updates <FiInfo size={12} color="#64748b" />
                  </button>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475569', cursor: 'pointer' }}>
                    <input type="checkbox" /> Disable updates notifications <FiInfo size={12} color="#64748b" />
                  </label>
                </div>
              </div>

            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '8px 12px', background: '#f8fafc', marginBottom: '16px' }}>
              <FiSearch style={{ color: '#64748b', marginRight: '8px' }} size={16} />
              <input type="text" placeholder="Search..." style={{ border: 'none', outline: 'none', fontSize: '13px', width: '100%', background: 'transparent' }} />
            </div>

            <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                    <th style={{ padding: '12px 16px', color: '#1e293b', fontWeight: 700 }}>ID</th>
                    <th style={{ padding: '12px 16px', color: '#1e293b', fontWeight: 700 }}>Cluster</th>
                    <th style={{ padding: '12px 16px', color: '#1e293b', fontWeight: 700 }}>Manager</th>
                    <th style={{ padding: '12px 16px', color: '#1e293b', fontWeight: 700 }}>Host</th>
                    <th style={{ padding: '12px 16px', color: '#1e293b', fontWeight: 700 }}>Port</th>
                    <th style={{ padding: '12px 16px', color: '#1e293b', fontWeight: 700 }}>Username</th>
                    <th style={{ padding: '12px 16px', color: '#1e293b', fontWeight: 700 }}>Status</th>
                    <th style={{ padding: '12px 16px', color: '#1e293b', fontWeight: 700 }}>Version</th>
                    <th style={{ padding: '12px 16px', color: '#1e293b', fontWeight: 700 }}>Updates status</th>
                    <th style={{ padding: '12px 16px', color: '#1e293b', fontWeight: 700 }}>Run as</th>
                    <th style={{ padding: '12px 16px', color: '#1e293b', fontWeight: 700 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '12px 16px', color: '#005cca', display: 'flex', alignItems: 'center', gap: '4px' }}>default <FiInfo size={12} color="#005cca" /></td>
                    <td style={{ padding: '12px 16px', color: '#475569' }}>wazuh</td>
                    <td style={{ padding: '12px 16px', color: '#475569' }}>saad-cyber6</td>
                    <td style={{ padding: '12px 16px', color: '#475569' }}>https://localhost</td>
                    <td style={{ padding: '12px 16px', color: '#475569' }}>55000</td>
                    <td style={{ padding: '12px 16px', color: '#475569' }}>wazuh-wui</td>
                    <td style={{ padding: '12px 16px', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} /> Online</td>
                    <td style={{ padding: '12px 16px', color: '#475569' }}>v4.14.5</td>
                    <td style={{ padding: '12px 16px', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} /> Up to date</td>
                    <td style={{ padding: '12px 16px', color: '#475569' }}>✓</td>
                    <td style={{ padding: '12px 16px', color: '#005cca', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="16" width="16" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
                      <FiRefreshCw size={14} />
                    </td>
                  </tr>
                </tbody>
              </table>
              <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#475569', fontSize: '13px', background: '#ffffff' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Rows per page: <select style={{ border: 'none', background: 'transparent', color: '#1e293b', fontWeight: 600, outline: 'none' }}><option>10</option></select>
                </div>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <span style={{ cursor: 'pointer' }}>&lt;</span>
                  <span style={{ fontWeight: 600, color: '#005cca' }}>1</span>
                  <span style={{ cursor: 'pointer' }}>&gt;</span>
                </div>
              </div>
            </div>
          </div>

          {/* Add API Connection Slide Panel */}
            {showAddApiConnection && (
              <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '600px', background: '#ffffff', borderLeft: '1px solid #e2e8f0', boxShadow: '-4px 0 15px rgba(0,0,0,0.05)', zIndex: 100, display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b', margin: 0 }}>Add API connection</h3>
                  <button onClick={() => setShowAddApiConnection(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>✕</button>
                </div>
                <div style={{ padding: '24px', overflowY: 'auto' }}>
                  <p style={{ fontSize: '14px', color: '#475569', margin: '0 0 16px 0', lineHeight: '1.5' }}>
                    Modify <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', color: '#1e293b' }}>/usr/share/wazuh-dashboard/data/wazuh/config/wazuh.yml</code> to set the connection information.
                  </p>
                  
                  <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '13px', color: '#334155', whiteSpace: 'pre-wrap', marginBottom: '24px' }}>
{`hosts:
  - <id>:
    url: <url>
    port: <port>
    username: <username>
    password: <password>
    run_as: <run_as>`}
                  </div>

                  <p style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', margin: '0 0 12px 0' }}>Where:</p>
                  <ul style={{ listStyleType: 'none', padding: 0, margin: '0 0 24px 0', fontSize: '14px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <li>- <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', color: '#1e293b' }}>&lt;id&gt;</code> : identifier of the API connection. This must be unique.</li>
                    <li>- <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', color: '#1e293b' }}>&lt;url&gt;</code> : server URL address</li>
                    <li>- <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', color: '#1e293b' }}>&lt;port&gt;</code> : port</li>
                    <li>- <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', color: '#1e293b' }}>&lt;username&gt;</code> : server API username</li>
                    <li>- <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', color: '#1e293b' }}>&lt;password&gt;</code> : user's Password</li>
                    <li>- <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', color: '#1e293b' }}>&lt;run_as&gt;</code> : use the authentication context.</li>
                  </ul>

                  <div style={{ background: '#fffbeb', borderLeft: '4px solid #fbbf24', padding: '16px', borderRadius: '4px' }}>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#b45309', margin: '0 0 8px 0', fontSize: '15px', fontWeight: 600 }}>
                      <FiAlertTriangle size={16} /> Warning
                    </h4>
                    <p style={{ color: '#92400e', fontSize: '13px', margin: 0, lineHeight: '1.5' }}>
                      The changes of the API connections in the configuration file could need some time to take effect due to the cache of configuration.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case 'about':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: '#eff6ff', padding: '16px 24px', borderRadius: '4px', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '14px', color: '#475569' }}>App version:</span>
              <strong style={{ fontSize: '14px', color: '#1e293b' }}>4.14.5</strong>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="wz-pill-card" style={{ background: '#ffffff', padding: '24px', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 300, color: '#1e293b', margin: '0 0 16px 0' }}>Welcome to the dashboard</h2>
                <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                  Dashboard provides management and monitoring capabilities, giving users control over the infrastructure. You can monitor your agents status and configuration, query and visualize your alert data and monitor manager rules and configuration.
                </p>
              </div>

              <div className="wz-pill-card" style={{ background: '#ffffff', padding: '24px', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 300, color: '#1e293b', margin: '0 0 16px 0' }}>Community</h2>
                <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6', margin: '0 0 24px 0' }}>
                  Enjoy your experience and please don't hesitate to give us your feedback.
                </p>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  {/* Mock icons for slack, groups, github using images or generic shapes */}
                  <div style={{ width: '32px', height: '32px', borderRadius: '4px', background: '#005cca', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', cursor: 'pointer' }}>#</div>
                  <div style={{ width: '32px', height: '32px', borderRadius: '4px', background: '#005cca', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', cursor: 'pointer' }}>@</div>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', cursor: 'pointer' }}>{'</>'}</div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="wz-page" style={{ background: '#f8fafc' }}>
      <div className="wz-page-content">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Settings;
