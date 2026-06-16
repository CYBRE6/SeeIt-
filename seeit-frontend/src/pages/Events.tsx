import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  FiSearch, FiRefreshCw, FiChevronRight, FiChevronDown, FiCalendar, 
  FiFilter, FiPlus, FiGrid, FiEye, FiSettings, FiDownload, FiFileText, FiX
} from 'react-icons/fi';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend
} from 'chart.js';
import toast from 'react-hot-toast';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Define alert details structure
interface SecurityAlert {
  id: string;
  time: string;
  fields: Record<string, string>;
  details: Record<string, any>;
}

const mockAlertsData: SecurityAlert[] = [
  {
    id: '1781183695',
    time: 'Jun 11, 2026 @ 13:23:03.697',
    fields: {
      'predecoder.hostname': 'saad-Ubuntu-24-04-PC-Q35-ICH9-2009',
      'predecoder.program_name': 'pkexec',
      'agent.ip': '192.168.122.70',
      'agent.name': 'Isgasaad',
      'agent.id': '001',
      'manager.name': 'saad-cyber6',
      'data.uid': '1000',
      'data.dstuser': 'root',
      'rule.mail': 'false',
      'rule.level': '3',
      'rule.pci_dss': '10.2.5',
      'rule.hipaa': '164.312.b',
      'rule.tsc': 'CC6.8, CC7.2, CC7.3',
      'rule.description': 'PAM: Login session opened.',
      'rule.groups': 'pam, syslog, authentication_success',
      'rule.gdpr': 'IV_32.2',
      'rule.mitre.technique': 'Valid Accounts',
      'rule.mitre.id': 'T1078',
      'rule.mitre.tactic': 'Defense Evasion, Persistence'
    },
    details: {
      predecoder: { hostname: 'saad-Ubuntu-24-04-PC-Q35-ICH9-2009', program_name: 'pkexec' },
      agent: { ip: '192.168.122.70', name: 'Isgasaad', id: '001' },
      manager: { name: 'saad-cyber6' },
      data: { uid: '1000', dstuser: 'root' },
      rule: { level: 3, description: 'PAM: Login session opened.', pci_dss: ['10.2.5'], hipaa: ['164.312.b'] }
    }
  },
  {
    id: '1781183696',
    time: 'Jun 11, 2026 @ 13:08:59.589',
    fields: {
      'agent.ip': '192.168.122.70',
      'agent.name': 'Isgasaad',
      'agent.id': '001',
      'manager.name': 'saad-cyber6',
      'data.dpkg_status': 'status installed',
      'data.package': 'systemd',
      'data.arch': 'amd64',
      'data.version': '245.4-4ubuntu3',
      'rule.level': '7',
      'rule.pci_dss': '10.6.1, 10.2.7',
      'rule.hipaa': '164.312.b',
      'rule.tsc': 'CC7.2, CC7.3, CC6.8, CC8.1',
      'rule.description': 'New dpkg (Debian Package) installed.',
      'rule.groups': 'syslog, dpkg, config_changed',
      'rule.gdpr': 'IV_35.7.d',
      'location': '/var/log/dpkg.log'
    },
    details: {
      agent: { ip: '192.168.122.70', name: 'Isgasaad', id: '001' },
      manager: { name: 'saad-cyber6' },
      data: { dpkg_status: 'status installed', package: 'systemd', arch: 'amd64', version: '245.4-4ubuntu3' },
      rule: { level: 7, description: 'New dpkg (Debian Package) installed.', pci_dss: ['10.6.1', '10.2.7'] }
    }
  },
  {
    id: '1781183697',
    time: 'Jun 11, 2026 @ 13:08:59.587',
    fields: {
      'agent.ip': '192.168.122.70',
      'agent.name': 'Isgasaad',
      'agent.id': '001',
      'manager.name': 'saad-cyber6',
      'data.dpkg_status': 'status half-configured',
      'data.package': 'systemd',
      'data.arch': 'amd64',
      'data.version': '245.4-4ubuntu3',
      'rule.level': '3',
      'rule.description': 'dpkg package half-configured.',
      'rule.groups': 'syslog, dpkg',
      'location': '/var/log/dpkg.log'
    },
    details: {
      agent: { ip: '192.168.122.70', name: 'Isgasaad', id: '001' },
      manager: { name: 'saad-cyber6' },
      data: { dpkg_status: 'status half-configured', package: 'systemd', arch: 'amd64' },
      rule: { level: 3, description: 'dpkg package half-configured.' }
    }
  },
  {
    id: '1781183698',
    time: 'Jun 11, 2026 @ 12:45:12.112',
    fields: {
      'predecoder.hostname': 'db-server-02',
      'agent.ip': '192.168.122.88',
      'agent.name': 'db-prod-02',
      'agent.id': '002',
      'rule.level': '12',
      'rule.description': 'SSH: Multiple failed login attempts (Brute Force).',
      'rule.groups': 'ssh, authentication_failed, attack',
      'rule.mitre.technique': 'Brute Force',
      'rule.mitre.id': 'T1110',
      'rule.mitre.tactic': 'Credential Access'
    },
    details: {
      agent: { ip: '192.168.122.88', name: 'db-prod-02', id: '002' },
      rule: { level: 12, description: 'SSH: Multiple failed login attempts (Brute Force).' }
    }
  },
  {
    id: '1781183699',
    time: 'Jun 11, 2026 @ 12:12:34.900',
    fields: {
      'agent.name': 'Isgasaad',
      'agent.id': '001',
      'rule.level': '9',
      'rule.description': 'Malware signature match: Trojan.Generic.xyz detected.',
      'rule.groups': 'malware, infection, virus',
      'rule.mitre.technique': 'User Execution',
      'rule.mitre.id': 'T1204',
      'rule.mitre.tactic': 'Execution'
    },
    details: {
      agent: { id: '001', name: 'Isgasaad' },
      rule: { level: 9, description: 'Malware signature match: Trojan.Generic.xyz detected.' }
    }
  }
];

