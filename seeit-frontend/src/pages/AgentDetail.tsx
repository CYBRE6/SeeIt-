import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FiSearch, FiChevronDown, FiRefreshCw, FiCalendar, FiDownload,
  FiActivity, FiSettings, FiExternalLink, FiMenu, FiChevronRight,
  FiRotateCw, FiArrowUp, FiTrash2
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  ArcElement, Tooltip as ChartTooltip, Legend
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, ChartTooltip, Legend);

const AgentDetail: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tabParam = searchParams.get('tab');

  const activeSubView: 'summary' | 'stats' | 'configuration' = 
    tabParam === 'stats' ? 'stats' : 
    tabParam === 'config' ? 'configuration' : 
    'summary';

  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [complianceType, setComplianceType] = useState('PCI DSS');
  const [agentStatus, setAgentStatus] = useState('active');
  const [summaryPage, setSummaryPage] = useState(1);
  const [globalPage, setGlobalPage] = useState(1);
  const [intervalPage, setIntervalPage] = useState(1);

  const [agentActionLoading, setAgentActionLoading] = useState<string | null>(null);

  // Events count data
  const eventTimelineData = [
    { time: '03:00', count: 0 },
    { time: '06:00', count: 0 },
    { time: '09:00', count: 0 },
    { time: '12:00', count: 0 },
    { time: '15:00', count: 0 },
    { time: '18:00', count: 0 },
    { time: '21:00', count: 0 },
    { time: '22:30', count: 48000 },
    { time: '23:00', count: 12000 },
  ];

  // Compliance pie chart data
  const complianceData = [
    { name: '10.6.1', value: 38101, color: '#3b7dd8' },
    { name: '10.2.7', value: 37900, color: '#4fa8a5' },
    { name: '11.5', value: 15302, color: '#d36186' },
    { name: '10.2.6', value: 201, color: '#7c5cb7' }
  ];

  const timelineChartData = {
    labels: eventTimelineData.map(d => d.time),
    datasets: [{
      label: 'count',
      data: eventTimelineData.map(d => d.count),
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.05)',
      tension: 0.1,
      fill: true
    }]
  };

  const timelineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 10 } } },
      y: { ticks: { font: { size: 10 } } }
    }
  };

  const complianceChartData = {
    labels: complianceData.map(d => d.name),
    datasets: [{
      data: complianceData.map(d => d.value),
      backgroundColor: complianceData.map(d => d.color),
      borderWidth: 1
    }]
  };

  const complianceChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    cutout: '65%'
  };

  const handleMenuClick = (path: string) => {
    setShowMoreMenu(false);
    navigate(path);
  };

  return (
    <div className="wz-page" style={{ background: '#f8fafc' }}>
      <div className="wz-page-content" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* Top Control Bar with Submenu options & Stats/Configuration Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          padding: '12px 24px',
          marginLeft: '-24px',
          marginRight: '-24px',
          marginTop: '-24px'
        }}>
          {/* Submenu on the Left */}
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <button 
              onClick={() => navigate('/hunting')}
              className="wz-link-btn" 
              style={{ fontSize: '13.5px', color: '#475569', fontWeight: 500, cursor: 'pointer', background: 'none', border: 'none' }}
            >
              Threat Hunting
            </button>
            <button 
              onClick={() => navigate('/fim')}
              className="wz-link-btn" 
              style={{ fontSize: '13.5px', color: '#475569', fontWeight: 500, cursor: 'pointer', background: 'none', border: 'none' }}
            >
              File Integrity Monitoring
            </button>
            <button 
              onClick={() => navigate('/sca')}
              className="wz-link-btn" 
              style={{ fontSize: '13.5px', color: '#475569', fontWeight: 500, cursor: 'pointer', background: 'none', border: 'none' }}
            >
              Configuration Assessment
            </button>
            <button 
              onClick={() => navigate('/mitre')}
              className="wz-link-btn" 
              style={{ fontSize: '13.5px', color: '#475569', fontWeight: 500, cursor: 'pointer', background: 'none', border: 'none' }}
            >
              MITRE ATT&CK
            </button>
            
            {/* More... Dropdown Trigger */}
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '4px', 
                  fontSize: '13.5px', 
                  color: '#005cca', 
                  fontWeight: 600, 
                  cursor: 'pointer', 
                  background: 'none', 
                  border: 'none' 
                }}
              >
                More... <FiChevronDown size={14} />
              </button>

              {/* More... Mega Dropdown Modal */}
              {showMoreMenu && (
                <>
                <div onClick={() => setShowMoreMenu(false)} style={{ position: 'fixed', inset: 0, zIndex: 99 }} />
                <div style={{
                  position: 'absolute',
                  top: '30px',
                  left: '0',
                  background: '#ffffff',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  padding: '24px',
                  width: '640px',
                  zIndex: 100,
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '24px 40px'
                }}>
                  {/* Endpoint Security */}
                  <div>
                    <h5 style={{ fontSize: '13px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      🛡️ Endpoint security
                    </h5>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <span onClick={() => handleMenuClick('/sca')} style={{ fontSize: '13.5px', color: '#1e293b', cursor: 'pointer' }}>Configuration Assessment</span>
                      <span onClick={() => handleMenuClick('/malware')} style={{ fontSize: '13.5px', color: '#1e293b', cursor: 'pointer' }}>Malware Detection</span>
                      <span onClick={() => handleMenuClick('/fim')} style={{ fontSize: '13.5px', color: '#1e293b', cursor: 'pointer' }}>File Integrity Monitoring</span>
                    </div>
                  </div>

                  {/* Threat Intelligence */}
                  <div>
                    <h5 style={{ fontSize: '13px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      🔎 Threat intelligence
                    </h5>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <span onClick={() => handleMenuClick('/hunting')} style={{ fontSize: '13.5px', color: '#1e293b', cursor: 'pointer' }}>Threat Hunting</span>
                      <span onClick={() => handleMenuClick('/vulnerabilities')} style={{ fontSize: '13.5px', color: '#1e293b', cursor: 'pointer' }}>Vulnerability Detection</span>
                      <span onClick={() => handleMenuClick('/mitre')} style={{ fontSize: '13.5px', color: '#1e293b', cursor: 'pointer' }}>MITRE ATT&CK</span>
                    </div>
                  </div>

                  {/* Security Operations */}
                  <div>
                    <h5 style={{ fontSize: '13px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      ⚙️ Security operations
                    </h5>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <span onClick={() => handleMenuClick('/hygiene')} style={{ fontSize: '13.5px', color: '#1e293b', cursor: 'pointer' }}>IT Hygiene</span>
                      <span onClick={() => handleMenuClick('/pci')} style={{ fontSize: '13.5px', color: '#1e293b', cursor: 'pointer' }}>PCI DSS</span>
                      <span onClick={() => handleMenuClick('/gdpr')} style={{ fontSize: '13.5px', color: '#1e293b', cursor: 'pointer' }}>GDPR</span>
                      <span onClick={() => handleMenuClick('/hipaa')} style={{ fontSize: '13.5px', color: '#1e293b', cursor: 'pointer' }}>HIPAA</span>
                      <span onClick={() => handleMenuClick('/nist')} style={{ fontSize: '13.5px', color: '#1e293b', cursor: 'pointer' }}>NIST 800-53</span>
                      <span onClick={() => handleMenuClick('/tsc')} style={{ fontSize: '13.5px', color: '#1e293b', cursor: 'pointer' }}>TSC</span>
                    </div>
                  </div>

                  {/* Cloud Security */}
                  <div>
                    <h5 style={{ fontSize: '13px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      ☁️ Cloud security
                    </h5>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <span onClick={() => handleMenuClick('/docker')} style={{ fontSize: '13.5px', color: '#1e293b', cursor: 'pointer' }}>Docker</span>
                      <span onClick={() => handleMenuClick('/aws')} style={{ fontSize: '13.5px', color: '#1e293b', cursor: 'pointer' }}>Amazon Web Services</span>
                      <span onClick={() => handleMenuClick('/gcp')} style={{ fontSize: '13.5px', color: '#1e293b', cursor: 'pointer' }}>Google Cloud</span>
                      <span onClick={() => handleMenuClick('/github')} style={{ fontSize: '13.5px', color: '#1e293b', cursor: 'pointer' }}>GitHub</span>
                      <span onClick={() => handleMenuClick('/o365')} style={{ fontSize: '13.5px', color: '#1e293b', cursor: 'pointer' }}>Office 365</span>
                      <span onClick={() => handleMenuClick('/msgraph')} style={{ fontSize: '13.5px', color: '#1e293b', cursor: 'pointer' }}>Microsoft Graph API</span>
                    </div>
                  </div>
                </div>
                </>
              )}
            </div>
          </div>

          {/* Stats/Configuration Button triggers on the Right */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={() => {
                setAgentActionLoading('restart');
                setTimeout(() => { setAgentStatus('restarting'); setAgentActionLoading(null); toast.success('Agent restarting...'); }, 500);
              }}
              disabled={agentActionLoading === 'restart'}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'none',
                border: '1px solid #cbd5e1',
                padding: '6px 12px',
                borderRadius: '4px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#334155',
                cursor: agentActionLoading === 'restart' ? 'not-allowed' : 'pointer',
                opacity: agentActionLoading === 'restart' ? 0.6 : 1
              }}
            >
              {agentActionLoading === 'restart' ? <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>&#x27F3;</span> : <FiRotateCw size={14} />} Restart
            </button>
            <button 
              onClick={() => {
                setAgentActionLoading('upgrade');
                setTimeout(() => { setAgentActionLoading(null); toast.success('Agent upgrade initiated'); }, 500);
              }}
              disabled={agentActionLoading === 'upgrade'}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'none',
                border: '1px solid #cbd5e1',
                padding: '6px 12px',
                borderRadius: '4px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#334155',
                cursor: agentActionLoading === 'upgrade' ? 'not-allowed' : 'pointer',
                opacity: agentActionLoading === 'upgrade' ? 0.6 : 1
              }}
            >
              {agentActionLoading === 'upgrade' ? <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>&#x27F3;</span> : <FiArrowUp size={14} />} Upgrade
            </button>
            <button 
              onClick={() => {
                setAgentActionLoading('remove');
                setTimeout(() => { setAgentActionLoading(null); toast.success('Agent removed'); }, 500);
              }}
              disabled={agentActionLoading === 'remove'}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'none',
                border: '1px solid #cbd5e1',
                padding: '6px 12px',
                borderRadius: '4px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#ef4444',
                cursor: agentActionLoading === 'remove' ? 'not-allowed' : 'pointer',
                opacity: agentActionLoading === 'remove' ? 0.6 : 1
              }}
            >
              {agentActionLoading === 'remove' ? <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>&#x27F3;</span> : <FiTrash2 size={14} />} Remove
            </button>
            <button 
              onClick={() => {
                const nextTab = activeSubView === 'stats' ? '' : 'stats';
                const newParams = new URLSearchParams(location.search);
                if (nextTab) {
                  newParams.set('tab', nextTab);
                } else {
                  newParams.delete('tab');
                }
                navigate(`?${newParams.toString()}`);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: activeSubView === 'stats' ? '#e2e8f0' : 'none',
                border: '1px solid #cbd5e1',
                padding: '6px 12px',
                borderRadius: '4px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#334155',
                cursor: 'pointer'
              }}
            >
              <FiActivity size={14} /> Stats
            </button>
            <button 
              onClick={() => {
                const nextTab = activeSubView === 'configuration' ? '' : 'config';
                const newParams = new URLSearchParams(location.search);
                if (nextTab) {
                  newParams.set('tab', nextTab);
                } else {
                  newParams.delete('tab');
                }
                navigate(`?${newParams.toString()}`);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: activeSubView === 'configuration' ? '#e2e8f0' : 'none',
                border: '1px solid #cbd5e1',
                padding: '6px 12px',
                borderRadius: '4px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#334155',
                cursor: 'pointer'
              }}
            >
              <FiSettings size={14} /> Configuration
            </button>
          </div>
        </div>

        {/* ==========================================
            VIEW 1: SUMMARY / GENERAL VIEW
            ========================================== */}
        {activeSubView === 'summary' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Agent Metadata row */}
            <div className="wz-pill-card" style={{ padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(9, 1fr)', gap: '12px', fontSize: '12px' }}>
                <div>
                  <div style={{ color: '#64748b', marginBottom: '4px' }}>ID</div>
                  <strong style={{ color: '#1e293b' }}>001</strong>
                </div>
                <div>
                  <div style={{ color: '#64748b', marginBottom: '4px' }}>Status</div>
                  <span style={{ color: agentStatus === 'active' ? '#10b981' : agentStatus === 'restarting' ? '#f59e0b' : '#ef4444', fontWeight: 600 }}>● {agentStatus}</span>
                </div>
                <div style={{ gridColumn: 'span 1' }}>
                  <div style={{ color: '#64748b', marginBottom: '4px' }}>IP address</div>
                  <strong style={{ color: '#1e293b' }}>192.168.122.70</strong>
                </div>
                <div style={{ gridColumn: 'span 1' }}>
                  <div style={{ color: '#64748b', marginBottom: '4px' }}>Version</div>
                  <strong style={{ color: '#1e293b' }}>Wazuh v4.14.5</strong>
                </div>
                <div>
                  <div style={{ color: '#64748b', marginBottom: '4px' }}>Group</div>
                  <span style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '2px 6px', fontWeight: 600 }}>default</span>
                </div>
                <div style={{ gridColumn: 'span 1' }}>
                  <div style={{ color: '#64748b', marginBottom: '4px' }}>Operating system</div>
                  <strong style={{ color: '#1e293b' }}>🐧 Ubuntu 20.04 LTS</strong>
                </div>
                <div>
                  <div style={{ color: '#64748b', marginBottom: '4px' }}>Cluster node</div>
                  <strong style={{ color: '#1e293b' }}>node01</strong>
                </div>
                <div style={{ gridColumn: 'span 1' }}>
                  <div style={{ color: '#64748b', marginBottom: '4px' }}>Registration date</div>
                  <strong style={{ color: '#1e293b' }}>Jun 11, 2026 @ 12:42:25.000</strong>
                </div>
                <div style={{ gridColumn: 'span 1' }}>
                  <div style={{ color: '#64748b', marginBottom: '4px' }}>Last keep alive</div>
                  <strong style={{ color: '#1e293b' }}>Jun 12, 2026 @ 23:01:35.000</strong>
                </div>
              </div>
            </div>

            {/* System Inventory row */}
            <div className="wz-pill-card" style={{ padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', margin: 0 }}>System inventory</h4>
                <FiExternalLink size={16} style={{ color: '#94a3b8', cursor: 'pointer' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', fontSize: '13px' }}>
                <div>
                  <div style={{ color: '#64748b', marginBottom: '4px' }}>Cores</div>
                  <strong style={{ color: '#1e293b' }}>2</strong>
                </div>
                <div>
                  <div style={{ color: '#64748b', marginBottom: '4px' }}>Memory</div>
                  <strong style={{ color: '#1e293b' }}>3.8GB</strong>
                </div>
                <div>
                  <div style={{ color: '#64748b', marginBottom: '4px' }}>CPU</div>
                  <strong style={{ color: '#1e293b' }}>Intel(R) Core(TM) i7-8665U CPU @ 1.90GHz</strong>
                </div>
                <div>
                  <div style={{ color: '#64748b', marginBottom: '4px' }}>Host name</div>
                  <strong style={{ color: '#1e293b' }}>saad-Ubuntu-2...</strong>
                </div>
                <div>
                  <div style={{ color: '#64748b', marginBottom: '4px' }}>Serial number</div>
                  <strong style={{ color: '#1e293b' }}>-</strong>
                </div>
              </div>
            </div>

            {/* Three Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '20px' }}>
              
              {/* Events count evolution */}
              <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b', margin: 0 }}>Events count evolution</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#005cca', fontWeight: 600, cursor: 'pointer' }}>
                    <span>Today</span> <FiChevronDown size={12} />
                  </div>
                </div>
                <div style={{ height: '200px' }}>
                  <Line data={timelineChartData} options={timelineChartOptions} />
                </div>
              </div>

              {/* MITRE ATT&CK */}
              <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b', margin: 0 }}>MITRE ATT&CK</h4>
                  <FiExternalLink size={16} style={{ color: '#94a3b8', cursor: 'pointer' }} />
                </div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#64748b', marginBottom: '12px' }}>Top Tactics</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', color: '#334155' }}>Impact</span>
                    <span style={{ background: '#f1f5f9', color: '#1e293b', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>14702</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', color: '#334155' }}>Defense Evasion</span>
                    <span style={{ background: '#f1f5f9', color: '#1e293b', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>500</span>
                  </div>
                </div>
              </div>

              {/* Compliance */}
              <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b', margin: 0 }}>Compliance</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#64748b', cursor: 'pointer' }}>
                    <span>{complianceType}</span> <FiChevronDown size={12} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ width: '90px', height: '90px' }}>
                    <Doughnut data={complianceChartData} options={complianceChartOptions} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px', color: '#475569' }}>
                    {complianceData.map((d, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }} onClick={() => {
                        const complianceRoutes: Record<string, string> = { 'PCI DSS': '/pci', 'GDPR': '/gdpr', 'HIPAA': '/hipaa', 'NIST 800-53': '/nist', 'TSC': '/tsc' };
                        const route = complianceRoutes[d.name] || '/pci';
                        navigate(route);
                      }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: d.color }} />
                        <span>{d.name} ({d.value.toLocaleString()})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Row Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              
              {/* Vulnerability Detection */}
              <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b', margin: 0 }}>Vulnerability Detection</h4>
                  <FiExternalLink size={16} style={{ color: '#94a3b8', cursor: 'pointer' }} onClick={() => navigate('/vulnerabilities')} />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
                  {/* Left Badges */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ background: '#fef2f2', color: '#b91c1c', border: '1px solid #fee2e2', borderRadius: '4px', padding: '8px 12px', fontSize: '13.5px', fontWeight: 600 }}>
                      759 Critical
                    </div>
                    <div style={{ background: '#fffbeb', color: '#b45309', border: '1px solid #fef3c7', borderRadius: '4px', padding: '8px 12px', fontSize: '13.5px', fontWeight: 600 }}>
                      5,841 High
                    </div>
                    <div style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #dbeafe', borderRadius: '4px', padding: '8px 12px', fontSize: '13.5px', fontWeight: 600 }}>
                      9,519 Medium
                    </div>
                    <div style={{ background: '#f0fdf4', color: '#15803d', border: '1px solid #dcfce7', borderRadius: '4px', padding: '8px 12px', fontSize: '13.5px', fontWeight: 600 }}>
                      463 Low
                    </div>
                  </div>

                  {/* Right Table */}
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Top 5 Packages</div>
                    <table className="wz-table" style={{ width: '100%' }}>
                      <thead>
                        <tr>
                          <th>Package</th>
                          <th style={{ textAlign: 'right' }}>Count ↓</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { pkg: 'linux-image-5.4.0-26-generic', count: 7121 },
                          { pkg: 'linux-image-5.15.0-139-generic', count: 3526 },
                          { pkg: 'firefox', count: 992 },
                          { pkg: 'libmysqlclient21', count: 633 },
                          { pkg: 'firefox-locale-en', count: 326 },
                        ].map((p, idx) => (
                          <tr key={idx}>
                            <td style={{ color: '#005cca', fontWeight: 500, fontSize: '12px' }}>{p.pkg}</td>
                            <td style={{ textAlign: 'right', fontSize: '12px' }}>{p.count}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Security Configuration Assessment */}
              <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b', margin: 0 }}>Security Configuration Assessment</h4>
                  <FiExternalLink size={16} style={{ color: '#94a3b8', cursor: 'pointer' }} />
                </div>
                
                <table className="wz-table">
                  <thead>
                    <tr>
                      <th>Policy</th>
                      <th>End scan</th>
                      <th>Passed</th>
                      <th>Failed</th>
                      <th>Not ap...</th>
                      <th>Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ fontSize: '12px', color: '#475569', fontWeight: 500 }}>CIS Ubuntu Linux 20.04 LTS Benchmark v2.0.0</td>
                      <td style={{ fontSize: '11px', color: '#64748b' }}>Jun 12, 2026 @ 22:48:31.000</td>
                      <td style={{ fontSize: '12px' }}>67</td>
                      <td style={{ fontSize: '12px' }}>109</td>
                      <td style={{ fontSize: '12px' }}>34</td>
                      <td style={{ fontSize: '12px', fontWeight: 600, color: '#d97706' }}>38%</td>
                    </tr>
                  </tbody>
                </table>

                {/* Pagination */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px', gap: '12px', fontSize: '13px', color: '#64748b' }}>
                  <span style={{ cursor: 'pointer' }} onClick={() => setSummaryPage(p => Math.max(1, p - 1))}>&lt;</span>
                  <span style={{ fontWeight: 600, color: '#005cca' }}>{summaryPage}</span>
                  <span style={{ cursor: 'pointer' }} onClick={() => setSummaryPage(p => p + 1)}>&gt;</span>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ==========================================
            VIEW 2: STATS VIEW
            ========================================== */}
        {activeSubView === 'stats' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Stats Metadata summary */}
            <div className="wz-pill-card" style={{ padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '16px', fontSize: '12.5px' }}>
                <div>
                  <div style={{ color: '#64748b', marginBottom: '4px' }}>Status</div>
                  <strong style={{ color: '#1e293b' }}>connected</strong>
                </div>
                <div>
                  <div style={{ color: '#64748b', marginBottom: '4px' }}>Buffer</div>
                  <strong style={{ color: '#1e293b' }}>enabled</strong>
                </div>
                <div>
                  <div style={{ color: '#64748b', marginBottom: '4px' }}>Message buffer</div>
                  <strong style={{ color: '#1e293b' }}>0</strong>
                </div>
                <div>
                  <div style={{ color: '#64748b', marginBottom: '4px' }}>Messages count</div>
                  <strong style={{ color: '#1e293b' }}>2770</strong>
                </div>
                <div>
                  <div style={{ color: '#64748b', marginBottom: '4px' }}>Messages sent</div>
                  <strong style={{ color: '#1e293b' }}>2823</strong>
                </div>
                <div>
                  <div style={{ color: '#64748b', marginBottom: '4px' }}>Last ack</div>
                  <strong style={{ color: '#1e293b' }}>Jun 13, 2026 @ 00:02:33.000</strong>
                </div>
                <div>
                  <div style={{ color: '#64748b', marginBottom: '4px' }}>Last keep alive</div>
                  <strong style={{ color: '#1e293b' }}>Jun 13, 2026 @ 00:02:15.000</strong>
                </div>
              </div>
            </div>

            {/* Global & Interval Side by Side */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              
              {/* Global */}
              <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b', margin: 0 }}>Global</h4>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Start: Jun 12, 2026 @ 23:48:19.000 - End: Jun 13, 2026 @ 00:02:19.000</span>
                </div>
                
                <table className="wz-table">
                  <thead>
                    <tr>
                      <th>Location</th>
                      <th style={{ textAlign: 'right' }}>Events</th>
                      <th style={{ textAlign: 'right' }}>Bytes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { loc: 'last -n 20', ev: 3, bytes: 4569 },
                      { loc: '/var/log/dpkg.log', ev: 1098, bytes: 79021 },
                      { loc: 'journald', ev: 237, bytes: 34113 },
                      { loc: '/var/ossec/logs/active-responses.log', ev: 0, bytes: 0 },
                      { loc: '/var/log/apache2/error.log', ev: 0, bytes: 0 },
                      { loc: '/var/log/apache2/access.log', ev: 0, bytes: 0 },
                      { loc: 'df -P', ev: 60, bytes: 5649 },
                    ].map((row, idx) => (
                      <tr key={idx}>
                        <td style={{ fontSize: '12px', color: '#475569' }}>{row.loc}</td>
                        <td style={{ fontSize: '12px', textAlign: 'right' }}>{row.ev}</td>
                        <td style={{ fontSize: '12px', textAlign: 'right' }}>{row.bytes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                  <button onClick={() => toast.success('Downloading CSV...')} style={{ background: 'none', border: 'none', color: '#005cca', fontSize: '12.5px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                    <FiDownload size={14} /> Download CSV
                  </button>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: '#64748b' }}>
                    <span style={{ cursor: 'pointer' }} onClick={() => setGlobalPage(p => Math.max(1, p - 1))}>&lt;</span>
                    <span style={{ fontWeight: 600, color: '#005cca' }}>{globalPage}</span>
                    <span style={{ cursor: 'pointer' }} onClick={() => setGlobalPage(p => p + 1)}>&gt;</span>
                  </div>
                </div>
              </div>

              {/* Interval */}
              <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b', margin: 0 }}>Interval</h4>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Start: Jun 13, 2026 @ 00:01:19.000 - End: Jun 13, 2026 @ 00:02:19.000</span>
                </div>
                
                <table className="wz-table">
                  <thead>
                    <tr>
                      <th>Location</th>
                      <th style={{ textAlign: 'right' }}>Events</th>
                      <th style={{ textAlign: 'right' }}>Bytes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { loc: 'last -n 20', ev: 0, bytes: 0 },
                      { loc: '/var/log/dpkg.log', ev: 88, bytes: 6273 },
                      { loc: 'journald', ev: 35, bytes: 4728 },
                      { loc: '/var/ossec/logs/active-responses.log', ev: 0, bytes: 0 },
                      { loc: '/var/log/apache2/error.log', ev: 0, bytes: 0 },
                      { loc: '/var/log/apache2/access.log', ev: 0, bytes: 0 },
                      { loc: 'df -P', ev: 0, bytes: 0 },
                    ].map((row, idx) => (
                      <tr key={idx}>
                        <td style={{ fontSize: '12px', color: '#475569' }}>{row.loc}</td>
                        <td style={{ fontSize: '12px', textAlign: 'right' }}>{row.ev}</td>
                        <td style={{ fontSize: '12px', textAlign: 'right' }}>{row.bytes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                  <button onClick={() => toast.success('Downloading CSV...')} style={{ background: 'none', border: 'none', color: '#005cca', fontSize: '12.5px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                    <FiDownload size={14} /> Download CSV
                  </button>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: '#64748b' }}>
                    <span style={{ cursor: 'pointer' }} onClick={() => setIntervalPage(p => Math.max(1, p - 1))}>&lt;</span>
                    <span style={{ fontWeight: 600, color: '#005cca' }}>{intervalPage}</span>
                    <span style={{ cursor: 'pointer' }} onClick={() => setIntervalPage(p => p + 1)}>&gt;</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ==========================================
            VIEW 3: CONFIGURATION VIEW
            ========================================== */}
        {activeSubView === 'configuration' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Config metadata actions bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '13.5px', color: '#475569' }}>
                Groups: <strong style={{ color: '#005cca' }}>default</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>SYNCHRONIZED</span>
                <button onClick={() => toast.success('Exporting PDF...')} style={{ background: 'none', border: 'none', color: '#005cca', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <FiDownload size={14} /> Export PDF
                </button>
              </div>
            </div>

            {/* Config Table Card */}
            <div className="wz-pill-card" style={{ padding: '24px', background: '#ffffff', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Main Configurations Section */}
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b', marginBottom: '12px', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>Main configurations</h4>
                <table className="wz-table">
                  <thead>
                    <tr>
                      <th style={{ width: '30%' }}>Name</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: 'Global Configuration', desc: 'Logging settings that apply to the agent' },
                      { name: 'Communication', desc: 'Settings related to the connection with the manager' },
                      { name: 'Anti-flooding settings', desc: 'Agent bucket parameters to avoid event flooding' },
                      { name: 'Labels', desc: 'User-defined information about the agent included in alerts' },
                    ].map((row, i) => (
                      <tr key={i}>
                        <td style={{ fontSize: '13px', color: '#475569', fontWeight: 500 }}>{row.name}</td>
                        <td style={{ fontSize: '12.5px', color: '#64748b' }}>{row.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Auditing and Policy Monitoring Section */}
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b', marginBottom: '12px', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>Auditing and policy monitoring</h4>
                <table className="wz-table">
                  <thead>
                    <tr>
                      <th style={{ width: '30%' }}>Name</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: 'Policy monitoring', desc: 'Configuration to ensure compliance with security policies, standards and hardening guides' },
                      { name: 'OpenSCAP', desc: 'Configuration assessment and automation of compliance monitoring using SCAP checks' },
                      { name: 'CIS-CAT', desc: 'Configuration assessment using CIS scanner and SCAP checks' },
                    ].map((row, i) => (
                      <tr key={i}>
                        <td style={{ fontSize: '13px', color: '#475569', fontWeight: 500 }}>{row.name}</td>
                        <td style={{ fontSize: '12.5px', color: '#64748b' }}>{row.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* System Threats Section */}
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b', marginBottom: '12px', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>System threats and incident response</h4>
                <p style={{ fontSize: '13px', color: '#94a3b8', margin: '12px 0 0 0' }}>No active configurations in this section.</p>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default AgentDetail;
