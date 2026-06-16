import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import {
  FiSearch, FiChevronDown, FiPlus, FiRefreshCw,
  FiDownload, FiAlertTriangle, FiMinus, FiPlus as FiZoomIn,
  FiLayers, FiMapPin, FiSquare
} from 'react-icons/fi';
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, ArcElement,
  Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, LinearScale,
  PointElement, LineElement, ArcElement,
  Title, Tooltip, Legend, Filler
);

/* ────────────────────────────────────────────
   TIME LABELS
──────────────────────────────────────────── */
const timeLabels = [
  '18:00','18:30','19:00','19:30','20:00','20:30','21:00','21:30',
  '22:00','22:30','23:00','23:30','00:00','00:30','01:00','01:30',
  '02:00','02:30','03:00','03:30','04:00','04:30','05:00','05:30',
  '06:00','06:30','07:00','07:30','08:00','08:30','09:00','09:30',
  '10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30',
  '14:00','14:30','15:00'
];

const n = timeLabels.length;
const wave = (lo: number, hi: number) =>
  Array.from({ length: n }, () => Math.floor(Math.random() * (hi - lo + 1)) + lo);

/* ────────────────────────────────────────────
   DONUT DATA
──────────────────────────────────────────── */
const sourcesData = {
  labels: ['guardduty', 'macie'],
  datasets: [{ data: [60, 40], backgroundColor: ['#ef4444', '#f87171'], borderWidth: 0 }]
};
const accountsData = {
  labels: ['250141701015', '18773455640', '18615417180'],
  datasets: [{ data: [45, 30, 25], backgroundColor: ['#f59e0b', '#d97706', '#fbbf24'], borderWidth: 0 }]
};
const bucketsData = {
  labels: ['aws-sample-bucket-5', 'aws-sample-bucket-6', 'aws-sample-bucket-7', 'aws-sample-bucket-4'],
  datasets: [{ data: [30, 25, 25, 20], backgroundColor: ['#22d3ee', '#3b82f6', '#8b5cf6', '#a78bfa'], borderWidth: 0 }]
};
const regionsData = {
  labels: ['ap-southeast-2', 'us-east-1', 'ap-southeast-1', 'ap-northeast-2'],
  datasets: [{ data: [35, 30, 20, 15], backgroundColor: ['#f87171', '#fbbf24', '#c084fc', '#d4b896'], borderWidth: 0 }]
};

const donutOpts = (pos: 'right' | 'bottom' = 'right') => ({
  responsive: true,
  maintainAspectRatio: false,
  cutout: '65%',
  plugins: {
    legend: {
      display: true,
      position: pos,
      labels: { boxWidth: 10, font: { size: 11 }, color: '#475569' }
    }
  }
});

/* ────────────────────────────────────────────
   LINE CHARTS (stacked area)
──────────────────────────────────────────── */
const sourceLineData = {
  labels: timeLabels,
  datasets: [
    { label: 'guardduty', data: wave(0, 4), borderColor: '#ef4444', backgroundColor: '#ef444466', fill: true, tension: 0.4, pointRadius: 0, borderWidth: 1.5 },
    { label: 'macie',     data: wave(0, 3), borderColor: '#f87171', backgroundColor: '#f8717166', fill: true, tension: 0.4, pointRadius: 0, borderWidth: 1.5 },
  ]
};

const bucketLineData = {
  labels: timeLabels,
  datasets: [
    { label: 'aws-sample-bucket-5', data: wave(0, 3), borderColor: '#22d3ee', backgroundColor: '#22d3ee55', fill: true, tension: 0.4, pointRadius: 0, borderWidth: 1.5 },
    { label: 'aws-sample-bucket-6', data: wave(0, 2), borderColor: '#3b82f6', backgroundColor: '#3b82f655', fill: true, tension: 0.4, pointRadius: 0, borderWidth: 1.5 },
    { label: 'aws-sample-bucket-7', data: wave(0, 4), borderColor: '#8b5cf6', backgroundColor: '#8b5cf655', fill: true, tension: 0.4, pointRadius: 0, borderWidth: 1.5 },
    { label: 'aws-sample-bucket-4', data: wave(0, 3), borderColor: '#a78bfa', backgroundColor: '#a78bfa55', fill: true, tension: 0.4, pointRadius: 0, borderWidth: 1.5 },
  ]
};

