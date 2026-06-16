import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch, FiPlus, FiX, FiServer, FiCopy, FiChevronRight, 
  FiChevronDown, FiCheck, FiInfo, FiArrowLeft, FiAlertTriangle, FiMoreHorizontal, FiSettings, FiRefreshCw, FiDownload
} from 'react-icons/fi';
import { FaApple, FaWindows, FaLinux } from 'react-icons/fa';

const mockAgents = [
  { id: '001', name: 'lsgasaad', ip: '192.168.122.70', group: 'default', os: 'Ubuntu 20.04 LTS', node: 'node01', version: 'v4.14.5', status: 'disconnected' },
  { id: '002', name: 'db-prod-02', ip: '192.168.122.88', group: 'default', os: 'Ubuntu 22.04 LTS', node: 'node01', version: 'v4.14.5', status: 'active' },
  { id: '003', name: 'web-server-03', ip: '192.168.122.95', group: 'web', os: 'CentOS 8', node: 'node02', version: 'v4.14.4', status: 'active' },
  { id: '004', name: 'dev-workstation', ip: '192.168.122.101', group: 'default', os: 'Windows 11', node: 'node01', version: 'v4.14.5', status: 'pending' },
  { id: '005', name: 'prod-db-05', ip: '10.0.0.15', group: 'database', os: 'Ubuntu 20.04 LTS', node: 'node02', version: 'v4.14.5', status: 'active' },
  { id: '006', name: 'ci-runner-01', ip: '10.0.0.22', group: 'default', os: 'Ubuntu 22.04 LTS', node: 'node01', version: 'v4.14.3', status: 'active' },
];

