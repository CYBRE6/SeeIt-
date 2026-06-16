import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  FiHome, FiSearch, FiShield, FiAlertTriangle, FiActivity, FiCloud, 
  FiServer, FiCpu, FiDatabase, FiGrid, FiChevronDown, FiChevronRight,
  FiClock, FiSettings, FiLock, FiUnlock
} from 'react-icons/fi';

interface SidebarProps {
  collapsed: boolean;
}

interface SubMenuItem {
  label: string;
  path: string;
}

interface MenuItem {
  key: string;
  label: string;
  icon: React.ComponentType<any>;
  subitems: SubMenuItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Track which accordion sections are expanded. Initialize Home and Explore as open.
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    home: true,
    explore: true,
    endpoint: false,
    threat: false,
    secops: false,
    cloud: false,
    agents: false,
    server: false,
    indexer: false,
    dashboard: false,
  });

  const toggleCategory = (key: string) => {
    setExpanded(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const menuGroups: MenuItem[] = [
    {
      key: 'home',
      label: 'Home',
      icon: FiHome,
      subitems: [
        { label: 'Overview', path: '/dashboard' }
      ]
    },
    {
      key: 'explore',
      label: 'Explore',
      icon: FiSearch,
      subitems: [
        { label: 'Discover', path: '/events' },
        { label: 'Dashboards', path: '/dashboards' },
        { label: 'Visualize', path: '/visualize' },
        { label: 'Reporting', path: '/reporting' },
        { label: 'Alerting', path: '/alerting' },
        { label: 'Anomaly Detection', path: '/anomaly-detection' },
        { label: 'Maps', path: '/maps' },
        { label: 'Notifications', path: '/notifications' }
      ]
    },
    {
      key: 'endpoint',
      label: 'Endpoint security',
      icon: FiShield,
      subitems: [
        { label: 'Configuration Assessment', path: '/sca' },
        { label: 'Malware Detection', path: '/malware' },
        { label: 'File Integrity Monitoring', path: '/fim' }
      ]
    },
    {
      key: 'threat',
      label: 'Threat intelligence',
      icon: FiAlertTriangle,
      subitems: [
        { label: 'Threat Hunting', path: '/hunting' },
        { label: 'Vulnerability Detection', path: '/vulnerabilities' },
        { label: 'MITRE ATT&CK', path: '/mitre' }
      ]
    },
    {
      key: 'secops',
      label: 'Security operations',
      icon: FiActivity,
      subitems: [
        { label: 'IT Hygiene', path: '/hygiene' },
        { label: 'PCI DSS', path: '/pci' },
        { label: 'GDPR', path: '/gdpr' },
        { label: 'HIPAA', path: '/hipaa' },
        { label: 'NIST 800-53', path: '/nist' },
        { label: 'TSC', path: '/tsc' }
      ]
    },
    {
      key: 'cloud',
      label: 'Cloud security',
      icon: FiCloud,
      subitems: [
        { label: 'Docker', path: '/docker' },
        { label: 'Amazon Web Services', path: '/aws' },
        { label: 'Google Cloud', path: '/gcp' },
        { label: 'GitHub', path: '/github' },
        { label: 'Office 365', path: '/o365' },
        { label: 'Microsoft Graph API', path: '/msgraph' }
      ]
    },
    {
      key: 'agents',
      label: 'Agents management',
      icon: FiServer,
      subitems: [
        { label: 'Summary', path: '/agents' },
        { label: 'Groups', path: '/agents?view=groups' }
      ]
    },
    {
      key: 'server',
      label: 'Server management',
      icon: FiCpu,
      subitems: [
        { label: 'Rules', path: '/rules' },
        { label: 'Decoders', path: '/rules?tab=decoders' },
        { label: 'CDB Lists', path: '/rules?tab=cdblists' },
        { label: 'Status', path: '/settings?tab=status' },
        { label: 'Cluster', path: '/settings?tab=cluster' },
        { label: 'Statistics', path: '/settings?tab=stats' },
        { label: 'Logs', path: '/settings?tab=logs' },
        { label: 'Settings', path: '/settings?tab=config' },
        { label: 'Dev Tools', path: '/settings?tab=devtools' },
        { label: 'Ruleset Test', path: '/rules?tab=test' },
        { label: 'Security', path: '/settings?tab=security' }
      ]
    },
    {
      key: 'indexer',
      label: 'Indexer management',
      icon: FiDatabase,
      subitems: [
        { label: 'Index Management', path: '/settings?tab=indices' },
        { label: 'Snapshot Management', path: '/settings?tab=snapshots' },
        { label: 'Security', path: '/settings?tab=indexsecurity' },
        { label: 'Sample Data', path: '/dashboard?loadsample=true' },
        { label: 'Dev Tools', path: '/settings?tab=devtools' }
      ]
    },
    {
      key: 'dashboard',
      label: 'Dashboard management',
      icon: FiGrid,
      subitems: [
        { label: 'Dashboards Management', path: '/dashboards' },
        { label: 'Reporting', path: '/reporting' },
        { label: 'Server APIs', path: '/settings?tab=apis' },
        { label: 'App Settings', path: '/settings?tab=app_settings' },
        { label: 'About', path: '/settings?tab=about' }
      ]
    }
  ];

  // Helper to check if a path is active
  const isPathActive = (path: string) => {
    return location.pathname + location.search === path;
  };

  // Helper to check if a group contains active path
  const isGroupActive = (group: MenuItem) => {
    return group.subitems.some(item => isPathActive(item.path) || location.pathname === item.path.split('?')[0]);
  };

  return (
    <div className={`wz-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="wz-sidebar-menu">
        {/* Recently Viewed Static Header */}
        <button 
          className="wz-sidebar-item" 
          style={{ fontWeight: 600, color: '#0f172a' }}
          onClick={() => {}}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FiClock size={16} style={{ color: '#64748b' }} />
            <span>Recently viewed</span>
          </div>
          <FiChevronRight size={14} style={{ color: '#94a3b8' }} />
        </button>

        <div style={{ height: '1px', background: '#f1f5f9', margin: '4px 8px' }} />

        {/* Dynamic Accordion Groups */}
        {menuGroups.map(group => {
          const Icon = group.icon;
          const isExpanded = expanded[group.key];
          const hasActiveItem = isGroupActive(group);
          
          return (
            <div key={group.key} style={{ marginBottom: '2px' }}>
              <button
                className={`wz-sidebar-item ${hasActiveItem && !isExpanded ? 'active' : ''}`}
                onClick={() => toggleCategory(group.key)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Icon size={16} style={{ color: hasActiveItem && !isExpanded ? '#005cca' : '#64748b' }} />
                  <span>{group.label}</span>
                </div>
                {isExpanded ? (
                  <FiChevronDown size={14} style={{ color: '#94a3b8' }} />
                ) : (
                  <FiChevronRight size={14} style={{ color: '#94a3b8' }} />
                )}
              </button>
              
              {isExpanded && (
                <div className="wz-sidebar-submenu">
                  {group.subitems.map(sub => {
                    const isActive = isPathActive(sub.path);
                    return (
                      <button
                        key={sub.label}
                        className={`wz-sidebar-subitem ${isActive ? 'active' : ''}`}
                        onClick={() => navigate(sub.path)}
                      >
                        {sub.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Dock navigation bottom button */}
      <div style={{ 
        padding: '12px 16px', 
        borderTop: '1px solid #e2e8f0', 
        fontSize: '12px',
        color: '#64748b',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: '#f8fafc',
        cursor: 'pointer'
      }}>
        <FiLock size={14} />
        <span>Dock navigation</span>
      </div>
    </div>
  );
};

export default Sidebar;
