import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { FiInfo, FiChevronDown, FiChevronUp, FiRefreshCw, FiDownload, FiSearch, FiAlertCircle } from 'react-icons/fi';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const ConfigurationAssessment: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inventory' | 'events'>('dashboard');
  const [expandedCheck, setExpandedCheck] = useState<number | null>(null);
  const [scaSearch, setScaSearch] = useState('');
  const [scaEventSearch, setScaEventSearch] = useState('');
  const [scaEventsPage, setScaEventsPage] = useState(1);
  const SCA_EVENTS_PER_PAGE = 10;

  const mockChecks = [
    { id: 19000, title: 'Ensure /tmp is a separate partition.', target: 'Command: findmnt -kn /tmp', result: 'Failed' },
    { id: 19001, title: 'Ensure nodev option set on /tmp partition.', target: 'Command: findmnt -kn /tmp', result: 'Failed' },
    { id: 19002, title: 'Ensure noexec option set on /tmp partition.', target: 'Command: findmnt -kn /tmp', result: 'Failed' },
    { id: 19003, title: 'Ensure nosuid option set on /tmp partition.', target: 'Command: findmnt -kn /tmp', result: 'Failed' },
    { id: 19004, title: 'Ensure separate partition exists for /var.', target: 'Command: findmnt -kn /var', result: 'Failed' },
    { id: 19005, title: 'Ensure nodev option set on /var partition.', target: 'Command: findmnt -kn /var', result: 'Failed' },
    { id: 19006, title: 'Ensure nosuid option set on /var partition.', target: 'Command: findmnt -kn /var', result: 'Failed' },
    { id: 19007, title: 'Ensure separate partition exists for /var/tmp.', target: 'Command: findmnt -kn /var/tmp', result: 'Failed' },
    { id: 19008, title: 'Ensure nodev option set on /var/tmp partition.', target: 'Command: findmnt -kn /var/tmp', result: 'Failed' },
    { id: 19009, title: 'Ensure noexec option set on /var/tmp partition.', target: 'Command: findmnt -kn /var/tmp', result: 'Failed' },
  ];

  const mockScaEvents = Array.from({ length: 45 }, (_, i) => ({
    timestamp: `Jun ${12 + (i % 3)}, 2026 @ ${10 + (i % 12)}:${(i * 7) % 60}:${(i * 13) % 60}.${(i * 37) % 1000}`,
    agent: `Agent${(i % 10) + 1}`,
    policy: i % 3 === 0 ? 'CIS Ubuntu 22.04' : i % 3 === 1 ? 'PCI DSS' : 'GDPR',
    check: mockChecks[i % mockChecks.length].title,
    result: i % 4 === 0 ? 'Passed' : 'Failed',
    level: (i % 7) + 3,
    ruleId: 19000 + (i % 20),
  }));

  const filteredScaEvents = mockScaEvents.filter(e => !scaEventSearch ||
    e.agent.toLowerCase().includes(scaEventSearch.toLowerCase()) ||
    e.check.toLowerCase().includes(scaEventSearch.toLowerCase()) ||
    e.policy.toLowerCase().includes(scaEventSearch.toLowerCase())
  );
  const totalScaPages = Math.ceil(filteredScaEvents.length / SCA_EVENTS_PER_PAGE);
  const pagedScaEvents = filteredScaEvents.slice((scaEventsPage - 1) * SCA_EVENTS_PER_PAGE, scaEventsPage * SCA_EVENTS_PER_PAGE);

  const doughnutData = {
    labels: ['Passed', 'Failed', 'Not applicable'],
    datasets: [
      {
        data: [67, 109, 34],
        backgroundColor: ['#14b8a6', '#f87171', '#475569'],
        borderWidth: 0,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true }
    }
  };

  const renderHeader = () => (
    <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', background: '#ffffff', padding: '0 24px', marginLeft: '-24px', marginRight: '-24px', marginTop: '-24px', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
      <div style={{ display: 'flex', gap: '4px' }}>
        {(['dashboard', 'inventory', 'events'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              background: 'none', border: 'none',
              borderBottom: activeTab === tab ? '2.5px solid #005cca' : '2.5px solid transparent',
              color: activeTab === tab ? '#005cca' : '#475569',
              fontWeight: activeTab === tab ? 600 : 500,
              fontSize: '13.5px', padding: '14px 16px 12px', cursor: 'pointer',
              textTransform: 'capitalize', transition: 'all 0.15s ease'
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingRight: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '4px 10px', color: '#334155', fontWeight: 500 }}>
          <span style={{ fontSize: '10px', color: '#005cca' }}>◉</span>
          Isgasaad (001)
          <span style={{ color: '#005cca', fontSize: '12px', cursor: 'pointer' }}>📌</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="wz-page" style={{ background: '#f8fafc' }}>
      <div className="wz-page-content" style={{ display: 'flex', flexDirection: 'column' }}>
        
        {renderHeader()}

        {activeTab === 'dashboard' && (
          <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '20px', alignItems: 'start' }}>
            
            {/* LEFT COLUMN */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Donut Chart Card */}
              <fieldset style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px 20px 24px', borderRadius: '4px', margin: 0 }}>
                <legend style={{ fontSize: '11px', fontWeight: 700, color: '#1e293b', padding: '0 8px', marginLeft: '12px', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  CIS UBUNTU LINUX 20.04 LTS BENCHMARK V2.0.0
                </legend>
                
                {/* ChartJS Donut Chart */}
                <div style={{ height: '160px', display: 'flex', justifyContent: 'center', marginBottom: '24px', position: 'relative', marginTop: '10px' }}>
                  <Doughnut data={doughnutData} options={doughnutOptions} />
                </div>

                {/* Legend list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px', marginLeft: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#14b8a6' }} />
                    <span style={{ color: '#334155', fontWeight: 500 }}>Passed (67)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f87171' }} />
                    <span style={{ color: '#334155', fontWeight: 500 }}>Failed (109)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#475569' }} />
                    <span style={{ color: '#334155', fontWeight: 500 }}>Not applicable (34)</span>
                  </div>
                </div>
              </fieldset>

              {/* Policy Description Card */}
              <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>
                  Policy
                </h4>
                <p style={{ fontSize: '12.5px', color: '#1e293b', margin: '0 0 16px 0', fontWeight: 500 }}>
                  CIS Ubuntu Linux 20.04 LTS Benchmark v2.0.0
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '12px', fontSize: '12.5px', color: '#64748b' }}>
                  <span>Rows per page: 15 <FiChevronDown style={{ display: 'inline', verticalAlign: 'middle' }} /></span>
                  <span>&lt; 1 &gt;</span>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Horizontal stats summary card */}
              <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b', margin: 0 }}>
                    CIS Ubuntu Linux 20.04 LTS Benchmark v2.0.0
                  </h3>
                  <FiInfo size={16} style={{ color: '#005cca', cursor: 'pointer' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '13px', color: '#475569', display: 'block', marginBottom: '6px' }}>Passed</span>
                    <strong style={{ fontSize: '28px', fontWeight: 500, color: '#14b8a6' }}>67</strong>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '13px', color: '#475569', display: 'block', marginBottom: '6px' }}>Failed</span>
                    <strong style={{ fontSize: '28px', fontWeight: 500, color: '#f87171' }}>109</strong>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '13px', color: '#475569', display: 'block', marginBottom: '6px' }}>Not applicable</span>
                    <strong style={{ fontSize: '28px', fontWeight: 500, color: '#94a3b8' }}>34</strong>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '13px', color: '#475569', display: 'block', marginBottom: '6px' }}>Score</span>
                    <strong style={{ fontSize: '28px', fontWeight: 500, color: '#ec4899' }}>38%</strong>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '13px', color: '#475569', display: 'block', marginBottom: '6px' }}>End scan</span>
                    <strong style={{ fontSize: '16px', fontWeight: 500, color: '#005cca', display: 'block', lineHeight: 1.4 }}>
                      Jun 12, 2026 @ <br/>22:48:31.000
                    </strong>
                  </div>
                </div>
              </div>

              {/* Checks list card */}
              <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', margin: 0 }}>
                    Checks (210)
                  </h3>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '13px' }}>
                    <button onClick={() => toast.success('Data refreshed')} style={{ background: 'none', border: 'none', color: '#005cca', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontWeight: 600 }}>
                      <FiRefreshCw size={13} /> Refresh
                    </button>
                    <button onClick={() => toast.success('Data exported')} style={{ background: 'none', border: 'none', color: '#005cca', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontWeight: 600 }}>
                      <FiDownload size={13} /> Export formatted
                    </button>
                  </div>
                </div>

                {/* Search Bar with WQL badge */}
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

                {/* Checks Table */}
                <div className="wz-table-wrapper" style={{ border: 'none' }}>
                  <table className="wz-table">
                    <thead>
                      <tr>
                        <th style={{ width: '80px' }}>ID ↑</th>
                        <th>Title</th>
                        <th>Target</th>
                        <th>Result</th>
                        <th style={{ width: '40px' }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockChecks.map(check => (
                        <React.Fragment key={check.id}>
                          <tr 
                            style={{ cursor: 'pointer' }}
                            onClick={() => setExpandedCheck(expandedCheck === check.id ? null : check.id)}
                          >
                            <td style={{ color: '#64748b' }}>{check.id}</td>
                            <td style={{ color: '#1e293b', fontWeight: 500 }}>{check.title}</td>
                            <td style={{ fontFamily: 'monospace', fontSize: '11.5px', color: '#475569' }}>{check.target}</td>
                            <td>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444', fontWeight: 600 }}>
                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444' }} />
                                {check.result}
                              </span>
                            </td>
                            <td>
                              {expandedCheck === check.id ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
                            </td>
                          </tr>
                          {expandedCheck === check.id && (
                            <tr style={{ background: '#f8fafc' }}>
                              <td colSpan={5} style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0' }}>
                                <div style={{ fontSize: '12.5px', color: '#475569', lineHeight: 1.6 }}>
                                  <div style={{ marginBottom: '8px' }}>
                                    <strong>Description:</strong> Standard CIS audit check evaluating security criteria on local filesystems.
                                  </div>
                                  <div>
                                    <strong>Remediation:</strong> Modify target mount configuration to include appropriate nodev/noexec options or separate mount partitions where applicable.
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', fontSize: '12.5px', color: '#64748b' }}>
                  <span>Rows per page: 10 <FiChevronDown style={{ display: 'inline', verticalAlign: 'middle' }} /></span>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <span style={{ cursor: 'pointer' }}>&lt;</span>
                    <span style={{ fontWeight: 600, color: '#005cca' }}>1</span>
                    <span style={{ cursor: 'pointer' }}>2</span>
                    <span style={{ cursor: 'pointer' }}>3</span>
                    <span style={{ cursor: 'pointer' }}>4</span>
                    <span style={{ cursor: 'pointer' }}>5</span>
                    <span>...</span>
                    <span style={{ cursor: 'pointer' }}>21</span>
                    <span style={{ cursor: 'pointer' }}>&gt;</span>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {activeTab === 'inventory' && (
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', background: '#f8fafc' }}>
                  <th style={{ padding: '14px 16px', textAlign: 'left', color: '#1e293b', fontWeight: 600 }}>Policy</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', color: '#1e293b', fontWeight: 600 }}>Description</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', color: '#1e293b', fontWeight: 600 }}>End scan</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', color: '#1e293b', fontWeight: 600 }}>Passed</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', color: '#1e293b', fontWeight: 600 }}>Failed</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', color: '#1e293b', fontWeight: 600 }}>Not applicable</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', color: '#1e293b', fontWeight: 600 }}>Score</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '16px', color: '#334155' }}>CIS Ubuntu Linux 20.04 LTS Benchmark v2.0.0</td>
                  <td style={{ padding: '16px', color: '#64748b' }}>This document provides prescriptive guidance for...</td>
                  <td style={{ padding: '16px', color: '#334155' }}>Jun 12, 2026 @ 22:48:31.000</td>
                  <td style={{ padding: '16px', color: '#334155' }}>67</td>
                  <td style={{ padding: '16px', color: '#334155' }}>109</td>
                  <td style={{ padding: '16px', color: '#334155' }}>34</td>
                  <td style={{ padding: '16px', color: '#334155' }}>38%</td>
                </tr>
              </tbody>
            </table>
            <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b', fontSize: '12.5px' }}>
              <span>Rows per page: 15 <FiChevronDown style={{ display: 'inline', verticalAlign: 'middle' }} /></span>
              <span>&lt; <span style={{ color: '#005cca', fontWeight: 600 }}>1</span> &gt;</span>
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              {/* Search */}
              <div style={{ flex: 1, position: 'relative' }}>
                <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                  <FiSearch size={14} />
                </span>
                <input
                  type="text" placeholder="Search"
                  value={scaEventSearch}
                  onChange={e => { setScaEventSearch(e.target.value); setScaEventsPage(1); }}
                  style={{ width: '100%', padding: '7px 60px 7px 34px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', background: '#ffffff', outline: 'none' }}
                />
                <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '12px', fontWeight: 700, color: '#64748b' }}>DQL</span>
              </div>
              
              {/* Date picker */}
              <button onClick={() => toast.success('Date picker opened')} style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '7px 14px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: '#334155' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', borderRight: '1px solid #cbd5e1', paddingRight: '8px' }}>
                  📅 <FiChevronDown size={12} />
                </span>
                <span style={{ paddingLeft: '4px' }}>Last 24 hours</span>
              </button>

              <button onClick={() => toast.success('Date picker opened')} style={{ background: 'none', border: 'none', color: '#005cca', fontSize: '12.5px', fontWeight: 600, cursor: 'pointer' }}>Show dates</button>
              
              <button onClick={() => toast.success('Data refreshed')} style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '7px 14px', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: '#334155' }}>
                <FiRefreshCw size={13} /> Refresh
              </button>
            </div>

            {/* Filter chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center', marginBottom: '8px' }}>
              {[
                { label: 'cluster.name: wazuh' },
                { label: 'rule.groups: sca' },
                { label: 'agent.id: 001' }
              ].map((f, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '5px', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '3px 8px', background: '#ffffff', fontSize: '12px', color: '#334155' }}>
                  <span>{f.label}</span>
                  <span onClick={() => toast.success(`Filter removed: ${f.label}`)} style={{ cursor: 'pointer', color: '#94a3b8', marginLeft: '2px' }}>×</span>
                </div>
              ))}
              <span style={{ color: '#94a3b8', fontSize: '13px', marginLeft: '6px' }}>⏧</span>
              <button onClick={() => toast.success('Add filter clicked')} style={{ background: 'none', border: 'none', color: '#005cca', fontSize: '12.5px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', marginLeft: '6px' }}>
                ⊕ Add filter
              </button>
            </div>

            {/* Events Table */}
            {filteredScaEvents.length > 0 ? (
              <div className="wz-table-wrapper" style={{ border: '1px solid #e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                <table className="wz-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc' }}>
                      <th style={{ padding: '10px 14px', textAlign: 'left', color: '#475569', fontWeight: 600, fontSize: '12px' }}>Timestamp</th>
                      <th style={{ padding: '10px 14px', textAlign: 'left', color: '#475569', fontWeight: 600, fontSize: '12px' }}>Agent</th>
                      <th style={{ padding: '10px 14px', textAlign: 'left', color: '#475569', fontWeight: 600, fontSize: '12px' }}>Policy</th>
                      <th style={{ padding: '10px 14px', textAlign: 'left', color: '#475569', fontWeight: 600, fontSize: '12px' }}>Check</th>
                      <th style={{ padding: '10px 14px', textAlign: 'left', color: '#475569', fontWeight: 600, fontSize: '12px' }}>Result</th>
                      <th style={{ padding: '10px 14px', textAlign: 'left', color: '#475569', fontWeight: 600, fontSize: '12px' }}>Level</th>
                      <th style={{ padding: '10px 14px', textAlign: 'left', color: '#475569', fontWeight: 600, fontSize: '12px' }}>Rule ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedScaEvents.map((e, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '8px 14px', fontSize: '12px', color: '#334155', whiteSpace: 'nowrap' }}>{e.timestamp}</td>
                        <td style={{ padding: '8px 14px', fontSize: '12px', color: '#005cca', fontWeight: 500 }}>{e.agent}</td>
                        <td style={{ padding: '8px 14px', fontSize: '12px', color: '#475569' }}>{e.policy}</td>
                        <td style={{ padding: '8px 14px', fontSize: '12px', color: '#334155' }}>{e.check}</td>
                        <td style={{ padding: '8px 14px', fontSize: '12px', fontWeight: 600, color: e.result === 'Passed' ? '#22c55e' : '#ef4444' }}>{e.result}</td>
                        <td style={{ padding: '8px 14px', fontSize: '12px', color: '#64748b' }}>{e.level}</td>
                        <td style={{ padding: '8px 14px', fontSize: '12px', color: '#005cca', fontWeight: 600 }}>{e.ruleId}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', background: '#f8fafc', fontSize: '12px', color: '#64748b' }}>
                  <span>Rows per page: {SCA_EVENTS_PER_PAGE}</span>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button disabled={scaEventsPage <= 1} onClick={() => setScaEventsPage(prev => Math.max(1, prev - 1))} style={{ border: 'none', background: 'none', cursor: scaEventsPage <= 1 ? 'not-allowed' : 'pointer', color: scaEventsPage <= 1 ? '#cbd5e1' : '#475569' }}>&lt;</button>
                    <span style={{ fontWeight: 600, color: '#005cca' }}>{scaEventsPage}</span>
                    <span style={{ color: '#94a3b8' }}>of {totalScaPages}</span>
                    <button disabled={scaEventsPage >= totalScaPages} onClick={() => setScaEventsPage(prev => Math.min(totalScaPages, prev + 1))} style={{ border: 'none', background: 'none', cursor: scaEventsPage >= totalScaPages ? 'not-allowed' : 'pointer', color: scaEventsPage >= totalScaPages ? '#cbd5e1' : '#475569' }}>&gt;</button>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#fffbeb', borderLeft: '4px solid #f59e0b', padding: '16px 20px', borderRadius: '0 4px 4px 0', color: '#b45309', fontWeight: 600, fontSize: '13.5px' }}>
                <FiAlertCircle size={16} />
                No results match your search criteria
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default ConfigurationAssessment;
