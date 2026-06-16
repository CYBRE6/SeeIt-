import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiChevronDown, FiPlus, FiRefreshCw, FiDownload, FiSettings, FiCalendar, FiX } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const PciDss: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'controls' | 'events'>('dashboard');
  const [hideNoAlerts, setHideNoAlerts] = useState(false);
  const [activeRequirement, setActiveRequirement] = useState<string | null>(null);

  const [filters, setFilters] = useState([
    { key: 'manager.name', value: 'saad-cyber6' },
    { key: 'rule.pci_dss', value: 'exists' },
    { key: 'agent.id', value: '001' }
  ]);

  const [reqSearch, setReqSearch] = useState('');
  const [pciEventsPage, setPciEventsPage] = useState(1);
  const PCI_EVENTS_PER_PAGE = 15;

  const pciEventsData = [
    { ts: 'Jun 12, 2026 @ 21:38:29.3...', agent: 'Isgasaad', rule: '11.5', desc: 'Integrity checksum changed.', level: 7, id: '550' },
    { ts: 'Jun 12, 2026 @ 21:38:29.3...', agent: 'Isgasaad', rule: '11.5', desc: 'Integrity checksum changed.', level: 7, id: '550' },
    { ts: 'Jun 12, 2026 @ 21:36:40.5...', agent: 'Isgasaad', rule: '10.6.1, 10.2.6', desc: 'Wazuh agent started.', level: 3, id: '503' },
    { ts: 'Jun 12, 2026 @ 21:35:10.1...', agent: 'Isgasaad', rule: '10.2.5', desc: 'PAM: Login session opened.', level: 3, id: '5501' },
    { ts: 'Jun 12, 2026 @ 21:30:22.8...', agent: 'db-prod-02', rule: '11.5', desc: 'File permission changed.', level: 7, id: '552' },
    { ts: 'Jun 12, 2026 @ 21:25:11.4...', agent: 'Isgasaad', rule: '10.2.7', desc: 'New dpkg installed.', level: 7, id: '553' },
    { ts: 'Jun 12, 2026 @ 21:20:05.7...', agent: 'db-prod-02', rule: '10.6.1', desc: 'Integrity checksum changed.', level: 7, id: '550' },
    { ts: 'Jun 11, 2026 @ 22:15:33.2...', agent: 'Isgasaad', rule: '10.2.5', desc: 'Login session closed.', level: 3, id: '5502' },
    { ts: 'Jun 11, 2026 @ 21:55:44.9...', agent: 'Amazon', rule: '11.5', desc: 'File added to system.', level: 5, id: '554' },
    { ts: 'Jun 11, 2026 @ 21:45:12.3...', agent: 'Isgasaad', rule: '10.2.6', desc: 'Service started.', level: 5, id: '555' },
  ];
  const totalPciPages = Math.ceil(pciEventsData.length / PCI_EVENTS_PER_PAGE);
  const filteredPciEvents = filters.length > 0 ? pciEventsData.filter(e => filters.some(f => e.rule.includes(f.value) || e.id.includes(f.value) || e.desc.includes(f.value))) : pciEventsData;
  const pagedPciEvents = filteredPciEvents.slice((pciEventsPage - 1) * PCI_EVENTS_PER_PAGE, pciEventsPage * PCI_EVENTS_PER_PAGE);
  const [selectedComplianceEvent, setSelectedComplianceEvent] = useState<any>(null);


  const removeFilter = (idx: number) => {
    setFilters(filters.filter((_, i) => i !== idx));
  };

  // Requirements list for the left panel in Controls
  const sidebarRequirements = [
    { name: 'Requirement 10', count: 2 },
    { name: 'Requirement 11', count: 2 },
    { name: 'Requirement 1', count: 0 },
    { name: 'Requirement 2', count: 0 },
    { name: 'Requirement 4', count: 0 },
    { name: 'Requirement 5', count: 0 },
    { name: 'Requirement 6', count: 0 },
    { name: 'Requirement 8', count: 0 }
  ];

  // Requirements details list for the grid on the right side
  const rightRequirements = [
    { id: '11.5', desc: 'Deploy a change detection me...', count: 2 },
    { id: '10.2.6', desc: 'Initialization, stopping, or pa...', count: 1 },
    { id: '10.6.1', desc: 'Review the following at least ...', count: 1 },
    { id: '1.1.1', desc: 'A formal process for approving...', count: 0 },
    { id: '1.3.4', desc: 'Do not allow unauthorized out...', count: 0 },
    { id: '1.4', desc: 'Install personal firewall softwar...', count: 0 },
    { id: '2.2', desc: 'Develop configuration standard...', count: 0 },
    { id: '2.2.2', desc: 'Enable only necessary servic...', count: 0 },
    { id: '2.2.3', desc: 'Implement additional security...', count: 0 },
    { id: '2.2.4', desc: 'Configure system security pa...', count: 0 },
    { id: '4.1', desc: 'Use strong cryptography and s...', count: 0 },
    { id: '5.1', desc: 'Deploy anti-virus software on al...', count: 0 },
    { id: '5.2', desc: 'Ensure that all anti-virus mech...', count: 0 },
    { id: '6.2', desc: 'Ensure that all system compon...', count: 0 },
    { id: '6.5', desc: 'Address common coding vulne...', count: 0 },
    { id: '6.5.1', desc: 'Injection flaws, particularly SQ...', count: 0 },
    { id: '6.5.2', desc: 'Buffer overflows', count: 0 },
    { id: '6.5.5', desc: 'Improper error handling', count: 0 },
    { id: '6.5.7', desc: 'Cross-site scripting (XSS)', count: 0 },
    { id: '6.5.8', desc: 'Improper access control (suc...', count: 0 },
    { id: '6.5.10', desc: 'Broken authentication and s...', count: 0 },
    { id: '6.6', desc: 'For public-facing web applicati...', count: 0 },
    { id: '8.1.2', desc: 'Control addition, deletion, and...', count: 0 },
    { id: '8.1.4', desc: 'Remove/disable inactive user ...', count: 0 },
    { id: '8.1.5', desc: 'Manage IDs used by third par...', count: 0 },
    { id: '8.1.6', desc: 'Limit repeated access attemp...', count: 0 },
    { id: '8.1.8', desc: 'If a session has been idle for ...', count: 0 },
    { id: '8.2.4', desc: 'Change user passwords/pass...', count: 0 },
    { id: '8.5.1', desc: 'Additional requirement for ser...', count: 0 },
    { id: '8.7', desc: 'All access to any database con...', count: 0 },
    { id: '10.1', desc: 'Implement audit trails to link all...', count: 0 },
    { id: '10.2.1', desc: 'All individual user accesses t...', count: 0 }
  ];

  const filteredRightRequirements = rightRequirements.filter(r => {
    if (hideNoAlerts && r.count === 0) return false;
    if (reqSearch.trim() && !r.id.toLowerCase().includes(reqSearch.toLowerCase()) && !r.desc.toLowerCase().includes(reqSearch.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="wz-page" style={{ background: '#f8fafc' }}>
      <div className="wz-page-content" style={{ display: 'flex', flexDirection: 'column' }}>

        {/* Navigation Tabs Bar */}
        <div style={{ 
          display: 'flex', 
          borderBottom: '1px solid #e2e8f0', 
          gap: '24px', 
          marginBottom: '24px',
          background: '#ffffff',
          padding: '0 24px',
          marginLeft: '-24px',
          marginRight: '-24px',
          marginTop: '-24px',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            {['dashboard', 'controls', 'events'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                style={{
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === tab ? '2px solid #005cca' : '2px solid transparent',
                  color: activeTab === tab ? '#005cca' : '#475569',
                  fontWeight: activeTab === tab ? 600 : 500,
                  fontSize: '13.5px',
                  padding: '14px 4px',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  transition: 'all 0.15s ease'
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingRight: '24px' }}>
            <button onClick={() => {
              const report = { id: Date.now().toString(), name: `PCI DSS Report ${new Date().toLocaleDateString()}`, desc: 'PCI DSS compliance investigation report', format: 'PDF', created: new Date().toLocaleString(), status: 'completed' };
              const existing = JSON.parse(localStorage.getItem('wz_reports') || '[]');
              existing.push(report);
              localStorage.setItem('wz_reports', JSON.stringify(existing));
              toast.success('PCI DSS report generated and saved to Reporting');
            }} style={{ background: 'none', border: 'none', color: '#005cca', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
              <FiDownload size={14} /> Generate report
            </button>
          </div>
        </div>

        {/* Global DQL Filter Bar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                <FiSearch size={16} />
              </span>
              <input 
                type="text" 
                placeholder="Search" 
                value={reqSearch}
                onChange={e => setReqSearch(e.target.value)}
                className="wz-search-input"
                style={{ paddingLeft: '38px', paddingRight: '60px' }}
              />
              <span style={{ 
                position: 'absolute', 
                right: '12px', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                fontSize: '12px', 
                fontWeight: 600, 
                color: '#64748b' 
              }}>
                DQL
              </span>
            </div>

            {/* Time selector */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              border: '1px solid #cbd5e1', 
              borderRadius: '4px', 
              padding: '6px 12px', 
              background: '#ffffff',
              fontSize: '13px',
              color: '#334155',
              cursor: 'pointer'
            }}>
              <FiCalendar size={14} style={{ color: '#64748b' }} />
              <span>Last 24 hours</span>
              <FiChevronDown size={12} />
            </div>

            <button style={{ background: 'none', border: 'none', color: '#005cca', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
              Show dates
            </button>

            <button className="wz-btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FiRefreshCw size={13} /> Refresh
            </button>
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
            {filters.map((f, idx) => (
              <div key={idx} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px', 
                border: '1px solid #e2e8f0', 
                borderRadius: '4px', 
                padding: '4px 8px', 
                background: '#f1f5f9',
                fontSize: '12.5px',
                color: '#334155'
              }}>
                <strong style={{ fontWeight: 600 }}>{f.key}:</strong>
                <span>{f.value}</span>
                <button 
                  onClick={() => removeFilter(idx)}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: '#94a3b8', 
                    cursor: 'pointer', 
                    fontSize: '11px',
                    padding: '2px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  ✕
                </button>
              </div>
            ))}

            <button style={{ 
              background: 'none', 
              border: 'none', 
              color: '#005cca', 
              fontSize: '12.5px', 
              fontWeight: 600, 
              display: 'flex', 
              alignItems: 'center', 
              gap: '4px', 
              cursor: 'pointer' 
            }}>
              <FiPlus size={14} /> Add filter
            </button>
          </div>
        </div>

        {/* ==========================================
            TAB CONTENT: DASHBOARD
            ========================================== */}
        {activeTab === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Top Row charts */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              
              {/* Top 5 rule groups */}
              <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '16px' }}>Top 5 rule groups</h4>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                  {/* SVG Donut */}
                  <svg width="120" height="120" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                    {/* ossec: 50% (grey/brown) */}
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#c2b29a" strokeWidth="4" strokeDasharray="50 100" strokeDashoffset="25" />
                    {/* syscheck: 25% (orange) */}
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#d98236" strokeWidth="4" strokeDasharray="25 100" strokeDashoffset="-25" />
                    {/* syscheck_entry_modif: 15% (dark brown) */}
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#a45a3c" strokeWidth="4" strokeDasharray="15 100" strokeDashoffset="-50" />
                    {/* syscheck_file: 10% (red/coral) */}
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#e06a55" strokeWidth="4" strokeDasharray="10 100" strokeDashoffset="-65" />
                  </svg>
                  <div style={{ fontSize: '11px', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span><span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#c2b29a', marginRight: '6px' }} />ossec</span>
                    <span><span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#d98236', marginRight: '6px' }} />syscheck</span>
                    <span><span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#a45a3c', marginRight: '6px' }} />syscheck_entry_modif</span>
                    <span><span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#e06a55', marginRight: '6px' }} />syscheck_file</span>
                  </div>
                </div>
              </div>

              {/* Top 5 rules */}
              <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '16px' }}>Top 5 rules</h4>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                  {/* SVG Donut */}
                  <svg width="120" height="120" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                    {/* Integrity checksum: 66% */}
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#c084fc" strokeWidth="4" strokeDasharray="66 100" strokeDashoffset="25" />
                    {/* Wazuh agent started: 34% */}
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#eab308" strokeWidth="4" strokeDasharray="34 100" strokeDashoffset="-41" />
                  </svg>
                  <div style={{ fontSize: '11px', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '6px', maxWidth: '140px' }}>
                    <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#c084fc', marginRight: '6px' }} />
                      Integrity checksum ch
                    </span>
                    <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#eab308', marginRight: '6px' }} />
                      Wazuh agent started.
                    </span>
                  </div>
                </div>
              </div>

              {/* Top 5 PCI DSS requirements */}
              <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '16px' }}>Top 5 PCI DSS requirements</h4>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                  {/* SVG Donut */}
                  <svg width="120" height="120" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                    {/* 11.5: 50% */}
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f472b6" strokeWidth="4" strokeDasharray="50 100" strokeDashoffset="25" />
                    {/* 10.2.6: 25% */}
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#c084fc" strokeWidth="4" strokeDasharray="25 100" strokeDashoffset="-25" />
                    {/* 10.6.1: 25% */}
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#fbcfe8" strokeWidth="4" strokeDasharray="25 100" strokeDashoffset="-50" />
                  </svg>
                  <div style={{ fontSize: '11px', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span><span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#f472b6', marginRight: '6px' }} />11.5</span>
                    <span><span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#c084fc', marginRight: '6px' }} />10.2.6</span>
                    <span><span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#fbcfe8', marginRight: '6px' }} />10.6.1</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Row charts */}
            <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '20px' }}>
              
              {/* PCI DSS requirements vertical bar chart */}
              <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '24px' }}>PCI DSS requirements</h4>
                <div style={{ display: 'flex', gap: '8px', height: '180px', position: 'relative', borderLeft: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', paddingLeft: '24px', paddingBottom: '8px' }}>
                  
                  {/* Y Axis helper labels */}
                  <span style={{ position: 'absolute', left: '-20px', bottom: '0%', fontSize: '10px', color: '#94a3b8' }}>0</span>
                  <span style={{ position: 'absolute', left: '-20px', bottom: '25%', fontSize: '10px', color: '#94a3b8' }}>0.5</span>
                  <span style={{ position: 'absolute', left: '-20px', bottom: '50%', fontSize: '10px', color: '#94a3b8' }}>1</span>
                  <span style={{ position: 'absolute', left: '-20px', bottom: '75%', fontSize: '10px', color: '#94a3b8' }}>1.5</span>
                  <span style={{ position: 'absolute', left: '-20px', bottom: '98%', fontSize: '10px', color: '#94a3b8' }}>2</span>
                  <span style={{ position: 'absolute', left: '-50px', top: '40%', transform: 'rotate(-90deg)', fontSize: '11px', color: '#64748b', fontWeight: 500 }}>Count</span>

                  {/* Bars container */}
                  <div style={{ display: 'flex', width: '100%', justifyContent: 'space-around', alignItems: 'flex-end', height: '100%' }}>
                    {/* Bar 11.5 (height: 100% / Count 2) */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '80px' }}>
                      <div style={{ width: '100%', height: '170px', background: '#f472b6', borderRadius: '2px 2px 0 0' }} />
                      <span style={{ fontSize: '11px', color: '#64748b', marginTop: '6px', fontWeight: 600 }}>11.5</span>
                    </div>

                    {/* Bar 10.2.6 (height: 50% / Count 1) */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '80px' }}>
                      <div style={{ width: '100%', height: '85px', background: '#c084fc', borderRadius: '2px 2px 0 0' }} />
                      <span style={{ fontSize: '11px', color: '#64748b', marginTop: '6px', fontWeight: 600 }}>10.2.6</span>
                    </div>

                    {/* Bar 10.6.1 (height: 50% / Count 1) */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '80px' }}>
                      <div style={{ width: '100%', height: '85px', background: '#fbcfe8', borderRadius: '2px 2px 0 0' }} />
                      <span style={{ fontSize: '11px', color: '#64748b', marginTop: '6px', fontWeight: 600 }}>10.6.1</span>
                    </div>
                  </div>

                  {/* Bottom title */}
                  <div style={{ position: 'absolute', bottom: '-28px', left: '0', right: '0', textAlign: 'center', fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
                    PCI DSS Requirements
                  </div>
                </div>
              </div>

              {/* Rule level distribution */}
              <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '16px' }}>Rule level distribution</h4>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  <svg width="120" height="120" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                    {/* Level 7: 66.67% (green) */}
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#86efac" strokeWidth="4" strokeDasharray="66.67 100" strokeDashoffset="25" />
                    {/* Level 3: 33.33% (blue) */}
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#93c5fd" strokeWidth="4" strokeDasharray="33.33 100" strokeDashoffset="-41.67" />
                  </svg>
                  <div style={{ display: 'flex', gap: '24px', fontSize: '11px', color: '#64748b', marginTop: '16px' }}>
                    <span><span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#93c5fd', marginRight: '6px' }} />3 (33.33%)</span>
                    <span><span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#86efac', marginRight: '6px' }} />7 (66.67%)</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ==========================================
            TAB CONTENT: CONTROLS
            ========================================== */}
        {activeTab === 'controls' && (
          <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '20px' }}>
            
            {/* Left sidebar: PCI DSS menu */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', borderRight: '1px solid #e2e8f0', paddingRight: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b' }}>PCI DSS</span>
                <button style={{ border: 'none', background: 'none', color: '#005cca', cursor: 'pointer' }}><FiSettings size={15} /></button>
              </div>

              {sidebarRequirements.map((req, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveRequirement(req.name)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    background: activeRequirement === req.name ? '#e6f0fa' : 'none',
                    color: activeRequirement === req.name ? '#005cca' : '#475569',
                    fontWeight: activeRequirement === req.name ? 700 : 500,
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '13px'
                  }}
                >
                  <span>{req.name}</span>
                  <span style={{ 
                    background: req.count > 0 ? '#e11d48' : '#f43f5e', 
                    color: '#ffffff', 
                    borderRadius: '4px', 
                    padding: '2px 6px', 
                    fontSize: '11px',
                    fontWeight: 700
                  }}>
                    {req.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Right content area */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Header and Filter toggle */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b' }}>Requirements</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#475569', fontWeight: 500 }}>Hide requirements with no alerts</span>
                  <label className="wz-switch" style={{ position: 'relative', display: 'inline-block', width: '34px', height: '20px' }}>
                    <input 
                      type="checkbox" 
                      checked={hideNoAlerts}
                      onChange={() => setHideNoAlerts(!hideNoAlerts)}
                      style={{ opacity: 0, width: 0, height: 0 }}
                    />
                    <span style={{
                      position: 'absolute',
                      cursor: 'pointer',
                      top: 0, left: 0, right: 0, bottom: 0,
                      background: hideNoAlerts ? '#005cca' : '#cbd5e1',
                      transition: '.4s',
                      borderRadius: '34px'
                    }}>
                      <span style={{
                        position: 'absolute',
                        content: '""',
                        height: '14px', width: '14px',
                        left: hideNoAlerts ? '16px' : '3px',
                        bottom: '3px',
                        background: 'white',
                        transition: '.4s',
                        borderRadius: '50%'
                      }} />
                    </span>
                  </label>
                </div>
              </div>

              {/* Requirement Search */}
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                  <FiSearch size={15} />
                </span>
                <input 
                  type="text" 
                  placeholder="Filter requirements" 
                  className="wz-search-input"
                  style={{ paddingLeft: '36px', height: '36px', fontSize: '13px' }}
                />
              </div>

              {/* Grid cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                {filteredRightRequirements.map((r, idx) => (
                  <div 
                    key={idx}
                    onClick={() => {
                      if (r.count > 0) {
                        setActiveTab('events');
                        toast.success(`Showing evidence for ${r.id}`);
                      } else {
                        toast.error('No alerts for this requirement');
                      }
                    }}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '4px',
                      padding: '12px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '12.5px',
                      color: '#334155',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                      cursor: r.count > 0 ? 'pointer' : 'default'
                    }}
                  >
                    <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', width: '150px' }} title={`${r.id} - ${r.desc}`}>
                      <strong>{r.id}</strong> - {r.desc}
                    </span>
                    <span style={{
                      background: r.count > 0 ? '#0f172a' : '#f1f5f9',
                      color: r.count > 0 ? '#ffffff' : '#64748b',
                      borderRadius: '3px',
                      padding: '1px 6px',
                      fontSize: '11px',
                      fontWeight: 700
                    }}>
                      {r.count}
                    </span>
                  </div>
                ))}
              </div>

            </div>

          </div>
        )}

        {/* ==========================================
            TAB CONTENT: EVENTS
            ========================================== */}
        {activeTab === 'events' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Timeline chart */}
            <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '24px' }}>
              <div style={{ display: 'flex', gap: '8px', height: '140px', position: 'relative', borderLeft: '1px solid #cbd5e1', borderBottom: '1px solid #cbd5e1', paddingLeft: '32px', paddingBottom: '8px' }}>
                {/* Y Axis values */}
                <span style={{ position: 'absolute', left: '-20px', bottom: '0%', fontSize: '10px', color: '#94a3b8' }}>0</span>
                <span style={{ position: 'absolute', left: '-20px', bottom: '33%', fontSize: '10px', color: '#94a3b8' }}>1</span>
                <span style={{ position: 'absolute', left: '-20px', bottom: '66%', fontSize: '10px', color: '#94a3b8' }}>2</span>
                <span style={{ position: 'absolute', left: '-20px', bottom: '99%', fontSize: '10px', color: '#94a3b8' }}>3</span>
                <span style={{ position: 'absolute', left: '-52px', top: '40%', transform: 'rotate(-90deg)', fontSize: '11px', color: '#64748b', fontWeight: 500 }}>Count</span>

                {/* X Axis time indicators */}
                <div style={{ display: 'flex', justifyContent: 'space-between', position: 'absolute', bottom: '-20px', left: '32px', right: '0', fontSize: '10px', color: '#94a3b8' }}>
                  <span>00:00</span>
                  <span>03:00</span>
                  <span>06:00</span>
                  <span>09:00</span>
                  <span>12:00</span>
                  <span>15:00</span>
                  <span>18:00</span>
                  <span>21:00</span>
                </div>

                {/* Bar chart - single bar at the far right */}
                <div style={{ position: 'absolute', right: '24px', bottom: 0, width: '18px', height: '100%', display: 'flex', alignItems: 'flex-end' }}>
                  <div style={{ width: '100%', height: '130px', background: '#3bb38f', borderRadius: '1px' }} />
                </div>

                {/* Center caption */}
                <div style={{ position: 'absolute', bottom: '-36px', left: 0, right: 0, textAlign: 'center', fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
                  timestamp per 30 minutes
                </div>
              </div>
            </div>

            {/* Hits grid table */}
            <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '24px', marginTop: '16px' }}>
              
              {/* Header block info */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '16px', fontSize: '12.5px', color: '#64748b' }}>
                  <button onClick={() => toast.success('Export formatted')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>📥 Export Formatted</button>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', color: '#cbd5e1' }} disabled>🔄 Reset view</button>
                  <span style={{ color: '#94a3b8' }}>|</span>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>👁️ 496 available fields</button>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>📋 Columns</button>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>↕️ Density</button>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, color: '#334155' }}>⇅ 1 fields sorted</button>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>🔲 Full screen</button>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>3 hits</div>
                  <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px' }}>Jun 11, 2026 @ 22:31:54.454 - Jun 12, 2026 @ 22:31:54.455</div>
                </div>
              </div>

              {/* Table */}
              <div className="wz-table-wrapper" style={{ border: 'none' }}>
                <table className="wz-table">
                  <thead>
                    <tr>
                      <th style={{ cursor: 'pointer' }}>↓ timestamp</th>
                      <th>agent.name</th>
                      <th>rule.pci_dss</th>
                      <th>rule.description</th>
                      <th>rule.level</th>
                      <th>rule.id</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedPciEvents.map((e, idx) => (
                      <tr key={idx} onClick={() => setSelectedComplianceEvent(e)} style={{ cursor: 'pointer' }}>
                        <td>{e.ts}</td>
                        <td><span style={{ color: '#005cca', fontWeight: 600, cursor: 'pointer' }} onClick={(ev) => { ev.stopPropagation(); navigate(`/agents/detail?agent=${e.agent}`); }}>{e.agent}</span></td>
                        <td>{e.rule}</td>
                        <td>{e.desc}</td>
                        <td>{e.level}</td>
                        <td style={{ color: '#005cca', fontWeight: 600 }}>{e.id}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', fontSize: '12.5px', color: '#64748b' }}>
                <div>
                  <span>Rows per page: {PCI_EVENTS_PER_PAGE}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button disabled={pciEventsPage <= 1} onClick={() => setPciEventsPage(prev => Math.max(1, prev - 1))} style={{ background: 'none', border: 'none', cursor: pciEventsPage <= 1 ? 'not-allowed' : 'pointer', color: pciEventsPage <= 1 ? '#cbd5e1' : '#475569' }}>&lt;</button>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>{pciEventsPage} of {totalPciPages}</span>
                  <button disabled={pciEventsPage >= totalPciPages} onClick={() => setPciEventsPage(prev => Math.min(totalPciPages, prev + 1))} style={{ background: 'none', border: 'none', cursor: pciEventsPage >= totalPciPages ? 'not-allowed' : 'pointer', color: pciEventsPage >= totalPciPages ? '#cbd5e1' : '#475569' }}>&gt;</button>
                </div>
              </div>

            </div>

          </div>
        )}

      {selectedComplianceEvent && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setSelectedComplianceEvent(null)}>
          <div style={{ background: '#ffffff', padding: '24px', borderRadius: '6px', width: '500px', display: 'flex', flexDirection: 'column', gap: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} onClick={ev => ev.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '16.5px', fontWeight: 600, color: '#1e293b' }}>Event Details</h3>
              <button onClick={() => setSelectedComplianceEvent(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><FiX size={18} /></button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '8px 12px', fontSize: '13px' }}>
              <span style={{ color: '#64748b', fontWeight: 600 }}>Timestamp</span>
              <span style={{ color: '#1e293b' }}>{selectedComplianceEvent.ts}</span>
              <span style={{ color: '#64748b', fontWeight: 600 }}>Agent</span>
              <span style={{ color: '#005cca', fontWeight: 600, cursor: 'pointer' }} onClick={() => { navigate(`/agents/detail?agent=${selectedComplianceEvent.agent}`); setSelectedComplianceEvent(null); }}>{selectedComplianceEvent.agent}</span>
              <span style={{ color: '#64748b', fontWeight: 600 }}>Requirement ID</span>
              <span style={{ color: '#1e293b' }}>{selectedComplianceEvent.rule}</span>
              <span style={{ color: '#64748b', fontWeight: 600 }}>Description</span>
              <span style={{ color: '#1e293b' }}>{selectedComplianceEvent.desc}</span>
              <span style={{ color: '#64748b', fontWeight: 600 }}>Level</span>
              <span style={{ color: '#1e293b' }}>{selectedComplianceEvent.level}</span>
              <span style={{ color: '#64748b', fontWeight: 600 }}>Rule ID</span>
              <span style={{ color: '#005cca', fontWeight: 600 }}>{selectedComplianceEvent.id}</span>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default PciDss;
