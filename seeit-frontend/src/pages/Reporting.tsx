import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { FiRefreshCw, FiSearch, FiExternalLink } from 'react-icons/fi';

const Reporting: React.FC = () => {
  const [reportName, setReportName] = useState('');
  const [reportDesc, setReportDesc] = useState('');
  const [reportSource, setReportSource] = useState('vulnerabilities');
  const [reportFormat, setReportFormat] = useState('PDF');
  const [reportTrigger, setReportTrigger] = useState('manual');
  const [reportTimeRange, setReportTimeRange] = useState('last7d');
  const [reportList, setReportList] = useState<{id: string; name: string; desc: string; format: string; created: string; status: string}[]>(() => {
    try { return JSON.parse(localStorage.getItem('wz_reports') || '[]'); } catch { return []; }
  });
  const [currentView, setCurrentView] = useState<'list' | 'create'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState('');
  const [stateFilter, setStateFilter] = useState('');

  const filteredReportList = reportList.filter(r => {
    if (searchTerm && !r.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (typeFilter && r.format !== typeFilter) return false;
    if (stateFilter && r.status !== stateFilter) return false;
    return true;
  });
  const totalPages = Math.ceil(filteredReportList.length / 15) || 1;
  const paginatedReports = filteredReportList.slice((page - 1) * 15, page * 15);

  if (currentView === 'create') {
    return (
      <div className="wz-page" style={{ background: '#f8fafc', paddingBottom: '80px' }}>
        <div style={{ padding: '20px 32px', borderBottom: '1px solid #e2e8f0', background: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#64748b' }}>
            <span style={{ cursor: 'pointer', color: '#005cca' }} onClick={() => { setCurrentView('list'); toast.success('Returned to reporting list'); }}>Reporting</span>
          <span>/</span>
          <span style={{ color: '#1e293b', fontWeight: 500 }}>Create report definition</span>
        </div>

        <div className="wz-page-content" style={{ maxWidth: '800px', margin: '0', padding: '32px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 300, color: '#1e293b', margin: '0 0 32px 0' }}>Create report definition</h1>
          
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 300, color: '#1e293b', margin: '0 0 16px 0' }}>Report settings</h2>
            <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '0 -32px 24px -32px' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Name */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Name</label>
                <input 
                  type="text" 
                  placeholder="Report name (e.g Log Traffic Daily Report)" 
                  value={reportName}
                  onChange={e => setReportName(e.target.value)}
                  style={{ width: '100%', maxWidth: '500px', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none' }}
                />
                <p style={{ fontSize: '12px', color: '#64748b', margin: '8px 0 0 0', lineHeight: '1.5' }}>
                  Valid characters are a-z, A-Z, 0-9, (), [], _ (underscore), - (hyphen) and<br/>(space).
                </p>
              </div>

              {/* Description */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Description (optional)</label>
                <textarea 
                  placeholder="Describe this report (e.g Morning daily reports for log traffic)" 
                  rows={4}
                  value={reportDesc}
                  onChange={e => setReportDesc(e.target.value)}
                  style={{ width: '100%', maxWidth: '500px', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none', resize: 'vertical' }}
                />
              </div>

              {/* Report source */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Report source</label>
                <select value={reportSource} onChange={e => setReportSource(e.target.value)} style={{ width: '100%', maxWidth: '300px', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none', background: '#ffffff' }}>
                  <option value="vulnerabilities">Vulnerabilities</option>
                  <option value="events">Events</option>
                  <option value="alerts">Alerts</option>
                  <option value="compliance">Compliance</option>
                </select>
              </div>

              {/* Select dashboard */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Select dashboard</label>
                <select style={{ width: '100%', maxWidth: '300px', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none', background: '#ffffff' }}>
                  <option>Select a dashboard</option>
                </select>
              </div>

              {/* Time range */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Time range</label>
                <select value={reportTimeRange} onChange={e => setReportTimeRange(e.target.value)} style={{ width: '100%', maxWidth: '300px', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none', background: '#ffffff' }}>
                  <option value="last30m">Last 30 minutes</option>
                  <option value="last1h">Last 1 hour</option>
                  <option value="last24h">Last 24 hours</option>
                  <option value="last7d">Last 7 days</option>
                  <option value="last30d">Last 30 days</option>
                  <option value="last90d">Last 90 days</option>
                </select>
              </div>

              {/* File format */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>File format</label>
                <select value={reportFormat} onChange={e => setReportFormat(e.target.value)} style={{ width: '100%', maxWidth: '300px', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none', background: '#ffffff' }}>
                  <option value="PDF">PDF</option>
                  <option value="CSV">CSV</option>
                  <option value="PNG">PNG</option>
                </select>
              </div>

              {/* Report header and footer */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Report header and footer</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155', cursor: 'pointer' }}>
                    <input type="checkbox" style={{ accentColor: '#005cca' }} /> Add header
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155', cursor: 'pointer' }}>
                    <input type="checkbox" style={{ accentColor: '#005cca' }} /> Add footer
                  </label>
                </div>
              </div>

              {/* Report trigger */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Report trigger</label>
                <select value={reportTrigger} onChange={e => setReportTrigger(e.target.value)} style={{ width: '100%', maxWidth: '300px', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none', background: '#ffffff' }}>
                  <option value="manual">On demand</option>
                  <option value="schedule">Schedule</option>
                </select>
              </div>

            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{ position: 'fixed', bottom: 0, left: '260px', right: 0, background: '#ffffff', borderTop: '1px solid #e2e8f0', padding: '16px 32px', display: 'flex', justifyContent: 'flex-end', gap: '16px', zIndex: 10 }}>
          <button onClick={() => { setCurrentView('list'); toast.success('Cancelled'); }} style={{ background: 'none', border: 'none', color: '#005cca', fontSize: '14px', fontWeight: 600, cursor: 'pointer', padding: '8px 16px' }}>
            Cancel
          </button>
          <button onClick={() => {
            if (!reportName.trim()) { toast.error('Report name is required'); return; }
            const newReport = {
              id: Date.now().toString(),
              name: reportName,
              desc: reportDesc,
              format: reportFormat,
              created: new Date().toLocaleString(),
              status: reportFormat === 'PDF' ? 'completed' : 'completed'
            };
            const updated = [...reportList, newReport];
            setReportList(updated);
            localStorage.setItem('wz_reports', JSON.stringify(updated));
            toast.success(`Report "${reportName}" created successfully`);
            setCurrentView('list');
            setReportName(''); setReportDesc('');
          }} style={{ background: '#005cca', color: '#ffffff', border: 'none', borderRadius: '4px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', padding: '8px 24px' }}>
            Create
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="wz-page" style={{ background: '#f8fafc' }}>
      <div className="wz-page-content" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '32px' }}>
        
        <h1 style={{ fontSize: '28px', fontWeight: 300, color: '#1e293b', margin: '0 0 10px 0' }}>
          Reporting
        </h1>

        {/* REPORTS CARD */}
        <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b', margin: 0 }}>
              Reports <span style={{ color: '#64748b', fontWeight: 400 }}>({reportList.length})</span>
            </h2>
            <button onClick={() => toast.success('Reports refreshed')} style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '6px 16px', color: '#005cca', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <FiRefreshCw size={14} /> Refresh
            </button>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={16} />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchTerm}
                onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
                style={{ width: '100%', padding: '8px 12px 8px 36px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <select value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setPage(1); }} style={{ padding: '8px 32px 8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', background: '#ffffff', color: '#1e293b', outline: 'none' }}>
              <option value="">Type</option>
              <option value="PDF">PDF</option>
              <option value="CSV">CSV</option>
              <option value="PNG">PNG</option>
            </select>
            <select value={stateFilter} onChange={e => { setStateFilter(e.target.value); setPage(1); }} style={{ padding: '8px 32px 8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', background: '#ffffff', color: '#1e293b', outline: 'none' }}>
              <option value="">State</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '12px 16px', color: '#1e293b', fontWeight: 700 }}>Name</th>
                <th style={{ padding: '12px 16px', color: '#1e293b', fontWeight: 700 }}>Source</th>
                <th style={{ padding: '12px 16px', color: '#1e293b', fontWeight: 700 }}>Type</th>
                <th style={{ padding: '12px 16px', color: '#1e293b', fontWeight: 700 }}>Creation time</th>
                <th style={{ padding: '12px 16px', color: '#1e293b', fontWeight: 700 }}>State</th>
                <th style={{ padding: '12px 16px', color: '#1e293b', fontWeight: 700 }}>Generate</th>
              </tr>
            </thead>
            <tbody>
              {paginatedReports.map((r, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '12px 16px', color: '#1e293b', fontWeight: 500 }}>{r.name}</td>
                  <td style={{ padding: '12px 16px', color: '#64748b' }}>--</td>
                  <td style={{ padding: '12px 16px', color: '#64748b' }}>{r.format}</td>
                  <td style={{ padding: '12px 16px', color: '#64748b' }}>{r.created}</td>
                  <td style={{ padding: '12px 16px', color: r.status === 'completed' ? '#10b981' : '#f59e0b' }}>{r.status}</td>
                  <td style={{ padding: '12px 16px' }}>
                    {r.format === 'CSV' ? (
                      <button onClick={() => {
                        const csv = ['Name,Description,Format,Created,Status'];
                        csv.push(`"${r.name}","${r.desc}","${r.format}","${r.created}","${r.status}"`);
                        const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url; a.download = `${r.name}.csv`; a.click();
                        URL.revokeObjectURL(url);
                        toast.success('CSV downloaded');
                      }} style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '4px 12px', color: '#005cca', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>
                        Download CSV
                      </button>
                    ) : (
                      <button onClick={() => {
                        toast.success('PDF export initiated');
                        setTimeout(() => toast.success('PDF report ready for download'), 1500);
                      }} style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '4px 12px', color: '#005cca', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>
                        Export PDF
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {paginatedReports.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', borderTop: '1px solid #e2e8f0' }}>
              <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b', margin: '0 0 16px 0' }}>No reports created yet</h4>
              <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 8px 0', lineHeight: 1.5 }}>
                No reports created yet. Click Create to generate your first report.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0 0 0', fontSize: '13px', color: '#64748b' }}>
              <span>Showing {paginatedReports.length} of {filteredReportList.length} reports</span>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1} style={{ background: 'none', border: 'none', color: page <= 1 ? '#cbd5e1' : '#005cca', cursor: page <= 1 ? 'not-allowed' : 'pointer', fontWeight: 600 }}>
                  Previous
                </button>
                <span style={{ color: '#1e293b', fontWeight: 500 }}>Page {page} of {totalPages}</span>
                <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page >= totalPages} style={{ background: 'none', border: 'none', color: page >= totalPages ? '#cbd5e1' : '#005cca', cursor: page >= totalPages ? 'not-allowed' : 'pointer', fontWeight: 600 }}>
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* REPORT DEFINITIONS CARD */}
        <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b', margin: 0 }}>
              Report definitions <span style={{ color: '#64748b', fontWeight: 400 }}>(0)</span>
            </h2>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => toast.success('Report definitions refreshed')} style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '6px 16px', color: '#005cca', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <FiRefreshCw size={14} /> Refresh
              </button>
              <button onClick={() => { setCurrentView('create'); toast.success('Creating new report definition'); }} style={{ background: '#005cca', border: 'none', borderRadius: '4px', padding: '6px 20px', color: '#ffffff', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                Create
              </button>
            </div>
          </div>

          <div style={{ position: 'relative', marginBottom: '24px' }}>
            <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={16} />
            <input 
              type="text" 
              placeholder="Search..." 
              style={{ width: '100%', padding: '8px 12px 8px 36px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none', boxSizing: 'border-box', background: '#fafafa' }}
            />
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '12px 16px', color: '#1e293b', fontWeight: 700 }}>Name</th>
                <th style={{ padding: '12px 16px', color: '#1e293b', fontWeight: 700 }}>Source</th>
                <th style={{ padding: '12px 16px', color: '#1e293b', fontWeight: 700 }}>Type</th>
                <th style={{ padding: '12px 16px', color: '#1e293b', fontWeight: 700 }}>Schedule details</th>
                <th style={{ padding: '12px 16px', color: '#1e293b', fontWeight: 700 }}>Last Updated</th>
                <th style={{ padding: '12px 16px', color: '#1e293b', fontWeight: 700 }}>Status</th>
              </tr>
            </thead>
          </table>

          <div style={{ textAlign: 'center', padding: '60px 20px', borderTop: '1px solid #e2e8f0' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b', margin: '0 0 16px 0' }}>No report definitions to display</h4>
            <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 8px 0', lineHeight: 1.5 }}>
              Create a new report definition to get started
            </p>
            <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 24px 0' }}>
              To learn more, see <a href="#" style={{ color: '#005cca', textDecoration: 'none', fontWeight: 500 }}>Get started with OpenSearch<br/>Dashboards reporting <FiExternalLink size={12} /></a>
            </p>
            <button onClick={() => { setCurrentView('create'); toast.success('Creating new report definition'); }} style={{ background: '#ffffff', border: '1px solid #005cca', borderRadius: '4px', padding: '8px 16px', color: '#005cca', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
              Create report definition
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Reporting;
