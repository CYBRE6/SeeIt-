import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { 
  FiSearch, FiActivity, FiSliders, FiMapPin, FiList, FiBarChart2, 
  FiTarget, FiGrid, FiAlignLeft, FiTrendingUp, FiMap, FiType,
  FiHash, FiPieChart, FiGlobe, FiDatabase, FiCloud, FiClock,
  FiCode, FiServer, FiPenTool, FiX
} from 'react-icons/fi';

const visualTypes = [
  { name: 'Area', icon: FiActivity },
  { name: 'Controls', icon: FiSliders },
  { name: 'Coordinate Map', icon: FiMapPin },
  { name: 'Data Table', icon: FiList },
  { name: 'Gantt Chart', icon: FiBarChart2 },
  { name: 'Gauge', icon: FiTarget },
  { name: 'Goal', icon: FiTarget },
  { name: 'Heat Map', icon: FiGrid },
  { name: 'Horizontal Bar', icon: FiAlignLeft },
  { name: 'Line', icon: FiTrendingUp },
  { name: 'Maps', icon: FiMap },
  { name: 'Markdown', icon: FiType },
  { name: 'Metric', icon: FiHash },
  { name: 'Pie', icon: FiPieChart },
  { name: 'Region Map', icon: FiGlobe },
  { name: 'TSVB', icon: FiDatabase },
  { name: 'Tag Cloud', icon: FiCloud },
  { name: 'Timeline', icon: FiClock },
  { name: 'Vega', icon: FiCode },
  { name: 'Vertical Bar', icon: FiServer },
  { name: 'VisBuilder', icon: FiPenTool },
];

const Visualize: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="wz-page" style={{ background: '#f8fafc', position: 'relative', minHeight: '100vh' }}>
      
      {/* Modal Overlay */}
      {isOpen && (
        <div style={{ position: 'fixed', top: 50, left: 250, right: 0, bottom: 0, background: 'rgba(248, 250, 252, 0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          
          <div style={{ width: '800px', height: '560px', background: '#ffffff', borderRadius: '4px', boxShadow: '0 10px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
            
            {/* Close Button */}
            <button onClick={() => { setIsOpen(false); toast.success('Visualization closed'); }} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', zIndex: 10 }}>
              <FiX size={20} />
            </button>

            {/* Header */}
            <div style={{ padding: '24px 32px 16px' }}>
              <h1 style={{ fontSize: '24px', fontWeight: 300, color: '#1e293b', margin: 0 }}>New Visualization</h1>
            </div>

            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
              
              {/* Left Panel */}
              <div style={{ flex: 3, display: 'flex', flexDirection: 'column', padding: '0 16px 16px 32px', borderRight: '1px solid #e2e8f0' }}>
                
                <div style={{ position: 'relative', marginBottom: '20px' }}>
                  <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={16} />
                  <input 
                    type="text" 
                    placeholder="Filter" 
                    style={{ width: '100%', padding: '8px 12px 8px 36px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none', boxSizing: 'border-box', background: '#fafafa' }}
                  />
                </div>

                <div style={{ flex: 1, overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', alignContent: 'start', paddingRight: '16px' }}>
                  {visualTypes.map(item => (
                    <div key={item.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '12px 8px', borderRadius: '4px', cursor: 'pointer', transition: 'background 0.2s' }} className="visual-type-item">
                      <div style={{ color: '#0d9488', marginBottom: '8px' }}>
                        <item.icon size={28} strokeWidth={1.5} />
                      </div>
                      <span style={{ fontSize: '12px', color: '#475569', textAlign: 'center', fontWeight: 500 }}>{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Panel */}
              <div style={{ flex: 2, padding: '24px 32px', position: 'relative', overflow: 'hidden' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', margin: '0 0 16px 0' }}>Select a visualization type</h2>
                <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                  Start creating your visualization by selecting a type for that visualization.
                </p>

                {/* Decorative Pattern Background */}
                <div style={{ position: 'absolute', bottom: '-40px', right: '-40px', width: '200px', height: '200px', background: '#f1f5f9', borderRadius: '50%', opacity: 0.6 }}></div>
                <div style={{ position: 'absolute', bottom: '20px', right: '40px', display: 'grid', gridTemplateColumns: 'repeat(3, 12px)', gap: '8px', opacity: 0.2 }}>
                  {Array.from({ length: 15 }).map((_, i) => (
                    <div key={i} style={{ width: '8px', height: '8px', background: '#1e293b', borderRadius: '2px' }}></div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Empty Background state when modal is closed */}
      {!isOpen && (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <button onClick={() => { setIsOpen(true); toast.success('Creating new visualization'); }} className="wz-btn">Create Visualization</button>
        </div>
      )}
      
      <style>{`
        .visual-type-item:hover {
          background: #f1f5f9;
        }
      `}</style>
    </div>
  );
};

export default Visualize;
