import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiChevronDown, FiPlus, FiRefreshCw, FiDownload, FiSettings, FiCalendar, FiX } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const Gdpr: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'controls' | 'events'>('dashboard');
  const [hideNoAlerts, setHideNoAlerts] = useState(false);
  const [activeRequirement, setActiveRequirement] = useState<string | null>(null);

  const [filters, setFilters] = useState([
    { key: 'manager.name', value: 'saad-cyber6' },
    { key: 'rule.gdpr', value: 'exists' },
    { key: 'agent.id', value: '001' }
  ]);

  const removeFilter = (idx: number) => {
    setFilters(filters.filter((_, i) => i !== idx));
  };

  const [reqSearch, setReqSearch] = useState('');
  const [gdprEventsPage, setGdprEventsPage] = useState(1);
  const GDPR_EVENTS_PER_PAGE = 15;

  const gdprEventsData = [
    { ts: 'Jun 12, 2026 @ 21:38:29.3...', agent: 'Isgasaad', rule: 'II_5.1.f', desc: 'Integrity checksum changed.', level: 7, id: '550' },
    { ts: 'Jun 12, 2026 @ 21:38:29.3...', agent: 'Isgasaad', rule: 'II_5.1.f', desc: 'Integrity checksum changed.', level: 7, id: '550' },
    { ts: 'Jun 12, 2026 @ 21:36:40.5...', agent: 'Isgasaad', rule: 'IV_35.7.d', desc: 'Wazuh agent started.', level: 3, id: '503' },
    { ts: 'Jun 12, 2026 @ 21:35:10.1...', agent: 'Isgasaad', rule: 'II_5.1.f', desc: 'PAM: Login session opened.', level: 3, id: '5501' },
    { ts: 'Jun 12, 2026 @ 21:30:22.8...', agent: 'db-prod-02', rule: 'IV_35.7.d', desc: 'File permission changed.', level: 7, id: '552' },
    { ts: 'Jun 12, 2026 @ 21:25:11.4...', agent: 'Isgasaad', rule: 'III_14.2.c', desc: 'New dpkg installed.', level: 7, id: '553' },
    { ts: 'Jun 12, 2026 @ 21:20:05.7...', agent: 'db-prod-02', rule: 'II_5.1.f', desc: 'Integrity checksum changed.', level: 7, id: '550' },
    { ts: 'Jun 11, 2026 @ 22:15:33.2...', agent: 'Isgasaad', rule: 'IV_24.2', desc: 'Login session closed.', level: 3, id: '5502' },
    { ts: 'Jun 11, 2026 @ 21:55:44.9...', agent: 'Amazon', rule: 'IV_28', desc: 'File added to system.', level: 5, id: '554' },
    { ts: 'Jun 11, 2026 @ 21:45:12.3...', agent: 'Isgasaad', rule: 'IV_30.1.g', desc: 'Service started.', level: 5, id: '555' },
  ];
  const totalGdprPages = Math.ceil(gdprEventsData.length / GDPR_EVENTS_PER_PAGE);
  const filteredGdprEvents = filters.length > 0 ? gdprEventsData.filter(e => filters.some(f => e.rule.includes(f.value) || e.id.includes(f.value) || e.desc.includes(f.value))) : gdprEventsData;
  const pagedGdprEvents = filteredGdprEvents.slice((gdprEventsPage - 1) * GDPR_EVENTS_PER_PAGE, gdprEventsPage * GDPR_EVENTS_PER_PAGE);
  const [selectedComplianceEvent, setSelectedComplianceEvent] = useState<any>(null);

  // Requirements list for the left panel in GDPR Controls
  const sidebarRequirements = [
    { name: 'Requirement II', count: 2 },
    { name: 'Requirement IV', count: 1 },
    { name: 'Requirement III', count: 0 }
  ];

  // Requirements details list for the grid on the right side
  const rightRequirements = [
    { id: 'II_5.1.f', desc: 'Ensure the ongoing confiden...', count: 2 },
    { id: 'IV_35.7.d', desc: 'Capabilities for identificati...', count: 1 },
    { id: 'III_14.2.c', desc: 'Restrict the processing of ...', count: 0 },
    { id: 'III_17', desc: 'Permanently erase personal in...', count: 0 },
    { id: 'IV_24.2', desc: 'Be able to demonstrate co...', count: 0 },
    { id: 'IV_28', desc: 'Ensure data protection during...', count: 0 },
    { id: 'IV_30.1.g', desc: 'It is necessary to keep all ...', count: 0 },
    { id: 'IV_32.1.c', desc: 'Data Loss Prevention (DLP...', count: 0 },
    { id: 'IV_32.2', desc: 'Account management tools ...', count: 0 },
    { id: 'IV_33', desc: 'Notify the supervisory author...', count: 0 },
    { id: 'IV_35.1', desc: 'Perform a data protection i...', count: 0 }
  ];

  const filteredRightRequirements = rightRequirements
    .filter(r => !activeRequirement || r.id.startsWith(activeRequirement.replace('Requirement ', '').split('_')[0]))
    .filter(r => !hideNoAlerts || r.count > 0)
    .filter(r => {
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
              const report = { id: Date.now().toString(), name: `GDPR Report ${new Date().toLocaleDateString()}`, desc: 'GDPR compliance investigation report', format: 'PDF', created: new Date().toLocaleString(), status: 'completed' };
              const existing = JSON.parse(localStorage.getItem('wz_reports') || '[]');
              existing.push(report);
              localStorage.setItem('wz_reports', JSON.stringify(existing));
              toast.success('GDPR report generated and saved to Reporting');
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
              <span>{activeTab === 'events' ? 'Last 1 hour' : 'Last 24 hours'}</span>
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
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#c2b29a" strokeWidth="4" strokeDasharray="50 100" strokeDashoffset="25" />
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#d98236" strokeWidth="4" strokeDasharray="25 100" strokeDashoffset="-25" />
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#a45a3c" strokeWidth="4" strokeDasharray="15 100" strokeDashoffset="-50" />
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
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#c084fc" strokeWidth="4" strokeDasharray="66 100" strokeDashoffset="25" />
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

              {/* Top 5 requirements */}
              <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '16px' }}>Top 5 requirements</h4>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                  {/* SVG Donut */}
                  <svg width="120" height="120" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                    {/* II_5.1.f: 66% */}
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f472b6" strokeWidth="4" strokeDasharray="66 100" strokeDashoffset="25" />
                    {/* IV_35.7.d: 34% */}
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#eab308" strokeWidth="4" strokeDasharray="34 100" strokeDashoffset="-41" />
                  </svg>
                  <div style={{ fontSize: '11px', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span><span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#f472b6', marginRight: '6px' }} />II_5.1.f</span>
                    <span><span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#eab308', marginRight: '6px' }} />IV_35.7.d</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Row charts */}
            <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '20px' }}>
              
              {/* GDPR Requirements vertical bar chart */}
              <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '24px' }}>GDPR Requirements</h4>
                <div style={{ display: 'flex', gap: '8px', height: '180px', position: 'relative', borderLeft: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', paddingLeft: '24px', paddingBottom: '8px' }}>
                  
                  {/* Y Axis labels */}
                  <span style={{ position: 'absolute', left: '-20px', bottom: '0%', fontSize: '10px', color: '#94a3b8' }}>0</span>
                  <span style={{ position: 'absolute', left: '-20px', bottom: '25%', fontSize: '10px', color: '#94a3b8' }}>0.5</span>
                  <span style={{ position: 'absolute', left: '-20px', bottom: '50%', fontSize: '10px', color: '#94a3b8' }}>1</span>
                  <span style={{ position: 'absolute', left: '-20px', bottom: '75%', fontSize: '10px', color: '#94a3b8' }}>1.5</span>
                  <span style={{ position: 'absolute', left: '-20px', bottom: '98%', fontSize: '10px', color: '#94a3b8' }}>2</span>
                  <span style={{ position: 'absolute', left: '-50px', top: '40%', transform: 'rotate(-90deg)', fontSize: '11px', color: '#64748b', fontWeight: 500 }}>Count</span>

                  {/* Bars container */}
                  <div style={{ display: 'flex', width: '100%', justifyContent: 'space-around', alignItems: 'flex-end', height: '100%' }}>
                    {/* Bar II_5.1.f (height: 100% / Count 2) */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100px' }}>
                      <div style={{ width: '100%', height: '170px', background: '#f472b6', borderRadius: '2px 2px 0 0' }} />
                      <span style={{ fontSize: '11px', color: '#64748b', marginTop: '6px', fontWeight: 600 }}>II_5.1.f</span>
                    </div>

                    {/* Bar IV_35.7.d (height: 50% / Count 1) */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100px' }}>
                      <div style={{ width: '100%', height: '85px', background: '#eab308', borderRadius: '2px 2px 0 0' }} />
                      <span style={{ fontSize: '11px', color: '#64748b', marginTop: '6px', fontWeight: 600 }}>IV_35.7.d</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rule level distribution */}
              <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '16px' }}>Rule level distribution</h4>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  <svg width="120" height="120" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#86efac" strokeWidth="4" strokeDasharray="66.67 100" strokeDashoffset="25" />
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
            
            {/* Left sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', borderRight: '1px solid #e2e8f0', paddingRight: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b' }}>GDPR</span>
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
                
                <span style={{ position: 'absolute', left: '-20px', bottom: '0%', fontSize: '10px', color: '#94a3b8' }}>0</span>
                <span style={{ position: 'absolute', left: '-20px', bottom: '25%', fontSize: '10px', color: '#94a3b8' }}>0.5</span>
                <span style={{ position: 'absolute', left: '-20px', bottom: '50%', fontSize: '10px', color: '#94a3b8' }}>1</span>
                <span style={{ position: 'absolute', left: '-20px', bottom: '75%', fontSize: '10px', color: '#94a3b8' }}>1.5</span>
                <span style={{ position: 'absolute', left: '-20px', bottom: '99%', fontSize: '10px', color: '#94a3b8' }}>2</span>
                <span style={{ position: 'absolute', left: '-52px', top: '40%', transform: 'rotate(-90deg)', fontSize: '11px', color: '#64748b', fontWeight: 500 }}>Count</span>

                <div style={{ display: 'flex', justifyContent: 'space-between', position: 'absolute', bottom: '-20px', left: '32px', right: '0', fontSize: '10px', color: '#94a3b8' }}>
                  <span>21:35</span>
                  <span>21:40</span>
                  <span>21:45</span>
                  <span>21:50</span>
                  <span>21:55</span>
                  <span>22:00</span>
                  <span>22:05</span>
                  <span>22:10</span>
                  <span>22:15</span>
                  <span>22:20</span>
                  <span>22:25</span>
                  <span>22:30</span>
                </div>

                {/* Bars */}
                {/* Bar at 21:37 height 1 (50%) */}
                <div style={{ position: 'absolute', left: '60px', bottom: 0, width: '12px', height: '100%', display: 'flex', alignItems: 'flex-end' }}>
                  <div style={{ width: '100%', height: '65px', background: '#3bb38f', borderRadius: '1px' }} />
                </div>

                {/* Bar at 21:38 height 2 (100%) */}
                <div style={{ position: 'absolute', left: '78px', bottom: 0, width: '12px', height: '100%', display: 'flex', alignItems: 'flex-end' }}>
                  <div style={{ width: '100%', height: '130px', background: '#3bb38f', borderRadius: '1px' }} />
                </div>

                <div style={{ position: 'absolute', bottom: '-36px', left: 0, right: 0, textAlign: 'center', fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
                  timestamp per minute
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
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>3 hits</div>
                  <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px' }}>Jun 12, 2026 @ 21:33:28.891 - Jun 12, 2026 @ 22:33:28.892</div>
                </div>
              </div>

              <div className="wz-table-wrapper" style={{ border: 'none' }}>
                <table className="wz-table">
                  <thead>
                    <tr>
                      <th style={{ cursor: 'pointer' }}>↓ timestamp</th>
                      <th>agent.name</th>
                      <th>rule.gdpr</th>
                      <th>rule.description</th>
                      <th>rule.level</th>
                      <th>rule.id</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedGdprEvents.map((e, idx) => (
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
                  <span>Rows per page: {GDPR_EVENTS_PER_PAGE}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button disabled={gdprEventsPage <= 1} onClick={() => setGdprEventsPage(prev => Math.max(1, prev - 1))} style={{ background: 'none', border: 'none', cursor: gdprEventsPage <= 1 ? 'not-allowed' : 'pointer', color: gdprEventsPage <= 1 ? '#cbd5e1' : '#475569' }}>&lt;</button>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>{gdprEventsPage} of {totalGdprPages}</span>
                  <button disabled={gdprEventsPage >= totalGdprPages} onClick={() => setGdprEventsPage(prev => Math.min(totalGdprPages, prev + 1))} style={{ background: 'none', border: 'none', cursor: gdprEventsPage >= totalGdprPages ? 'not-allowed' : 'pointer', color: gdprEventsPage >= totalGdprPages ? '#cbd5e1' : '#475569' }}>&gt;</button>
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

export default Gdpr;
