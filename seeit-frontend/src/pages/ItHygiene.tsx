import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { FiSearch, FiChevronDown, FiPlus, FiRefreshCw, FiDownload } from 'react-icons/fi';

const ItHygiene: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'system' | 'software' | 'processes' | 'network' | 'identity' | 'services'>('dashboard');
  const [systemSubTab, setSystemSubTab] = useState<'os' | 'hardware'>('os');
  const [softwareSubTab, setSoftwareSubTab] = useState<'packages' | 'windows' | 'browser'>('packages');
  const [networkSubTab, setNetworkSubTab] = useState<'addresses' | 'interfaces' | 'protocols' | 'listeners' | 'traffic'>('addresses');
  const [identitySubTab, setIdentitySubTab] = useState<'users' | 'groups'>('users');
  const [packagesPage, setPackagesPage] = useState(1);


  const [filters, setFilters] = useState([
    { key: 'wazuh.cluster.name', value: 'saad-cyber6' },
    { key: 'agent.id', value: '001' }
  ]);

  const removeFilter = (idx: number) => {
    setFilters(filters.filter((_, i) => i !== idx));
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
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            {['dashboard', 'system', 'software', 'processes', 'network', 'identity', 'services'].map(tab => (
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
            <button onClick={() => toast.success('Report generated')} style={{ background: 'none', border: 'none', color: '#005cca', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
              <FiDownload size={14} /> Generate report
            </button>
          </div>
        </div>

        {/* Global DQL Filter Bar */}
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

            <button onClick={() => toast.success('Data refreshed')} className="wz-btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
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

            <button onClick={() => toast.success('Add filter clicked')} style={{ 
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
            
            {/* Top row distributions */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              
              {/* Operating system families */}
              <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '16px' }}>Operating system families</h4>
                <div className="wz-table-wrapper" style={{ border: 'none' }}>
                  <table className="wz-table">
                    <thead>
                      <tr>
                        <th>Operating system families</th>
                        <th style={{ textAlign: 'right' }}>Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>ubuntu</td>
                        <td style={{ textAlign: 'right' }}><strong>1</strong></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Package types horizontal block */}
              <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '16px' }}>Package types</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', height: '80px' }}>
                  <div style={{ flex: 1, height: '36px', background: '#b28d7d', borderRadius: '4px', position: 'relative' }}>
                    <div style={{ position: 'absolute', right: '4px', top: '50%', transform: 'translateY(-50%)', width: '4px', height: '100%', background: '#f87171' }} />
                  </div>
                  <div style={{ fontSize: '10.5px', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span><span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#b28d7d', marginRight: '4px' }} />deb</span>
                    <span><span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#f87171', marginRight: '4px' }} />extension</span>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#94a3b8', borderTop: '1px solid #cbd5e1', paddingTop: '6px' }}>
                  <span>500</span>
                  <span>1,000</span>
                  <span>1,500</span>
                </div>
              </div>

              {/* Top 5 endpoints by memory */}
              <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '16px' }}>Top 5 endpoints by memory usage</h4>
                <div className="wz-table-wrapper" style={{ border: 'none' }}>
                  <table className="wz-table">
                    <thead>
                      <tr>
                        <th>Top 5 endpoints...</th>
                        <th>Total memory</th>
                        <th style={{ textAlign: 'right' }}>Usage</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Isgasaad</td>
                        <td>3.8GB</td>
                        <td style={{ textAlign: 'right' }}><strong>16%</strong></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* Middle row tables */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
              
              {/* Top 5 installed packages */}
              <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '16px' }}>
                <h4 style={{ fontSize: '12.5px', fontWeight: 700, color: '#1e293b', marginBottom: '12px' }}>Top 5 installed packages</h4>
                <div className="wz-table-wrapper" style={{ border: 'none' }}>
                  <table className="wz-table" style={{ fontSize: '12px' }}>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th style={{ textAlign: 'right' }}>Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      {['apturl', 'duplicity', 'snapd', 'ubuntu-advantage-tools', 'ubuntu-drivers-common'].map((pkg, idx) => (
                        <tr key={idx}>
                          <td>{pkg}</td>
                          <td style={{ textAlign: 'right' }}><strong>2</strong></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Top 5 running processes */}
              <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '16px' }}>
                <h4 style={{ fontSize: '12.5px', fontWeight: 700, color: '#1e293b', marginBottom: '12px' }}>Top 5 running processes</h4>
                <div className="wz-table-wrapper" style={{ border: 'none' }}>
                  <table className="wz-table" style={{ fontSize: '12px' }}>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th style={{ textAlign: 'right' }}>Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { n: 'systemd-udevd', c: 21 },
                        { n: 'apache2', c: 6 },
                        { n: 'dbus-daemon', c: 3 },
                        { n: 'avahi-daemon', c: 2 },
                        { n: 'gnome-session-b', c: 2 }
                      ].map((proc, idx) => (
                        <tr key={idx}>
                          <td>{proc.n}</td>
                          <td style={{ textAlign: 'right' }}><strong>{proc.c}</strong></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Top 5 operating systems */}
              <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '16px' }}>
                <h4 style={{ fontSize: '12.5px', fontWeight: 700, color: '#1e293b', marginBottom: '12px' }}>Top 5 operating systems</h4>
                <div className="wz-table-wrapper" style={{ border: 'none' }}>
                  <table className="wz-table" style={{ fontSize: '12px' }}>
                    <thead>
                      <tr>
                        <th>OS</th>
                        <th style={{ textAlign: 'right' }}>Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Ubuntu</td>
                        <td style={{ textAlign: 'right' }}><strong>1</strong></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Top 5 host CPUs */}
              <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '16px' }}>
                <h4 style={{ fontSize: '12.5px', fontWeight: 700, color: '#1e293b', marginBottom: '12px' }}>Top 5 host CPUs</h4>
                <div className="wz-table-wrapper" style={{ border: 'none' }}>
                  <table className="wz-table" style={{ fontSize: '12px' }}>
                    <thead>
                      <tr>
                        <th>CPU</th>
                        <th style={{ textAlign: 'right' }}>Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ fontSize: '11px', lineHeight: 1.4 }}>Intel(R) Core(TM) i7-8665U CPU @ 1.90G</td>
                        <td style={{ textAlign: 'right' }}><strong>1</strong></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* Bottom row: horizontal port bars + process start time */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              
              {/* Top 5 destination ports */}
              <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '16px' }}>Top 5 destination ports</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', fontSize: '11.5px', color: '#475569' }}>53</div>
                    <div style={{ flex: 1, height: '18px', background: '#99d8c9', borderRadius: '2px' }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', fontSize: '11.5px', color: '#475569' }}>67</div>
                    <div style={{ flex: 0.7, height: '18px', background: '#3b82f6', borderRadius: '2px' }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', fontSize: '11.5px', color: '#475569' }}>443</div>
                    <div style={{ flex: 0.7, height: '18px', background: '#ec4899', borderRadius: '2px' }} />
                  </div>
                </div>
              </div>

              {/* Top 5 source ports */}
              <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '16px' }}>Top 5 source ports</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', fontSize: '11.5px', color: '#475569' }}>53</div>
                    <div style={{ flex: 1, height: '18px', background: '#99d8c9', borderRadius: '2px' }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', fontSize: '11.5px', color: '#475569' }}>953</div>
                    <div style={{ flex: 0.25, height: '18px', background: '#a855f7', borderRadius: '2px' }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', fontSize: '11.5px', color: '#475569' }}>137</div>
                    <div style={{ flex: 0.2, height: '18px', background: '#eab308', borderRadius: '2px' }} />
                  </div>
                </div>
              </div>

              {/* Processes start time */}
              <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '16px' }}>Processes start time</h4>
                <div style={{ height: '110px', borderLeft: '1px solid #cbd5e1', borderBottom: '1px solid #cbd5e1', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '-18px', top: '0', fontSize: '9px', color: '#94a3b8' }}>200</span>
                  <span style={{ position: 'absolute', left: '-18px', top: '35px', fontSize: '9px', color: '#94a3b8' }}>150</span>
                  <span style={{ position: 'absolute', left: '-18px', top: '70px', fontSize: '9px', color: '#94a3b8' }}>100</span>
                  <span style={{ position: 'absolute', left: '-14px', top: '100px', fontSize: '9px', color: '#94a3b8' }}>50</span>
                  
                  {/* Flat 0 line */}
                  <svg style={{ width: '100%', height: '100%', position: 'absolute', bottom: 0 }}>
                    <line x1="0" y1="110" x2="300" y2="110" stroke="#cbd5e1" strokeWidth="2" />
                  </svg>

                  <div style={{ display: 'flex', justifyContent: 'space-between', position: 'absolute', bottom: '-22px', left: 0, right: 0, fontSize: '8.5px', color: '#94a3b8' }}>
                    <span>2026-06-12 21:10</span>
                    <span>2026-06-12 21:25</span>
                    <span>2026-06-12 21:40</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ==========================================
            TAB CONTENT: SYSTEM
            ========================================== */}
        {activeTab === 'system' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* System Sub-tabs */}
            <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid #cbd5e1', paddingBottom: '8px' }}>
              <button 
                onClick={() => setSystemSubTab('os')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: systemSubTab === 'os' ? '#005cca' : '#475569',
                  fontWeight: systemSubTab === 'os' ? 700 : 500,
                  fontSize: '13.5px',
                  cursor: 'pointer'
                }}
              >
                OS
              </button>
              <button 
                onClick={() => setSystemSubTab('hardware')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: systemSubTab === 'hardware' ? '#005cca' : '#475569',
                  fontWeight: systemSubTab === 'hardware' ? 700 : 500,
                  fontSize: '13.5px',
                  cursor: 'pointer'
                }}
              >
                Hardware
              </button>
            </div>

            {/* Filter selectors row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              <div className="wz-select-wrapper">
                <select className="wz-select">
                  <option>{systemSubTab === 'os' ? 'Platform (0)' : 'CPU name (0)'}</option>
                </select>
              </div>
              <div className="wz-select-wrapper">
                <select className="wz-select">
                  <option>{systemSubTab === 'os' ? 'Name (0)' : 'CPU cores (0)'}</option>
                </select>
              </div>
              {systemSubTab === 'os' && (
                <div className="wz-select-wrapper">
                  <select className="wz-select">
                    <option>Architecture (0)</option>
                  </select>
                </div>
              )}
            </div>

            {/* OS View Content */}
            {systemSubTab === 'os' && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                  <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '16px' }}>Top 5 platforms</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ fontSize: '11px', color: '#64748b', width: '50px' }}>ubuntu</div>
                      <div style={{ flex: 1, height: '18px', background: '#99d8c9', borderRadius: '2px' }} />
                    </div>
                  </div>
                  <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '16px' }}>Top 5 operating systems</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ fontSize: '11px', color: '#64748b', width: '50px' }}>Ubuntu</div>
                      <div style={{ flex: 1, height: '18px', background: '#99d8c9', borderRadius: '2px' }} />
                    </div>
                  </div>
                  <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '16px' }}>Architecture</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ fontSize: '11px', color: '#64748b', width: '50px' }}>x86_64</div>
                      <div style={{ flex: 1, height: '18px', background: '#99d8c9', borderRadius: '2px' }} />
                    </div>
                  </div>
                </div>

                {/* Hits grid */}
                <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '24px' }}>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b', marginBottom: '12px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>1 hit</div>
                  <div className="wz-table-wrapper" style={{ border: 'none' }}>
                    <table className="wz-table">
                      <thead>
                        <tr>
                          <th>agent.name</th>
                          <th>host.os.platform</th>
                          <th>host.os.name</th>
                          <th>host.os.version</th>
                          <th>host.os.kernel.release</th>
                          <th>host.os.architecture</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={{ color: '#005cca', fontWeight: 600 }}>Isgasaad</td>
                          <td>ubuntu</td>
                          <td>Ubuntu</td>
                          <td>20.04 LTS (Focal Fossa)</td>
                          <td>5.15.0-139-generic</td>
                          <td>x86_64</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* Hardware View Content */}
            {systemSubTab === 'hardware' && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                  <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '16px' }}>Top 5 CPU names</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ fontSize: '9px', color: '#64748b', width: '120px', lineHeight: 1.2 }}>Intel(R) Core(TM) i7-8665U CPU @ 1.90GHz</div>
                      <div style={{ flex: 1, height: '18px', background: '#99d8c9', borderRadius: '2px' }} />
                    </div>
                  </div>
                  <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '16px' }}>Top 5 CPU cores</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ fontSize: '11px', color: '#64748b', width: '20px' }}>2</div>
                      <div style={{ flex: 1, height: '18px', background: '#99d8c9', borderRadius: '2px' }} />
                    </div>
                  </div>
                  <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '16px' }}>Top 5 endpoints by memory usage</h4>
                    <div className="wz-table-wrapper" style={{ border: 'none' }}>
                      <table className="wz-table">
                        <thead>
                          <tr>
                            <th>Endpoint</th>
                            <th>Total memory</th>
                            <th>Usage</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Isgasaad</td>
                            <td>3.8GB</td>
                            <td>16%</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Hits grid */}
                <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '24px' }}>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b', marginBottom: '12px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>1 hit</div>
                  <div className="wz-table-wrapper" style={{ border: 'none' }}>
                    <table className="wz-table">
                      <thead>
                        <tr>
                          <th>agent.name</th>
                          <th>host.memory.total</th>
                          <th>host.memory.used</th>
                          <th>host.memory.free</th>
                          <th>host.cpu.name</th>
                          <th>host.cpu.cores</th>
                          <th>host.cpu.speed</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={{ color: '#005cca', fontWeight: 600 }}>Isgasaad</td>
                          <td>3.8GB</td>
                          <td>608.9MB</td>
                          <td>3.2GB</td>
                          <td>Intel(R) Core(TM) i7-8665U CPU @ 1.90GHz</td>
                          <td>2</td>
                          <td>2,113</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

          </div>
        )}

        {/* ==========================================
            TAB CONTENT: SOFTWARE
            ========================================== */}
        {activeTab === 'software' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Software Sub-tabs */}
            <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid #cbd5e1', paddingBottom: '8px' }}>
              <button 
                onClick={() => setSoftwareSubTab('packages')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: softwareSubTab === 'packages' ? '#005cca' : '#475569',
                  fontWeight: softwareSubTab === 'packages' ? 700 : 500,
                  fontSize: '13.5px',
                  cursor: 'pointer'
                }}
              >
                Packages
              </button>
              <button 
                onClick={() => setSoftwareSubTab('windows')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: softwareSubTab === 'windows' ? '#005cca' : '#475569',
                  fontWeight: softwareSubTab === 'windows' ? 700 : 500,
                  fontSize: '13.5px',
                  cursor: 'pointer'
                }}
              >
                Windows KBs
              </button>
              <button 
                onClick={() => setSoftwareSubTab('browser')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: softwareSubTab === 'browser' ? '#005cca' : '#475569',
                  fontWeight: softwareSubTab === 'browser' ? 700 : 500,
                  fontSize: '13.5px',
                  cursor: 'pointer'
                }}
              >
                Browser extensions
              </button>
            </div>

            {/* Packages View */}
            {softwareSubTab === 'packages' && (
              <>
                {/* Filter selectors row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                  <div className="wz-select-wrapper">
                    <select className="wz-select">
                      <option>Vendor (0)</option>
                    </select>
                  </div>
                  <div className="wz-select-wrapper">
                    <select className="wz-select">
                      <option>Name (0)</option>
                    </select>
                  </div>
                  <div className="wz-select-wrapper">
                    <select className="wz-select">
                      <option>Type (0)</option>
                    </select>
                  </div>
                </div>

                {/* Packages content grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                  
                  {/* Top 5 vendors */}
                  <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '16px' }}>Top 5 vendors</h4>
                    <div className="wz-table-wrapper" style={{ border: 'none' }}>
                      <table className="wz-table">
                        <thead>
                          <tr>
                            <th>Vendor</th>
                            <th style={{ textAlign: 'right' }}>Count</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td style={{ fontSize: '10.5px', lineHeight: 1.4 }}>Ubuntu Developers &lt;ubuntu-devel-discuss@lists.ubuntu.com&gt;</td>
                            <td style={{ textAlign: 'right' }}><strong>1,558</strong></td>
                          </tr>
                          <tr>
                            <td style={{ fontSize: '10.5px', lineHeight: 1.4 }}>Ubuntu X-SWAT &lt;ubuntu-x@lists.ubuntu.com&gt;</td>
                            <td style={{ textAlign: 'right' }}><strong>18</strong></td>
                          </tr>
                          <tr>
                            <td style={{ fontSize: '10.5px', lineHeight: 1.4 }}>Ubuntu Core Developers &lt;ubuntu-devel-discuss@lists.ubuntu.com&gt;</td>
                            <td style={{ textAlign: 'right' }}><strong>14</strong></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Unique packages count block */}
                  <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ fontSize: '48px', fontWeight: 700, color: '#1e293b' }}>1,695</div>
                    <div style={{ fontSize: '12.5px', color: '#64748b', fontWeight: 500, marginTop: '8px' }}>Unique packages</div>
                  </div>

                  {/* Package types horizontal block */}
                  <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '16px' }}>Package types</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', height: '80px' }}>
                      <div style={{ flex: 1, height: '36px', background: '#b28d7d', borderRadius: '4px', position: 'relative' }}>
                        <div style={{ position: 'absolute', right: '4px', top: '50%', transform: 'translateY(-50%)', width: '4px', height: '100%', background: '#f87171' }} />
                      </div>
                      <div style={{ fontSize: '10.5px', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span><span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#b28d7d', marginRight: '4px' }} />deb</span>
                        <span><span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#f87171', marginRight: '4px' }} />pypi</span>
                        <span><span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#fda4af', marginRight: '4px' }} />snap</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#94a3b8', borderTop: '1px solid #cbd5e1', paddingTop: '6px' }}>
                      <span>500</span>
                      <span>1,000</span>
                      <span>1,500</span>
                    </div>
                  </div>

                </div>

                {/* Hits grid */}
                <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '24px' }}>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b', marginBottom: '12px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>1,702 hits</div>
                  <div className="wz-table-wrapper" style={{ border: 'none' }}>
                    <table className="wz-table">
                      <thead>
                        <tr>
                          <th>agent.name</th>
                          <th>package.vendor</th>
                          <th>package.name</th>
                          <th>package.version</th>
                          <th>package.type</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { v: 'Ubuntu Developers <ubuntu-devel-discuss@lists.ubuntu.com>', n: 'libdmapsharing-3.0-2', ver: '2.9.39-6', t: 'deb' },
                          { v: 'Ubuntu Developers <ubuntu-devel-discuss@lists.ubuntu.com>', n: 'xserver-xorg-input-libinput', ver: '0.29.0-1', t: 'deb' },
                          { v: 'Ubuntu Developers <ubuntu-devel-discuss@lists.ubuntu.com>', n: 'fonts-orya-extra', ver: '2.0-6', t: 'deb' },
                          { v: 'Ubuntu Developers <ubuntu-devel-discuss@lists.ubuntu.com>', n: 'libclutter-gst-3.0-0', ver: '3.0.27-1', t: 'deb' },
                          { v: 'Ubuntu Developers <ubuntu-devel-discuss@lists.ubuntu.com>', n: 'xml-core', ver: '0.18+nmu1', t: 'deb' },
                          { v: 'Ubuntu Developers <ubuntu-devel-discuss@lists.ubuntu.com>', n: 'kbd', ver: '2.0.4-4ubuntu2', t: 'deb' },
                          { v: 'Ubuntu Developers <ubuntu-devel-discuss@lists.ubuntu.com>', n: 'libreoffice-calc', ver: '1:6.4.7-0ubuntu0.20.04.15', t: 'deb' }
                        ].map((pkg, idx) => (
                          <tr key={idx}>
                            <td style={{ color: '#005cca', fontWeight: 600 }}>Isgasaad</td>
                            <td style={{ fontSize: '11px' }}>{pkg.v}</td>
                            <td style={{ color: '#005cca', fontWeight: 600 }}>{pkg.n}</td>
                            <td>{pkg.ver}</td>
                            <td>{pkg.t}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {/* Pagination mock */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', fontSize: '12.5px', color: '#64748b' }}>
                    <div>
                      <span>Rows per page: </span>
                      <select style={{ border: '1px solid #cbd5e1', borderRadius: '4px', padding: '2px 4px' }}>
                        <option>15</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setPackagesPage(p => Math.max(1, p - 1))}>&lt;</button>
                      {[1,2,3,4,5].map(p => (
                        <span key={p} onClick={() => setPackagesPage(p)} style={{ fontWeight: packagesPage === p ? 600 : 400, color: packagesPage === p ? '#0f172a' : '#64748b', cursor: 'pointer' }}>{p}</span>
                      ))}
                      <span style={{ color: '#94a3b8' }}>...</span>
                      <span style={{ cursor: 'pointer' }} onClick={() => setPackagesPage(114)}>114</span>
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setPackagesPage(p => Math.min(114, p + 1))}>&gt;</button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Windows KBs tab */}
            {softwareSubTab === 'windows' && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                  <div className="wz-select-wrapper">
                    <select className="wz-select">
                      <option>KB (0)</option>
                    </select>
                  </div>
                </div>

                <div style={{
                  background: '#fffbeb',
                  border: '1px solid #fef3c7',
                  borderLeft: '4px solid #f59e0b',
                  borderRadius: '4px',
                  padding: '16px',
                  color: '#b45309',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13.5px',
                  fontWeight: 500,
                  marginTop: '16px'
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ flexShrink: 0 }}>
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>No results match your search criteria</span>
                </div>
              </>
            )}

            {/* Browser Extensions tab */}
            {softwareSubTab === 'browser' && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                  <div className="wz-select-wrapper">
                    <select className="wz-select">
                      <option>Browser name (0)</option>
                    </select>
                  </div>
                  <div className="wz-select-wrapper">
                    <select className="wz-select">
                      <option>Package name (0)</option>
                    </select>
                  </div>
                  <div className="wz-select-wrapper">
                    <select className="wz-select">
                      <option>Enabled (0)</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 3fr', gap: '20px', marginTop: '16px' }}>
                  
                  {/* Top 5 browsers */}
                  <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '16px' }}>Top 5 browsers</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ fontSize: '11.5px', color: '#64748b', width: '50px' }}>firefox</div>
                      <div style={{ flex: 1, height: '20px', background: '#99d8c9', borderRadius: '2px' }} />
                      <div style={{ fontSize: '11.5px', fontWeight: 600 }}>17</div>
                    </div>
                  </div>

                  {/* Top 5 packages */}
                  <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '16px' }}>Top 5 packages</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {['Amazon.com', 'Bing', 'Dark', 'Default', 'DoH Roll-Out'].map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ fontSize: '11px', color: '#64748b', width: '90px' }}>{item}</div>
                          <div style={{ flex: 1, height: '12px', background: '#99d8c9', borderRadius: '2px' }} />
                          <div style={{ fontSize: '11px', fontWeight: 600 }}>1</div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Hits grid */}
                <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '24px', marginTop: '16px' }}>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b', marginBottom: '12px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>17 hits</div>
                  <div className="wz-table-wrapper" style={{ border: 'none' }}>
                    <table className="wz-table">
                      <thead>
                        <tr>
                          <th>agent.name</th>
                          <th>browser.name</th>
                          <th>package.name</th>
                          <th>package.version</th>
                          <th>package.enabled</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { b: 'firefox', n: 'Language: English (CA)', ver: '136.0.20250227.124745', e: 'false' },
                          { b: 'firefox', n: 'Google', ver: '1.0', e: 'true' },
                          { b: 'firefox', n: 'Wikipedia (en)', ver: '1.0', e: 'true' },
                          { b: 'firefox', n: 'Twitter', ver: '1.0', e: 'true' },
                          { b: 'firefox', n: 'Firefox Screenshots', ver: '39.0.0', e: 'true' },
                          { b: 'firefox', n: 'Bing', ver: '1.1', e: 'true' },
                          { b: 'firefox', n: 'DuckDuckGo', ver: '1.0', e: 'true' }
                        ].map((item, idx) => (
                          <tr key={idx}>
                            <td style={{ color: '#005cca', fontWeight: 600 }}>Isgasaad</td>
                            <td>{item.b}</td>
                            <td style={{ color: '#005cca', fontWeight: 600 }}>{item.n}</td>
                            <td>{item.ver}</td>
                            <td><span style={{ 
                              background: item.e === 'true' ? '#dcfce7' : '#fee2e2',
                              color: item.e === 'true' ? '#15803d' : '#b91c1c',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: 600
                            }}>{item.e}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination mock */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', fontSize: '12.5px', color: '#64748b' }}>
                    <div>
                      <span>Rows per page: </span>
                      <select style={{ border: '1px solid #cbd5e1', borderRadius: '4px', padding: '2px 4px' }}>
                        <option>15</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>&lt;</button>
                      <span style={{ fontWeight: 600, color: '#0f172a' }}>1</span>
                      <span>2</span>
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>&gt;</button>
                    </div>
                  </div>
                </div>
              </>
            )}

          </div>
        )}

        {/* ==========================================
            TAB CONTENT: PROCESSES
            ========================================== */}
        {activeTab === 'processes' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Filter selectors row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              <div className="wz-select-wrapper">
                <select className="wz-select">
                  <option>Name (0)</option>
                </select>
              </div>
              <div className="wz-select-wrapper">
                <select className="wz-select">
                  <option>Command line (0)</option>
                </select>
              </div>
            </div>

            {/* Processes Dashboard Charts */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              
              {/* Top 5 processes */}
              <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '16px' }}>Top 5 processes</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { name: 'systemd-udevd', count: 21 },
                    { name: 'apache2', count: 6 },
                    { name: 'dbus-daemon', count: 3 },
                    { name: 'avahi-daemon', count: 2 },
                    { name: 'gnome-session-b', count: 2 }
                  ].map((proc, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ fontSize: '11px', color: '#64748b', width: '100px' }}>{proc.name}</div>
                      <div style={{ flex: proc.count / 21, height: '16px', background: '#99d8c9', borderRadius: '2px' }} />
                      <div style={{ fontSize: '11px', fontWeight: 600 }}>{proc.count}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Processes start time */}
              <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '16px' }}>Processes start time</h4>
                <div style={{ height: '120px', borderLeft: '1px solid #cbd5e1', borderBottom: '1px solid #cbd5e1', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '-18px', top: '0', fontSize: '9px', color: '#94a3b8' }}>200</span>
                  <span style={{ position: 'absolute', left: '-18px', top: '35px', fontSize: '9px', color: '#94a3b8' }}>150</span>
                  <span style={{ position: 'absolute', left: '-18px', top: '70px', fontSize: '9px', color: '#94a3b8' }}>100</span>
                  <span style={{ position: 'absolute', left: '-14px', top: '100px', fontSize: '9px', color: '#94a3b8' }}>50</span>
                  
                  {/* Flat line */}
                  <svg style={{ width: '100%', height: '100%', position: 'absolute', bottom: 0 }}>
                    <line x1="0" y1="120" x2="400" y2="120" stroke="#cbd5e1" strokeWidth="2" />
                  </svg>

                  <div style={{ display: 'flex', justifyContent: 'space-between', position: 'absolute', bottom: '-22px', left: 0, right: 0, fontSize: '8.5px', color: '#94a3b8' }}>
                    <span>2026-06-12 21:05</span>
                    <span>2026-06-12 21:15</span>
                    <span>2026-06-12 21:25</span>
                    <span>2026-06-12 21:35</span>
                    <span>2026-06-12 21:45</span>
                    <span>2026-06-12 21:55</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Hits grid */}
            <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '24px' }}>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b', marginBottom: '12px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>216 hits</div>
              <div className="wz-table-wrapper" style={{ border: 'none' }}>
                <table className="wz-table">
                  <thead>
                    <tr>
                      <th>agent.name</th>
                      <th>process.name</th>
                      <th>process.start</th>
                      <th>process.pid</th>
                      <th>process.parent.pid</th>
                      <th>process.command_line</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { n: 'ksoftirqd/0', start: 'Jun 12, 2026 @ 21:36:28.000', pid: '13', ppid: '2', cmd: '-' },
                      { n: 'zswap-shrink', start: 'Jun 12, 2026 @ 21:36:30.000', pid: '127', ppid: '2', cmd: '-' },
                      { n: 'systemd-timedat', start: 'Jun 12, 2026 @ 21:36:40.000', pid: '1308', ppid: '1', cmd: '/lib/systemd/systemd-timedated' },
                      { n: 'wazuh-syscheckd', start: 'Jun 12, 2026 @ 21:36:40.000', pid: '1458', ppid: '1', cmd: '/var/ossec/bin/wazuh-syscheckd' },
                      { n: 'rcu_sched', start: 'Jun 12, 2026 @ 21:36:28.000', pid: '14', ppid: '2', cmd: '-' },
                      { n: 'migration/0', start: 'Jun 12, 2026 @ 21:36:28.000', pid: '15', ppid: '2', cmd: '-' },
                      { n: 'at-spi-bus-laun', start: 'Jun 12, 2026 @ 21:36:41.000', pid: '1538', ppid: '791', cmd: '/usr/libexec/at-spi-bus-launcher' },
                      { n: 'tracker-store', start: 'Jun 12, 2026 @ 21:36:40.000', pid: '1427', ppid: '791', cmd: '/usr/libexec/tracker-store' },
                      { n: 'dbus-daemon', start: 'Jun 12, 2026 @ 21:36:41.000', pid: '1549', ppid: '1538', cmd: '/usr/bin/dbus-daemon' },
                      { n: 'idle_inject/0', start: 'Jun 12, 2026 @ 21:36:28.000', pid: '16', ppid: '2', cmd: '-' },
                      { n: 'kworker/0:1-eve', start: 'Jun 12, 2026 @ 21:36:28.000', pid: '17', ppid: '2', cmd: '-' },
                      { n: 'systemd-udevd', start: 'Jun 12, 2026 @ 21:36:31.000', pid: '312', ppid: '291', cmd: '/lib/systemd/systemd-udevd' },
                      { n: 'systemd-udevd', start: 'Jun 12, 2026 @ 21:36:31.000', pid: '314', ppid: '291', cmd: '/lib/systemd/systemd-udevd' },
                      { n: 'wazuh-logcollec', start: 'Jun 12, 2026 @ 21:36:42.000', pid: '1748', ppid: '1', cmd: '/var/ossec/bin/wazuh-logcollector' },
                      { n: 'kworker/0:3-pm', start: 'Jun 12, 2026 @ 21:36:30.000', pid: '178', ppid: '2', cmd: '-' }
                    ].map((proc, idx) => (
                      <tr key={idx}>
                        <td style={{ color: '#005cca', fontWeight: 600 }}>Isgasaad</td>
                        <td style={{ color: '#005cca', fontWeight: 600 }}>{proc.n}</td>
                        <td>{proc.start}</td>
                        <td>{proc.pid}</td>
                        <td>{proc.ppid}</td>
                        <td style={{ fontFamily: 'monospace', fontSize: '11.5px' }}>{proc.cmd}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination mock */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', fontSize: '12.5px', color: '#64748b' }}>
                <div>
                  <span>Rows per page: </span>
                  <select style={{ border: '1px solid #cbd5e1', borderRadius: '4px', padding: '2px 4px' }}>
                    <option>15</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>&lt;</button>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>1</span>
                  <span>2</span>
                  <span>3</span>
                  <span>4</span>
                  <span>5</span>
                  <span>...</span>
                  <span>15</span>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>&gt;</button>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ==========================================
            TAB CONTENT: NETWORK
            ========================================== */}
        {activeTab === 'network' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Network Sub-tabs */}
            <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid #cbd5e1', paddingBottom: '8px' }}>
              {['addresses', 'interfaces', 'protocols', 'listeners', 'traffic'].map(subTab => (
                <button 
                  key={subTab}
                  onClick={() => setNetworkSubTab(subTab as any)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: networkSubTab === subTab ? '#005cca' : '#475569',
                    fontWeight: networkSubTab === subTab ? 700 : 500,
                    fontSize: '13.5px',
                    cursor: 'pointer',
                    textTransform: 'capitalize'
                  }}
                >
                  {subTab}
                </button>
              ))}
            </div>

            {/* ADDRESSES SUBTAB */}
            {networkSubTab === 'addresses' && (
              <>
                {/* Selectors */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                  <div className="wz-select-wrapper"><select className="wz-select"><option>Network type (0)</option></select></div>
                  <div className="wz-select-wrapper"><select className="wz-select"><option>IP (0)</option></select></div>
                  <div className="wz-select-wrapper"><select className="wz-select"><option>Interface name (0)</option></select></div>
                </div>

                {/* Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '16px' }}>
                  {/* Network types bar */}
                  <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '16px' }}>Network types</h4>
                    <div style={{ display: 'flex', gap: '8px', height: '60px', alignItems: 'center' }}>
                      <div style={{ flex: 1, height: '28px', background: '#3b82f6', borderRadius: '2px', position: 'relative' }}>
                        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '50%', background: '#ec4899' }} />
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>
                        <div><span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#3b82f6', marginRight: '4px' }} />IPv4</div>
                        <div><span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#ec4899', marginRight: '4px' }} />IPv6</div>
                      </div>
                    </div>
                  </div>

                  {/* Unique network IPs */}
                  <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ fontSize: '48px', fontWeight: 700, color: '#1e293b' }}>2</div>
                    <div style={{ fontSize: '12.5px', color: '#64748b', fontWeight: 500, marginTop: '8px' }}>Unique networks</div>
                  </div>

                  {/* Top 5 interface names */}
                  <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '16px' }}>Top 5 interface names</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ fontSize: '11.5px', color: '#64748b', width: '50px' }}>enp1s0</div>
                      <div style={{ flex: 1, height: '20px', background: '#99d8c9', borderRadius: '2px' }} />
                      <div style={{ fontSize: '11.5px', fontWeight: 600 }}>2</div>
                    </div>
                  </div>
                </div>

                {/* Table */}
                <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '24px', marginTop: '16px' }}>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b', marginBottom: '12px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>2 hits</div>
                  <div className="wz-table-wrapper" style={{ border: 'none' }}>
                    <table className="wz-table">
                      <thead>
                        <tr>
                          <th>agent.name</th>
                          <th>network.ip</th>
                          <th>network.netmask</th>
                          <th>network.broadcast</th>
                          <th>network.type</th>
                          <th>interface.name</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={{ color: '#005cca', fontWeight: 600 }}>Isgasaad</td>
                          <td style={{ color: '#005cca', fontWeight: 600 }}>192.168.122.70</td>
                          <td>255.255.255.0</td>
                          <td>192.168.122.255</td>
                          <td>IPv4</td>
                          <td>enp1s0</td>
                        </tr>
                        <tr>
                          <td style={{ color: '#005cca', fontWeight: 600 }}>Isgasaad</td>
                          <td style={{ color: '#005cca', fontWeight: 600 }}>fe80::5054:ff:fea7:f3a1</td>
                          <td>ffff:ffff:ffff::</td>
                          <td>-</td>
                          <td>IPv6</td>
                          <td>enp1s0</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* INTERFACES SUBTAB */}
            {networkSubTab === 'interfaces' && (
              <>
                {/* Selectors */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                  <div className="wz-select-wrapper"><select className="wz-select"><option>Name (0)</option></select></div>
                  <div className="wz-select-wrapper"><select className="wz-select"><option>State (0)</option></select></div>
                  <div className="wz-select-wrapper"><select className="wz-select"><option>Type (0)</option></select></div>
                </div>

                {/* Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '16px' }}>
                  {/* Average packet loss */}
                  <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ fontSize: '48px', fontWeight: 700, color: '#1e293b' }}>4.15%</div>
                    <div style={{ fontSize: '12.5px', color: '#64748b', fontWeight: 500, marginTop: '8px' }}>Average packet loss rate</div>
                  </div>

                  {/* Interface states */}
                  <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '16px' }}>Interface states</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ flex: 1, height: '24px', background: '#a855f7', borderRadius: '2px' }} />
                      <div style={{ fontSize: '11px', color: '#64748b' }}><span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#a855f7', marginRight: '4px' }} />up</div>
                    </div>
                  </div>

                  {/* Interface types */}
                  <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '16px' }}>Interface types</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ flex: 1, height: '24px', background: '#ec4899', borderRadius: '2px' }} />
                      <div style={{ fontSize: '11px', color: '#64748b' }}><span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#ec4899', marginRight: '4px' }} />ethernet</div>
                    </div>
                  </div>
                </div>

                {/* Table */}
                <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '24px', marginTop: '16px' }}>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b', marginBottom: '12px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>1 hit</div>
                  <div className="wz-table-wrapper" style={{ border: 'none' }}>
                    <table className="wz-table">
                      <thead>
                        <tr>
                          <th>agent.name</th>
                          <th>interface.name</th>
                          <th>interface.type</th>
                          <th>interface.state</th>
                          <th>interface.mtu</th>
                          <th>host.mac</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={{ color: '#005cca', fontWeight: 600 }}>Isgasaad</td>
                          <td style={{ color: '#005cca', fontWeight: 600 }}>enp1s0</td>
                          <td>ethernet</td>
                          <td>up</td>
                          <td>1,500</td>
                          <td style={{ fontFamily: 'monospace' }}>52:54:00:a7:f3:a1</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* PROTOCOLS SUBTAB */}
            {networkSubTab === 'protocols' && (
              <>
                {/* Selectors */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                  <div className="wz-select-wrapper"><select className="wz-select"><option>Network type (0)</option></select></div>
                  <div className="wz-select-wrapper"><select className="wz-select"><option>Interface name (0)</option></select></div>
                  <div className="wz-select-wrapper"><select className="wz-select"><option>DHCP enabled (0)</option></select></div>
                </div>

                {/* Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '16px' }}>
                  {/* Network types */}
                  <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '16px' }}>Network types</h4>
                    <div style={{ display: 'flex', gap: '8px', height: '60px', alignItems: 'center' }}>
                      <div style={{ flex: 1, height: '28px', background: '#d97706', borderRadius: '2px', position: 'relative' }}>
                        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '50%', background: '#b45309' }} />
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>
                        <div><span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#d97706', marginRight: '4px' }} />ipv4</div>
                        <div><span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#b45309', marginRight: '4px' }} />ipv6</div>
                      </div>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px', display: 'flex', gap: '24px', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '36px', fontWeight: 700, color: '#1e293b' }}>0</div>
                      <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>Min network metric</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '36px', fontWeight: 700, color: '#1e293b' }}>20,100</div>
                      <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>Max network metric</div>
                    </div>
                  </div>

                  {/* DHCP enabled */}
                  <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '16px' }}>DHCP enabled</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ flex: 1, height: '24px', background: '#f59e0b', borderRadius: '2px' }} />
                      <div style={{ fontSize: '11px', color: '#64748b' }}><span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#f59e0b', marginRight: '4px' }} />false</div>
                    </div>
                  </div>
                </div>

                {/* Table */}
                <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '24px', marginTop: '16px' }}>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b', marginBottom: '12px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>2 hits</div>
                  <div className="wz-table-wrapper" style={{ border: 'none' }}>
                    <table className="wz-table">
                      <thead>
                        <tr>
                          <th>agent.name</th>
                          <th>interface.name</th>
                          <th>network.dhcp</th>
                          <th>network.gateway</th>
                          <th>network.type</th>
                          <th>network.metric</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={{ color: '#005cca', fontWeight: 600 }}>Isgasaad</td>
                          <td style={{ color: '#005cca', fontWeight: 600 }}>enp1s0</td>
                          <td>false</td>
                          <td>192.168.122.1</td>
                          <td>ipv4</td>
                          <td>20,100</td>
                        </tr>
                        <tr>
                          <td style={{ color: '#005cca', fontWeight: 600 }}>Isgasaad</td>
                          <td style={{ color: '#005cca', fontWeight: 600 }}>enp1s0</td>
                          <td>false</td>
                          <td>192.168.122.1</td>
                          <td>ipv6</td>
                          <td>0</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* LISTENERS SUBTAB */}
            {networkSubTab === 'listeners' && (
              <>
                {/* Selectors */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                  <div className="wz-select-wrapper"><select className="wz-select"><option>Source port (0)</option></select></div>
                  <div className="wz-select-wrapper"><select className="wz-select"><option>Transport protocol (0)</option></select></div>
                  <div className="wz-select-wrapper"><select className="wz-select"><option>Process name (0)</option></select></div>
                </div>

                {/* Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '16px' }}>
                  {/* Top 5 source ports */}
                  <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '16px' }}>Top 5 source ports</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {[
                        { port: '53', count: 17, color: '#99d8c9' },
                        { port: '953', count: 3, color: '#a855f7' },
                        { port: '137', count: 2, color: '#eab308' },
                        { port: '138', count: 2, color: '#f87171' },
                        { port: '631', count: 2, color: '#60a5fa' }
                      ].map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ fontSize: '11px', color: '#64748b', width: '30px' }}>{item.port}</div>
                          <div style={{ flex: item.count / 17, height: '14px', background: item.color, borderRadius: '2px' }} />
                          <div style={{ fontSize: '11px', fontWeight: 600 }}>{item.count}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Transport protocols */}
                  <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '16px' }}>Transport protocols</h4>
                    <div style={{ display: 'flex', gap: '4px', height: '80px', alignItems: 'center' }}>
                      <div style={{ flex: 1, height: '28px', background: '#3b82f6', borderRadius: '2px', position: 'relative' }}>
                        <div style={{ position: 'absolute', left: '25%', right: 0, top: 0, bottom: 0, background: '#10b981' }} />
                        <div style={{ position: 'absolute', left: '50%', right: 0, top: 0, bottom: 0, background: '#ec4899' }} />
                        <div style={{ position: 'absolute', left: '75%', right: 0, top: 0, bottom: 0, background: '#a855f7' }} />
                      </div>
                      <div style={{ fontSize: '9.5px', color: '#64748b', flexShrink: 0 }}>
                        <div><span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#3b82f6', marginRight: '4px' }} />tcp6</div>
                        <div><span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', marginRight: '4px' }} />tcp</div>
                        <div><span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#ec4899', marginRight: '4px' }} />udp</div>
                        <div><span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#a855f7', marginRight: '4px' }} />udp6</div>
                      </div>
                    </div>
                  </div>

                  {/* Top 5 processes */}
                  <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '16px' }}>Top 5 processes</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {[
                        { name: 'named', count: 18 },
                        { name: 'dovecot', count: 8 },
                        { name: 'nmbd', count: 6 },
                        { name: 'avahi-daemon', count: 4 },
                        { name: 'smbd', count: 4 }
                      ].map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ fontSize: '10.5px', color: '#64748b', width: '80px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{item.name}</div>
                          <div style={{ flex: item.count / 18, height: '14px', background: '#99d8c9', borderRadius: '2px' }} />
                          <div style={{ fontSize: '11px', fontWeight: 600 }}>{item.count}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Table */}
                <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '24px', marginTop: '16px' }}>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b', marginBottom: '12px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>51 hits</div>
                  <div className="wz-table-wrapper" style={{ border: 'none' }}>
                    <table className="wz-table">
                      <thead>
                        <tr>
                          <th>agent.name</th>
                          <th>source.ip</th>
                          <th>source.port</th>
                          <th>network.transport</th>
                          <th>process.name</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { ip: '0.0.0.0', port: '139', trans: 'tcp', proc: 'smbd' },
                          { ip: '::', port: '993', trans: 'tcp6', proc: 'dovecot' },
                          { ip: '127.0.0.1', port: '53', trans: 'tcp', proc: 'named' },
                          { ip: 'fe80::5054:ff:fea7:f3a1', port: '53', trans: 'udp6', proc: 'named' },
                          { ip: 'fe80::5054:ff:fea7:f3a1', port: '53', trans: 'tcp6', proc: 'named' },
                          { ip: '127.0.0.53', port: '53', trans: 'tcp', proc: 'systemd-resolve' },
                          { ip: '::1', port: '53', trans: 'tcp6', proc: 'named' },
                          { ip: '0.0.0.0', port: '995', trans: 'tcp', proc: 'dovecot' },
                          { ip: '127.0.0.1', port: '53', trans: 'udp', proc: 'named' },
                          { ip: '::', port: '139', trans: 'tcp6', proc: 'smbd' },
                          { ip: '::', port: '995', trans: 'tcp6', proc: 'dovecot' },
                          { ip: '::1', port: '53', trans: 'udp6', proc: 'named' },
                          { ip: '192.168.122.70', port: '53', trans: 'udp', proc: 'named' },
                          { ip: '192.168.122.70', port: '137', trans: 'udp', proc: 'nmbd' },
                          { ip: '::1', port: '953', trans: 'tcp6', proc: 'named' }
                        ].map((item, idx) => (
                          <tr key={idx}>
                            <td style={{ color: '#005cca', fontWeight: 600 }}>Isgasaad</td>
                            <td>{item.ip}</td>
                            <td>{item.port}</td>
                            <td>{item.trans}</td>
                            <td style={{ color: '#005cca', fontWeight: 600 }}>{item.proc}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination mock */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', fontSize: '12.5px', color: '#64748b' }}>
                    <div>
                      <span>Rows per page: </span>
                      <select style={{ border: '1px solid #cbd5e1', borderRadius: '4px', padding: '2px 4px' }}>
                        <option>15</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>&lt;</button>
                      <span style={{ fontWeight: 600, color: '#0f172a' }}>1</span>
                      <span>2</span>
                      <span>3</span>
                      <span>4</span>
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>&gt;</button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* TRAFFIC SUBTAB */}
            {networkSubTab === 'traffic' && (
              <>
                {/* Selectors */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                  <div className="wz-select-wrapper"><select className="wz-select"><option>Source port (0)</option></select></div>
                  <div className="wz-select-wrapper"><select className="wz-select"><option>Destination port (0)</option></select></div>
                  <div className="wz-select-wrapper"><select className="wz-select"><option>Transport protocol (0)</option></select></div>
                  <div className="wz-select-wrapper"><select className="wz-select"><option>Process name (0)</option></select></div>
                </div>

                {/* Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '16px' }}>
                  {/* Top 5 destination ports */}
                  <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '16px' }}>Top 5 destination ports</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {[
                        { port: '53', count: 2, color: '#99d8c9' },
                        { port: '67', count: 1, color: '#3b82f6' },
                        { port: '443', count: 1, color: '#ec4899' },
                        { port: '953', count: 1, color: '#a855f7' },
                        { port: '1514', count: 1, color: '#eab308' }
                      ].map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ fontSize: '11px', color: '#64748b', width: '30px' }}>{item.port}</div>
                          <div style={{ flex: item.count / 2, height: '14px', background: item.color, borderRadius: '2px' }} />
                          <div style={{ fontSize: '11px', fontWeight: 600 }}>{item.count}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Transport protocols */}
                  <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '16px' }}>Transport protocols</h4>
                    <div style={{ display: 'flex', gap: '8px', height: '60px', alignItems: 'center' }}>
                      <div style={{ flex: 1, height: '28px', background: '#3b82f6', borderRadius: '2px', position: 'relative' }}>
                        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '50%', background: '#ec4899' }} />
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>
                        <div><span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#3b82f6', marginRight: '4px' }} />tcp</div>
                        <div><span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#ec4899', marginRight: '4px' }} />udp</div>
                      </div>
                    </div>
                  </div>

                  {/* Top 5 processes */}
                  <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '16px' }}>Top 5 processes</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {[
                        { name: 'named', count: 2 },
                        { name: 'NetworkManager', count: 1 },
                        { name: 'snapd', count: 1 },
                        { name: 'wazuh-agentd', count: 1 }
                      ].map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ fontSize: '10.5px', color: '#64748b', width: '90px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{item.name}</div>
                          <div style={{ flex: item.count / 2, height: '14px', background: '#99d8c9', borderRadius: '2px' }} />
                          <div style={{ fontSize: '11px', fontWeight: 600 }}>{item.count}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Table */}
                <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '24px', marginTop: '16px' }}>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b', marginBottom: '12px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>6 hits</div>
                  <div className="wz-table-wrapper" style={{ border: 'none' }}>
                    <table className="wz-table">
                      <thead>
                        <tr>
                          <th>agent.name</th>
                          <th>source.ip</th>
                          <th>source.port</th>
                          <th>destination.ip</th>
                          <th>destination.port</th>
                          <th>network.transport</th>
                          <th>process.name</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { sip: '192.168.122.70', sport: '56205', dip: '192.33.4.12', dport: '53', trans: 'udp', proc: 'named' },
                          { sip: '192.168.122.70', sport: '37158', dip: '185.125.188.58', dport: '443', trans: 'tcp', proc: 'snapd' },
                          { sip: '127.0.0.1', sport: '39063', dip: '127.0.0.1', dport: '953', trans: 'tcp', proc: '-' },
                          { sip: '192.168.122.70', sport: '40075', dip: '192.168.8.127', dport: '1514', trans: 'tcp', proc: 'wazuh-agentd' },
                          { sip: '192.168.122.70', sport: '68', dip: '192.168.122.1', dport: '67', trans: 'udp', proc: 'NetworkManager' },
                          { sip: '192.168.122.70', sport: '35263', dip: '192.5.5.241', dport: '53', trans: 'udp', proc: 'named' }
                        ].map((item, idx) => (
                          <tr key={idx}>
                            <td style={{ color: '#005cca', fontWeight: 600 }}>Isgasaad</td>
                            <td>{item.sip}</td>
                            <td>{item.sport}</td>
                            <td>{item.dip}</td>
                            <td>{item.dport}</td>
                            <td>{item.trans}</td>
                            <td style={{ color: item.proc !== '-' ? '#005cca' : 'inherit', fontWeight: item.proc !== '-' ? 600 : 'normal' }}>{item.proc}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

          </div>
        )}

        {/* ==========================================
            TAB CONTENT: IDENTITY
            ========================================== */}
        {activeTab === 'identity' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Identity Sub-tabs */}
            <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid #cbd5e1', paddingBottom: '8px' }}>
              <button 
                onClick={() => setIdentitySubTab('users')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: identitySubTab === 'users' ? '#005cca' : '#475569',
                  fontWeight: identitySubTab === 'users' ? 700 : 500,
                  fontSize: '13.5px',
                  cursor: 'pointer'
                }}
              >
                Users
              </button>
              <button 
                onClick={() => setIdentitySubTab('groups')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: identitySubTab === 'groups' ? '#005cca' : '#475569',
                  fontWeight: identitySubTab === 'groups' ? 700 : 500,
                  fontSize: '13.5px',
                  cursor: 'pointer'
                }}
              >
                Groups
              </button>
            </div>

            {identitySubTab === 'users' && (
              <>
                {/* Selectors */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                  <div className="wz-select-wrapper"><select className="wz-select"><option>Name (0)</option></select></div>
                  <div className="wz-select-wrapper"><select className="wz-select"><option>Group (0)</option></select></div>
                  <div className="wz-select-wrapper"><select className="wz-select"><option>Shell (0)</option></select></div>
                </div>

                {/* Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '16px' }}>
                  
                  {/* Top 5 users */}
                  <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '16px' }}>Top 5 users</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {['_apt', 'avahi', 'avahi-autoipd', 'backup', 'bin'].map((user, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ fontSize: '11px', color: '#64748b', width: '90px' }}>{user}</div>
                          <div style={{ flex: 1, height: '14px', background: '#99d8c9', borderRadius: '2px' }} />
                          <div style={{ fontSize: '11px', fontWeight: 600 }}>1</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top 5 groups */}
                  <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '16px' }}>Top 5 user groups</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {[
                        { name: 'nogroup', count: 6 },
                        { name: 'adm', count: 2 },
                        { name: 'audio', count: 2 },
                        { name: 'lp', count: 2 },
                        { name: 'lpadmin', count: 2 }
                      ].map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ fontSize: '11px', color: '#64748b', width: '60px' }}>{item.name}</div>
                          <div style={{ flex: item.count / 6, height: '14px', background: '#99d8c9', borderRadius: '2px' }} />
                          <div style={{ fontSize: '11px', fontWeight: 600 }}>{item.count}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top 5 shells */}
                  <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '16px' }}>Top 5 user shells</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {[
                        { name: '/usr/sbin/nologin', count: 42 },
                        { name: '/bin/false', count: 6 },
                        { name: '/bin/bash', count: 1 },
                        { name: '/bin/sh', count: 1 },
                        { name: '/bin/sync', count: 1 }
                      ].map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ fontSize: '10px', color: '#64748b', width: '100px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{item.name}</div>
                          <div style={{ flex: item.count / 42, height: '14px', background: '#99d8c9', borderRadius: '2px' }} />
                          <div style={{ fontSize: '11px', fontWeight: 600 }}>{item.count}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Table */}
                <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '24px', marginTop: '16px' }}>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b', marginBottom: '12px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>51 hits</div>
                  <div className="wz-table-wrapper" style={{ border: 'none' }}>
                    <table className="wz-table">
                      <thead>
                        <tr>
                          <th>agent.name</th>
                          <th>user.name</th>
                          <th>user.groups</th>
                          <th>user.shell</th>
                          <th>user.home</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { n: '_apt', g: 'nogroup', s: '/usr/sbin/nologin', h: '/nonexistent' },
                          { n: 'avahi', g: 'avahi', s: '/usr/sbin/nologin', h: '/var/run/avahi-daemon' },
                          { n: 'avahi-autoipd', g: 'avahi-autoipd', s: '/usr/sbin/nologin', h: '/var/lib/avahi-autoipd' },
                          { n: 'backup', g: 'backup', s: '/usr/sbin/nologin', h: '/var/backups' },
                          { n: 'bin', g: 'bin', s: '/usr/sbin/nologin', h: '/bin' },
                          { n: 'bind', g: 'bind', s: '/usr/sbin/nologin', h: '/var/cache/bind' },
                          { n: 'colord', g: 'colord', s: '/usr/sbin/nologin', h: '/var/lib/colord' },
                          { n: 'cups-pk-helper', g: 'lpadmin', s: '/usr/sbin/nologin', h: '/home/cups-pk-helper' },
                          { n: 'daemon', g: 'daemon', s: '/usr/sbin/nologin', h: '/usr/sbin' },
                          { n: 'dnsmasq', g: 'nogroup', s: '/usr/sbin/nologin', h: '/var/lib/misc' },
                          { n: 'dovecot', g: 'dovecot', s: '/usr/sbin/nologin', h: '/usr/lib/dovecot' },
                          { n: 'dovenull', g: 'dovenull', s: '/usr/sbin/nologin', h: '/nonexistent' },
                          { n: 'games', g: 'games', s: '/usr/sbin/nologin', h: '/usr/games' },
                          { n: 'gdm', g: 'gdm', s: '/bin/false', h: '/var/lib/gdm3' },
                          { n: 'geoclue', g: 'geoclue', s: '/usr/sbin/nologin', h: '/var/lib/geoclue' }
                        ].map((item, idx) => (
                          <tr key={idx}>
                            <td style={{ color: '#005cca', fontWeight: 600 }}>Isgasaad</td>
                            <td style={{ color: '#005cca', fontWeight: 600 }}>{item.n}</td>
                            <td>{item.g}</td>
                            <td>{item.s}</td>
                            <td>{item.h}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination mock */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', fontSize: '12.5px', color: '#64748b' }}>
                    <div>
                      <span>Rows per page: </span>
                      <select style={{ border: '1px solid #cbd5e1', borderRadius: '4px', padding: '2px 4px' }}>
                        <option>15</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>&lt;</button>
                      <span style={{ fontWeight: 600, color: '#0f172a' }}>1</span>
                      <span>2</span>
                      <span>3</span>
                      <span>4</span>
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>&gt;</button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {identitySubTab === 'groups' && (
              <>
                {/* Selectors */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                  <div className="wz-select-wrapper"><select className="wz-select"><option>Name (0)</option></select></div>
                  <div className="wz-select-wrapper"><select className="wz-select"><option>User (0)</option></select></div>
                </div>

                {/* Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '20px', marginTop: '16px' }}>
                  
                  {/* Top 5 groups */}
                  <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '16px' }}>Top 5 groups</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {['adm', 'audio', 'avahi', 'avahi-autoipd', 'backup'].map((group, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ fontSize: '11.5px', color: '#64748b', width: '90px' }}>{group}</div>
                          <div style={{ flex: 1, height: '14px', background: '#99d8c9', borderRadius: '2px' }} />
                          <div style={{ fontSize: '11px', fontWeight: 600 }}>1</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Unique groups */}
                  <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ fontSize: '64px', fontWeight: 700, color: '#1e293b', lineHeight: 1 }}>80</div>
                    <div style={{ fontSize: '14px', color: '#64748b', fontWeight: 500, marginTop: '12px' }}>Unique groups</div>
                  </div>

                </div>

                {/* Hits grid */}
                <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '24px', marginTop: '16px' }}>
                  
                  {/* Header Tools */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', gap: '16px', fontSize: '12.5px', color: '#64748b' }}>
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>📥 Export Formatted</button>
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', color: '#cbd5e1' }} disabled>🔄 Reset view</button>
                      <span style={{ color: '#94a3b8' }}>|</span>
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>👁️ 16 available fields</button>
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>📋 Columns</button>
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>↕️ Density</button>
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>⇅ Sort fields</button>
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>🔲 Full screen</button>
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>80 hits</div>
                  </div>

                  <div className="wz-table-wrapper" style={{ border: 'none' }}>
                    <table className="wz-table">
                      <thead>
                        <tr>
                          <th>agent.name</th>
                          <th>group.name</th>
                          <th>group.is_hidden</th>
                          <th>group.users</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { n: 'adm', h: 'false', u: 'saad, syslog' },
                          { n: 'audio', h: 'false', u: 'pulse, speech-dispatcher' },
                          { n: 'avahi', h: 'false', u: 'avahi' },
                          { n: 'avahi-autoipd', h: 'false', u: 'avahi-autoipd' },
                          { n: 'backup', h: 'false', u: 'backup' },
                          { n: 'bin', h: 'false', u: 'bin' },
                          { n: 'bind', h: 'false', u: 'bind' },
                          { n: 'bluetooth', h: 'false', u: '-' },
                          { n: 'cdrom', h: 'false', u: 'saad' },
                          { n: 'colord', h: 'false', u: 'colord' },
                          { n: 'crontab', h: 'false', u: '-' },
                          { n: 'daemon', h: 'false', u: 'daemon' },
                          { n: 'dialout', h: 'false', u: '-' },
                          { n: 'dip', h: 'false', u: 'saad' },
                          { n: 'disk', h: 'false', u: '-' }
                        ].map((item, idx) => (
                          <tr key={idx}>
                            <td style={{ color: '#005cca', fontWeight: 600 }}>Isgasaad</td>
                            <td style={{ color: '#005cca', fontWeight: 600 }}>{item.n}</td>
                            <td>{item.h}</td>
                            <td>{item.u}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', fontSize: '12.5px', color: '#64748b' }}>
                    <div>
                      <span>Rows per page: </span>
                      <select style={{ border: '1px solid #cbd5e1', borderRadius: '4px', padding: '2px 4px' }}>
                        <option>15</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>&lt;</button>
                      <span style={{ fontWeight: 600, color: '#0f172a' }}>1</span>
                      <span>2</span>
                      <span>3</span>
                      <span>4</span>
                      <span>5</span>
                      <span>6</span>
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>&gt;</button>
                    </div>
                  </div>

                </div>
              </>
            )}

          </div>
        )}

        {/* ==========================================
            TAB CONTENT: SERVICES
            ========================================== */}
        {activeTab === 'services' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Selectors */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              <div className="wz-select-wrapper"><select className="wz-select"><option>Name (0)</option></select></div>
            </div>

            {/* Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '20px' }}>
              
              {/* Top 5 services */}
              <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '16px' }}>Top 5 services</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    'ModemManager',
                    'NetworkManager',
                    'NetworkManager-dispatcher',
                    'NetworkManager-wait-online',
                    'accounts-daemon'
                  ].map((service, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ fontSize: '11.5px', color: '#64748b', width: '180px' }}>{service}</div>
                      <div style={{ flex: 1, height: '14px', background: '#99d8c9', borderRadius: '2px' }} />
                      <div style={{ fontSize: '11px', fontWeight: 600 }}>1</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Unique services */}
              <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: '64px', fontWeight: 700, color: '#1e293b', lineHeight: 1 }}>134</div>
                <div style={{ fontSize: '14px', color: '#64748b', fontWeight: 500, marginTop: '12px' }}>Unique services</div>
              </div>

            </div>

            {/* Table */}
            <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '24px' }}>
              
              {/* Header Tools */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '16px', fontSize: '12.5px', color: '#64748b' }}>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>📥 Export Formatted</button>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', color: '#cbd5e1' }} disabled>🔄 Reset view</button>
                  <span style={{ color: '#94a3b8' }}>|</span>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>👁️ 41 available fields</button>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>📋 Columns</button>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>↕️ Density</button>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>⇅ Sort fields</button>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>🔲 Full screen</button>
                </div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>134 hits</div>
              </div>

              <div className="wz-table-wrapper" style={{ border: 'none' }}>
                <table className="wz-table">
                  <thead>
                    <tr>
                      <th>agent.name</th>
                      <th>service.name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      'apache2',
                      'ModemManager',
                      'NetworkManager',
                      'systemd-fsck@dev-disk-by\\x2duuid-2523\\x2d4152',
                      'systemd-machine-id-commit',
                      'snapd',
                      'systemd-udev-trigger',
                      'gdm',
                      'auditd',
                      'systemd-quotacheck',
                      'phpsessionclean',
                      'systemd-tmpfiles-clean',
                      'systemd-update-utmp',
                      'motd-news',
                      'snapd.failure'
                    ].map((item, idx) => (
                      <tr key={idx}>
                        <td style={{ color: '#005cca', fontWeight: 600 }}>Isgasaad</td>
                        <td style={{ color: '#005cca', fontWeight: 600 }}>{item}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', fontSize: '12.5px', color: '#64748b' }}>
                <div>
                  <span>Rows per page: </span>
                  <select style={{ border: '1px solid #cbd5e1', borderRadius: '4px', padding: '2px 4px' }}>
                    <option>15</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>&lt;</button>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>1</span>
                  <span>2</span>
                  <span>3</span>
                  <span>4</span>
                  <span>5</span>
                  <span>...</span>
                  <span>9</span>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>&gt;</button>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ItHygiene;