const availableFields = [
  '_index', 'agent.id', 'agent.ip', 'agent.name', 'data.arch', 
  'data.command', 'data.dpkg_status', 'data.dstuser', 'data.extra_data',
  'data.package', 'data.pwd', 'data.sca.check.command', 'data.sca.check.compliance.cis',
  'data.sca.check.compliance.cis_csc_v7'
];

const Events: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [search, setSearch] = useState('');
  const [expandedAlert, setExpandedAlert] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('Last 24 hours');
  const [showDates, setShowDates] = useState(false);
  const [showFilterPopover, setShowFilterPopover] = useState(false);
  const [selectedFields, setSelectedFields] = useState<string[]>(['_source']);
  const [fieldSearch, setFieldSearch] = useState('');
  const [filters, setFilters] = useState<{ field: string; operator: string; value: string; enabled: boolean; pinned: boolean; exclude: boolean }[]>([]);
  const [editingFilterIdx, setEditingFilterIdx] = useState<number | null>(null);
  const [editField, setEditField] = useState('');
  const [editOperator, setEditOperator] = useState('');
  const [editValue, setEditValue] = useState('');
  const [showInspect, setShowInspect] = useState(false);
  const [inspectTab, setInspectTab] = useState('Request');

  const [currentPage, setCurrentPage] = useState(1);
  const [savedSearches, setSavedSearches] = useState<{ name: string; search: string; filters: any[] }[]>(() => {
    try { return JSON.parse(localStorage.getItem('wz_saved_searches') || '[]'); } catch { return []; }
  });
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [autoRefreshInterval, setAutoRefreshInterval] = useState(15);
  const [showOpenModal, setShowOpenModal] = useState(false);
  const ITEMS_PER_PAGE = 15;
  const [showTimePicker, setShowTimePicker] = useState(false);
  const chartRef = useRef<any>(null);
  const [filterField, setFilterField] = useState('agent.name');
  const [filterOperator, setFilterOperator] = useState('is');
  const [filterValue, setFilterValue] = useState('');

  // Handle query params from search query (e.g. clicking a card in Dashboard)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get('search');
    if (searchQuery) {
      setSearch(searchQuery);
    }
    const filtersParam = params.get('filters');
    if (filtersParam) {
      try {
        const parsed = JSON.parse(filtersParam);
        setFilters(parsed.map((f: any) => ({ ...f, enabled: true, pinned: false, exclude: false })));
      } catch {}
    }
    const timeRangeParam = params.get('timeRange');
    if (timeRangeParam) setTimeRange(timeRangeParam);
  }, [location]);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      toast.success(`Auto-refreshed (${autoRefreshInterval}s)`);
    }, autoRefreshInterval * 1000);
    return () => clearInterval(interval);
  }, [autoRefresh, autoRefreshInterval]);

  // Reset page when filters/search change
  useEffect(() => { setCurrentPage(1); }, [search, filters]);

  // Handle DQL search and Filter Builder filtering
  const filteredAlerts = mockAlertsData.filter(alert => {
    // 1. Text Search
    if (search.trim()) {
      const term = search.toLowerCase();
      const matchesSearch = Object.entries(alert.fields).some(([key, val]) => 
        key.toLowerCase().includes(term) || val.toLowerCase().includes(term)
      );
      if (!matchesSearch) return false;
    }

    // 2. Chip Filters
    for (const f of filters) {
      if (!f.enabled) continue;
      const val = alert.fields[f.field] || '';
      let matches = true;
      
      if (f.operator === 'is') matches = val === f.value;
      else if (f.operator === 'is not') matches = val !== f.value;
      else if (f.operator === 'exists') matches = !!alert.fields[f.field];
      else if (f.operator === 'does not exist') matches = !alert.fields[f.field];
      else if (f.operator === '>') matches = parseFloat(val) > parseFloat(f.value) && !!val;
      else if (f.operator === '<') matches = parseFloat(val) < parseFloat(f.value) && !!val;
      
      if (f.exclude) matches = !matches;
      if (!matches) return false;
    }

    return true;
  });

  const hitsCount = filteredAlerts.length;
  const totalPages = Math.max(1, Math.ceil(hitsCount / ITEMS_PER_PAGE));
  const paginatedAlerts = filteredAlerts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleRefresh = () => {
    toast.success('Data refreshed');
  };

  // Setup Histogram Chart Options & Data
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0, 0, 0, 0.04)' },
        ticks: { color: '#64748b', font: { size: 10 } },
        title: { display: true, text: 'Count', color: '#64748b', font: { size: 11, weight: 600 } }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#64748b', font: { size: 10 } },
        title: { display: true, text: 'timestamp per 30 minutes', color: '#64748b', font: { size: 11, weight: 600 } }
      }
    }
  };

  // Simulate dynamic chart data based on filtered hits
  const chartData = {
    labels: ['15:00', '18:00', '21:00', '00:00', '03:00', '06:00', '09:00', '12:00'],
    datasets: [{
      label: 'Alerts Count',
      data: hitsCount > 0 
        ? [
            Math.ceil(hitsCount * 0.05), Math.ceil(hitsCount * 0.02), Math.ceil(hitsCount * 0.03), 
            Math.ceil(hitsCount * 0.3), Math.ceil(hitsCount * 0.35), Math.ceil(hitsCount * 0.2), 
            Math.ceil(hitsCount * 0.01), Math.ceil(hitsCount * 0.04)
          ]
        : [0, 0, 0, 0, 0, 0, 0, 0],
      backgroundColor: '#4ba06a',
      borderRadius: 2,
      barPercentage: 0.6
    }]
  };

  const handleChartClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const chart = chartRef.current;
    if (!chart) return;
    const elements = chart.getElementsAtEventForMode(event.nativeEvent, 'index', { intersect: true }, false);
    if (elements.length > 0) {
      const index = elements[0].index;
      const label = chartData.labels[index];
      setTimeRange(`Around ${label}`);
      toast.success(`Time range narrowed to ${label}`);
    }
  };

  return (
    <div className="wz-page">
      {/* Top action header for Discover (New, Save, Open...) */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'flex-end', 
        alignItems: 'center', 
        gap: '20px', 
        padding: '12px 24px 4px 24px',
        fontSize: '13px',
        color: '#005cca',
        fontWeight: 500,
        background: '#ffffff',
        borderBottom: '1px solid var(--wz-border)'
      }}>
        <span
          style={{ cursor: 'pointer' }}
          onClick={() => { setSearch(''); setFilters([]); setSelectedFields(['_source']); toast.success('Search reset'); }}
        >New</span>
        <span
          style={{ cursor: 'pointer' }}
          onClick={() => setShowSaveModal(true)}
        >Save</span>
        <span
          style={{ cursor: 'pointer' }}
          onClick={() => setShowOpenModal(true)}
        >Open</span>
        <span
          style={{ cursor: 'pointer' }}
          onClick={() => {
            const url = new URL(window.location.href);
            if (search) url.searchParams.set('search', search);
            else url.searchParams.delete('search');
            if (filters.length > 0) url.searchParams.set('filters', JSON.stringify(filters.map(f => ({ field: f.field, operator: f.operator, value: f.value }))));
            else url.searchParams.delete('filters');
            url.searchParams.set('timeRange', timeRange);
            navigator.clipboard.writeText(url.toString());
            toast.success('Shareable URL copied to clipboard');
          }}
        >Share</span>
        <span
          style={{ cursor: 'pointer' }}
          onClick={() => {
            const csv = ['Time,...Object'];
            filteredAlerts.forEach(a => {
              csv.push(`${a.time},${JSON.stringify(a.fields).replace(/,/g, ';')}`);
            });
            const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url; link.download = 'events-export.csv'; link.click();
            URL.revokeObjectURL(url);
            toast.success('CSV exported');
          }}
        >Reporting</span>
        <span
          style={{ cursor: 'pointer' }}
          onClick={() => setShowInspect(true)}
        >Inspect</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '8px' }}>
          <label style={{ fontSize: '12px', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <input type="checkbox" checked={autoRefresh} onChange={e => setAutoRefresh(e.target.checked)} style={{ cursor: 'pointer' }} />
            Auto-refresh
          </label>
          {autoRefresh && (
            <select value={autoRefreshInterval} onChange={e => setAutoRefreshInterval(Number(e.target.value))} style={{ fontSize: '11px', padding: '2px 4px', border: '1px solid #cbd5e1', borderRadius: '3px' }}>
              <option value={5}>5s</option>
              <option value={15}>15s</option>
              <option value={30}>30s</option>
              <option value={60}>1m</option>
              <option value={300}>5m</option>
            </select>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1 }}>
        
        {/* LEFT COLUMN: FIELD SELECTOR */}
        <div style={{ 
          width: '260px', 
          background: '#ffffff', 
          borderRight: '1px solid var(--wz-border)', 
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {/* Index Pattern Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '6px 10px', background: '#f8fafc' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>wazuh-alerts-*</span>
            <button style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748b' }} onClick={handleRefresh}>
              <FiRefreshCw size={12} />
            </button>
          </div>

          {/* Search Fields Input */}
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
              <FiSearch size={14} />
            </span>
            <input 
              type="text" 
              placeholder="Search fields" 
              value={fieldSearch}
              onChange={e => setFieldSearch(e.target.value)}
              className="wz-search-input"
              style={{ paddingLeft: '32px', fontSize: '12px', padding: '6px 10px 6px 30px' }}
            />
          </div>

          {/* Selected Fields */}
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
              Selected Fields
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {selectedFields.map(field => (
                <div key={field} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12.5px', color: '#1e293b', padding: '4px 6px', borderRadius: '4px' }} onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ 
                      fontSize: '10px', 
                      background: '#e2e8f0', 
                      color: '#475569', 
                      width: '14px', 
                      height: '14px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      borderRadius: '2px',
                      fontWeight: 'bold',
                      fontFamily: 'monospace'
                    }}>t</span>
                    <span>{field}</span>
                  </div>
                  <FiX size={12} style={{ color: '#94a3b8', cursor: 'pointer' }} onClick={() => {
                    if (selectedFields.length > 1) {
                      setSelectedFields(selectedFields.filter(f => f !== field));
                      toast.success(`Field "${field}" removed`);
                    } else {
                      toast.error('Must have at least one field selected');
                    }
                  }} />
                </div>
              ))}
            </div>
          </div>

          {/* Available Fields */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
              Available Fields
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {availableFields
                .filter(f => f.toLowerCase().includes(fieldSearch.toLowerCase()))
                .map(field => (
                <div 
                  key={field} 
                  onClick={() => {
                    if (!selectedFields.includes(field)) {
                      setSelectedFields([...selectedFields, field]);
                      toast.success(`Field "${field}" added`);
                    }
                  }}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    fontSize: '12px', 
                    color: '#334155', 
                    padding: '4px 6px',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ 
                      fontSize: '10px', 
                      background: '#e2e8f0', 
                      color: '#475569', 
                      width: '14px', 
                      height: '14px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      borderRadius: '2px',
                      fontWeight: 'bold',
                      fontFamily: 'monospace'
                    }}>t</span>
                    <span style={{ fontFamily: 'monospace' }}>{field}</span>
                  </div>
                  <FiPlus size={10} style={{ color: '#94a3b8' }} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MAIN SEARCH & RESULTS WORKSPACE */}
        <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
          
          {/* Query Bar */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {/* Search Input Box */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#ffffff', overflow: 'hidden' }}>
              <div style={{ padding: '0 12px', color: '#64748b' }}>
                <FiFileText size={16} />
              </div>
              <input 
                type="text"
                placeholder="Search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ 
                  flex: 1, 
                  border: 'none', 
                  outline: 'none', 
                  fontSize: '13.5px', 
                  padding: '8px 4px'
                }}
              />
              <button style={{ 
                border: 'none', 
                background: 'none', 
                fontWeight: 600, 
                color: '#005cca', 
                fontSize: '12px', 
                padding: '0 12px',
                cursor: 'pointer' 
              }}>
                DQL
              </button>
            </div>

            {/* Time Picker */}
            <div style={{ position: 'relative' }}>
              <div onClick={() => setShowTimePicker(!showTimePicker)} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px',
                border: '1px solid #cbd5e1', 
                borderRadius: '4px', 
                padding: '8px 12px',
                background: '#ffffff',
                cursor: 'pointer',
                fontSize: '13px'
              }}>
                <FiCalendar size={14} style={{ color: '#64748b' }} />
                <span>{timeRange}</span>
              </div>
              {showTimePicker && (
                <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '4px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 10, minWidth: '180px' }}>
                  {['Last 15 minutes', 'Last 30 minutes', 'Last 1 hour', 'Last 24 hours', 'Last 7 days', 'Last 30 days', 'Last 90 days'].map(range => (
                    <div key={range} onClick={() => { setTimeRange(range); setShowTimePicker(false); toast.success(`Time range set to ${range}`); }} style={{ padding: '8px 16px', fontSize: '13px', cursor: 'pointer', color: timeRange === range ? '#005cca' : '#1e293b', background: timeRange === range ? '#f0f7ff' : 'transparent', borderBottom: '1px solid #f1f5f9' }}>
                      {range}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Show dates toggle */}
            <div style={{ fontSize: '13px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', userSelect: 'none' }}>
              <span>Show dates</span>
            </div>

            {/* Refresh Button */}
            <button 
              onClick={handleRefresh}
              className="wz-btn-secondary" 
              style={{ borderColor: '#005cca', color: '#005cca', padding: '8px 16px', fontWeight: 600 }}
            >
              <FiRefreshCw size={14} /> Refresh
            </button>
          </div>

          {/* Filter Chips & Add Filter */}
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            {filters.map((f, idx) => (
              <div key={idx} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '4px', 
                border: `1px solid ${!f.enabled ? '#fde68a' : f.exclude ? '#fca5a5' : '#e2e8f0'}`, 
                borderRadius: '4px', 
                padding: '4px 8px', 
                background: !f.enabled ? '#fffbeb' : f.exclude ? '#fef2f2' : f.pinned ? '#eff6ff' : '#f1f5f9',
                fontSize: '12.5px',
                color: '#334155',
                opacity: f.enabled ? 1 : 0.7
              }}>
                {f.pinned && <span style={{ color: '#64748b', fontSize: '10px' }}>&#128204;</span>}
                {editingFilterIdx === idx ? (
                  <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    <select value={editField} onChange={e => setEditField(e.target.value)} style={{ padding: '2px 4px', fontSize: '12px', border: '1px solid #cbd5e1', borderRadius: '3px' }}>
                      {availableFields.map(af => <option key={af} value={af}>{af}</option>)}
                    </select>
                    <select value={editOperator} onChange={e => setEditOperator(e.target.value)} style={{ padding: '2px 4px', fontSize: '12px', border: '1px solid #cbd5e1', borderRadius: '3px' }}>
                      <option value="is">is</option>
                      <option value="is not">is not</option>
                      <option value="exists">exists</option>
                      <option value="does not exist">does not exist</option>
                      <option value=">">&gt;</option>
                      <option value="<">&lt;</option>
                    </select>
                    {editOperator !== 'exists' && editOperator !== 'does not exist' && (
                      <input type="text" value={editValue} onChange={e => setEditValue(e.target.value)} style={{ padding: '2px 4px', fontSize: '12px', border: '1px solid #cbd5e1', borderRadius: '3px', width: '80px' }} />
                    )}
                    <button onClick={() => {
                      const updated = [...filters];
                      updated[idx] = { ...updated[idx], field: editField, operator: editOperator, value: editValue };
                      setFilters(updated);
                      setEditingFilterIdx(null);
                      toast.success('Filter updated');
                    }} style={{ background: '#005cca', color: '#fff', border: 'none', borderRadius: '3px', padding: '2px 6px', fontSize: '11px', cursor: 'pointer' }}>OK</button>
                    <button onClick={() => setEditingFilterIdx(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px' }}><FiX size={12} /></button>
                  </div>
                ) : (
                  <>
                    <strong style={{ fontWeight: 600, textDecoration: !f.enabled ? 'line-through' : 'none' }}>{f.field}</strong>
                    <span style={{ color: f.exclude ? '#dc2626' : '#005cca' }}>{f.exclude ? 'is not' : f.operator}</span>
                    {f.operator !== 'exists' && f.operator !== 'does not exist' && <span>{f.value}</span>}
                  </>
                )}
                {editingFilterIdx === null && (
                  <div style={{ display: 'flex', gap: '2px', marginLeft: '2px' }}>
                    <button onClick={() => {
                      const updated = [...filters];
                      updated[idx] = { ...updated[idx], enabled: !updated[idx].enabled };
                      setFilters(updated);
                      toast(updated[idx].enabled ? 'Filter enabled' : 'Filter disabled', { icon: updated[idx].enabled ? '✅' : '⏸️' });
                    }} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px', fontSize: '10px' }} title={f.enabled ? 'Disable' : 'Enable'}>
                      {f.enabled ? '👁' : '👁‍🗨'}
                    </button>
                    <button onClick={() => {
                      const updated = [...filters];
                      updated[idx] = { ...updated[idx], pinned: !updated[idx].pinned };
                      setFilters(updated);
                      toast(updated[idx].pinned ? 'Filter pinned' : 'Filter unpinned', { icon: '📌' });
                    }} style={{ background: 'none', border: 'none', color: f.pinned ? '#005cca' : '#94a3b8', cursor: 'pointer', padding: '2px', fontSize: '10px' }} title={f.pinned ? 'Unpin' : 'Pin'}>
                      &#128204;
                    </button>
                    <button onClick={() => {
                      const updated = [...filters];
                      updated[idx] = { ...updated[idx], exclude: !updated[idx].exclude };
                      setFilters(updated);
                      toast(updated[idx].exclude ? 'Filter negated' : 'Filter un-negated', { icon: '🚫' });
                    }} style={{ background: 'none', border: 'none', color: f.exclude ? '#dc2626' : '#94a3b8', cursor: 'pointer', padding: '2px', fontSize: '10px' }} title={f.exclude ? 'Un-negate' : 'Negate'}>
                      {f.exclude ? '✕' : '⊘'}
                    </button>
                    <button onClick={() => {
                      setEditField(f.field);
                      setEditOperator(f.operator);
                      setEditValue(f.value);
                      setEditingFilterIdx(idx);
                    }} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px', fontSize: '10px' }} title="Edit">
                      &#9998;
                    </button>
                    <button onClick={() => {
                      const newFilters = [...filters];
                      newFilters.splice(idx, 1);
                      setFilters(newFilters);
                      toast.success('Filter removed');
                    }} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px', fontSize: '10px' }} title="Remove">
                      <FiX size={12} />
                    </button>
                  </div>
                )}
              </div>
            ))}

            {filters.length > 0 && (
              <button onClick={() => { setFilters([]); toast.success('All filters cleared'); }} style={{ 
                display: 'flex', alignItems: 'center', gap: '4px', border: 'none', background: 'none', color: '#dc2626', fontSize: '12px', fontWeight: 500, cursor: 'pointer'
              }}>
                <FiX size={12} /> Clear All
              </button>
            )}

            <div style={{ position: 'relative' }}>
              <button onClick={() => setShowFilterPopover(!showFilterPopover)} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '4px', 
                border: 'none', 
                background: 'none', 
                color: '#005cca', 
                fontSize: '13px', 
                fontWeight: 500,
                cursor: 'pointer'
              }}>
                <FiFilter size={12} /> Add filter
              </button>
              {showFilterPopover && (
                <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: '12px', zIndex: 100 }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <select value={filterField} onChange={e => setFilterField(e.target.value)} style={{ padding: '6px 8px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#ffffff' }}>
                      {availableFields.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                    <select value={filterOperator} onChange={e => setFilterOperator(e.target.value)} style={{ padding: '6px 8px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#ffffff' }}>
                      <option value="is">is</option>
                      <option value="is not">is not</option>
                      <option value="exists">exists</option>
                      <option value="does not exist">does not exist</option>
                      <option value=">">&gt;</option>
                      <option value="<">&lt;</option>
                    </select>
                    {filterOperator !== 'exists' && filterOperator !== 'does not exist' && (
                      <input type="text" value={filterValue} onChange={e => setFilterValue(e.target.value)} placeholder="Value" style={{ flex: 1, padding: '6px 8px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px', minWidth: '150px' }} />
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button onClick={() => { setShowFilterPopover(false); setFilterValue(''); }} style={{ padding: '6px 16px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#ffffff', cursor: 'pointer', color: '#475569' }}>Cancel</button>
                    <button onClick={() => {
                      setFilters([...filters, { field: filterField, operator: filterOperator, value: filterValue, enabled: true, pinned: false, exclude: false }]);
                      setShowFilterPopover(false);
                      setFilterValue('');
                      toast.success(`Filter added: ${filterField} ${filterOperator} ${filterValue || '(empty)'}`);
                    }} style={{ padding: '6px 16px', fontSize: '13px', border: 'none', borderRadius: '4px', background: '#005cca', color: '#ffffff', cursor: 'pointer' }}>Save</button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Alert Hits Info Panel */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
            <div>
              <strong style={{ fontSize: '15px', fontWeight: 700 }}>{hitsCount.toLocaleString()}</strong> <span style={{ color: '#64748b' }}>hits</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b' }}>
              <span>Jun 10, 2026 @ 13:35:48.839 - Jun 11, 2026 @ 13:35:48.839 per</span>
              <select style={{ border: 'none', background: 'transparent', fontWeight: 600, color: '#005cca', cursor: 'pointer', outline: 'none' }}>
                <option>Auto</option>
                <option>1 hour</option>
                <option>30 minutes</option>
              </select>
              <FiSettings size={14} style={{ cursor: 'pointer' }} />
            </div>
          </div>

          {/* HISTOGRAM BAR CHART */}
          <div className="wz-pill-card" style={{ height: '180px', padding: '16px 24px', margin: 0 }}>
            <div style={{ height: '100%', position: 'relative' }}>
              <Bar ref={chartRef} data={chartData} options={chartOptions} onClick={handleChartClick} />
            </div>
          </div>

          {/* DATA LOGS LIST */}
          <div className="wz-table-wrapper" style={{ border: 'none' }}>
            <table className="wz-table">
              <thead>
                <tr>
                  <th style={{ width: '40px' }}></th>
                  <th style={{ width: '180px' }}>Time</th>
                  {selectedFields.map(field => (
                    <th key={field}>{field}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedAlerts.map(alert => (
                  <React.Fragment key={alert.id}>
                    {/* Log Row */}
                    <tr 
                      style={{ cursor: 'pointer' }}
                      onClick={() => setExpandedAlert(expandedAlert === alert.id ? null : alert.id)}
                    >
                      <td style={{ textAlign: 'center' }}>
                        {expandedAlert === alert.id ? <FiChevronDown size={14} /> : <FiChevronRight size={14} />}
                      </td>
                      <td style={{ fontSize: '12.5px', color: '#475569', whiteSpace: 'nowrap', verticalAlign: 'top', paddingTop: '14px' }}>
                        {alert.time}
                      </td>
                      {selectedFields.map(field => (
                        <td key={field} style={{ padding: '8px 14px', verticalAlign: 'top', paddingTop: '14px', fontSize: '12.5px', color: '#334155' }}>
                          {field === '_source' ? (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px', alignItems: 'center' }}>
                              {Object.entries(alert.fields).map(([key, val]) => (
                                <div key={key} className="wz-field-badge">
                                  <span className="wz-field-badge-key">{key}</span>
                                  {key === 'agent.name' ? (
                                    <span className="wz-field-badge-val" style={{ cursor: 'pointer', color: '#005cca' }} onClick={() => navigate(`/agents/detail?agent=${alert.fields['agent.id']}`)}>{val}</span>
                                  ) : key === 'agent.id' ? (
                                    <span className="wz-field-badge-val" style={{ cursor: 'pointer', color: '#005cca' }} onClick={() => navigate(`/agents/detail?agent=${val}`)}>{val}</span>
                                  ) : key === 'rule.id' ? (
                                    <span className="wz-field-badge-val" style={{ cursor: 'pointer', color: '#005cca' }} onClick={() => navigate(`/rules?tab=rules&search=${val}`)}>{val}</span>
                                  ) : key === 'rule.level' ? (
                                    <span className="wz-field-badge-val" style={{ cursor: 'pointer', color: '#005cca' }} onClick={() => navigate(`/rules?tab=rules&search=${val}`)}>{val}</span>
                                  ) : (
                                    <span className="wz-field-badge-val">{val}</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span>{alert.fields[field] || '-'}</span>
                          )}
                        </td>
                      ))}
                    </tr>
                    
                    {/* Log Expand Details */}
                    {expandedAlert === alert.id && (
                      <tr style={{ background: '#f8fafc' }}>
                        <td></td>
                        <td colSpan={1 + selectedFields.length} style={{ padding: '16px', borderBottom: '1px solid var(--wz-border)' }}>
                          <div style={{ 
                            background: '#ffffff', 
                            border: '1px solid var(--wz-border)', 
                            borderRadius: '4px',
                            padding: '16px',
                            fontFamily: 'monospace',
                            fontSize: '12px',
                            color: '#1e293b',
                            overflowX: 'auto',
                            maxHeight: '400px'
                          }}>
                            {/* JSON Tree View */}
                            <pre style={{ margin: 0 }}>
                              {JSON.stringify(alert.details, null, 2)}
                            </pre>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
                {filteredAlerts.length === 0 && (
                  <tr>
                    <td colSpan={3} style={{ textAlign: 'center', padding: '48px', color: 'var(--wz-text-muted)' }}>
                      No search hits match the search query.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '12px 0' }}>
              <button disabled={currentPage <= 1} onClick={() => setCurrentPage(p => p - 1)} style={{ padding: '6px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', background: currentPage <= 1 ? '#f1f5f9' : '#fff', cursor: currentPage <= 1 ? 'not-allowed' : 'pointer', fontSize: '12px', color: '#475569' }}>
                Previous
              </button>
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                let page: number;
                if (totalPages <= 7) page = i + 1;
                else if (currentPage <= 4) page = i + 1;
                else if (currentPage >= totalPages - 3) page = totalPages - 6 + i;
                else page = currentPage - 3 + i;
                return (
                  <button key={page} onClick={() => setCurrentPage(page)} style={{ padding: '6px 10px', border: '1px solid', borderRadius: '4px', fontSize: '12px', fontWeight: currentPage === page ? 700 : 400, cursor: 'pointer', background: currentPage === page ? '#005cca' : '#fff', color: currentPage === page ? '#fff' : '#475569', borderColor: currentPage === page ? '#005cca' : '#cbd5e1' }}>
                    {page}
                  </button>
                );
              })}
              <button disabled={currentPage >= totalPages} onClick={() => setCurrentPage(p => p + 1)} style={{ padding: '6px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', background: currentPage >= totalPages ? '#f1f5f9' : '#fff', cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer', fontSize: '12px', color: '#475569' }}>
                Next
              </button>
              <span style={{ fontSize: '12px', color: '#64748b', marginLeft: '8px' }}>
                Page {currentPage} of {totalPages}
              </span>
            </div>
          )}

        </div>

      </div>

      {/* INSPECT MODAL */}
      {showInspect && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowInspect(false)}>
          <div style={{ background: '#fff', borderRadius: '8px', width: '640px', maxHeight: '80vh', display: 'flex', flexDirection: 'column', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #e2e8f0' }}>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>Inspect</h3>
              <button onClick={() => setShowInspect(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><FiX size={18} /></button>
            </div>
            <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0' }}>
              {['Request', 'Response', 'Statistics'].map(t => (
                <button key={t} onClick={() => setInspectTab(t)} style={{ flex: 1, padding: '10px', border: 'none', borderBottom: inspectTab === t ? '2px solid #005cca' : '2px solid transparent', background: inspectTab === t ? '#f0f7ff' : '#ffffff', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: inspectTab === t ? '#005cca' : '#64748b' }}>{t}</button>
              ))}
            </div>
            <div style={{ padding: '16px 20px', overflowY: 'auto', flex: 1 }}>
              {inspectTab === 'Request' && (
              <pre style={{ margin: 0, fontSize: '12px', fontFamily: 'monospace', background: '#f8fafc', padding: '12px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
{JSON.stringify({
  index: 'wazuh-alerts-*',
  query: {
    bool: {
      must: [
        search ? { query_string: { query: search } } : { match_all: {} },
        ...filters.filter(f => f.enabled).map(f => ({
          term: { [f.field]: f.exclude ? { value: f.value, _prefixed: true } : f.value }
        }))
      ]
    }
  },
  size: 20,
  sort: [{ timestamp: { order: 'desc' } }]
}, null, 2)}
              </pre>
              )}
              {inspectTab === 'Response' && (
              <pre style={{ margin: 0, fontSize: '12px', fontFamily: 'monospace', background: '#f8fafc', padding: '12px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
{JSON.stringify({ took: 5, timed_out: false, _shards: { total: 1, successful: 1, skipped: 0, failed: 0 }, hits: { total: { value: 1247, relation: 'eq' }, max_score: 1.0, hits: [] } }, null, 2)}
              </pre>
              )}
              {inspectTab === 'Statistics' && (
              <pre style={{ margin: 0, fontSize: '12px', fontFamily: 'monospace', background: '#f8fafc', padding: '12px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
{JSON.stringify({ totalTime: '5ms', avgTime: '1.2ms', hitsTotal: 1247, hitsReturned: 20, shardsSucceeded: 1, shardsFailed: 0 }, null, 2)}
              </pre>
              )}
            </div>
            <div style={{ padding: '12px 20px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => { navigator.clipboard.writeText(JSON.stringify({ index: 'wazuh-alerts-*', query: { bool: { must: [search ? { query_string: { query: search } } : { match_all: {} } ] } }, size: 20 }, null, 2)); toast.success('Query copied to clipboard'); }} style={{ padding: '6px 16px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#fff', cursor: 'pointer', color: '#475569' }}>
                Copy to clipboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SAVE SEARCH MODAL */}
      {showSaveModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowSaveModal(false)}>
          <div style={{ background: '#fff', borderRadius: '8px', width: '420px', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #e2e8f0' }}>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>Save search</h3>
              <button onClick={() => setShowSaveModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><FiX size={18} /></button>
            </div>
            <div style={{ padding: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: '#334155' }}>Name</label>
              <input type="text" value={saveName} onChange={e => setSaveName(e.target.value)} placeholder="My saved search" style={{ width: '100%', padding: '8px 12px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px', boxSizing: 'border-box' }} />
            </div>
            <div style={{ padding: '12px 20px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowSaveModal(false)} style={{ padding: '6px 16px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#fff', cursor: 'pointer', color: '#475569' }}>Cancel</button>
              <button onClick={() => {
                if (!saveName.trim()) { toast.error('Name is required'); return; }
                const newSaved = [...savedSearches, { name: saveName.trim(), search, filters }];
                setSavedSearches(newSaved);
                localStorage.setItem('wz_saved_searches', JSON.stringify(newSaved));
                setShowSaveModal(false);
                setSaveName('');
                toast.success('Search saved');
              }} style={{ padding: '6px 16px', fontSize: '13px', border: 'none', borderRadius: '4px', background: '#005cca', color: '#fff', cursor: 'pointer' }}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* OPEN SAVED SEARCH MODAL */}
      {showOpenModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowOpenModal(false)}>
          <div style={{ background: '#fff', borderRadius: '8px', width: '480px', maxHeight: '60vh', display: 'flex', flexDirection: 'column', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #e2e8f0' }}>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>Open saved search</h3>
              <button onClick={() => setShowOpenModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><FiX size={18} /></button>
            </div>
            <div style={{ padding: '8px', overflowY: 'auto', flex: 1 }}>
              {savedSearches.length === 0 ? (
                <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>No saved searches yet</div>
              ) : savedSearches.map((s, i) => (
                <div key={i} onClick={() => { setSearch(s.search); setFilters(s.filters); setShowOpenModal(false); toast.success(`Loaded: ${s.name}`); }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: '4px', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>{s.name}</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{s.search || '(no query)'} &middot; {s.filters.length} filters</div>
                  </div>
                  <button onClick={e => { e.stopPropagation(); const updated = savedSearches.filter((_, j) => j !== i); setSavedSearches(updated); localStorage.setItem('wz_saved_searches', JSON.stringify(updated)); toast.success('Deleted'); }} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><FiX size={14} /></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
