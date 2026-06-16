import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiChevronDown, FiPlus, FiRefreshCw, FiDownload, FiSettings, FiCalendar, FiX } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const Tsc: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'controls' | 'events'>('dashboard');
  const [hideNoAlerts, setHideNoAlerts] = useState(false);
  const [activeRequirement, setActiveRequirement] = useState<string | null>(null);

  const [filters, setFilters] = useState([
    { key: 'manager.name', value: 'saad-cyber6' },
    { key: 'rule.tsc', value: 'exists' },
    { key: 'agent.id', value: '001' }
  ]);

  const removeFilter = (idx: number) => {
    setFilters(filters.filter((_, i) => i !== idx));
  };

  const [reqSearch, setReqSearch] = useState('');
  const [tscEventsPage, setTscEventsPage] = useState(1);
  const TSC_EVENTS_PER_PAGE = 15;

  const tscEventsData = [
    { ts: 'Jun 12, 2026 @ 22:36:23.7...', agent: 'Isgasaad', rule: 'PI1.4, PI1.5, CC6.1, CC6.8, CC7.2, CC7.3', desc: 'Integrity checksum changed.', level: 7, id: '550' },
    { ts: 'Jun 12, 2026 @ 22:36:23.7...', agent: 'Isgasaad', rule: 'PI1.4, PI1.5, CC6.1, CC6.8, CC7.2, CC7.3', desc: 'Integrity checksum changed.', level: 7, id: '550' },
    { ts: 'Jun 12, 2026 @ 22:36:23.7...', agent: 'Isgasaad', rule: 'PI1.4, PI1.5, CC6.1, CC6.8, CC7.2, CC7.3', desc: 'Integrity checksum changed.', level: 7, id: '550' },
    { ts: 'Jun 12, 2026 @ 21:36:40.5...', agent: 'Isgasaad', rule: 'CC6.8, CC7.2', desc: 'Wazuh agent started.', level: 3, id: '503' },
    { ts: 'Jun 12, 2026 @ 21:35:10.1...', agent: 'Isgasaad', rule: 'CC7.2', desc: 'PAM: Login session opened.', level: 3, id: '5501' },
    { ts: 'Jun 12, 2026 @ 21:30:22.8...', agent: 'db-prod-02', rule: 'CC6.8', desc: 'File permission changed.', level: 7, id: '552' },
    { ts: 'Jun 12, 2026 @ 21:25:11.4...', agent: 'Isgasaad', rule: 'CC7.3', desc: 'New dpkg installed.', level: 7, id: '553' },
    { ts: 'Jun 12, 2026 @ 21:20:05.7...', agent: 'db-prod-02', rule: 'CC6.1', desc: 'Integrity checksum changed.', level: 7, id: '550' },
    { ts: 'Jun 11, 2026 @ 22:15:33.2...', agent: 'Isgasaad', rule: 'PI1.4', desc: 'Login session closed.', level: 3, id: '5502' },
    { ts: 'Jun 11, 2026 @ 21:55:44.9...', agent: 'Amazon', rule: 'PI1.5', desc: 'File added to system.', level: 5, id: '554' },
  ];
  const totalTscPages = Math.ceil(tscEventsData.length / TSC_EVENTS_PER_PAGE);
  const filteredTscEvents = filters.length > 0 ? tscEventsData.filter(e => filters.some(f => e.rule.includes(f.value) || e.id.includes(f.value) || e.desc.includes(f.value))) : tscEventsData;
  const pagedTscEvents = filteredTscEvents.slice((tscEventsPage - 1) * TSC_EVENTS_PER_PAGE, tscEventsPage * TSC_EVENTS_PER_PAGE);
  const [selectedComplianceEvent, setSelectedComplianceEvent] = useState<any>(null);

  // Requirements list for the left panel in TSC Controls
  const sidebarRequirements = [
    { name: 'Requirement CC7', count: 406 },
    { name: 'Requirement CC6', count: 405 },
    { name: 'Requirement PI1', count: 404 },
    { name: 'Requirement A1', count: 0 },
    { name: 'Requirement CC5', count: 0 },
    { name: 'Requirement CC8', count: 0 }
  ];

  // Requirements details list for the grid on the right side
  const rightRequirements = [
    { id: 'CC6.8', desc: 'The entity implements contr...', count: 203 },
    { id: 'CC7.2', desc: 'The entity monitors system ...', count: 203 },
    { id: 'CC7.3', desc: 'The entity evaluates securit...', count: 203 },
    { id: 'CC6.1', desc: 'The entity implements logic...', count: 202 },
    { id: 'PI1.4', desc: 'The entity implements policie...', count: 202 },
    { id: 'PI1.5', desc: 'The entity implements policie...', count: 202 },
    { id: 'A1.1', desc: 'The entity maintains, monitors, ...', count: 0 },
    { id: 'A1.2', desc: 'The entity authorizes, designs,...', count: 0 },
    { id: 'CC5.1', desc: 'The entity selects and develo...', count: 0 },
    { id: 'CC5.2', desc: 'The entity also selects and d...', count: 0 },
    { id: 'CC6.2', desc: 'Prior to issuing system crede...', count: 0 },
    { id: 'CC6.3', desc: 'The entity authorizes, modifi...', count: 0 },
    { id: 'CC6.4', desc: 'The entity restricts physical ...', count: 0 },
    { id: 'CC6.6', desc: 'The entity implements logica...', count: 0 },
    { id: 'CC6.7', desc: 'The entity restricts the trans...', count: 0 },
    { id: 'CC7.1', desc: 'To meet its objectives, the en...', count: 0 },
    { id: 'CC7.4', desc: 'The entity responds to identi...', count: 0 },
    { id: 'CC8.1', desc: 'The entity authorizes, design...', count: 0 }
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
              const report = { id: Date.now().toString(), name: `TSC Report ${new Date().toLocaleDateString()}`, desc: 'TSC compliance investigation report', format: 'PDF', created: new Date().toLocaleString(), status: 'completed' };
              const existing = JSON.parse(localStorage.getItem('wz_reports') || '[]');
              existing.push(report);
              localStorage.setItem('wz_reports', JSON.stringify(existing));
              toast.success('TSC report generated and saved to Reporting');
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
              <span>Today</span>
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
                  <svg width="110" height="110" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                    {/* ossec: 25% (orange-red) */}
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#e0583b" strokeWidth="4" strokeDasharray="25 100" strokeDashoffset="25" />
                    {/* syscheck: 25% (greenish) */}
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#a3d9c9" strokeWidth="4" strokeDasharray="25 100" strokeDashoffset="0" />
                    {/* syscheck_entry_modif: 25% (blueish) */}
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#a3c9e8" strokeWidth="4" strokeDasharray="25 100" strokeDashoffset="-25" />
                    {/* syscheck_file: 25% (pinkish) */}
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#e8a3c9" strokeWidth="4" strokeDasharray="25 100" strokeDashoffset="-50" />
                  </svg>
                  <div style={{ fontSize: '10.5px', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span><span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#e0583b', marginRight: '6px' }} />ossec</span>
                    <span><span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#a3d9c9', marginRight: '6px' }} />syscheck</span>
                    <span><span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#a3c9e8', marginRight: '6px' }} />syscheck_entry_modif</span>
                    <span><span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#e8a3c9', marginRight: '6px' }} />syscheck_file</span>
                  </div>
                </div>
              </div>

              {/* Top 5 rules */}
              <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '16px' }}>Top 5 rules</h4>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                  <svg width="110" height="110" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                    {/* Integrity checksum changed: 99% (tan/brown) */}
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#d2b48c" strokeWidth="4" strokeDasharray="99 100" strokeDashoffset="25" />
                    {/* Wazuh agent started: 1% (orange) */}
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#e9967a" strokeWidth="4" strokeDasharray="1 100" strokeDashoffset="-74" />
                  </svg>
                  <div style={{ fontSize: '10.5px', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span><span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#d2b48c', marginRight: '6px' }} />Integrity checksum ch</span>
                    <span><span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#e9967a', marginRight: '6px' }} />Wazuh agent started.</span>
                  </div>
                </div>
              </div>

              {/* Top 5 TSC requirements */}
              <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '16px' }}>Top 5 TSC requirements</h4>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                  <svg width="110" height="110" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                    {/* CC6.8: 20% (purple) */}
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#c0a3e8" strokeWidth="4" strokeDasharray="20 100" strokeDashoffset="25" />
                    {/* CC7.2: 20% (pink) */}
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#e8a3c0" strokeWidth="4" strokeDasharray="20 100" strokeDashoffset="5" />
                    {/* CC7.3: 20% (yellow) */}
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#e8dca3" strokeWidth="4" strokeDasharray="20 100" strokeDashoffset="-15" />
                    {/* CC6.1: 20% (greenish) */}
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#cfe8a3" strokeWidth="4" strokeDasharray="20 100" strokeDashoffset="-35" />
                    {/* PI1.4: 20% (orange) */}
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#e8bfa3" strokeWidth="4" strokeDasharray="20 100" strokeDashoffset="-55" />
                  </svg>
                  <div style={{ fontSize: '10.5px', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span><span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#c0a3e8', marginRight: '6px' }} />CC6.8</span>
                    <span><span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#e8a3c0', marginRight: '6px' }} />CC7.2</span>
                    <span><span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#e8dca3', marginRight: '6px' }} />CC7.3</span>
                    <span><span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#cfe8a3', marginRight: '6px' }} />CC6.1</span>
                    <span><span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#e8bfa3', marginRight: '6px' }} />PI1.4</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Row charts */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
              
              {/* TSC Requirements stacked bar chart */}
              <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '24px' }}>TSC Requirements</h4>
                <div style={{ display: 'flex', gap: '8px', height: '180px', position: 'relative', borderLeft: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', paddingLeft: '32px', paddingBottom: '8px' }}>
                  
                  {/* Y Axis labels */}
                  <span style={{ position: 'absolute', left: '-24px', bottom: '0%', fontSize: '10px', color: '#94a3b8' }}>0</span>
                  <span style={{ position: 'absolute', left: '-24px', bottom: '20%', fontSize: '10px', color: '#94a3b8' }}>200</span>
                  <span style={{ position: 'absolute', left: '-24px', bottom: '40%', fontSize: '10px', color: '#94a3b8' }}>400</span>
                  <span style={{ position: 'absolute', left: '-24px', bottom: '60%', fontSize: '10px', color: '#94a3b8' }}>600</span>
                  <span style={{ position: 'absolute', left: '-24px', bottom: '80%', fontSize: '10px', color: '#94a3b8' }}>800</span>
                  <span style={{ position: 'absolute', left: '-24px', bottom: '99%', fontSize: '10px', color: '#94a3b8' }}>1,000</span>
                  <span style={{ position: 'absolute', left: '-50px', top: '40%', transform: 'rotate(-90deg)', fontSize: '11px', color: '#64748b', fontWeight: 500 }}>Count</span>

                  {/* X Axis labels */}
                  <div style={{ display: 'flex', justifyContent: 'space-around', position: 'absolute', bottom: '-20px', left: '32px', right: '0', fontSize: '10px', color: '#94a3b8' }}>
                    <span>CC6.8</span>
                    <span>CC7.2</span>
                    <span>CC7.3</span>
                    <span>CC6.1</span>
                    <span>PI1.4</span>
                    <span>PI1.5</span>
                  </div>

                  {/* Bars container */}
                  <div style={{ display: 'flex', width: '100%', justifyContent: 'space-around', alignItems: 'flex-end', height: '100%' }}>
                    {['CC6.8', 'CC7.2', 'CC7.3', 'CC6.1', 'PI1.4', 'PI1.5'].map((req, idx) => (
                      <div key={idx} style={{ width: '28px', height: '160px', display: 'flex', flexDirection: 'column' }}>
                        {/* Stacked segments of height 1000 total */}
                        <div style={{ flex: 1, background: '#e8bfa3' }} />
                        <div style={{ flex: 1, background: '#cfe8a3' }} />
                        <div style={{ flex: 1, background: '#e8dca3' }} />
                        <div style={{ flex: 1, background: '#e8a3c0' }} />
                        <div style={{ flex: 1, background: '#c0a3e8' }} />
                      </div>
                    ))}
                  </div>

                  <div style={{ position: 'absolute', bottom: '-36px', left: 0, right: 0, textAlign: 'center', fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
                    TSC Requirements
                  </div>

                  {/* Legend inside top right */}
                  <div style={{ position: 'absolute', top: 0, right: 0, fontSize: '10px', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span><span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#c0a3e8', marginRight: '6px' }} />CC6.8</span>
                    <span><span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#e8a3c0', marginRight: '6px' }} />CC7.2</span>
                    <span><span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#e8dca3', marginRight: '6px' }} />CC7.3</span>
                    <span><span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#cfe8a3', marginRight: '6px' }} />CC6.1</span>
                    <span><span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#e8bfa3', marginRight: '6px' }} />PI1.4</span>
                  </div>

                </div>
              </div>

              {/* Rule level distribution */}
              <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '16px' }}>Rule level distribution</h4>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                  <svg width="100" height="100" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                    {/* 7: 99.51% (purple) */}
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#8b5cf6" strokeWidth="4" strokeDasharray="99.51 100" strokeDashoffset="25" />
                    {/* 3: 0.49% (sliver) */}
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#ec4899" strokeWidth="4" strokeDasharray="0.49 100" strokeDashoffset="-74.51" />
                  </svg>
                  <div style={{ fontSize: '10px', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span><span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#ec4899', marginRight: '6px' }} />3 (0.49%)</span>
                    <span><span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#8b5cf6', marginRight: '6px' }} />7 (99.51%)</span>
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
            
            {/* Left sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', borderRight: '1px solid #e2e8f0', paddingRight: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b' }}>TSC</span>
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

            {/* Right grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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

              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                  <FiSearch size={15} />
                </span>
                <input 
                  type="text" 
                  placeholder="Filter requirements" 
                  value={reqSearch}
                  onChange={e => setReqSearch(e.target.value)}
                  className="wz-search-input"
                  style={{ paddingLeft: '36px', height: '36px', fontSize: '13px' }}
                />
              </div>

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
                    <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', width: '120px' }} title={`${r.id} - ${r.desc}`}>
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
                
                <span style={{ position: 'absolute', left: '-20px', bottom: '0%', fontSize: '10px', color: '#94a3b8' }}>0</span>
                <span style={{ position: 'absolute', left: '-20px', bottom: '25%', fontSize: '10px', color: '#94a3b8' }}>50</span>
                <span style={{ position: 'absolute', left: '-20px', bottom: '50%', fontSize: '10px', color: '#94a3b8' }}>100</span>
                <span style={{ position: 'absolute', left: '-20px', bottom: '75%', fontSize: '10px', color: '#94a3b8' }}>150</span>
                <span style={{ position: 'absolute', left: '-20px', bottom: '99%', fontSize: '10px', color: '#94a3b8' }}>200</span>
                <span style={{ position: 'absolute', left: '-52px', top: '40%', transform: 'rotate(-90deg)', fontSize: '11px', color: '#64748b', fontWeight: 500 }}>Count</span>

                <div style={{ display: 'flex', justifyContent: 'space-between', position: 'absolute', bottom: '-20px', left: '32px', right: '0', fontSize: '10px', color: '#94a3b8' }}>
                  <span>03:00</span>
                  <span>06:00</span>
                  <span>09:00</span>
                  <span>12:00</span>
                  <span>15:00</span>
                  <span>18:00</span>
                  <span>21:00</span>
                </div>

                {/* Vertical bar of height 203 at 22:30 */}
                <div style={{ position: 'absolute', right: '10px', bottom: 0, width: '18px', height: '100%', display: 'flex', alignItems: 'flex-end' }}>
                  <div style={{ width: '100%', height: '130px', background: '#3bb38f', borderRadius: '1px' }} />
                </div>

                <div style={{ position: 'absolute', bottom: '-36px', left: 0, right: 0, textAlign: 'center', fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
                  timestamp per 30 minutes
                </div>
              </div>
            </div>

            {/* Hits Grid */}
            <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '24px', marginTop: '16px' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '16px', fontSize: '12.5px', color: '#64748b' }}>
                  <button onClick={() => toast.success('Export formatted')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>📥 Export Formatted</button>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', color: '#cbd5e1' }} disabled>🔄 Reset view</button>
                  <span style={{ color: '#94a3b8' }}>|</span>
                  <button onClick={() => toast.success('496 available fields')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>👁️ 496 available fields</button>
                  <button onClick={() => toast.success('Columns')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>📋 Columns</button>
                  <button onClick={() => toast.success('Density')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>↕️ Density</button>
                  <button onClick={() => toast.success('1 fields sorted')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, color: '#334155' }}>⇅ 1 fields sorted</button>
                  <button onClick={() => toast.success('Full screen')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>🔲 Full screen</button>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>203 hits</div>
                  <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px' }}>Jun 12, 2026 @ 00:00:00.000 - Jun 12, 2026 @ 23:59:59.999</div>
                </div>
              </div>

              <div className="wz-table-wrapper" style={{ border: 'none' }}>
                <table className="wz-table">
                  <thead>
                    <tr>
                      <th style={{ cursor: 'pointer' }}>↓ timestamp</th>
                      <th>agent.name</th>
                      <th>rule.tsc</th>
                      <th>rule.description</th>
                      <th>rule.level</th>
                      <th>rule.id</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedTscEvents.map((e, idx) => (
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

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', fontSize: '12.5px', color: '#64748b' }}>
                <div>
                  <span>Rows per page: {TSC_EVENTS_PER_PAGE}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button disabled={tscEventsPage <= 1} onClick={() => setTscEventsPage(prev => Math.max(1, prev - 1))} style={{ background: 'none', border: 'none', cursor: tscEventsPage <= 1 ? 'not-allowed' : 'pointer', color: tscEventsPage <= 1 ? '#cbd5e1' : '#475569' }}>&lt;</button>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>{tscEventsPage} of {totalTscPages}</span>
                  <button disabled={tscEventsPage >= totalTscPages} onClick={() => setTscEventsPage(prev => Math.min(totalTscPages, prev + 1))} style={{ background: 'none', border: 'none', cursor: tscEventsPage >= totalTscPages ? 'not-allowed' : 'pointer', color: tscEventsPage >= totalTscPages ? '#cbd5e1' : '#475569' }}>&gt;</button>
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

export default Tsc;
