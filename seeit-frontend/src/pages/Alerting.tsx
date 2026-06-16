import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FiSearch, FiChevronDown, FiPlus, FiExternalLink, FiSettings, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

const mockAlertRows = [
  { id: 'alert-1', alert: 'SSH Brute Force detected', active: 3, ack: 1, errors: 0, trigger: 'SSH Brute Force Monitor', startTime: 'Jun 10, 2026 @ 13:23', lastUpdated: 'Jun 11, 2026 @ 13:23', severity: 'High', monitor: 'SSH Monitor' },
  { id: 'alert-2', alert: 'Malware signature match', active: 1, ack: 0, errors: 2, trigger: 'Malware Detection Rule', startTime: 'Jun 9, 2026 @ 10:15', lastUpdated: 'Jun 11, 2026 @ 08:12', severity: 'Critical', monitor: 'Malware Monitor' },
  { id: 'alert-3', alert: 'File integrity change', active: 5, ack: 3, errors: 0, trigger: 'FIM Rule', startTime: 'Jun 8, 2026 @ 22:00', lastUpdated: 'Jun 11, 2026 @ 12:45', severity: 'Medium', monitor: 'FIM Monitor' },
];

const Alerting: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = (searchParams.get('tab') as 'alerts' | 'monitors' | 'destinations') || 'alerts';
  const [isCreating, setIsCreating] = useState(false);
  const [selectedAlerts, setSelectedAlerts] = useState<string[]>([]);
  const [detailAlert, setDetailAlert] = useState<any>(null);
  const [severityFilter, setSeverityFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [acknowledged, setAcknowledged] = useState<Record<string, boolean>>({});
  const [monitorName, setMonitorName] = useState('');
  const [monitors, setMonitors] = useState<any[]>(() => {
    const saved = localStorage.getItem('wz_alerting_monitors');
    return saved ? JSON.parse(saved) : [];
  });


  const filteredAlerts = mockAlertRows.filter(row => {
    const matchSeverity = severityFilter === 'all' || row.severity === severityFilter;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || row.alert.toLowerCase().includes(q) || row.trigger.toLowerCase().includes(q) || row.monitor.toLowerCase().includes(q);
    return matchSeverity && matchSearch;
  });

  const mockTimeline = [
    { time: 'Jun 11, 2026 @ 13:23:45', event: 'Alert last updated', detail: 'Trigger condition re-evaluated' },
    { time: 'Jun 11, 2026 @ 08:12:30', event: 'Acknowledged', detail: 'User admin acknowledged alert' },
    { time: 'Jun 10, 2026 @ 13:23:00', event: 'Alert triggered', detail: 'Monitor condition matched' },
  ];

  const setActiveTab = (tab: 'alerts' | 'monitors' | 'destinations') => {
    setSearchParams({ tab });
  };

  if (isCreating) {
    return (
      <div className="wz-page" style={{ background: '#f8fafc', paddingBottom: '80px' }}>
        
        {/* Breadcrumb-style tabs */}
        <div style={{ display: 'flex', padding: '16px 24px', background: '#ffffff', borderBottom: '1px solid #e2e8f0', gap: '8px' }}>
          <div style={{ padding: '4px 12px', background: '#e2e8f0', borderRadius: '16px', fontSize: '13px', color: '#475569', cursor: 'pointer' }} onClick={() => setIsCreating(false)}>Alerting</div>
          <div style={{ padding: '4px 12px', background: '#e2e8f0', borderRadius: '16px', fontSize: '13px', color: '#475569', cursor: 'pointer' }} onClick={() => setIsCreating(false)}>Monitors</div>
          <div style={{ padding: '4px 12px', background: '#dbeafe', borderRadius: '16px', fontSize: '13px', color: '#1e3a8a', fontWeight: 600 }}>Create monitor</div>
        </div>

        <div className="wz-page-content" style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 300, color: '#1e293b', margin: '0 0 24px 0' }}>Create monitor</h1>

          {/* Monitor Details */}
          <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '24px', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 300, color: '#1e293b', margin: '0 0 16px 0' }}>Monitor details</h2>
            <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '0 -24px 24px -24px' }} />

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Monitor name</label>
              <input type="text" value={monitorName} onChange={e => setMonitorName(e.target.value)} style={{ width: '300px', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none' }} />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Monitor type</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                <div style={{ border: '2px solid #005cca', borderRadius: '4px', padding: '16px', background: '#eff6ff', cursor: 'pointer', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <input type="radio" checked readOnly style={{ accentColor: '#005cca', marginTop: '4px' }} />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Per query monitor</div>
                    <div style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5 }}>Per query monitors run a query and generate alerts based on trigger criteria that match query results.</div>
                  </div>
                </div>
                <div style={{ border: '1px solid #cbd5e1', borderRadius: '4px', padding: '16px', background: '#ffffff', cursor: 'pointer', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <input type="radio" readOnly style={{ accentColor: '#005cca', marginTop: '4px' }} />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Per bucket monitor</div>
                    <div style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5 }}>Per bucket monitors run a query that evaluates trigger criteria based on aggregated values in the dataset.</div>
                  </div>
                </div>
                <div style={{ border: '1px solid #cbd5e1', borderRadius: '4px', padding: '16px', background: '#ffffff', cursor: 'pointer', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <input type="radio" readOnly style={{ accentColor: '#005cca', marginTop: '4px' }} />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Per cluster metrics monitor</div>
                    <div style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5 }}>Per cluster metrics monitors run API requests to monitor the cluster's health.</div>
                  </div>
                </div>
                <div style={{ border: '1px solid #cbd5e1', borderRadius: '4px', padding: '16px', background: '#ffffff', cursor: 'pointer', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <input type="radio" readOnly style={{ accentColor: '#005cca', marginTop: '4px' }} />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Per document monitor</div>
                    <div style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5 }}>Per document monitors run queries that return individual documents matching the trigger conditions.</div>
                  </div>
                </div>
                <div style={{ border: '1px solid #cbd5e1', borderRadius: '4px', padding: '16px', background: '#ffffff', cursor: 'pointer', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <input type="radio" readOnly style={{ accentColor: '#005cca', marginTop: '4px' }} />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Composite monitor</div>
                    <div style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5 }}>Composite monitors chain the outputs of different monitor types and focus trigger conditions to reduce alert noise and generate finer results.</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>Monitor defining method</label>
              <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px' }}>Specify the way you want to define your query and triggers. <a href="#" style={{ color: '#005cca', textDecoration: 'none' }}>Learn more <FiExternalLink size={12} /></a></div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ border: '2px solid #005cca', borderRadius: '4px', padding: '12px 24px', background: '#eff6ff', cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input type="radio" checked readOnly style={{ accentColor: '#005cca' }} />
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>Visual editor</span>
                </div>
                <div style={{ border: '1px solid #cbd5e1', borderRadius: '4px', padding: '12px 24px', background: '#ffffff', cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input type="radio" readOnly style={{ accentColor: '#005cca' }} />
                  <span style={{ fontSize: '13px', color: '#334155' }}>Extraction query editor</span>
                </div>
                <div style={{ border: '1px solid #cbd5e1', borderRadius: '4px', padding: '12px 24px', background: '#ffffff', cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input type="radio" readOnly style={{ accentColor: '#005cca' }} />
                  <span style={{ fontSize: '13px', color: '#334155' }}>Anomaly detector</span>
                </div>
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '24px', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 300, color: '#1e293b', margin: '0 0 16px 0' }}>Schedule</h2>
            <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '0 -24px 24px -24px' }} />

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Frequency</label>
              <select style={{ width: '300px', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none', background: '#ffffff' }}>
                <option>By interval</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Run every</label>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '8px 12px', width: '120px' }}>
                  <FiSettings size={14} color="#94a3b8" style={{ marginRight: '8px' }} />
                  <input type="number" defaultValue={1} style={{ border: 'none', outline: 'none', width: '100%', fontSize: '13px' }} />
                </div>
              </div>
              <div style={{ marginTop: '26px' }}>
                <select style={{ width: '150px', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none', background: '#ffffff' }}>
                  <option>Minute(s)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Select Data */}
          <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '24px', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 300, color: '#1e293b', margin: '0 0 16px 0' }}>Select data</h2>
            <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '0 -24px 24px -24px' }} />

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>Select clusters</label>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>Select a local cluster or remote clusters from cross-cluster connections. <a href="#" style={{ color: '#005cca', textDecoration: 'none' }}>Learn more <FiExternalLink size={12} /></a></div>
              <select style={{ width: '400px', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none', background: '#ffffff' }}>
                <option>wazuh-cluster (Local)</option>
              </select>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>Indexes</label>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>Select one or more indexes or wildcard patterns</div>
              <div style={{ position: 'relative', width: '400px' }}>
                <select style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none', background: '#ffffff', appearance: 'none' }}>
                  <option></option>
                </select>
                <FiChevronDown style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '8px', lineHeight: 1.5, maxWidth: '400px' }}>You can use * as a wildcard or date math index resolution in your index pattern.</div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Time field</label>
              <div style={{ position: 'relative', width: '400px' }}>
                <select style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none', background: '#ffffff', appearance: 'none', color: '#94a3b8' }}>
                  <option>Select a time field</option>
                </select>
                <FiChevronDown style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '8px' }}>Choose the time field you want to use for your x-axis</div>
            </div>
          </div>

          {/* Query */}
          <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '24px', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 300, color: '#1e293b', margin: '0 0 16px 0' }}>Query</h2>
            <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '0 -24px 24px -24px' }} />

            <div style={{ height: '300px', border: '1px solid #e2e8f0', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa' }}>
              <span style={{ color: '#94a3b8', fontSize: '14px' }}>You must specify an index.</span>
            </div>
          </div>

          {/* Triggers */}
          <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '24px', marginBottom: '80px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 300, color: '#1e293b', margin: '0 0 16px 0' }}>Triggers (0)</h2>
            <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '0 -24px 24px -24px' }} />

            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b', margin: '0 0 8px 0' }}>No triggers</h4>
              <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 16px 0' }}>Add a trigger to define conditions and actions.</p>
              <button className="wz-btn-secondary" style={{ borderColor: '#005cca', color: '#005cca' }}>Add trigger</button>
            </div>
          </div>
        </div>

        {/* Fixed Footer */}
        <div style={{ position: 'fixed', bottom: 0, left: 250, right: 0, background: '#ffffff', borderTop: '1px solid #e2e8f0', padding: '16px 24px', display: 'flex', justifyContent: 'flex-end', gap: '12px', zIndex: 10 }}>
          <button onClick={() => setIsCreating(false)} style={{ background: 'none', border: 'none', color: '#005cca', fontWeight: 600, fontSize: '13px', cursor: 'pointer', padding: '8px 16px' }}>Cancel</button>
          <button className="wz-btn" style={{ fontWeight: 600, padding: '8px 24px' }} onClick={() => {
            const name = monitorName.trim() || `Monitor ${monitors.length + 1}`;
            const newMonitor = { id: `monitor-${Date.now()}`, name, state: 'enabled', type: 'Per query monitor', latestAlert: '-', lastNotification: '-', active: 0, acknowledged: 0, errors: 0, ignored: 0, associations: '-' };
            const updated = [...monitors, newMonitor];
            setMonitors(updated);
            localStorage.setItem('wz_alerting_monitors', JSON.stringify(updated));
            toast.success(`Monitor "${name}" created`);
            setIsCreating(false);
            setSearchParams({ tab: 'monitors' });
          }}>Create</button>
        </div>
      </div>
    );
  }

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
          marginTop: '-24px'
        }}>
          {['alerts', 'monitors', 'destinations'].map(tab => (
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

        {/* ALERTS TAB */}
        {activeTab === 'alerts' && (
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 500, color: '#1e293b', margin: '0 0 16px 0' }}>
              Alerts by triggers
            </h2>

            <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '24px 32px' }}>
              {/* Top Filters & Action Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', flex: 1, gap: '12px' }}>
                  <div style={{ flex: 1, position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                      <FiSearch size={14} />
                    </span>
                    <input 
                      type="text" 
                      placeholder="Search alerts..." 
                      className="wz-search-input"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      style={{ paddingLeft: '38px', fontSize: '13px' }}
                    />
                  </div>
                  <select className="wz-select" style={{ width: '180px' }} value={severityFilter} onChange={e => setSeverityFilter(e.target.value)}>
                    <option value="all">All severity levels</option>
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                  <select className="wz-select" style={{ width: '130px' }}>
                    <option>All alerts</option>
                  </select>
                </div>
                
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    disabled={selectedAlerts.length !== 1}
                    onClick={() => {
                      if (selectedAlerts.length === 1) {
                        const alert = filteredAlerts.find(r => r.id === selectedAlerts[0]);
                        if (alert) setDetailAlert(alert);
                      }
                    }}
                    className="wz-btn-secondary"
                    style={{
                      borderColor: selectedAlerts.length === 1 ? '#005cca' : '#cbd5e1',
                      color: selectedAlerts.length === 1 ? '#005cca' : '#94a3b8',
                      background: selectedAlerts.length === 1 ? '#ffffff' : '#f8fafc',
                      cursor: selectedAlerts.length === 1 ? 'pointer' : 'not-allowed',
                      fontWeight: 600
                    }}
                  >
                    View alert details
                  </button>
                  <button
                    disabled={selectedAlerts.length === 0}
                    onClick={() => {
                      if (selectedAlerts.length > 0) {
                        const updated = { ...acknowledged };
                        selectedAlerts.forEach(id => { updated[id] = true; });
                        setAcknowledged(updated);
                        toast.success(`${selectedAlerts.length} alert(s) acknowledged`);
                        setSelectedAlerts([]);
                      }
                    }}
                    className="wz-btn-secondary"
                    style={{
                      borderColor: selectedAlerts.length > 0 ? '#005cca' : '#cbd5e1',
                      color: selectedAlerts.length > 0 ? '#005cca' : '#94a3b8',
                      background: selectedAlerts.length > 0 ? '#ffffff' : '#f8fafc',
                      cursor: selectedAlerts.length > 0 ? 'pointer' : 'not-allowed',
                      fontWeight: 600
                    }}
                  >
                    Acknowledge
                  </button>
                </div>
              </div>

              {/* Alerts Table */}
              <div className="wz-table-wrapper" style={{ border: 'none' }}>
                <table className="wz-table">
                  <thead>
                    <tr>
                      <th style={{ width: '30px' }}>
                        <input
                          type="checkbox"
                          checked={selectedAlerts.length === mockAlertRows.length}
                          onChange={() => {
                            if (selectedAlerts.length === mockAlertRows.length) {
                              setSelectedAlerts([]);
                            } else {
                              setSelectedAlerts(mockAlertRows.map(r => r.id));
                            }
                          }}
                        />
                      </th>
                      <th>Alerts</th>
                      <th>Active</th>
                      <th>Acknowledged</th>
                      <th>Errors</th>
                      <th>Trigger name</th>
                      <th>Trigger start time ▽</th>
                      <th>Trigger last updated</th>
                      <th>Severity</th>
                      <th>Monitor name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAlerts.map(row => (
                      <tr key={row.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                          <input
                            type="checkbox"
                            checked={selectedAlerts.includes(row.id)}
                            onChange={() => {
                              setSelectedAlerts(prev =>
                                prev.includes(row.id)
                                  ? prev.filter(id => id !== row.id)
                                  : [...prev, row.id]
                              );
                            }}
                          />
                        </td>
                        <td style={{ padding: '10px 14px', color: '#005cca', fontWeight: 600, cursor: 'pointer' }} onClick={() => navigate(`/events?search=${encodeURIComponent(row.alert)}`)}>{row.alert}</td>
                        <td style={{ padding: '10px 14px' }}>{row.active}</td>
                        <td style={{ padding: '10px 14px' }}>{row.ack}</td>
                        <td style={{ padding: '10px 14px' }}>{row.errors}</td>
                        <td style={{ padding: '10px 14px' }}>{row.trigger}</td>
                        <td style={{ padding: '10px 14px', whiteSpace: 'nowrap' }}>{row.startTime}</td>
                        <td style={{ padding: '10px 14px', whiteSpace: 'nowrap' }}>{row.lastUpdated}</td>
                        <td style={{ padding: '10px 14px', fontWeight: 600, color: row.severity === 'Critical' ? '#cc0000' : row.severity === 'High' ? '#f59e0b' : '#005cca' }}>{row.severity}</td>
                        <td style={{ padding: '10px 14px' }}>{row.monitor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredAlerts.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '48px 20px', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 20px 0', lineHeight: 1.5, maxWidth: '500px' }}>
                      {mockAlertRows.length === 0 ? 'There are no existing alerts. Create a monitor to add triggers and actions.' : 'No alerts match your search or filter criteria.'}
                    </p>
                    {mockAlertRows.length === 0 && (
                      <button onClick={() => setIsCreating(true)} className="wz-btn" style={{ fontWeight: 600 }}>
                        Create monitor
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* MONITORS TAB */}
        {activeTab === 'monitors' && (
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 500, color: '#1e293b', margin: '0 0 16px 0' }}>
              Monitors
            </h2>

            <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '24px 32px' }}>
              {/* Top Controls Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', flex: 1, gap: '12px' }}>
                  <div style={{ flex: 1, position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                      <FiSearch size={14} />
                    </span>
                    <input 
                      type="text" 
                      placeholder="Search" 
                      className="wz-search-input"
                      style={{ paddingLeft: '38px', fontSize: '13px' }}
                    />
                  </div>
                  <button className="wz-btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px', borderColor: '#005cca', color: '#005cca', fontWeight: 600 }}>
                    Actions <FiChevronDown size={14} />
                  </button>
                  <button onClick={() => setIsCreating(true)} className="wz-btn" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                    <FiPlus size={14} /> Create monitor
                  </button>
                </div>
                
                <select className="wz-select" style={{ width: '130px' }}>
                  <option>All states</option>
                </select>
              </div>

              {/* Monitors Table */}
              <div className="wz-table-wrapper" style={{ border: 'none' }}>
                <table className="wz-table">
                  <thead>
                    <tr>
                      <th style={{ width: '30px' }}><input type="checkbox" disabled /></th>
                      <th>Monitor name ▽</th>
                      <th>State</th>
                      <th>Type</th>
                      <th>Latest alert</th>
                      <th>Last notification ti...</th>
                      <th>Active</th>
                      <th>Acknowledged</th>
                      <th>Errors</th>
                      <th>Ignored</th>
                      <th>Associations with ...</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monitors.map(m => (
                      <tr key={m.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '10px 8px', textAlign: 'center' }}><input type="checkbox" /></td>
                        <td style={{ padding: '10px 14px', color: '#005cca', fontWeight: 600 }}>{m.name}</td>
                        <td style={{ padding: '10px 14px' }}><span style={{ background: '#ecfdf5', color: '#047857', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>{m.state}</span></td>
                        <td style={{ padding: '10px 14px' }}>{m.type}</td>
                        <td style={{ padding: '10px 14px', color: '#94a3b8' }}>{m.latestAlert}</td>
                        <td style={{ padding: '10px 14px', color: '#94a3b8' }}>{m.lastNotification}</td>
                        <td style={{ padding: '10px 14px' }}>{m.active}</td>
                        <td style={{ padding: '10px 14px' }}>{m.acknowledged}</td>
                        <td style={{ padding: '10px 14px' }}>{m.errors}</td>
                        <td style={{ padding: '10px 14px' }}>{m.ignored}</td>
                        <td style={{ padding: '10px 14px', color: '#94a3b8' }}>{m.associations}</td>
                        <td style={{ padding: '10px 14px' }}>
                          <button onClick={() => {
                            const updated = monitors.filter(x => x.id !== m.id);
                            setMonitors(updated);
                            localStorage.setItem('wz_alerting_monitors', JSON.stringify(updated));
                            toast.success(`Monitor "${m.name}" deleted`);
                          }} style={{ background: 'none', border: 'none', color: '#b91c1c', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {monitors.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '48px 20px', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 20px 0', lineHeight: 1.5 }}>
                      There are no existing monitors. Create a monitor to add triggers and actions.
                    </p>
                    <button onClick={() => setIsCreating(true)} className="wz-btn" style={{ fontWeight: 600 }}>
                      Create monitor
                    </button>
                  </div>
                ) : (
                  <div style={{ padding: '12px 16px', borderTop: '1px solid #e2e8f0', fontSize: '12.5px', color: '#64748b', textAlign: 'center' }}>
                    {monitors.length} monitor(s)
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* DESTINATIONS TAB */}
        {activeTab === 'destinations' && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
            <div className="wz-pill-card" style={{ 
              background: '#ffffff', 
              border: '1px solid #e2e8f0', 
              borderRadius: '4px', 
              padding: '40px 48px',
              maxWidth: '640px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <h2 style={{ fontSize: '24px', fontWeight: 300, color: '#1e293b', margin: '0 0 16px 0' }}>
                Destinations have become channels in Notifications
              </h2>
              <p style={{ fontSize: '13.5px', color: '#64748b', margin: '0 0 24px 0', lineHeight: 1.6 }}>
                Your destinations have been migrated as channels in Notifications, a new centralized place to manage your notification channels. Destinations will be deprecated going forward.{' '}
                <a href="#" style={{ color: '#005cca', textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                  Learn more <FiExternalLink size={12} />
                </a>
              </p>
              <button className="wz-btn" style={{ padding: '10px 20px', fontWeight: 600 }}>
                View in Notifications
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Alert Detail Flyout */}
      {detailAlert && (
        <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '520px', background: '#ffffff', boxShadow: '-4px 0 24px rgba(0,0,0,0.1)', zIndex: 1000, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #e2e8f0' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b', margin: 0 }}>Alert Details</h2>
            <button onClick={() => setDetailAlert(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }}>
              <FiX size={20} />
            </button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
            {/* Alert Metadata */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '13px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '12px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b', fontWeight: 500 }}>Alert ID</span>
                <span style={{ color: '#1e293b', fontWeight: 600 }}>{detailAlert.id}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '12px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b', fontWeight: 500 }}>Alert</span>
                <span style={{ color: '#005cca', fontWeight: 600 }}>{detailAlert.alert}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '12px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b', fontWeight: 500 }}>Severity</span>
                <span style={{ fontWeight: 600, color: detailAlert.severity === 'Critical' ? '#cc0000' : detailAlert.severity === 'High' ? '#f59e0b' : '#005cca' }}>{detailAlert.severity}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '12px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b', fontWeight: 500 }}>Trigger</span>
                <span style={{ color: '#475569' }}>{detailAlert.trigger}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '12px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b', fontWeight: 500 }}>Monitor</span>
                <span style={{ color: '#475569' }}>{detailAlert.monitor}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '12px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b', fontWeight: 500 }}>Start Time</span>
                <span style={{ color: '#475569' }}>{detailAlert.startTime}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '12px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b', fontWeight: 500 }}>Last Updated</span>
                <span style={{ color: '#475569' }}>{detailAlert.lastUpdated}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '12px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b', fontWeight: 500 }}>Active</span>
                <span style={{ color: '#475569' }}>{detailAlert.active}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '12px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b', fontWeight: 500 }}>Acknowledged</span>
                <span style={{ color: '#475569' }}>{acknowledged[detailAlert.id] ? detailAlert.ack : (detailAlert.ack || 0)}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '12px' }}>
                <span style={{ color: '#64748b', fontWeight: 500 }}>Errors</span>
                <span style={{ color: '#475569' }}>{detailAlert.errors}</span>
              </div>
            </div>

            {/* Timeline Section */}
            <div style={{ marginTop: '28px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b', margin: '0 0 16px 0' }}>Timeline</h3>
              <div style={{ position: 'relative', paddingLeft: '24px' }}>
                <div style={{ position: 'absolute', left: '8px', top: 0, bottom: 0, width: '2px', background: '#e2e8f0' }} />
                {mockTimeline.map((entry, idx) => (
                  <div key={idx} style={{ position: 'relative', paddingBottom: '20px', paddingLeft: '8px' }}>
                    <div style={{ position: 'absolute', left: '-20px', top: '4px', width: '10px', height: '10px', borderRadius: '50%', background: idx === 0 ? '#005cca' : '#cbd5e1', border: '2px solid #ffffff' }} />
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '2px' }}>{entry.time}</div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>{entry.event}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{entry.detail}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div style={{ marginTop: '24px', display: 'flex', gap: '8px' }}>
              <button onClick={() => { navigate(`/events?search=${encodeURIComponent(detailAlert.alert)}`); setDetailAlert(null); }} style={{ padding: '8px 16px', fontSize: '13px', border: 'none', borderRadius: '4px', background: '#005cca', color: '#ffffff', cursor: 'pointer', fontWeight: 600 }}>
                View in Discover
              </button>
              <button onClick={() => { setAcknowledged(prev => ({ ...prev, [detailAlert.id]: true })); toast.success(`Alert ${detailAlert.id} acknowledged`); }} style={{ padding: '8px 16px', fontSize: '13px', border: '1px solid #005cca', borderRadius: '4px', background: '#ffffff', color: '#005cca', cursor: 'pointer', fontWeight: 600 }}>
                Acknowledge
              </button>
              <button onClick={() => { toast.success('Alert status updated to Closed'); setDetailAlert(null); }} style={{ padding: '8px 16px', fontSize: '13px', border: '1px solid #f59e0b', borderRadius: '4px', background: '#ffffff', color: '#b45309', cursor: 'pointer', fontWeight: 600 }}>
                Close alert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Alerting;