const DonutChart: React.FC<{
  size?: number;
  thickness?: number;
  segments: { color: string; value: number; label: string }[];
}> = ({ size = 110, thickness = 18, segments }) => {
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = segments.reduce((acc, s) => acc + s.value, 0);
  
  let currentOffset = 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '32px', height: '100%' }}>
      <svg width={size} height={size}>
        {total === 0 && (
          <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#f1f5f9" strokeWidth={thickness} />
        )}
        {segments.map((s, i) => {
          if (total === 0 || s.value === 0) return null;
          const percentage = s.value / total;
          const strokeLength = percentage * circumference;
          const strokeGap = circumference - strokeLength;
          const offset = currentOffset;
          currentOffset += strokeLength;
          return (
            <circle
              key={i}
              cx={size/2}
              cy={size/2}
              r={radius}
              fill="none"
              stroke={s.color}
              strokeWidth={thickness}
              strokeDasharray={`${strokeLength} ${strokeGap}`}
              strokeDashoffset={-offset}
              transform={`rotate(-90 ${size/2} ${size/2})`}
            />
          );
        })}
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {segments.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475569' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: s.color }}></div>
            <span>{s.label} ({s.value})</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Agents: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (location.search.includes('view=groups')) {
      navigate('/groups', { replace: true });
    }
  }, [location.search, navigate]);

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [showActionsFor, setShowActionsFor] = useState<string | null>(null);
  const ITEMS_PER_PAGE = 10;

  // Check if we are in deployment wizard view
  const isDeployMode = location.search.includes('deploy=true');

  // Wizard state variables
  const [selectedOS, setSelectedOS] = useState<'linux' | 'windows' | 'macos'>('linux');
  const [selectedArch, setSelectedArch] = useState<string>('deb-amd64'); // deb-amd64, deb-aarch64, rpm-amd64, rpm-aarch64, msi, mac-intel, mac-silicon
  const [serverAddress, setServerAddress] = useState('');
  const [rememberServer, setRememberServer] = useState(false);
  const [agentName, setAgentName] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('Default');
  const [copiedText, setCopiedText] = useState('');

  // Handle back to list
  const handleBackToList = () => {
    navigate('/agents');
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(''), 2000);
  };

  // Generate dynamic installation commands based on OS and Server Address
  const getInstallCommand = () => {
    const manager = serverAddress || '<manager_ip_address>';
    const nameArg = agentName ? ` WAZUH_AGENT_NAME='${agentName}'` : '';
    const groupArg = selectedGroup && selectedGroup !== 'Default' ? ` WAZUH_AGENT_GROUP='${selectedGroup}'` : ` WAZUH_AGENT_GROUP='default'`;

    if (selectedOS === 'linux') {
      if (selectedArch.startsWith('deb')) {
        return `wget https://packages.wazuh.com/4.x/apt/pool/main/w/wazuh-agent/wazuh-agent_4.14.5-1_amd64.deb && sudo WAZUH_MANAGER='${manager}'${groupArg}${nameArg} dpkg -i ./wazuh-agent_4.14.5-1_amd64.deb`;
      } else {
        return `wget https://packages.wazuh.com/4.x/yum/wazuh-agent-4.14.5-1.x86_64.rpm && sudo WAZUH_MANAGER='${manager}'${groupArg}${nameArg} rpm -ihv wazuh-agent-4.14.5-1.x86_64.rpm`;
      }
    } else if (selectedOS === 'windows') {
      return `Invoke-WebRequest -Uri https://packages.wazuh.com/4.x/windows/wazuh-agent-4.14.5-1.msi -OutFile wazuh-agent-4.14.5.msi; .\\wazuh-agent-4.14.5.msi /q WAZUH_MANAGER='${manager}'${nameArg.replace(' WAZUH_AGENT_NAME', ' WAZUH_AGENT_NAME')}${groupArg.replace(' WAZUH_AGENT_GROUP', ' WAZUH_AGENT_GROUP')}`;
    } else if (selectedOS === 'macos') {
      return `curl -so wazuh-agent.pkg https://packages.wazuh.com/4.x/macos/wazuh-agent-4.14.5-1.pkg && sudo WAZUH_MANAGER='${manager}'${groupArg}${nameArg} installer -pkg wazuh-agent.pkg -target /`;
    }
    return '';
  };

  // Generate dynamic service start commands
  const getStartCommand = () => {
    if (selectedOS === 'linux') {
      return 'sudo systemctl daemon-reload\nsudo systemctl enable wazuh-agent\nsudo systemctl start wazuh-agent';
    } else if (selectedOS === 'windows') {
      return 'NET START Wazuh';
    } else if (selectedOS === 'macos') {
      return 'sudo /Library/Ossec/bin/wazuh-control start';
    }
    return '';
  };

  const filteredAgents = mockAgents.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase()) || 
                          a.ip.includes(search) || 
                          a.id.includes(search);
    return matchesSearch && (filterStatus === 'all' || a.status === filterStatus);
  });

  const totalPages = Math.max(1, Math.ceil(filteredAgents.length / ITEMS_PER_PAGE));
  const paginatedAgents = filteredAgents.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const allSelected = paginatedAgents.length > 0 && paginatedAgents.every(a => selectedAgents.includes(a.id));

  return (
    <div className="wz-page">
      <div className="wz-page-content">
        
        {isDeployMode ? (
          /* =========================================================
             DEPLOY NEW AGENT WIZARD VIEW
             ========================================================= */
          <div>
            {/* Header Arrow */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <button 
                onClick={handleBackToList}
                style={{
                  border: 'none',
                  background: 'none',
                  color: 'var(--wz-blue)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '4px'
                }}
              >
                <FiArrowLeft size={18} />
              </button>
              <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--wz-text)', margin: 0 }}>
                Deploy new agent
              </h2>
            </div>

            <div style={{ padding: '0 32px 32px' }}>
              
              {/* STEP 1: Select OS Package */}
              <div className="wz-wizard-step">
                <div className="wz-wizard-circle completed"><FiCheck size={16} /></div>
                <div className="wz-wizard-content">
                  <div className="wz-wizard-title">Select the package to download and install on your system:</div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '12px' }}>
                    
                    {/* LINUX CARD */}
                    <div 
                      className={`wz-os-card ${selectedOS === 'linux' ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedOS('linux');
                        setSelectedArch('deb-amd64');
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontWeight: 700, fontSize: '15px', marginBottom: '24px', color: '#1e293b' }}>
                        <FaLinux size={24} /> LINUX
                      </div>
                      <div style={{ height: '1px', background: 'var(--wz-border)', margin: '0 -16px 16px', opacity: 0.5 }}></div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', paddingLeft: '8px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', cursor: 'pointer', color: '#475569' }}>
                          <input type="radio" name="linux-arch" checked={selectedArch === 'rpm-amd64'} onChange={() => { setSelectedOS('linux'); setSelectedArch('rpm-amd64'); }} />
                          <span>RPM amd64</span>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', cursor: 'pointer', color: '#475569' }}>
                          <input type="radio" name="linux-arch" checked={selectedArch === 'rpm-aarch64'} onChange={() => { setSelectedOS('linux'); setSelectedArch('rpm-aarch64'); }} />
                          <span>RPM aarch64</span>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', cursor: 'pointer', color: '#1e293b' }}>
                          <input type="radio" name="linux-arch" checked={selectedArch === 'deb-amd64'} onChange={() => { setSelectedOS('linux'); setSelectedArch('deb-amd64'); }} />
                          <span>DEB amd64</span>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', cursor: 'pointer', color: '#475569' }}>
                          <input type="radio" name="linux-arch" checked={selectedArch === 'deb-aarch64'} onChange={() => { setSelectedOS('linux'); setSelectedArch('deb-aarch64'); }} />
                          <span>DEB aarch64</span>
                        </label>
                      </div>
                    </div>

                    {/* WINDOWS CARD */}
                    <div 
                      className={`wz-os-card ${selectedOS === 'windows' ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedOS('windows');
                        setSelectedArch('msi');
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontWeight: 700, fontSize: '15px', marginBottom: '24px', color: '#1e293b' }}>
                        <FaWindows size={20} /> WINDOWS
                      </div>
                      <div style={{ height: '1px', background: 'var(--wz-border)', margin: '0 -16px 16px', opacity: 0.5 }}></div>
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', cursor: 'pointer', color: '#475569' }}>
                          <input type="radio" name="win-arch" checked={selectedArch === 'msi'} onChange={() => { setSelectedOS('windows'); setSelectedArch('msi'); }} />
                          <span>MSI 32/64 bits</span>
                        </label>
                      </div>
                    </div>

                    {/* MACOS CARD */}
                    <div 
                      className={`wz-os-card ${selectedOS === 'macos' ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedOS('macos');
                        setSelectedArch('mac-intel');
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontWeight: 700, fontSize: '15px', marginBottom: '24px', color: '#1e293b' }}>
                        <FaApple size={22} style={{ marginBottom: '4px' }} /> macOS
                      </div>
                      <div style={{ height: '1px', background: 'var(--wz-border)', margin: '0 -16px 16px', opacity: 0.5 }}></div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingLeft: '16px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', cursor: 'pointer', color: '#475569' }}>
                          <input type="radio" name="mac-arch" checked={selectedArch === 'mac-intel'} onChange={() => { setSelectedOS('macos'); setSelectedArch('mac-intel'); }} />
                          <span>Intel</span>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', cursor: 'pointer', color: '#475569' }}>
                          <input type="radio" name="mac-arch" checked={selectedArch === 'mac-silicon'} onChange={() => { setSelectedOS('macos'); setSelectedArch('mac-silicon'); }} />
                          <span>Apple silicon</span>
                        </label>
                      </div>
                    </div>

                  </div>

                  <div className="wz-info-banner wz-info-banner-blue" style={{ marginTop: '16px' }}>
                    <FiInfo size={16} style={{ flexShrink: 0 }} />
                    <span>
                      For additional systems and architectures, please check our <a href="#" style={{ color: 'var(--wz-blue)', textDecoration: 'underline', fontWeight: 600 }}>documentation</a>.
                    </span>
                  </div>
                </div>
              </div>

              {/* STEP 2: Server Address */}
              <div className="wz-wizard-step">
                <div className={`wz-wizard-circle completed`}><FiCheck size={16} /></div>
                <div className="wz-wizard-content">
                  <div className="wz-wizard-title">Server address:</div>
                  <p style={{ fontSize: '13px', color: '#475569', margin: '0 0 16px 0', lineHeight: 1.5 }}>
                    This is the address the agent uses to communicate with the server. Enter an IP address or a fully qualified domain name (FQDN).
                  </p>
                  
                  <div style={{ maxWidth: '450px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Assign a server address <FiInfo size={14} style={{ color: '#005cca', cursor: 'pointer' }} />
                    </span>
                    <input 
                      type="text" 
                      placeholder="192.168.122.70"
                      value={serverAddress}
                      onChange={e => setServerAddress(e.target.value)}
                      className="wz-search-input"
                      style={{ padding: '8px 12px' }}
                    />
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', cursor: 'pointer', marginTop: '4px', color: '#475569' }}>
                      <input 
                        type="checkbox" 
                        checked={rememberServer} 
                        onChange={() => setRememberServer(!rememberServer)}
                      />
                      <span>Remember server address</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* STEP 3: Optional Settings */}
              <div className="wz-wizard-step">
                <div className="wz-wizard-circle completed"><FiCheck size={16} /></div>
                <div className="wz-wizard-content">
                  <div className="wz-wizard-title">Optional settings:</div>
                  <p style={{ fontSize: '13px', color: '#475569', margin: '0 0 16px 0' }}>
                    By default, the deployment uses the hostname as the agent name. Optionally, you can use a different agent name in the field below.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '450px', marginTop: '8px' }}>
                    
                    {/* Agent Name */}
                    <div>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                        Assign an agent name: <FiInfo size={14} style={{ color: '#005cca', cursor: 'pointer' }} />
                      </span>
                      <input 
                        type="text" 
                        placeholder="lsga"
                        value={agentName}
                        onChange={e => setAgentName(e.target.value)}
                        className="wz-search-input"
                        style={{ padding: '8px 12px' }}
                      />
                    </div>

                    <div className="wz-info-banner wz-info-banner-yellow" style={{ margin: 0, padding: '12px 16px' }}>
                      <FiInfo size={16} style={{ flexShrink: 0 }} />
                      <span>
                        The agent name must be unique. It can't be changed once the agent has been enrolled. <a href="#" style={{ textDecoration: 'underline' }}></a>
                      </span>
                    </div>

                    {/* Group Selection */}
                    <div>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                        Select one or more existing groups: <FiInfo size={14} style={{ color: '#005cca', cursor: 'pointer' }} />
                      </span>
                      <div style={{ border: '1px solid var(--wz-border)', borderRadius: '4px', padding: '6px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#ffffff', minHeight: '38px' }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <span style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '2px 8px', fontSize: '12.5px', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            default <FiX size={12} style={{ cursor: 'pointer' }} />
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8' }}>
                          <FiX size={14} style={{ cursor: 'pointer' }} />
                          <FiChevronDown size={16} style={{ cursor: 'pointer' }} />
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

                  {/* STEP 4: Installation Commands */}
              <div className="wz-wizard-step">
                <div className="wz-wizard-circle">4</div>
                <div className="wz-wizard-content">
                  <div className="wz-wizard-title">Run the following commands to download and install the agent:</div>
                  
                  <div style={{ position: 'relative', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '16px', marginTop: '16px' }}>
                    <pre style={{ margin: 0, fontSize: '13px', color: '#1e293b', fontFamily: 'monospace', whiteSpace: 'pre-wrap', wordBreak: 'break-all', lineHeight: 1.6, paddingRight: '40px' }}>
                      {getInstallCommand()}
                    </pre>
                    <button
                      onClick={() => handleCopy(getInstallCommand())}
                      style={{
                        position: 'absolute', top: '8px', right: '8px',
                        background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px',
                        padding: '4px 10px', fontSize: '12px', fontWeight: 600, color: '#005cca',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px'
                      }}
                    >
                      <FiCopy size={12} /> {copiedText === getInstallCommand() ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  
                  <div className="wz-info-banner wz-info-banner-blue" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '16px', marginTop: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--wz-blue)', fontWeight: 600, marginBottom: '8px' }}>
                      <FiInfo size={16} /> Requirements
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '24px', marginBottom: '16px', color: '#1e293b', fontSize: '13px' }}>
                      <li>You will need administrator privileges to perform this installation.</li>
                      <li>Shell Bash is required.</li>
                    </ul>
                    <span style={{ color: '#1e293b', fontSize: '13px' }}>Keep in mind you need to run this command in a Shell Bash terminal.</span>
                  </div>
                </div>
              </div>

              {/* STEP 5: Start Agent */}
              <div className="wz-wizard-step">
                <div className="wz-wizard-circle">5</div>
                <div className="wz-wizard-content">
                  <div className="wz-wizard-title">Start the agent:</div>
                  
                  <div style={{ position: 'relative', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '16px', marginTop: '16px' }}>
                    <pre style={{ margin: 0, fontSize: '13px', color: '#1e293b', fontFamily: 'monospace', whiteSpace: 'pre-wrap', wordBreak: 'break-all', lineHeight: 1.6, paddingRight: '40px' }}>
                      {getStartCommand()}
                    </pre>
                    <button
                      onClick={() => handleCopy(getStartCommand())}
                      style={{
                        position: 'absolute', top: '8px', right: '8px',
                        background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px',
                        padding: '4px 10px', fontSize: '12px', fontWeight: 600, color: '#005cca',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px'
                      }}
                    >
                      <FiCopy size={12} /> {copiedText === getStartCommand() ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
              </div>

              {/* STEP 6: Go to Endpoints to Verify */}
              <div className="wz-wizard-step">
                <div className="wz-wizard-circle">6</div>
                <div className="wz-wizard-content">
                  <div className="wz-wizard-title">Go to endpoints to verify the agent connection:</div>
                  <div style={{ marginTop: '16px' }}>
                    <button className="wz-btn" onClick={handleBackToList} style={{ background: '#005cca', padding: '8px 16px', fontWeight: 600 }}>
                      Back to agent list
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        ) : (
          /* =========================================================
             STANDARD AGENTS LIST / ENDPOINTS DASHBOARD VIEW
             ========================================================= */
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--wz-text)', margin: '0 0 4px 0' }}>Agents</h1>
                  <p style={{ fontSize: '13px', color: 'var(--wz-text-muted)', margin: 0 }}>Manage and monitor Wazuh agents deployed across your infrastructure</p>
                </div>
                <button className="wz-btn" onClick={() => navigate('/agents?deploy=true')}>
                  <FiPlus size={14} /> Deploy new agent
                </button>
              </div>

            {/* Quick stats cards as Donut Charts */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
              <div className="wz-pill-card" style={{ display: 'flex', flexDirection: 'column', padding: '24px 16px', margin: 0, height: '180px' }}>
                <div className="wz-pill-card-header">AGENTS BY STATUS</div>
                <div style={{ flex: 1 }}>
                  <DonutChart 
                    segments={[
                      { color: '#cc0000', value: 1, label: 'Disconnected' },
                      { color: '#00a853', value: 0, label: 'Active' },
                      { color: '#f59e0b', value: 0, label: 'Pending' },
                      { color: '#64748b', value: 0, label: 'Never connected' },
                    ]} 
                  />
                </div>
              </div>
              
              <div className="wz-pill-card" style={{ display: 'flex', flexDirection: 'column', padding: '24px 16px', margin: 0, height: '180px' }}>
                <div className="wz-pill-card-header">TOP 5 OS</div>
                <div style={{ flex: 1 }}>
                  <DonutChart 
                    segments={[
                      { color: '#44a68f', value: 1, label: 'ubuntu' }
                    ]} 
                  />
                </div>
              </div>
              
              <div className="wz-pill-card" style={{ display: 'flex', flexDirection: 'column', padding: '24px 16px', margin: 0, height: '180px' }}>
                <div className="wz-pill-card-header">TOP 5 GROUPS</div>
                <div style={{ flex: 1 }}>
                  <DonutChart 
                    segments={[
                      { color: '#44a68f', value: 1, label: 'default' }
                    ]} 
                  />
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="wz-table-wrapper" style={{ border: '1px solid var(--wz-border)', borderRadius: '6px', background: '#ffffff', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--wz-border)' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b', margin: 0 }}>Agents ({filteredAgents.length})</h2>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', fontSize: '13px', color: '#005cca' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }} onClick={() => navigate('/agents?deploy=true')}>
                    <FiPlus size={14} /> Deploy new agent
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }} onClick={() => toast.success('Agents refreshed')}>
                    <FiRefreshCw size={14} /> Refresh
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }} onClick={() => {
                    const csv = ['ID,Name,IP,Group,OS,Node,Version,Status'];
                    filteredAgents.forEach(a => csv.push(`${a.id},${a.name},${a.ip},${a.group},${a.os},${a.node},${a.version},${a.status}`));
                    const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a'); link.href = url; link.download = 'agents-export.csv'; link.click();
                    URL.revokeObjectURL(url); toast.success('CSV exported');
                  }}>
                    <FiDownload size={14} /> Export formatted
                  </div>
                </div>
              </div>

              {/* Status Filter Buttons */}
              <div style={{ display: 'flex', gap: '8px', padding: '12px 20px', borderBottom: '1px solid var(--wz-border)' }}>
                {[
                  { key: 'all', label: 'All', count: mockAgents.length },
                  { key: 'active', label: 'Active', count: mockAgents.filter(a => a.status === 'active').length },
                  { key: 'pending', label: 'Pending', count: mockAgents.filter(a => a.status === 'pending').length },
                  { key: 'disconnected', label: 'Disconnected', count: mockAgents.filter(a => a.status === 'disconnected').length },
                ].map(s => (
                  <button key={s.key} onClick={() => { setFilterStatus(s.key); setCurrentPage(1); }} style={{ padding: '6px 14px', border: '1px solid', borderRadius: '20px', fontSize: '12px', fontWeight: filterStatus === s.key ? 600 : 400, cursor: 'pointer', background: filterStatus === s.key ? (s.key === 'active' ? '#dcfce7' : s.key === 'pending' ? '#fef3c7' : s.key === 'disconnected' ? '#fee2e2' : '#eff6ff') : '#ffffff', color: filterStatus === s.key ? '#1e293b' : '#64748b', borderColor: filterStatus === s.key ? (s.key === 'active' ? '#86efac' : s.key === 'pending' ? '#fde68a' : s.key === 'disconnected' ? '#fca5a5' : '#93c5fd') : '#e2e8f0' }}>
                    {s.label} ({s.count})
                  </button>
                ))}
              </div>

              {/* Bulk Actions Bar */}
              {selectedAgents.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 20px', background: '#eff6ff', borderBottom: '1px solid #bfdbfe', fontSize: '13px' }}>
                  <span style={{ fontWeight: 600, color: '#1e293b' }}>{selectedAgents.length} selected</span>
                  <button onClick={() => { toast.success(`Restarting ${selectedAgents.length} agent(s)`); setSelectedAgents([]); }} style={{ padding: '4px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#fff', cursor: 'pointer', fontSize: '12px', color: '#475569' }}>Restart</button>
                  <button onClick={() => { toast.success(`Upgrading ${selectedAgents.length} agent(s)`); setSelectedAgents([]); }} style={{ padding: '4px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#fff', cursor: 'pointer', fontSize: '12px', color: '#475569' }}>Upgrade</button>
                  <button onClick={() => { toast.success(`Assigning ${selectedAgents.length} agent(s) to group`); setSelectedAgents([]); }} style={{ padding: '4px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#fff', cursor: 'pointer', fontSize: '12px', color: '#475569' }}>Add to group</button>
                  <button onClick={() => { if (window.confirm(`Remove ${selectedAgents.length} agent(s)?`)) { toast.success(`Removed ${selectedAgents.length} agent(s)`); setSelectedAgents([]); } }} style={{ padding: '4px 12px', border: '1px solid #fca5a5', borderRadius: '4px', background: '#fff', cursor: 'pointer', fontSize: '12px', color: '#dc2626' }}>Remove</button>
                  <button onClick={() => setSelectedAgents([])} style={{ padding: '4px 8px', border: 'none', background: 'none', cursor: 'pointer', color: '#64748b', marginLeft: 'auto' }}><FiX size={14} /></button>
                </div>
              )}
              
              <div style={{ display: 'flex', borderBottom: '1px solid var(--wz-border)' }}>
                <input
                  type="text"
                  placeholder="Search"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{ flex: 1, padding: '12px 20px', border: 'none', outline: 'none', fontSize: '13px', background: '#f8fafc' }}
                />
                <button style={{ background: '#ffffff', borderLeft: '1px solid var(--wz-border)', borderRight: 'none', borderTop: 'none', borderBottom: 'none', padding: '0 16px', color: '#005cca', fontWeight: 600, fontSize: '12.5px', cursor: 'pointer' }}>
                  WQL
                </button>
              </div>

              <table className="wz-table">
                <thead>
                  <tr>
                    <th style={{ width: '40px', paddingLeft: '20px' }}><input type="checkbox" checked={allSelected} onChange={e => {
                      if (e.target.checked) setSelectedAgents(paginatedAgents.map(a => a.id));
                      else setSelectedAgents([]);
                    }} /></th>
                    <th>ID ↑</th>
                    <th>Name</th>
                    <th>IP address</th>
                    <th>Group(s)</th>
                    <th>Operating system</th>
                    <th>Cluster node</th>
                    <th>Version</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right', paddingRight: '20px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedAgents.map(agent => (
                    <React.Fragment key={agent.id}>
                      <tr style={{ cursor: 'default' }}>
                        <td style={{ paddingLeft: '20px' }}><input type="checkbox" checked={selectedAgents.includes(agent.id)} onChange={e => {
                          if (e.target.checked) setSelectedAgents([...selectedAgents, agent.id]);
                          else setSelectedAgents(selectedAgents.filter(id => id !== agent.id));
                        }} /></td>
                        <td style={{ color: '#005cca', fontWeight: 600, cursor: 'pointer' }} onClick={() => navigate(`/agents/detail?id=${agent.id}`)}>{agent.id}</td>
                        <td style={{ color: '#005cca', fontWeight: 600, cursor: 'pointer' }} onClick={() => navigate(`/agents/detail?id=${agent.id}`)}>{agent.name}</td>
                        <td>{agent.ip}</td>
                        <td><span style={{ border: '1px solid #e2e8f0', borderRadius: '4px', padding: '2px 6px', fontSize: '12px' }}>{agent.group}</span></td>
                        <td><FaLinux size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle', color: '#1e293b' }} />{agent.os}</td>
                        <td>{agent.node}</td>
                        <td>{agent.version}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: agent.status === 'disconnected' ? '#cc0000' : agent.status === 'pending' ? '#f59e0b' : '#00a853' }}></div>
                            <span style={{ color: '#1e293b' }}>{agent.status}</span>
                          </div>
                        </td>
                        <td style={{ textAlign: 'right', paddingRight: '20px', position: 'relative' }}>
                          <FiMoreHorizontal size={14} style={{ cursor: 'pointer', verticalAlign: 'middle', color: '#64748b' }} onClick={() => setShowActionsFor(showActionsFor === agent.id ? null : agent.id)} />
                          {showActionsFor === agent.id && (
                            <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '4px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px', boxShadow: '0 4px 12px rgba(0,0,0,0.12)', zIndex: 20, minWidth: '160px' }}>
                              {[
                                { label: 'Restart', color: '#1e293b', action: () => { toast.success(`Restarting agent ${agent.id}`); setShowActionsFor(null); } },
                                { label: 'Upgrade', color: '#1e293b', action: () => { toast.success(`Upgrading agent ${agent.id}`); setShowActionsFor(null); } },
                                { label: 'Add to group', color: '#1e293b', action: () => { toast.success(`Adding agent ${agent.id} to group`); setShowActionsFor(null); } },
                                { label: 'Agent summary', color: '#1e293b', action: () => { toast.success(`Viewing summary for agent ${agent.id}`); setShowActionsFor(null); } },
                                { label: 'Delete', color: '#dc2626', action: () => { if (window.confirm(`Remove agent ${agent.id}?`)) { toast.success(`Agent ${agent.id} removed`); } setShowActionsFor(null); } },
                              ].map((item, mi) => (
                                <div key={mi} onClick={item.action} style={{ padding: '8px 14px', fontSize: '13px', cursor: 'pointer', color: item.color, borderBottom: mi < 4 ? '1px solid #f1f5f9' : undefined }}>
                                  {item.label}
                                </div>
                              ))}
                            </div>
                          )}
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
                  {paginatedAgents.length === 0 && (
                    <tr>
                      <td colSpan={10} style={{ textAlign: 'center', padding: '48px', color: 'var(--wz-text-muted)' }}>
                        No agents matching query
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', borderTop: '1px solid var(--wz-border)', fontSize: '13px', color: '#475569' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Rows per page: {ITEMS_PER_PAGE}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ cursor: currentPage > 1 ? 'pointer' : 'not-allowed', color: currentPage > 1 ? '#475569' : '#cbd5e1' }} onClick={() => { if (currentPage > 1) setCurrentPage(currentPage - 1); }}>&lt;</span>
                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                    let page: number;
                    if (totalPages <= 7) page = i + 1;
                    else if (currentPage <= 4) page = i + 1;
                    else if (currentPage >= totalPages - 3) page = totalPages - 6 + i;
                    else page = currentPage - 3 + i;
                    return (
                      <span key={page} onClick={() => setCurrentPage(page)} style={{ cursor: 'pointer', fontWeight: currentPage === page ? 600 : 400, color: currentPage === page ? '#005cca' : '#475569' }}>{page}</span>
                    );
                  })}
                  <span style={{ cursor: currentPage < totalPages ? 'pointer' : 'not-allowed', color: currentPage < totalPages ? '#475569' : '#cbd5e1' }} onClick={() => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); }}>&gt;</span>
                  <span style={{ color: '#94a3b8', fontSize: '12px' }}>{filteredAgents.length} total</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Agents;
