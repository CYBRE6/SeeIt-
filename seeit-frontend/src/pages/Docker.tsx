import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import {
  FiSearch, FiChevronDown, FiPlus, FiRefreshCw,
  FiDownload, FiAlertTriangle
} from 'react-icons/fi';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  PointElement, LineElement, ArcElement,
  Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, LinearScale, BarElement,
  PointElement, LineElement, ArcElement,
  Title, Tooltip, Legend, Filler
);

/* ────────────────────────────────────────────
   TIME LABELS (shared)
──────────────────────────────────────────── */
const timeLabels = [
  '18:00','18:30','19:00','19:30','20:00','20:30','21:00','21:30',
  '22:00','22:30','23:00','23:30','00:00','00:30','01:00','01:30',
  '02:00','02:30','03:00','03:30','04:00','04:30','05:00','05:30',
  '06:00','06:30','07:00','07:30','08:00','08:30','09:00','09:30',
  '10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30',
  '14:00','14:30','15:00'
];

const rand = (lo: number, hi: number) =>
  Math.floor(Math.random() * (hi - lo + 1)) + lo;

const makeWave = (n: number, lo: number, hi: number) =>
  Array.from({ length: n }, () => rand(lo, hi));

/* ────────────────────────────────────────────
   DONUT CHARTS DATA
──────────────────────────────────────────── */
const imagesData = {
  labels: ['nginx'],
  datasets: [{ data: [1], backgroundColor: ['#c084fc'], borderWidth: 0 }]
};

const eventsData = {
  labels: ['pull', 'exec_start: bash', 'stop', 'create', 'connect'],
  datasets: [{
    data: [35, 28, 15, 12, 10],
    backgroundColor: ['#f59e0b', '#d97706', '#f87171', '#ef4444', '#fb923c'],
    borderWidth: 0
  }]
};

const donutOpts = (title: string) => ({
  responsive: true,
  maintainAspectRatio: false,
  cutout: '68%',
  plugins: {
    legend: {
      display: true,
      position: 'right' as const,
      labels: { boxWidth: 10, font: { size: 11 }, color: '#475569' }
    },
    title: { display: true, text: title, align: 'start' as const, font: { size: 13, weight: '600' }, color: '#1e293b', padding: { bottom: 8 } }
  }
});

/* ────────────────────────────────────────────
   RESOURCES OVER TIME – grouped bar
──────────────────────────────────────────── */
const resLabels = ['18:00','21:00','00:00','03:00','06:00','09:00','12:00','15:00'];
const resourcesData = {
  labels: resLabels,
  datasets: [
    { label: 'container', data: [2,2,1,1,2,1,2,1], backgroundColor: '#22c55e', borderRadius: 2, barPercentage: 0.7 },
    { label: 'image',     data: [3,2,1,1,3,2,3,2], backgroundColor: '#3b82f6', borderRadius: 2, barPercentage: 0.7 },
    { label: 'network',   data: [1,2,0,1,1,1,4,2], backgroundColor: '#f87171', borderRadius: 2, barPercentage: 0.7 },
  ]
};
const resourcesOpts = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: true, position: 'right' as const, labels: { boxWidth: 10, font: { size: 11 } } },
    title: { display: true, text: 'Resources usage over time', align: 'start' as const, font: { size: 13, weight: '600' }, color: '#1e293b', padding: { bottom: 8 } }
  },
  scales: {
    x: { grid: { display: false }, ticks: { font: { size: 10 }, color: '#64748b' } },
    y: {
      min: 0, max: 4, ticks: { stepSize: 1, font: { size: 10 }, color: '#64748b' },
      grid: { color: 'rgba(0,0,0,0.05)' },
      title: { display: true, text: 'Count', font: { size: 10 }, color: '#64748b' }
    }
  }
};

/* ────────────────────────────────────────────
   EVENTS EVOLUTION – stacked area
──────────────────────────────────────────── */
const n = timeLabels.length;
const evolutionColors = [
  '#f59e0b','#d97706','#f87171','#ef4444','#fb923c',
  '#a78bfa','#34d399','#60a5fa','#f472b6','#facc15'
];
const evolutionLabels = [
  'pull','exec_start: bash','stop','create','connect',
  'die','start','disconnect','kill','restart'
];
const evolutionDatasets = evolutionLabels.map((label, i) => ({
  label,
  data: makeWave(n, 0, 4),
  borderColor: evolutionColors[i],
  backgroundColor: evolutionColors[i] + '55',
  fill: true,
  tension: 0.4,
  pointRadius: 0,
  borderWidth: 1.5
}));