const lineOpts = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: true, position: 'top' as const, labels: { boxWidth: 10, font: { size: 11 }, usePointStyle: true } }
  },
  scales: {
    x: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { font: { size: 10 }, color: '#64748b', maxTicksLimit: 9, maxRotation: 0 },
         title: { display: true, text: 'timestamp per 30 minutes', font: { size: 10 }, color: '#64748b' } },
    y: { min: 0, max: 4, ticks: { stepSize: 1, font: { size: 10 }, color: '#64748b' }, grid: { color: 'rgba(0,0,0,0.04)' },
         title: { display: true, text: 'Count', font: { size: 10 }, color: '#64748b' } }
  }
};

/* ────────────────────────────────────────────
   GEO MAP DOTS (mock)
──────────────────────────────────────────── */
const geoDots = [
  { x: 32, y: 42, color: '#facc15', size: 8,  label: '2–3.5' },   // Americas
  { x: 24, y: 48, color: '#f59e0b', size: 10, label: '3.5–5' },   // Mexico
  { x: 54, y: 38, color: '#ef4444', size: 12, label: '5–6.5' },   // Middle East
  { x: 55, y: 37, color: '#ef4444', size: 10, label: '5–6.5' },   // Middle East cluster
  { x: 56, y: 39, color: '#f59e0b', size: 8,  label: '3.5–5' },
  { x: 53, y: 46, color: '#ef4444', size: 11, label: '5–6.5' },   // Africa
  { x: 76, y: 35, color: '#ef4444', size: 12, label: '6.5–8' },   // India
  { x: 86, y: 35, color: '#facc15', size: 8,  label: '2–3.5' },   // SE Asia
  { x: 88, y: 50, color: '#facc15', size: 8,  label: '2–3.5' },   // Australia area
  { x: 37, y: 66, color: '#facc15', size: 7,  label: '2–3.5' },   // South America
];

