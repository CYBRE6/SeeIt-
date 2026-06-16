import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiChevronDown, FiPlus, FiRefreshCw, FiDownload, FiSettings, FiMaximize2 } from 'react-icons/fi';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement } from 'chart.js';
import { Doughnut, Line, Bar } from 'react-chartjs-2';
import toast from 'react-hot-toast';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement);

const FileIntegrityMonitoring: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inventory' | 'events'>('dashboard');
  const [selectedFimEvent, setSelectedFimEvent] = useState<any>(null);
  const [fimEventsPage, setFimEventsPage] = useState(1);
  const FIM_EVENTS_PER_PAGE = 15;

  const [filters, setFilters] = useState([
    { key: 'manager.name', value: 'saad-cyber6' },
    { key: 'rule.groups', value: 'syscheck' },
    { key: 'agent.id', value: '001' }
  ]);

  const removeFilter = (idx: number) => {
    setFilters(filters.filter((_, i) => i !== idx));
  };

  const inventoryData = [
    { file: '/bin', modified: 'May 5, 2026 @ 14:36:57.000', user: 'root', uid: '0', group: 'root', gid: '0', size: '7' },
    { file: '/boot/System.map-5.15.0-139-generic', modified: 'Apr 16, 2025 @ 08:48:19.000', user: 'root', uid: '0', group: 'root', gid: '0', size: '6262548' },
    { file: '/boot/System.map-5.4.0-26-generic', modified: 'Apr 20, 2020 @ 16:33:49.000', user: 'root', uid: '0', group: 'root', gid: '0', size: '4736015' },
    { file: '/boot/config-5.15.0-139-generic', modified: 'Apr 16, 2025 @ 08:48:19.000', user: 'root', uid: '0', group: 'root', gid: '0', size: '262530' },
    { file: '/boot/config-5.4.0-26-generic', modified: 'Apr 20, 2020 @ 16:33:49.000', user: 'root', uid: '0', group: 'root', gid: '0', size: '237718' },
    { file: '/boot/grub/fonts/unicode.pf2', modified: 'May 5, 2026 @ 14:48:23.000', user: 'root', uid: '0', group: 'root', gid: '0', size: '2395475' },
    { file: '/boot/grub/gfxblacklist.txt', modified: 'Apr 23, 2020 @ 07:38:56.000', user: 'root', uid: '0', group: 'root', gid: '0', size: '712' },
    { file: '/boot/grub/grub.cfg', modified: 'May 5, 2026 @ 14:53:28.000', user: 'root', uid: '0', group: 'root', gid: '0', size: '9234' },
    { file: '/boot/grub/grubenv', modified: 'Jun 11, 2026 @ 12:41:42.000', user: 'root', uid: '0', group: 'root', gid: '0', size: '1024' },
    { file: '/boot/grub/i386-pc/915resolution.mod', modified: 'May 5, 2026 @ 14:48:22.000', user: 'root', uid: '0', group: 'root', gid: '0', size: '8016' },
    { file: '/boot/grub/i386-pc/acpi.mod', modified: 'May 5, 2026 @ 14:48:22.000', user: 'root', uid: '0', group: 'root', gid: '0', size: '10764' },
    { file: '/boot/grub/i386-pc/adler32.mod', modified: 'May 5, 2026 @ 14:48:22.000', user: 'root', uid: '0', group: 'root', gid: '0', size: '1396' },
  ];

  const eventsData = [
    { timestamp: 'Jun 14, 2026 @ 20:34:51.1...', agent: 'Amazon', path: '/var/log/lastlog', event: 'deleted', desc: 'File deleted.', level: 7, id: '553' },
    { timestamp: 'Jun 14, 2026 @ 20:31:09.4...', agent: 'Debian', path: '/etc/elasticsearch/elasticsearch.yml', event: 'deleted', desc: 'File deleted.', level: 7, id: '553' },
    { timestamp: 'Jun 14, 2026 @ 20:21:51.1...', agent: 'Windows', path: '[x32] HKEY_LOCAL_MACHINE\\System\\CurrentControlS...', event: 'modified', desc: 'Integrity checksum changed.', level: 7, id: '550' },
    { timestamp: 'Jun 14, 2026 @ 20:21:31.8...', agent: 'Ubuntu', path: '/tmp/wazuh-config', event: 'added', desc: 'File added to the system.', level: 5, id: '554' },
    { timestamp: 'Jun 14, 2026 @ 20:19:46.2...', agent: 'Amazon', path: '/var/wazuh/queue/fim/db/fim.db', event: 'modified', desc: 'Integrity checksum changed.', level: 7, id: '550' },
    { timestamp: 'Jun 14, 2026 @ 20:19:12.6...', agent: 'ip-10-0-0-180...', path: '/tmp/wazuh-config', event: 'modified', desc: 'Integrity checksum changed.', level: 7, id: '550' },
    { timestamp: 'Jun 14, 2026 @ 20:18:26.7...', agent: 'Windows', path: '[x32] HKEY_LOCAL_MACHINE\\System\\CurrentControlS...', event: 'modified', desc: 'Integrity checksum changed.', level: 7, id: '550' },
    { timestamp: 'Jun 14, 2026 @ 20:17:52.8...', agent: 'Centos', path: '/etc/resolv.conf', event: 'added', desc: 'File added to the system.', level: 5, id: '554' },
    { timestamp: 'Jun 14, 2026 @ 20:16:45.9...', agent: 'Amazon', path: '/var/wazuh/queue/fim/db/fim.db', event: 'modified', desc: 'Integrity checksum changed.', level: 7, id: '550' },
    { timestamp: 'Jun 14, 2026 @ 20:13:01.7...', agent: 'Amazon', path: '/etc/resolv.conf', event: 'modified', desc: 'Integrity checksum changed.', level: 7, id: '550' }
  ];
  const totalFimPages = Math.ceil(eventsData.length / FIM_EVENTS_PER_PAGE);
  const pagedFimEvents = eventsData.slice((fimEventsPage - 1) * FIM_EVENTS_PER_PAGE, fimEventsPage * FIM_EVENTS_PER_PAGE);

  const donutOptions = {
    cutout: '65%',
    plugins: {
      legend: { position: 'right' as const, labels: { boxWidth: 10, font: { size: 10 } } }
    },
    maintainAspectRatio: false
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'right' as const, labels: { boxWidth: 10, font: { size: 11 } } } },
    scales: {
      y: { min: 0, max: 2, ticks: { stepSize: 0.5 } },
      x: { grid: { display: false } }
    }
  };

  const activeUsersData = {
    labels: ['SYSTEM (25%)', 'root (25%)', 'Administrators (22.5%)', 'NETWORK Service (15%)', 'LOCAL Service (12.5%)'],
    datasets: [{
      data: [25, 25, 22.5, 15, 12.5],
      backgroundColor: ['#eab308', '#4ade80', '#ec4899', '#3b82f6', '#a855f7'],
      borderWidth: 0
    }]
  };

  const actionsData = {
    labels: ['deleted (35.85%)', 'modified (33.96%)', 'added (30.19%)'],
    datasets: [{
      data: [35.85, 33.96, 30.19],
      backgroundColor: ['#d97706', '#f59e0b', '#8b5cf6'],
      borderWidth: 0
    }]
  };

  const filesAddedData = {
    labels: ['/var/osquery/osquery.db/CURRENT', '/etc/elasticsearch/elasticsearch.yml', '/etc/resolv.conf', '/run/utmp'],
    datasets: [{ data: [40, 20, 20, 20], backgroundColor: ['#ef4444', '#f472b6', '#eab308', '#d97706'], borderWidth: 0 }]
  };

  const filesModifiedData = {
    labels: ['/etc/elasticsearch/elasticsearch.yml', '/var/wazuh/queue/fim/db/fim.db'],
    datasets: [{ data: [50, 50], backgroundColor: ['#ec4899', '#3b82f6'], borderWidth: 0 }]
  };

  const filesDeletedData = {
    labels: ['/etc/elasticsearch/elasticsearch.yml', '/etc/resolv.conf', '/run/utmp', '/etc/filebeat/fields.yml'],
    datasets: [{ data: [25, 25, 25, 25], backgroundColor: ['#ec4899', '#eab308', '#d97706', '#8b5cf6'], borderWidth: 0 }]
  };

  const eventsLineData = {
    labels: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00'],
    datasets: [
      { label: 'deleted', data: [1, 1, 1, 1, 2, 1, 2], borderColor: '#d97706', tension: 0, fill: false, borderWidth: 1.5, pointRadius: 2 },
      { label: 'modified', data: [1, 2, 1, 1, 2, 2, 1], borderColor: '#f59e0b', tension: 0, fill: false, borderWidth: 1.5, pointRadius: 2 },
      { label: 'added', data: [1, 1, 1, 1, 2, 1, 2], borderColor: '#8b5cf6', tension: 0, fill: false, borderWidth: 1.5, pointRadius: 2 }
    ]
  };

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
            {['dashboard', 'inventory', 'events'].map(tab => (
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
              const reports = JSON.parse(localStorage.getItem('wz_reports') || '[]');
              reports.push({ id: `report-${Date.now()}`, name: 'FIM Report', type: 'fim', date: new Date().toISOString().split('T')[0], format: 'PDF' });
              localStorage.setItem('wz_reports', JSON.stringify(reports));
              toast.success('Report generated');
            }} style={{ background: 'none', border: 'none', color: '#005cca', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
              <FiDownload size={14} /> Generate report
            </button>
          </div>
        </div>

        {/* Dashboard and Events Tabs Share the DQL filter layout */}
        {(activeTab === 'dashboard' || activeTab === 'events') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
            {/* Search + Action bar */}
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

              {/* Datepicker Mock */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                border: '1px solid #cbd5e1', 
                borderRadius: '4px', 
                padding: '0 12px',
                background: '#ffffff',
                fontSize: '13px',
                color: '#1e293b',
                cursor: 'pointer'
              }}>
                <span style={{ color: '#64748b' }}>📅</span>
                <span>Last 24 hours</span>
                <FiChevronDown size={14} />
              </div>

              {/* Show dates toggle */}
              <button style={{ background: 'none', border: 'none', color: '#005cca', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                Show dates
              </button>

              {/* Refresh button */}
              <button 
                className="wz-btn-secondary" 
                onClick={() => toast.success('Dashboard refreshed successfully')}
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <FiRefreshCw size={13} /> Refresh
              </button>
            </div>

            {/* Filter pills row */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
              {filters.map((f, idx) => (
                <div key={idx} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  border: '1px solid #cbd5e1', 
                  borderRadius: '4px', 
                  padding: '2px 8px', 
                  background: '#ffffff',
                  fontSize: '12px',
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

              <button 
                onClick={() => toast('Filter builder opening...', { icon: '🔧' })}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: '#005cca', 
                  fontSize: '12.5px', 
                  fontWeight: 600, 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '4px', 
                  cursor: 'pointer' 
                }}
              >
                <FiPlus size={14} /> Add filter
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
          </div>
        )}

        {/* ==========================================
            TAB CONTENT: DASHBOARD
            ========================================== */}
        {activeTab === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Top row charts */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr) minmax(0, 2fr)', gap: '16px' }}>
              
              {/* Most Active Users */}
              <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '16px', display: 'flex', flexDirection: 'column' }}>
                <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', marginBottom: '16px', margin: 0 }}>Most active users</h4>
                <div style={{ flex: 1, position: 'relative', minHeight: '180px' }}>
                  <Doughnut data={activeUsersData} options={donutOptions} />
                </div>
              </div>

              {/* Actions */}
              <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '16px', display: 'flex', flexDirection: 'column' }}>
                <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', marginBottom: '16px', margin: 0 }}>Actions</h4>
                <div style={{ flex: 1, position: 'relative', minHeight: '180px' }}>
                  <Doughnut data={actionsData} options={donutOptions} />
                </div>
              </div>

              {/* Events Graph */}
              <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '16px', display: 'flex', flexDirection: 'column' }}>
                <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', margin: 0, marginBottom: '16px' }}>Events</h4>
                <div style={{ flex: 1, position: 'relative', minHeight: '180px' }}>
                  <Line data={eventsLineData} options={lineOptions} />
                </div>
              </div>

            </div>

            {/* Bottom row cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              
              {/* Files Added */}
              <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '16px', display: 'flex', flexDirection: 'column' }}>
                <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', marginBottom: '16px', margin: 0 }}>Files added</h4>
                <div style={{ flex: 1, position: 'relative', minHeight: '180px' }}>
                  <Doughnut data={filesAddedData} options={donutOptions} />
                </div>
              </div>

              {/* Files Modified */}
              <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '16px', display: 'flex', flexDirection: 'column' }}>
                <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', marginBottom: '16px', margin: 0 }}>Files modified</h4>
                <div style={{ flex: 1, position: 'relative', minHeight: '180px' }}>
                  <Doughnut data={filesModifiedData} options={donutOptions} />
                </div>
              </div>

              {/* Files Deleted */}
              <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '16px', display: 'flex', flexDirection: 'column' }}>
                <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', marginBottom: '16px', margin: 0 }}>Files deleted</h4>
                <div style={{ flex: 1, position: 'relative', minHeight: '180px' }}>
                  <Doughnut data={filesDeletedData} options={donutOptions} />
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ==========================================
            TAB CONTENT: INVENTORY
            ========================================== */}
        {activeTab === 'inventory' && (
          <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '24px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b', margin: 0 }}>
                Files <span style={{ color: '#64748b', fontWeight: 400 }}>(5,040)</span>
              </h3>
              
              <div style={{ display: 'flex', gap: '16px', fontSize: '13px' }}>
                <button onClick={() => toast.success('Files refreshed')} style={{ background: 'none', border: 'none', color: '#005cca', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontWeight: 600 }}>
                  <FiRefreshCw size={13} /> Refresh
                </button>
                <button onClick={() => toast.success('File list exported')} style={{ background: 'none', border: 'none', color: '#005cca', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontWeight: 600 }}>
                  <FiDownload size={13} /> Export formatted
                </button>
                <button style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                  <FiSettings size={14} />
                </button>
              </div>
            </div>

            {/* Search Input Box */}
            <div style={{ position: 'relative', marginBottom: '20px' }}>
              <input 
                type="text" 
                placeholder="Search" 
                className="wz-search-input"
                style={{ paddingRight: '60px' }}
              />
              <span style={{ 
                position: 'absolute', 
                right: '12px', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                fontSize: '12px', 
                fontWeight: 600, 
                color: '#005cca', 
                cursor: 'pointer' 
              }}>
                WQL
              </span>
            </div>

            {/* Inventory Table */}
            <div className="wz-table-wrapper" style={{ border: 'none' }}>
              <table className="wz-table">
                <thead>
                  <tr>
                    <th>File ↑</th>
                    <th>Last modified</th>
                    <th>User</th>
                    <th>User ID</th>
                    <th>Group</th>
                    <th>Group ID</th>
                    <th>Size</th>
                  </tr>
                </thead>
                <tbody>
                  {inventoryData.map((row, idx) => (
                    <tr key={idx}>
                      <td style={{ color: '#005cca', cursor: 'pointer', fontWeight: 500 }}>{row.file}</td>
                      <td>{row.modified}</td>
                      <td>{row.user}</td>
                      <td>{row.uid}</td>
                      <td>{row.group}</td>
                      <td>{row.gid}</td>
                      <td>{row.size}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* ==========================================
            TAB CONTENT: EVENTS
            ========================================== */}
        {activeTab === 'events' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Histogram bar chart */}
            <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '16px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ position: 'relative', height: '180px' }}>
                <Bar 
                  data={{
                    labels: ['21:00', '00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00'],
                    datasets: [{
                      label: 'Count',
                      data: [100, 20, 50, 10, 30, 1200, 1000, 600, 200, 0, 150],
                      backgroundColor: '#4db6ac',
                      barPercentage: 0.8,
                      categoryPercentage: 0.9
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

            {/* Interactive table box */}
            <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '24px' }}>
              
              {/* Hit Counter + Dates Range label */}
              <div style={{ textAlign: 'center', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
                <div style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b' }}>3,643 hits</div>
                <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '4px' }}>
                  Jun 13, 2026 @ 20:37:13.318 - Jun 14, 2026 @ 20:37:13.318
                </div>
              </div>

              {/* Action Toolbar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12.5px', color: '#64748b', marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <button 
                    onClick={() => toast.success('CSV Export downloaded')}
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

              {/* Hits Table Grid */}
              <div className="wz-table-wrapper" style={{ border: 'none' }}>
                <table className="wz-table">
                  <thead>
                    <tr>
                      <th style={{ width: '24px' }}></th>
                      <th>↓ timestamp</th>
                      <th>agent.name</th>
                      <th>syscheck.path</th>
                      <th>syscheck.event</th>
                      <th>rule.description</th>
                      <th>rule.level</th>
                      <th>rule.id</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedFimEvents.map((row, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ textAlign: 'center', color: '#005cca', cursor: 'pointer' }} onClick={() => setSelectedFimEvent(row)}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
                        </td>
                        <td style={{ fontSize: '12.5px', color: '#334155', whiteSpace: 'nowrap' }}>{row.timestamp}</td>
                        <td style={{ color: '#005cca', fontWeight: 500, cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); navigate(`/agents/detail?agent=${row.agent}`); }}>{row.agent}</td>
                        <td style={{ fontFamily: 'monospace', fontSize: '12px', color: '#334155' }}>{row.path}</td>
                        <td>{row.event}</td>
                        <td style={{ color: '#475569' }}>{row.desc}</td>
                        <td>{row.level}</td>
                        <td style={{ color: '#005cca', fontWeight: 600 }}>{row.id}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', fontSize: '12.5px', color: '#475569' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Rows per page: {FIM_EVENTS_PER_PAGE} <FiChevronDown />
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <span onClick={() => setFimEventsPage(prev => Math.max(1, prev - 1))} style={{ cursor: fimEventsPage <= 1 ? 'not-allowed' : 'pointer', color: fimEventsPage <= 1 ? '#cbd5e1' : '#475569' }}>&lt;</span>
                  {Array.from({ length: totalFimPages }, (_, i) => i + 1).map(p => (
                    <span key={p} onClick={() => setFimEventsPage(p)} style={{ cursor: 'pointer', fontWeight: p === fimEventsPage ? 600 : 400, color: p === fimEventsPage ? '#005cca' : '#475569' }}>{p}</span>
                  ))}
                  <span onClick={() => setFimEventsPage(prev => Math.min(totalFimPages, prev + 1))} style={{ cursor: fimEventsPage >= totalFimPages ? 'not-allowed' : 'pointer', color: fimEventsPage >= totalFimPages ? '#cbd5e1' : '#475569' }}>&gt;</span>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* Event detail modal */}
        {selectedFimEvent && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setSelectedFimEvent(null)}>
            <div onClick={e => e.stopPropagation()} style={{ background: '#ffffff', borderRadius: '8px', width: '520px', maxHeight: '80vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #e2e8f0' }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>Event details</h3>
                <span onClick={() => setSelectedFimEvent(null)} style={{ cursor: 'pointer', color: '#94a3b8', fontSize: '18px' }}>×</span>
              </div>
              <div style={{ padding: '20px 24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '10px 16px', fontSize: '13px' }}>
                  {[
                    ['Timestamp', selectedFimEvent.timestamp],
                    ['Agent', selectedFimEvent.agent],
                    ['Path', selectedFimEvent.path],
                    ['Event', selectedFimEvent.event],
                    ['Description', selectedFimEvent.desc],
                    ['Level', selectedFimEvent.level],
                    ['Rule ID', selectedFimEvent.id],
                  ].map(([label, value]) => (
                    <>
                      <div style={{ color: '#64748b', fontWeight: 600 }}>{label}</div>
                      <div style={{ color: '#0f172a', wordBreak: 'break-all' }}>{value}</div>
                    </>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', padding: '16px 24px', borderTop: '1px solid #e2e8f0' }}>
                <button onClick={() => { toast.success('Generating report...'); setSelectedFimEvent(null); }} style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '7px 16px', fontSize: '12.5px', fontWeight: 600, cursor: 'pointer', color: '#334155' }}>Generate report</button>
                <button onClick={() => { setSelectedFimEvent(null); }} style={{ background: '#005cca', border: 'none', borderRadius: '4px', padding: '7px 16px', fontSize: '12.5px', fontWeight: 600, cursor: 'pointer', color: '#ffffff' }}>Close</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default FileIntegrityMonitoring;
