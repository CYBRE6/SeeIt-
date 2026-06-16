import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiChevronDown, FiPlus, FiRefreshCw, FiDownload, FiSettings, FiCalendar, FiX } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const Nist80053: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'controls' | 'events'>('dashboard');
  const [hideNoAlerts, setHideNoAlerts] = useState(false);
  const [activeRequirement, setActiveRequirement] = useState<string | null>(null);

  const [filters, setFilters] = useState([
    { key: 'manager.name', value: 'saad-cyber6' },
    { key: 'rule.nist_800_53', value: 'exists' },
    { key: 'agent.id', value: '001' }
  ]);

  const removeFilter = (idx: number) => {
    setFilters(filters.filter((_, i) => i !== idx));
  };

  const [reqSearch, setReqSearch] = useState('');
  const [nistEventsPage, setNistEventsPage] = useState(1);
  const NIST_EVENTS_PER_PAGE = 15;

  const nistEventsData = [
    { ts: 'Jun 12, 2026 @ 21:38:29.3...', agent: 'Isgasaad', rule: 'SI.7', desc: 'Integrity checksum changed.', level: 7, id: '550' },
    { ts: 'Jun 12, 2026 @ 21:38:29.3...', agent: 'Isgasaad', rule: 'SI.7', desc: 'Integrity checksum changed.', level: 7, id: '550' },
    { ts: 'Jun 12, 2026 @ 21:36:40.5...', agent: 'Isgasaad', rule: 'AU.14, AU.5, AU.6', desc: 'Wazuh agent started.', level: 3, id: '503' },
    { ts: 'Jun 12, 2026 @ 21:35:10.1...', agent: 'Isgasaad', rule: 'AU.5', desc: 'PAM: Login session opened.', level: 3, id: '5501' },
    { ts: 'Jun 12, 2026 @ 21:30:22.8...', agent: 'db-prod-02', rule: 'SI.7', desc: 'File permission changed.', level: 7, id: '552' },
    { ts: 'Jun 12, 2026 @ 21:25:11.4...', agent: 'Isgasaad', rule: 'AU.6', desc: 'New dpkg installed.', level: 7, id: '553' },
    { ts: 'Jun 12, 2026 @ 21:20:05.7...', agent: 'db-prod-02', rule: 'SI.7', desc: 'Integrity checksum changed.', level: 7, id: '550' },
    { ts: 'Jun 11, 2026 @ 22:15:33.2...', agent: 'Isgasaad', rule: 'AU.5', desc: 'Login session closed.', level: 3, id: '5502' },
    { ts: 'Jun 11, 2026 @ 21:55:44.9...', agent: 'Amazon', rule: 'AC.2', desc: 'File added to system.', level: 5, id: '554' },
    { ts: 'Jun 11, 2026 @ 21:45:12.3...', agent: 'Isgasaad', rule: 'AC.6', desc: 'Service started.', level: 5, id: '555' },
  ];
  const totalNistPages = Math.ceil(nistEventsData.length / NIST_EVENTS_PER_PAGE);
  const filteredNistEvents = filters.length > 0 ? nistEventsData.filter(e => filters.some(f => e.rule.includes(f.value) || e.id.includes(f.value) || e.desc.includes(f.value))) : nistEventsData;
  const pagedNistEvents = filteredNistEvents.slice((nistEventsPage - 1) * NIST_EVENTS_PER_PAGE, nistEventsPage * NIST_EVENTS_PER_PAGE);
  const [selectedComplianceEvent, setSelectedComplianceEvent] = useState<any>(null);

  // Requirements list for the left panel in NIST Controls
  const sidebarRequirements = [
    { name: 'Requirement AU', count: 2 },
    { name: 'Requirement SI', count: 2 },
    { name: 'Requirement AC', count: 0 },
    { name: 'Requirement CA', count: 0 },
    { name: 'Requirement CM', count: 0 },
    { name: 'Requirement IA', count: 0 },
    { name: 'Requirement SA', count: 0 },
    { name: 'Requirement SC', count: 0 }
  ];

  // Requirements details list for the grid on the right side
  const rightRequirements = [
    { id: 'SI.7', desc: 'SOFTWARE, FIRMWARE, AND I...', count: 2 },
    { id: 'AU.5', desc: 'RESPONSE TO AUDIT PROCE...', count: 1 },
    { id: 'AU.6', desc: 'AUDIT REVIEW, ANALYSIS, AN...', count: 1 },
    { id: 'AC.2', desc: 'ACCOUNT MANAGEMENT - I...', count: 0 },
    { id: 'AC.6', desc: 'LEAST PRIVILEGE - The organi...', count: 0 },
    { id: 'AC.7', desc: 'UNSUCCESSFUL LOGON ATT...', count: 0 },
    { id: 'AC.12', desc: 'SESSION TERMINATION - Th...', count: 0 },
    { id: 'AU.8', desc: 'TIME STAMPS - Uses internal ...', count: 0 },
    { id: 'AU.9', desc: 'PROTECTION OF AUDIT INFO...', count: 0 },
    { id: 'AU.12', desc: 'AUDIT GENERATION - The inf...', count: 0 },
    { id: 'CA.3', desc: 'SYSTEM INTERCONNECTION...', count: 0 },
    { id: 'CM.1', desc: 'CONFIGURATION MANAGEME...', count: 0 },
    { id: 'CM.3', desc: 'CONFIGURATION CHANGE C...', count: 0 },
    { id: 'CM.5', desc: 'ACCESS RESTRICTIONS FOR ...', count: 0 },
    { id: 'IA.4', desc: 'IDENTIFIER MANAGEMENT - T...', count: 0 },
    { id: 'IA.5', desc: 'AUTHENTICATOR MANAGEME...', count: 0 },
    { id: 'IA.10', desc: 'ADAPTIVE IDENTIFICATION A...', count: 0 },
    { id: 'SA.11', desc: 'DEVELOPER SECURITY TESTI...', count: 0 },
    { id: 'SC.2', desc: 'APPLICATION PARTITIONING ...', count: 0 },
    { id: 'SC.7', desc: 'BOUNDARY PROTECTION - T...', count: 0 },
    { id: 'SC.8', desc: 'TRANSMISSION CONFIDENTI...', count: 0 },
    { id: 'SI.2', desc: 'FLAW REMEDIATION - The org...', count: 0 },
    { id: 'SI.3', desc: 'MALICIOUS CODE PROTECTIO...', count: 0 }
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
              const report = { id: Date.now().toString(), name: `NIST 800-53 Report ${new Date().toLocaleDateString()}`, desc: 'NIST 800-53 compliance investigation report', format: 'PDF', created: new Date().toLocaleString(), status: 'completed' };
              const existing = JSON.parse(localStorage.getItem('wz_reports') || '[]');
              existing.push(report);
              localStorage.setItem('wz_reports', JSON.stringify(existing));
              toast.success('NIST 800-53 report generated and saved to Reporting');
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
              
              {/* Stats card */}
              <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '24px' }}>Stats</h4>
                <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '36px', fontWeight: 700, color: '#0f766e' }}>3</div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>Total alerts</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '36px', fontWeight: 700, color: '#0f766e' }}>7</div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>Max rule level</div>
                  </div>
                </div>
              </div>

              {/* Top 10 requirements */}
              <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '16px' }}>Top 10 requirements</h4>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                  {/* SVG Donut */}
                  <svg width="120" height="120" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                    {/* SI.7: 50% (yellow/gold) */}
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#eab308" strokeWidth="4" strokeDasharray="50 100" strokeDashoffset="25" />
                    {/* AU.14: 16.6% (tan/grey) */}
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#c2b29a" strokeWidth="4" strokeDasharray="16.6 100" strokeDashoffset="-25" />
                    {/* AU.5: 16.6% (orange) */}
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#d98236" strokeWidth="4" strokeDasharray="16.6 100" strokeDashoffset="-41.6" />
                    {/* AU.6: 16.6% (coral/red) */}
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#e06a55" strokeWidth="4" strokeDasharray="16.6 100" strokeDashoffset="-58.2" />
                  </svg>
                  <div style={{ fontSize: '11px', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span><span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#eab308', marginRight: '6px' }} />SI.7</span>
                    <span><span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#c2b29a', marginRight: '6px' }} />AU.14</span>
                    <span><span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#d98236', marginRight: '6px' }} />AU.5</span>
                    <span><span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#e06a55', marginRight: '6px' }} />AU.6</span>
                  </div>
                </div>
              </div>

              {/* Requirements distributed by level (horizontal bar chart) */}
              <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '16px' }}>Requirements distributed by level</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', height: '140px', position: 'relative', borderLeft: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', paddingLeft: '40px', paddingBottom: '24px' }}>
                  
                  {/* Y Axis labels */}
                  <span style={{ position: 'absolute', left: '8px', bottom: '78%', fontSize: '9px', color: '#64748b', fontWeight: 500 }}>SI.7</span>
                  <span style={{ position: 'absolute', left: '8px', bottom: '58%', fontSize: '9px', color: '#64748b', fontWeight: 500 }}>AU.14</span>
                  <span style={{ position: 'absolute', left: '8px', bottom: '38%', fontSize: '9px', color: '#64748b', fontWeight: 500 }}>AU.5</span>
                  <span style={{ position: 'absolute', left: '8px', bottom: '18%', fontSize: '9px', color: '#64748b', fontWeight: 500 }}>AU.6</span>
                  <span style={{ position: 'absolute', left: '-30px', top: '35%', transform: 'rotate(-90deg)', fontSize: '10px', color: '#64748b' }}>Requirement</span>

                  {/* X Axis labels */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', position: 'absolute', bottom: '0px', left: '40px', right: '0', fontSize: '9px', color: '#94a3b8' }}>
                    <span>0.2</span>
                    <span>0.4</span>
                    <span>0.6</span>
                    <span>0.8</span>
                    <span>1</span>
                    <span>1.2</span>
                    <span>1.4</span>
                    <span>1.6</span>
                    <span>1.8</span>
                  </div>
                  <span style={{ position: 'absolute', bottom: '-14px', left: '0', right: '0', textAlign: 'center', fontSize: '10px', color: '#64748b', fontWeight: 600 }}>Count</span>

                  {/* Legend */}
                  <div style={{ position: 'absolute', top: '-10px', right: 0, fontSize: '9px', color: '#64748b', display: 'flex', gap: '8px' }}>
                    <span><span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#8b5cf6', marginRight: '4px' }} />7</span>
                    <span><span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#ec4899', marginRight: '4px' }} />3</span>
                  </div>

                  {/* Horizontal bars */}
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', height: '100%', width: '100%', paddingLeft: '8px' }}>
                    {/* SI.7 (length 2 - purple) */}
                    <div style={{ width: '90%', height: '14px', background: '#8b5cf6', borderRadius: '1px' }} />
                    {/* AU.14 (length 1 - pink) */}
                    <div style={{ width: '45%', height: '14px', background: '#ec4899', borderRadius: '1px' }} />
                    {/* AU.5 (length 1 - pink) */}
                    <div style={{ width: '45%', height: '14px', background: '#ec4899', borderRadius: '1px' }} />
                    {/* AU.6 (length 1 - pink) */}
                    <div style={{ width: '45%', height: '14px', background: '#ec4899', borderRadius: '1px' }} />
                  </div>

                </div>
              </div>

            </div>

            {/* Bottom Row chart */}
            <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px' }}>
              <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '24px' }}>Requirements over time</h4>
              <div style={{ display: 'flex', gap: '8px', height: '180px', position: 'relative', borderLeft: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', paddingLeft: '32px', paddingBottom: '8px' }}>
                
                {/* Y Axis labels */}
                <span style={{ position: 'absolute', left: '-20px', bottom: '0%', fontSize: '10px', color: '#94a3b8' }}>0</span>
                <span style={{ position: 'absolute', left: '-20px', bottom: '20%', fontSize: '10px', color: '#94a3b8' }}>1</span>
                <span style={{ position: 'absolute', left: '-20px', bottom: '40%', fontSize: '10px', color: '#94a3b8' }}>2</span>
                <span style={{ position: 'absolute', left: '-20px', bottom: '60%', fontSize: '10px', color: '#94a3b8' }}>3</span>
                <span style={{ position: 'absolute', left: '-20px', bottom: '80%', fontSize: '10px', color: '#94a3b8' }}>4</span>
                <span style={{ position: 'absolute', left: '-20px', bottom: '99%', fontSize: '10px', color: '#94a3b8' }}>5</span>
                <span style={{ position: 'absolute', left: '-50px', top: '40%', transform: 'rotate(-90deg)', fontSize: '11px', color: '#64748b', fontWeight: 500 }}>Count</span>

                {/* X Axis labels */}
                <div style={{ display: 'flex', justifyContent: 'space-between', position: 'absolute', bottom: '-20px', left: '32px', right: '0', fontSize: '10px', color: '#94a3b8' }}>
                  <span>03:00</span>
                  <span>06:00</span>
                  <span>09:00</span>
                  <span>12:00</span>
                  <span>15:00</span>
                  <span>18:00</span>
                  <span>21:00</span>
                </div>

                {/* Stacked bar at 21:00/22:00 of height 5 */}
                <div style={{ position: 'absolute', right: '40px', bottom: 0, width: '14px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                  {/* Pink portion: 1 */}
                  <div style={{ width: '100%', height: '34px', background: '#ec4899', borderRadius: '1px 1px 0 0' }} />
                  {/* Blue portion: 2 */}
                  <div style={{ width: '100%', height: '68px', background: '#3b82f6' }} />
                  {/* Green portion: 2 */}
                  <div style={{ width: '100%', height: '68px', background: '#10b981' }} />
                </div>

                <div style={{ position: 'absolute', bottom: '-36px', left: 0, right: 0, textAlign: 'center', fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
                  Timestamp
                </div>

                {/* Legend */}
                <div style={{ position: 'absolute', top: 0, right: 0, fontSize: '10px', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span><span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', marginRight: '6px' }} />164.312..c.1</span>
                  <span><span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6', marginRight: '6px' }} />164.312..c.2</span>
                  <span><span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#ec4899', marginRight: '6px' }} />164.312..b</span>
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
                <span style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b' }}>NIST 800-53</span>
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
                <span style={{ position: 'absolute', left: '-20px', bottom: '33%', fontSize: '10px', color: '#94a3b8' }}>1</span>
                <span style={{ position: 'absolute', left: '-20px', bottom: '66%', fontSize: '10px', color: '#94a3b8' }}>2</span>
                <span style={{ position: 'absolute', left: '-20px', bottom: '99%', fontSize: '10px', color: '#94a3b8' }}>3</span>
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

                {/* Vertical bar of height 3 at 21:00 */}
                <div style={{ position: 'absolute', right: '40px', bottom: 0, width: '18px', height: '100%', display: 'flex', alignItems: 'flex-end' }}>
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
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>3 hits</div>
                  <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px' }}>Jun 12, 2026 @ 00:00:00.000 - Jun 12, 2026 @ 23:59:59.999</div>
                </div>
              </div>

              <div className="wz-table-wrapper" style={{ border: 'none' }}>
                <table className="wz-table">
                  <thead>
                    <tr>
                      <th style={{ cursor: 'pointer' }}>↓ timestamp</th>
                      <th>agent.name</th>
                      <th>rule.nist_800_53</th>
                      <th>rule.description</th>
                      <th>rule.level</th>
                      <th>rule.id</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedNistEvents.map((e, idx) => (
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
                  <span>Rows per page: {NIST_EVENTS_PER_PAGE}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button disabled={nistEventsPage <= 1} onClick={() => setNistEventsPage(prev => Math.max(1, prev - 1))} style={{ background: 'none', border: 'none', cursor: nistEventsPage <= 1 ? 'not-allowed' : 'pointer', color: nistEventsPage <= 1 ? '#cbd5e1' : '#475569' }}>&lt;</button>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>{nistEventsPage} of {totalNistPages}</span>
                  <button disabled={nistEventsPage >= totalNistPages} onClick={() => setNistEventsPage(prev => Math.min(totalNistPages, prev + 1))} style={{ background: 'none', border: 'none', cursor: nistEventsPage >= totalNistPages ? 'not-allowed' : 'pointer', color: nistEventsPage >= totalNistPages ? '#cbd5e1' : '#475569' }}>&gt;</button>
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

export default Nist80053;
