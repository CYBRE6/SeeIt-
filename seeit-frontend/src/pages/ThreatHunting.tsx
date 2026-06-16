import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiChevronDown, FiPlus, FiRefreshCw, FiDownload, FiSettings, FiMaximize2, FiX, FiExternalLink, FiCalendar } from 'react-icons/fi';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Filler } from 'chart.js';
import { Doughnut, Line, Bar } from 'react-chartjs-2';
import toast from 'react-hot-toast';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Filler);

const ThreatHunting: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'events'>('dashboard');
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [modalTab, setModalTab] = useState<'table' | 'json'>('table');
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [timeRange, setTimeRange] = useState('Last 24 hours');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showFilterPopover, setShowFilterPopover] = useState(false);
  const [filterField, setFilterField] = useState('agent.name');
  const [filterOperator, setFilterOperator] = useState('is');
  const [filterValue, setFilterValue] = useState('');
  const chartRef = useRef<any>(null);
  const ITEMS_PER_PAGE = 15;

  const eventsData = [
    { timestamp: 'Jun 14, 2026 @ 20:38:28.3...', agent: 'RHEL7', agentId: '001', desc: 'Courier: Multiple connection attempts from same source.', level: 10, id: '3911' },
    { timestamp: 'Jun 14, 2026 @ 20:38:28.3...', agent: 'RHEL7', agentId: '001', desc: 'sshd: Possible attack on the ssh server (or version gathering).', level: 8, id: '5701' },
    { timestamp: 'Jun 14, 2026 @ 20:36:49.5...', agent: 'RHEL7', agentId: '002', desc: 'AWS GuardDuty: AWS_API_CALL - Unusual console login was seen for principal root.', level: 6, id: '80302' },
    { timestamp: 'Jun 14, 2026 @ 20:36:29.6...', agent: 'RHEL7', agentId: '001', desc: 'File "" is a positive match. Yara rule:', level: 11, id: '5191' },
    { timestamp: 'Jun 14, 2026 @ 20:34:23.3...', agent: 'RHEL7', agentId: '003', desc: 'Multiple web server 400 error codes from same source ip.', level: 10, id: '31151' },
    { timestamp: 'Jun 14, 2026 @ 20:33:05.7...', agent: 'RHEL7', agentId: '001', desc: 'Apache: Attempt to access forbidden directory index.', level: 5, id: '30306' },
    { timestamp: 'Jun 14, 2026 @ 20:30:01.3...', agent: 'RHEL7', agentId: '002', desc: 'CVE-2013-4235 affects login', level: 5, id: '23503' },
    { timestamp: 'Jun 14, 2026 @ 20:29:26.9...', agent: 'RHEL7', agentId: '003', desc: 'GCP notice event with source IP 83.32.0.0 from europe-west1 with response code NXDOMAIN', level: 5, id: '65010' },
    { timestamp: 'Jun 14, 2026 @ 20:29:20.5...', agent: 'RHEL7', agentId: '001', desc: 'sshd: insecure connection attempt (scan).', level: 6, id: '5706' },
    { timestamp: 'Jun 14, 2026 @ 20:28:22.3...', agent: 'RHEL7', agentId: '002', desc: 'Host-based anomaly detection event (rootcheck).', level: 7, id: '510' },
    { timestamp: 'Jun 14, 2026 @ 20:26:43.2...', agent: 'RHEL7', agentId: '001', desc: 'Audit: Command: /usr/sbin/bash', level: 3, id: '80784' },
    { timestamp: 'Jun 14, 2026 @ 20:24:53.0...', agent: 'RHEL7', agentId: '003', desc: 'CVE-2019-13050 affects gnupg', level: 10, id: '23505' },
    { timestamp: 'Jun 14, 2026 @ 20:21:45.2...', agent: 'RHEL7', agentId: '002', desc: 'First time user executed sudo.', level: 4, id: '5403' },
    { timestamp: 'Jun 14, 2026 @ 20:19:24.4...', agent: 'RHEL7', agentId: '001', desc: 'Host-based anomaly detection event (rootcheck).', level: 7, id: '510' },
    { timestamp: 'Jun 14, 2026 @ 20:17:20.0...', agent: 'RHEL7', agentId: '003', desc: 'sshd: brute force trying to get access to the system.', level: 10, id: '5712' }
  ];

  const [filters, setFilters] = useState<{ key: string; value: string; enabled: boolean; exclude: boolean }[]>([
    { key: 'manager.name', value: 'saad-cyber6', enabled: true, exclude: false },
    { key: 'agent.id', value: '001', enabled: true, exclude: false }
  ]);

  const totalPages = Math.ceil(eventsData.length / ITEMS_PER_PAGE);

  // Apply filters and search to events data
  const filteredEvents = eventsData.filter(ev => {
    if (search.trim()) {
      const term = search.toLowerCase();
      if (!ev.desc.toLowerCase().includes(term) && !ev.agent.toLowerCase().includes(term) && !ev.id.includes(term)) return false;
    }
    for (const f of filters) {
      if (!f.enabled) continue;
      let matches = true;
      const fieldVal = f.key === 'agent.name' ? ev.agent : f.key === 'rule.id' ? ev.id : f.key === 'rule.level' ? String(ev.level) : ev.desc;
      if (f.key === 'rule.id' || f.key === 'rule.level') {
        matches = fieldVal === f.value;
      } else {
        matches = fieldVal.toLowerCase().includes(f.value.toLowerCase());
      }
      if (f.exclude) matches = !matches;
      if (!matches) return false;
    }
    return true;
  });

  const paginatedEvents = filteredEvents.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const removeFilter = (idx: number) => {
    setFilters(filters.filter((_, i) => i !== idx));
    toast.success('Filter removed');
  };

  const donutOptions = { cutout: '65%', plugins: { legend: { position: 'right' as const, labels: { boxWidth: 10, font: { size: 10 } } } }, maintainAspectRatio: false };
  const areaOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: 'right' as const, labels: { boxWidth: 10, font: { size: 10 } } } },
    scales: { y: { stacked: true }, x: { grid: { display: false } } },
    elements: { line: { tension: 0.4 }, point: { radius: 0 } }
  };

  const top10EvolutionData = {
    labels: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00'],
    datasets: [
      { label: 'syslog', data: [15, 20, 10, 5, 12, 28, 10], borderColor: '#4db6ac', backgroundColor: 'rgba(77, 182, 172, 0.5)', fill: true, borderWidth: 1 },
      { label: 'wazuh', data: [10, 15, 8, 12, 18, 10, 15], borderColor: '#64b5f6', backgroundColor: 'rgba(100, 181, 246, 0.5)', fill: true, borderWidth: 1 },
      { label: 'sshd', data: [5, 8, 15, 10, 20, 5, 8], borderColor: '#f06292', backgroundColor: 'rgba(240, 98, 146, 0.5)', fill: true, borderWidth: 1 },
      { label: 'web', data: [8, 5, 10, 15, 5, 12, 20], borderColor: '#ba68c8', backgroundColor: 'rgba(186, 104, 200, 0.5)', fill: true, borderWidth: 1 },
      { label: 'gcp', data: [12, 10, 5, 8, 15, 20, 5], borderColor: '#ce93d8', backgroundColor: 'rgba(206, 147, 216, 0.5)', fill: true, borderWidth: 1 }
    ]
  };

  const alertsEvolutionData = {
    labels: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00'],
    datasets: [
      { label: '5', data: [20, 15, 25, 10, 15, 30, 20], borderColor: '#d4af37', backgroundColor: 'rgba(212, 175, 55, 0.5)', fill: true, borderWidth: 1 },
      { label: '3', data: [10, 20, 15, 5, 25, 15, 10], borderColor: '#a1887f', backgroundColor: 'rgba(161, 136, 127, 0.5)', fill: true, borderWidth: 1 },
      { label: '7', data: [15, 10, 20, 15, 10, 25, 15], borderColor: '#e67c73', backgroundColor: 'rgba(230, 124, 115, 0.5)', fill: true, borderWidth: 1 },
      { label: '10', data: [5, 25, 10, 20, 15, 10, 25], borderColor: '#d32f2f', backgroundColor: 'rgba(211, 47, 47, 0.5)', fill: true, borderWidth: 1 }
    ]
  };

  const top5AlertsData = { labels: ['File "" is a positive mat...', 'Host-based anomaly c...', 'Apache: Attempt to ac...', 'Web server 400 error...', 'Multiple web server 40...'], datasets: [{ data: [30, 25, 20, 15, 10], backgroundColor: ['#4db6ac', '#64b5f6', '#f06292', '#ba68c8', '#a1887f'], borderWidth: 0 }] };
  const top5RulesData = { labels: ['syslog', 'wazuh', 'sshd', 'web', 'gcp'], datasets: [{ data: [35, 25, 20, 10, 10], backgroundColor: ['#4db6ac', '#64b5f6', '#f06292', '#ba68c8', '#ce93d8'], borderWidth: 0 }] };
  const pciDssData = { labels: ['11.4', '10.2.4', '10.2.5', '11.2.1', '11.2.3'], datasets: [{ data: [40, 30, 15, 10, 5], backgroundColor: ['#ffd54f', '#ffb74d', '#ff8a65', '#e57373', '#f06292'], borderWidth: 0 }] };

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
          <div style={{ display: 'flex', gap: '24px' }}>
            {['dashboard', 'events'].map(tab => (
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
              const report = {
                id: Date.now().toString(),
                name: `Threat Hunting Report ${new Date().toLocaleDateString()}`,
                desc: `Auto-generated threat hunting report with ${filteredEvents.length} events`,
                format: 'PDF',
                created: new Date().toLocaleString(),
                status: 'completed'
              };
              const existing = JSON.parse(localStorage.getItem('wz_reports') || '[]');
              existing.push(report);
              localStorage.setItem('wz_reports', JSON.stringify(existing));
              toast.success('Threat hunting report generated and saved to Reporting');
            }} style={{ background: 'none', border: 'none', color: '#005cca', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
              <FiDownload size={14} /> Generate report
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                <FiSearch size={16} />
              </span>
              <input
                type="text"
                placeholder="Search"
                className="wz-search-input"
                style={{ paddingLeft: '38px', paddingRight: '60px' }}
                value={search}
                onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
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

            <div style={{ position: 'relative' }}>
              <div onClick={() => setShowTimePicker(!showTimePicker)} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                border: '1px solid #cbd5e1',
                borderRadius: '4px',
                padding: '0 12px',
                background: '#ffffff',
                cursor: 'pointer',
                fontSize: '13px',
                color: '#1e293b'
              }}>
                <FiCalendar size={14} style={{ color: '#64748b' }} />
                <span>{timeRange}</span>
                <FiChevronDown size={14} />
              </div>
              {showTimePicker && (
                <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '4px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 10, minWidth: '180px' }}>
                  {['Last 15 minutes', 'Last 30 minutes', 'Last 1 hour', 'Last 24 hours', 'Last 7 days', 'Last 30 days', 'Last 90 days'].map(range => (
                    <div key={range} onClick={() => { setTimeRange(range); setShowTimePicker(false); setCurrentPage(1); toast.success(`Time range: ${range}`); }} style={{ padding: '8px 16px', fontSize: '13px', cursor: 'pointer', color: timeRange === range ? '#005cca' : '#1e293b', background: timeRange === range ? '#f0f7ff' : 'transparent', borderBottom: '1px solid #f1f5f9' }}>
                      {range}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button style={{ background: 'none', border: 'none', color: '#005cca', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
              Show dates
            </button>

            <button
              className="wz-btn-secondary"
              onClick={() => toast.success('Dashboard refreshed successfully')}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <FiRefreshCw size={13} /> Refresh
            </button>
          </div>

          {/* Sample Data Banner */}
          <div style={{
            background: '#fffbeb',
            border: '1px solid #fde68a',
            borderLeft: '4px solid #f59e0b',
            padding: '16px',
            borderRadius: '2px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#b45309', fontWeight: 600, fontSize: '14px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              This dashboard contains sample data
            </div>
            <div style={{ color: '#451a03', fontSize: '13px', marginLeft: '24px' }}>
              The data displayed may contain sample data. Go <span style={{ color: '#005cca', cursor: 'pointer' }}>here</span> to configure the sample data.
            </div>
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
                <span>{f.key}: {f.value}</span>
                <button
                  onClick={() => removeFilter(idx)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#005cca',
                    cursor: 'pointer',
                    fontSize: '12px',
                    padding: '0 0 0 4px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                </button>
              </div>
            ))}

            <button onClick={() => toast.success('Add filter — placeholder')} style={{
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

            {/* Quick Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>

              <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px', textAlign: 'center' }}>
                <div style={{ fontSize: '42px', fontWeight: 700, color: '#14b8a6' }}>1,089</div>
                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 500, marginTop: '4px' }}>- Total -</div>
              </div>

              <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px', textAlign: 'center' }}>
                <div style={{ fontSize: '42px', fontWeight: 700, color: '#e0594a' }}>129</div>
                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 500, marginTop: '4px' }}>- Level 12 or above alerts -</div>
              </div>

              <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px', textAlign: 'center' }}>
                <div style={{ fontSize: '42px', fontWeight: 700, color: '#e0594a' }}>67</div>
                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 500, marginTop: '4px' }}>- Authentication failure -</div>
              </div>

              <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px', textAlign: 'center' }}>
                <div style={{ fontSize: '42px', fontWeight: 700, color: '#14b8a6' }}>15</div>
                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 500, marginTop: '4px' }}>- Authentication success -</div>
              </div>

            </div>

            {/* Evolution Area Charts */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

              {/* Top 10 Alert groups evolution */}
              <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '16px', display: 'flex', flexDirection: 'column' }}>
                <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', marginBottom: '16px', margin: 0 }}>Top 10 Alert groups evolution</h4>
                <div style={{ flex: 1, position: 'relative', minHeight: '220px' }}>
                  <Line data={top10EvolutionData} options={areaOptions} />
                </div>
              </div>

              {/* Alerts Levels spike */}
              <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '16px', display: 'flex', flexDirection: 'column' }}>
                <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', marginBottom: '16px', margin: 0 }}>Alerts</h4>
                <div style={{ flex: 1, position: 'relative', minHeight: '220px' }}>
                  <Line data={alertsEvolutionData} options={areaOptions} />
                </div>
              </div>

            </div>

            {/* Donut distributions row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>

              {/* Top 5 Alerts */}
              <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '16px', display: 'flex', flexDirection: 'column' }}>
                <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', marginBottom: '16px', margin: 0 }}>Top 5 alerts</h4>
                <div style={{ flex: 1, position: 'relative', minHeight: '180px' }}>
                  <Doughnut data={top5AlertsData} options={donutOptions} />
                </div>
              </div>

              {/* Top 5 Rule groups */}
              <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '16px', display: 'flex', flexDirection: 'column' }}>
                <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', marginBottom: '16px', margin: 0 }}>Top 5 rule groups</h4>
                <div style={{ flex: 1, position: 'relative', minHeight: '180px' }}>
                  <Doughnut data={top5RulesData} options={donutOptions} />
                </div>
              </div>

              {/* Top 5 PCI DSS */}
              <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '16px', display: 'flex', flexDirection: 'column' }}>
                <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', marginBottom: '16px', margin: 0 }}>Top 5 PCI DSS Requirements</h4>
                <div style={{ flex: 1, position: 'relative', minHeight: '180px' }}>
                  <Doughnut data={pciDssData} options={donutOptions} />
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ==========================================
            TAB CONTENT: EVENTS
            ========================================== */}
        {activeTab === 'events' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Events histogram bar */}
            <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '16px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ position: 'relative', height: '180px' }}>
                <Bar
                  data={{
                    labels: ['21:00', '00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00'],
                    datasets: [{
                      label: 'Count',
                      data: [22, 25, 20, 26, 21, 23, 26, 22, 27, 24, 15, 19, 21, 11, 14, 23, 26, 22, 20, 23, 26, 21, 19, 15, 29, 21, 19, 20, 21, 16, 19, 22, 23, 22, 30, 22, 16, 6],
                      backgroundColor: '#4db6ac',
                      barPercentage: 0.9,
                      categoryPercentage: 1.0
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                      y: {
                        title: { display: true, text: 'Count', font: { size: 11, weight: 'bold' }, color: '#475569' },
                        grid: { display: false }
                      },
                      x: {
                        title: { display: true, text: 'timestamp per 30 minutes', font: { size: 11, weight: 'bold' }, color: '#475569' },
                        grid: { display: false }
                      }
                    }
                  }}
                />
              </div>
            </div>

            <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '24px' }}>

              <div style={{ textAlign: 'center', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
                <div style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b' }}>{filteredEvents.length.toLocaleString()} hits</div>
                <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '4px' }}>
                  Jun 13, 2026 @ 20:40:16.930 - Jun 14, 2026 @ 20:40:16.930
                </div>
              </div>

              {/* Toolbar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12.5px', color: '#64748b', marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <button
                    onClick={() => {
                      const csv = ['Timestamp,Agent,Description,Level,Rule ID'];
                      filteredEvents.forEach((e: any) => {
                        csv.push(`"${e.timestamp}","${e.agent}","${e.desc}",${e.level},${e.id}`);
                      });
                      const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url; a.download = 'threat-hunting-export.csv'; a.click();
                      URL.revokeObjectURL(url);
                      toast.success(`${filteredEvents.length} events exported to CSV`);
                    }}
                    style={{ background: 'none', border: 'none', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
                  >
                    <FiDownload size={14} /> Export Formatted
                  </button>
                  <button style={{ background: 'none', border: 'none', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'not-allowed' }}>
                    <FiRefreshCw size={14} /> Reset view
                  </button>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><FiSettings size={14} /> <strong>898</strong> available fields ⓘ</span>
                </div>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <button style={{ background: 'none', border: 'none', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                    ▤ Columns
                  </button>
                  <span>Density</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>↕ <strong>1 fields sorted</strong></span>
                  <button style={{ background: 'none', border: 'none', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                    <FiMaximize2 size={14} /> Full screen
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="wz-table-wrapper" style={{ border: 'none' }}>
                <table className="wz-table">
                  <thead>
                    <tr>
                      <th style={{ width: '24px' }}></th>
                      <th>↓ timestamp</th>
                      <th>agent.name</th>
                      <th>rule.description</th>
                      <th>rule.level</th>
                      <th>rule.id</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedEvents.map((ev, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ textAlign: 'center', color: '#005cca', cursor: 'pointer' }} onClick={() => setSelectedEvent(ev)}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
                        </td>
                        <td style={{ fontSize: '12.5px', color: '#334155', whiteSpace: 'nowrap' }}>{ev.timestamp}</td>
                        <td style={{ color: '#005cca', fontWeight: 500, cursor: 'pointer' }} onClick={() => navigate(`/agents/detail?agent=${ev.agentId || '001'}`)}>{ev.agent}</td>
                        <td style={{ color: '#475569' }}>{ev.desc}</td>
                        <td>{ev.level}</td>
                        <td style={{ color: '#005cca', fontWeight: 600, cursor: 'pointer' }} onClick={() => navigate(`/rules?tab=rules&search=${ev.id}`)}>{ev.id}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', fontSize: '12.5px', color: '#475569' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Rows per page: 15 <FiChevronDown />
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <span style={{ cursor: currentPage > 1 ? 'pointer' : 'not-allowed', color: currentPage > 1 ? '#475569' : '#cbd5e1' }} onClick={() => { if (currentPage > 1) { setCurrentPage(currentPage - 1); toast.success(`Page ${currentPage - 1}`); } }}>&lt;</span>
                  {[1, 2, 3, 4, 5].map(p => (
                    <span key={p} onClick={() => { setCurrentPage(p); toast.success(`Page ${p}`); }} style={{ cursor: 'pointer', fontWeight: currentPage === p ? 600 : 400, color: currentPage === p ? '#005cca' : '#475569' }}>{p}</span>
                  ))}
                  <span>...</span>
                  <span style={{ cursor: 'pointer' }} onClick={() => { setCurrentPage(totalPages); toast.success(`Page ${totalPages}`); }}>{totalPages}</span>
                  <span style={{ cursor: currentPage < totalPages ? 'pointer' : 'not-allowed', color: currentPage < totalPages ? '#475569' : '#cbd5e1' }} onClick={() => { if (currentPage < totalPages) { setCurrentPage(currentPage + 1); toast.success(`Page ${currentPage + 1}`); } }}>&gt;</span>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* Document Details Modal Slider */}
      {selectedEvent && (
        <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '600px', background: '#ffffff', boxShadow: '-4px 0 24px rgba(0,0,0,0.1)', zIndex: 1000, display: 'flex', flexDirection: 'column' }}>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #e2e8f0' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 400, color: '#1e293b', margin: 0 }}>Document Details</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button style={{ background: 'none', border: 'none', color: '#005cca', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                View surrounding documents <FiExternalLink />
              </button>
              <button style={{ background: 'none', border: 'none', color: '#005cca', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                View single document <FiExternalLink />
              </button>
              <button onClick={() => setSelectedEvent(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }}>
                <FiX size={20} />
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '24px', padding: '0 24px', borderBottom: '1px solid #e2e8f0' }}>
            <button
              onClick={() => setModalTab('table')}
              style={{ background: 'none', border: 'none', padding: '12px 0', fontSize: '14px', fontWeight: modalTab === 'table' ? 600 : 400, color: modalTab === 'table' ? '#005cca' : '#475569', borderBottom: modalTab === 'table' ? '2px solid #005cca' : '2px solid transparent', cursor: 'pointer' }}
            >
              Table
            </button>
            <button
              onClick={() => setModalTab('json')}
              style={{ background: 'none', border: 'none', padding: '12px 0', fontSize: '14px', fontWeight: modalTab === 'json' ? 600 : 400, color: modalTab === 'json' ? '#005cca' : '#475569', borderBottom: modalTab === 'json' ? '2px solid #005cca' : '2px solid transparent', cursor: 'pointer' }}
            >
              JSON
            </button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
            {modalTab === 'table' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '16px', paddingBottom: '12px', borderBottom: '1px dashed #e2e8f0' }}>
                  <span style={{ color: '#475569', display: 'flex', alignItems: 'center', gap: '8px' }}><span>t</span> @sampledata</span>
                  <span style={{ color: '#1e293b' }}>true</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '16px', paddingBottom: '12px', borderBottom: '1px dashed #e2e8f0' }}>
                  <span style={{ color: '#475569', display: 'flex', alignItems: 'center', gap: '8px' }}><span>t</span> _index</span>
                  <span style={{ color: '#1e293b' }}>wazuh-alerts-4.x-sample-threat-detection</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '16px', paddingBottom: '12px', borderBottom: '1px dashed #e2e8f0' }}>
                  <span style={{ color: '#475569', display: 'flex', alignItems: 'center', gap: '8px' }}><span>t</span> agent.id</span>
                  <span style={{ color: '#005cca', fontWeight: 600, cursor: 'pointer' }} onClick={() => { navigate(`/agents/detail?agent=${selectedEvent.agentId || '001'}`); setSelectedEvent(null); }}>{selectedEvent.agentId || '001'}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '16px', paddingBottom: '12px', borderBottom: '1px dashed #e2e8f0' }}>
                  <span style={{ color: '#475569', display: 'flex', alignItems: 'center', gap: '8px' }}><span>t</span> agent.name</span>
                  <span style={{ color: '#005cca', fontWeight: 600, cursor: 'pointer' }} onClick={() => { navigate(`/agents/detail?agent=${selectedEvent.agentId || '001'}`); setSelectedEvent(null); }}>{selectedEvent.agent}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '16px', paddingBottom: '12px', borderBottom: '1px dashed #e2e8f0' }}>
                  <span style={{ color: '#475569', display: 'flex', alignItems: 'center', gap: '8px' }}><span>t</span> rule.description</span>
                  <span style={{ color: '#1e293b' }}>{selectedEvent.desc}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '16px', paddingBottom: '12px', borderBottom: '1px dashed #e2e8f0' }}>
                  <span style={{ color: '#475569', display: 'flex', alignItems: 'center', gap: '8px' }}><span>t</span> rule.id</span>
                  <span style={{ color: '#1e293b' }}>{selectedEvent.id}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '16px', paddingBottom: '12px', borderBottom: '1px dashed #e2e8f0' }}>
                  <span style={{ color: '#475569', display: 'flex', alignItems: 'center', gap: '8px' }}><span>t</span> rule.level</span>
                  <span style={{ color: '#1e293b' }}>{selectedEvent.level}</span>
                </div>
              </div>
            ) : (
              <pre style={{ background: '#f8fafc', padding: '16px', borderRadius: '4px', fontSize: '13px', color: '#1e293b', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                {JSON.stringify(selectedEvent, null, 2)}
              </pre>
            )}
          </div>

        </div>
      )}
    </div>
  );
};

export default ThreatHunting;