/* ────────────────────────────────────────────
   COMPONENT
──────────────────────────────────────────── */
const Aws: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'events'>('dashboard');
  const [filters, setFilters] = useState([
    { label: 'cluster.name: wazuh' },
    { label: 'rule.groups: amazon' },
    { label: 'agent.id: 001' },
  ]);

  const removeFilter = (i: number) => setFilters(f => f.filter((_, idx) => idx !== i));
  const [awsSearch, setAwsSearch] = useState('');
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
              <input type="text" placeholder="Search" value={awsSearch} onChange={e => setAwsSearch(e.target.value)} style={{ width: '100%', padding: '7px 60px 7px 34px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', background: '#ffffff', outline: 'none' }} />
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

            {/* Row 1: 4 donut charts */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              {[
                { title: 'Sources',  data: sourcesData  },
                { title: 'Accounts', data: accountsData },
                { title: 'Buckets',  data: bucketsData  },
                { title: 'Regions',  data: regionsData  },
              ].map(({ title, data }) => (
                <div key={title} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '16px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b', marginBottom: '10px' }}>{title}</div>
                  <div style={{ height: '140px' }}>
                    <Doughnut data={data} options={donutOpts() as any} />
                  </div>
                </div>
              ))}
            </div>

            {/* Row 2: 2 line charts side-by-side */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '16px' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b', marginBottom: '10px' }}>Events by source over time</div>
                <div style={{ height: '200px' }}>
                  <Line data={sourceLineData} options={lineOpts as any} />
                </div>
              </div>
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '16px' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b', marginBottom: '10px' }}>Events by S3 bucket over time</div>
                <div style={{ height: '200px' }}>
                  <Line data={bucketLineData} options={lineOpts as any} />
                </div>
              </div>
            </div>

            {/* Row 3: Geolocation map */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '16px' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b', marginBottom: '12px' }}>Geolocation map</div>
              <div style={{ position: 'relative', height: '340px', background: '#b8d4e8', borderRadius: '4px', overflow: 'hidden' }}>
                {/* World map SVG background (simplified) */}
                <svg
                  viewBox="0 0 1000 500"
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
                  preserveAspectRatio="xMidYMid slice"
                >
                  {/* Ocean */}
                  <rect width="1000" height="500" fill="#a8c8e0" />
                  {/* Continents (simplified shapes) */}
                  {/* North America */}
                  <path d="M 80 80 L 220 80 L 240 120 L 220 180 L 180 220 L 150 250 L 120 240 L 100 200 L 70 160 L 60 120 Z" fill="#e8dcc8" />
                  {/* South America */}
                  <path d="M 160 270 L 200 260 L 220 300 L 230 370 L 210 430 L 180 440 L 160 420 L 145 380 L 140 320 Z" fill="#e8dcc8" />
                  {/* Europe */}
                  <path d="M 420 70 L 490 65 L 510 90 L 500 130 L 470 140 L 445 130 L 430 110 Z" fill="#e8dcc8" />
                  {/* Africa */}
                  <path d="M 440 150 L 510 140 L 530 170 L 540 240 L 520 310 L 490 360 L 460 370 L 440 340 L 420 270 L 415 200 Z" fill="#e8dcc8" />
                  {/* Middle East / W. Asia */}
                  <path d="M 510 110 L 580 105 L 600 130 L 590 160 L 560 170 L 525 165 L 510 140 Z" fill="#e8dcc8" />
                  {/* Asia */}
                  <path d="M 580 60 L 780 55 L 820 100 L 810 160 L 770 180 L 720 190 L 670 185 L 620 175 L 590 150 L 575 110 Z" fill="#e8dcc8" />
                  {/* India */}
                  <path d="M 640 170 L 680 165 L 700 200 L 690 240 L 665 260 L 645 240 L 630 200 Z" fill="#e8dcc8" />
                  {/* SE Asia */}
                  <path d="M 730 175 L 780 170 L 800 200 L 790 230 L 760 240 L 735 225 Z" fill="#e8dcc8" />
                  {/* Australia */}
                  <path d="M 750 290 L 860 285 L 880 330 L 860 380 L 820 390 L 770 380 L 745 345 Z" fill="#e8dcc8" />
                </svg>

                {/* Dot overlay */}
                {geoDots.map((dot, i) => (
                  <div key={i} style={{
                    position: 'absolute',
                    left: `${dot.x}%`,
                    top: `${dot.y}%`,
                    width: `${dot.size}px`,
                    height: `${dot.size}px`,
                    background: dot.color,
                    borderRadius: '50%',
                    transform: 'translate(-50%, -50%)',
                    border: '1.5px solid rgba(255,255,255,0.6)',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                    cursor: 'pointer',
                    zIndex: 2
                  }} />
                ))}

                {/* Zoom controls */}
                <div style={{ position: 'absolute', left: '12px', top: '12px', display: 'flex', flexDirection: 'column', gap: '2px', zIndex: 3 }}>
                  {[FiZoomIn, FiMinus, FiLayers, FiMapPin, FiSquare].map((Icon, i) => (
                    <button key={i} style={{ width: '28px', height: '28px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#475569' }}>
                      <Icon size={13} />
                    </button>
                  ))}
                </div>

                {/* Legend */}
                <div style={{ position: 'absolute', bottom: '12px', right: '12px', background: 'rgba(255,255,255,0.92)', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '8px 12px', fontSize: '11px', zIndex: 3 }}>
                  <div style={{ fontWeight: 600, color: '#1e293b', marginBottom: '6px' }}>Count</div>
                  {[
                    { color: '#facc15', label: '2 – 3.5' },
                    { color: '#f59e0b', label: '3.5 – 5' },
                    { color: '#ef4444', label: '5 – 6.5' },
                    { color: '#dc2626', label: '6.5 – 8' },
                  ].map(item => (
                    <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.color, display: 'inline-block', flexShrink: 0 }} />
                      <span style={{ color: '#475569' }}>{item.label}</span>
                    </div>
                  ))}
                </div>

                {/* Attribution */}
                <div style={{ position: 'absolute', bottom: '4px', left: '50%', transform: 'translateX(-50%)', fontSize: '10px', color: 'rgba(0,0,0,0.5)', zIndex: 3 }}>
                  Map data © OpenStreetMap contributors
                </div>
              </div>
            </div>

          </div>
        ) : (
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '40px', textAlign: 'center' }}>
            <FiSearch size={40} style={{ color: '#cbd5e1', marginBottom: '16px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 300, color: '#1e293b', margin: '0 0 8px 0' }}>No events to display</h3>
            <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Adjust your time range or filters to find AWS events.</p>
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

export default Aws;
