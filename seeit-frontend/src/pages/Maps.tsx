import React from 'react';
import { toast } from 'react-hot-toast';
import { FiPlus } from 'react-icons/fi';

const Maps: React.FC = () => {
  return (
    <div className="wz-page" style={{ background: '#f8fafc', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 120px)' }}>
      <div className="wz-pill-card" style={{ 
        background: '#ffffff', 
        border: '1px solid #e2e8f0', 
        borderRadius: '4px', 
        padding: '32px 48px',
        maxWidth: '560px',
        width: '100%',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 300, color: '#1e293b', margin: 0 }}>
            Create your first map
          </h2>
          <button onClick={() => toast.success('Creating new map')} className="wz-btn" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, padding: '8px 16px' }}>
            <FiPlus size={16} /> Create map
          </button>
        </div>
        <p style={{ fontSize: '13.5px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
          There is no map to display, let's create your first map.
        </p>
      </div>
    </div>
  );
};

export default Maps;