const evolutionData = { labels: timeLabels, datasets: evolutionDatasets };
const evolutionOpts = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true, position: 'right' as const,
      labels: { boxWidth: 10, font: { size: 11 }, color: '#475569' }
    },
    title: { display: false }
  },
  scales: {
    x: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { font: { size: 10 }, color: '#64748b', maxTicksLimit: 9, maxRotation: 0 },
         title: { display: true, text: 'timestamp per 30 minutes', font: { size: 10 }, color: '#64748b' } },
    y: { min: 0, max: 4, stacked: false, ticks: { stepSize: 1, font: { size: 10 }, color: '#64748b' }, grid: { color: 'rgba(0,0,0,0.05)' },
         title: { display: true, text: 'Events', font: { size: 10 }, color: '#64748b' } }
  }
};

/* ────────────────────────────────────────────
   COMPONENT
──────────────────────────────────────────── */
const Docker: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'events'>('dashboard');
  const [filters, setFilters] = useState([
    { label: 'cluster.name: wazuh' },
    { label: 'rule.groups: docker' },
    { label: 'agent.id: 001' },
  ]);

  const removeFilter = (i: number) => setFilters(f => f.filter((_, idx) => idx !== i));
  const [dockerSearch, setDockerSearch] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  return (
    <div className="wz-page" style={{ background: '#f8fafc' }}>
      <div className="wz-page-content" style={{ display: 'flex', flexDirection: 'column' }}>

        {/* ── Tab bar ── */}
        <div style={{
          display: 'flex', borderBottom: '1px solid #e2e8f0', background: '#ffffff',
          padding: '0 24px', marginLeft: '-24px', marginRight: '-24px', marginTop: '-24px',
          justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div style={{ display: 'flex' }}>
            {(['dashboard', 'events'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                background: 'none', border: 'none',
                borderBottom: activeTab === tab ? '2.5px solid #005cca' : '2.5px solid transparent',
                color: activeTab === tab ? '#005cca' : '#475569',
                fontWeight: activeTab === tab ? 600 : 500,
                fontSize: '13.5px', padding: '14px 16px 12px', cursor: 'pointer',
                textTransform: 'capitalize', transition: 'all 0.15s ease'
              }}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingRight: '8px' }}>
            {/* Agent chip */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '4px 10px', color: '#334155' }}>
              <span style={{ fontSize: '10px', color: '#005cca' }}>◉</span> Isgasaad (001)
              <span style={{ color: '#005cca', fontSize: '12px', cursor: 'pointer' }}>📌</span>
            </div>
            <button onClick={() => toast.success('Report generated')} style={{ background: 'none', border: 'none', color: '#005cca', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
              <FiDownload size={13} /> Generate report
            </button>
          </div>
        </div>

        {/* ── Search + filters ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '16px 0' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}><FiSearch size={14} /></span>
              <input type="text" placeholder="Search" value={dockerSearch} onChange={e => setDockerSearch(e.target.value)} style={{ width: '100%', padding: '7px 60px 7px 34px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', background: '#ffffff', outline: 'none' }} />
              <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '12px', fontWeight: 700, color: '#64748b' }}>DQL</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '7px 12px', background: '#ffffff', fontSize: '13px', color: '#334155', cursor: 'pointer' }}>
              <span>Last 24 hours</span><FiChevronDown size={12} />
            </div>
            <button onClick={() => toast.success('Date picker opened')} style={{ background: 'none', border: 'none', color: '#005cca', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Show dates</button>
            <button onClick={() => toast.success('Data refreshed')} style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '7px 14px', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: '#334155' }}>
              <FiRefreshCw size={13} /> Refresh
            </button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
            {filters.map((f, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '5px', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '3px 8px', background: '#ffffff', fontSize: '12px', color: '#334155' }}>
                <span>{f.label}</span>
                <button onClick={() => removeFilter(idx)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '11px', padding: '1px' }}>✕</button>
              </div>
            ))}
            <button onClick={() => toast.success('Add filter clicked')} style={{ background: 'none', border: 'none', color: '#005cca', fontSize: '12.5px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
              <FiPlus size={13} /> Add filter
            </button>
          </div>
        </div>

        {/* ── Sample data banner ── */}
        <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '4px', padding: '10px 14px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '12.5px', fontWeight: 600, color: '#92400e' }}>
            <FiAlertTriangle size={13} /> This dashboard contains sample data
          </div>
          <div style={{ fontSize: '12px', color: '#78350f', marginTop: '3px' }}>
            The data displayed may contain sample data. Go{' '}
            <a href="/dashboard?loadsample=true" style={{ color: '#005cca', fontWeight: 600, textDecoration: 'none' }}>here</a>{' '}
            to configure the sample data.
          </div>
        </div>

        {activeTab === 'dashboard' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Row 1: 3 charts */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: '16px' }}>

              {/* Top 5 images */}
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '16px', minHeight: '220px' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b', marginBottom: '12px' }}>Top 5 images</div>
                <div style={{ height: '160px' }}>
                  <Doughnut data={imagesData} options={{ responsive: true, maintainAspectRatio: false, cutout: '68%', plugins: { legend: { display: true, position: 'right', labels: { boxWidth: 10, font: { size: 11 }, color: '#475569' } } } } as any} />
                </div>
              </div>

              {/* Top 5 events */}
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '16px', minHeight: '220px' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b', marginBottom: '12px' }}>Top 5 events</div>
                <div style={{ height: '160px' }}>
                  <Doughnut data={eventsData} options={{ responsive: true, maintainAspectRatio: false, cutout: '68%', plugins: { legend: { display: true, position: 'right', labels: { boxWidth: 10, font: { size: 11 }, color: '#475569' } } } } as any} />
                </div>
              </div>

              {/* Resources usage over time */}
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '16px', minHeight: '220px' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b', marginBottom: '12px' }}>Resources usage over time</div>
                <div style={{ height: '160px' }}>
                  <Bar data={resourcesData} options={resourcesOpts as any} />
                </div>
                <div style={{ textAlign: 'center', fontSize: '10px', color: '#64748b', marginTop: '6px' }}>timestamp per 30 minutes</div>
              </div>
            </div>

            {/* Row 2: Events occurred evolution */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '16px' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b', marginBottom: '12px' }}>Events occurred evolution</div>
              <div style={{ height: '220px' }}>
                <Line data={evolutionData} options={evolutionOpts as any} />
              </div>
            </div>

          </div>
        ) : (
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '40px', textAlign: 'center' }}>
            <FiSearch size={40} style={{ color: '#cbd5e1', marginBottom: '16px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 300, color: '#1e293b', margin: '0 0 8px 0' }}>No events to display</h3>
            <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Adjust your time range or filters to find Docker events.</p>
          {selectedEvent && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setSelectedEvent(null)}>
              <div onClick={e => e.stopPropagation()} style={{ background: '#ffffff', borderRadius: '8px', width: '500px', maxHeight: '80vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #e2e8f0' }}>
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>Event details</h3>
                  <span onClick={() => setSelectedEvent(null)} style={{ cursor: 'pointer', color: '#94a3b8', fontSize: '18px' }}>×</span>
                </div>
                <div style={{ padding: '16px 20px' }}>
                  {Object.entries(selectedEvent).filter(([k]) => k !== 'id').map(([key, val]) => (
                    <div key={key} style={{ display: 'flex', marginBottom: '8px', fontSize: '13px' }}>
                      <div style={{ width: '120px', color: '#64748b', fontWeight: 600, flexShrink: 0 }}>{key}</div>
                      <div style={{ color: '#0f172a', wordBreak: 'break-all' }}>{String(val)}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '12px 20px', borderTop: '1px solid #e2e8f0' }}>
                  <button onClick={() => { setSelectedEvent(null); }} style={{ background: '#005cca', border: 'none', borderRadius: '4px', padding: '6px 14px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', color: '#ffffff' }}>Close</button>
                </div>
              </div>
            </div>
          )}
          </div>
        )}

      </div>
    </div>
  );
};

export default Docker;
