import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiMenu, FiHelpCircle, FiChevronDown } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface NavbarProps {
  onToggleSidebar: () => void;
  onLogout: () => void;
  username: string;
}

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, onLogout, username }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Determine breadcrumbs based on pathname
  const getBreadcrumbs = () => {
    const path = location.pathname;
    if (path === '/dashboard') {
      const isLoadSample = new URLSearchParams(location.search).get('loadsample') === 'true';
      if (isLoadSample) {
        return [{ label: 'Sample Data', onClick: () => navigate('/dashboard?loadsample=true') }];
      }
      return [{ label: 'Overview', onClick: () => navigate('/dashboard') }];
    } else if (path === '/dashboards') {
      return [{ label: 'Dashboards', onClick: () => navigate('/dashboards') }];
    } else if (path === '/events') {
      return [{ label: 'Discover', onClick: () => navigate('/events') }];
    } else if (path === '/reporting') {
      return [{ label: 'Reporting', onClick: () => navigate('/reporting') }];
    } else if (path === '/alerting') {
      const isMonitors = location.search.includes('tab=monitors');
      const isDestinations = location.search.includes('tab=destinations');
      const activeSub = isMonitors ? 'Monitors' : isDestinations ? 'Destinations' : 'Alerts';
      return [
        { label: 'Alerting', onClick: () => navigate('/alerting?tab=alerts') },
        { label: activeSub, onClick: () => {} }
      ];
    } else if (path === '/anomaly-detection') {
      const isDashboard = location.search.includes('view=dashboard');
      const isDetectors = location.search.includes('view=detectors');
      const activeSub = isDashboard ? 'Dashboard' : isDetectors ? 'Detectors' : '';
      const list = [{ label: 'Anomaly detection', onClick: () => navigate('/anomaly-detection?view=get-started') }];
      if (activeSub) {
        list.push({ label: activeSub, onClick: () => {} });
      }
      return list;
    } else if (path === '/maps') {
      return [{ label: 'Maps', onClick: () => navigate('/maps') }];
    } else if (path === '/notifications') {
      const isSenders = location.search.includes('view=senders');
      const isGroups = location.search.includes('view=recipient-groups');
      const activeSub = isSenders ? 'Email senders' : isGroups ? 'Email recipient groups' : 'Channels';
      return [
        { label: 'Notification channels', onClick: () => navigate('/notifications?view=channels') },
        { label: activeSub, onClick: () => {} }
      ];
    } else if (path === '/sca') {
      return [{ label: 'Configuration Assessment', onClick: () => navigate('/sca') }];
    } else if (path === '/fim') {
      return [{ label: 'File Integrity Monitoring', onClick: () => navigate('/fim') }];
    } else if (path === '/malware') {
      return [{ label: 'Malware Detection', onClick: () => navigate('/malware') }];
    } else if (path === '/hunting') {
      return [{ label: 'Threat Hunting', onClick: () => navigate('/hunting') }];
    } else if (path === '/hygiene') {
      return [{ label: 'IT Hygiene', onClick: () => navigate('/hygiene') }];
    } else if (path === '/pci') {
      return [{ label: 'PCI DSS', onClick: () => navigate('/pci') }];
    } else if (path === '/gdpr') {
      return [{ label: 'GDPR', onClick: () => navigate('/gdpr') }];
    } else if (path === '/hipaa') {
      return [{ label: 'HIPAA', onClick: () => navigate('/hipaa') }];
    } else if (path === '/nist') {
      return [{ label: 'NIST 800-53', onClick: () => navigate('/nist') }];
    } else if (path === '/tsc') {
      return [{ label: 'TSC', onClick: () => navigate('/tsc') }];
    } else if (path === '/docker') {
      return [{ label: 'Docker', onClick: () => navigate('/docker') }];
    } else if (path === '/aws') {
      return [{ label: 'Amazon Web Services', onClick: () => navigate('/aws') }];
    } else if (path === '/gcp') {
      return [{ label: 'Google Cloud', onClick: () => navigate('/gcp') }];
    } else if (path === '/github') {
      return [{ label: 'GitHub', onClick: () => navigate('/github') }];
    } else if (path === '/o365') {
      return [{ label: 'Office 365', onClick: () => navigate('/o365') }];
    } else if (path === '/msgraph') {
      return [{ label: 'Microsoft Graph API', onClick: () => navigate('/msgraph') }];
    } else if (path === '/mitre') {
      return [{ label: 'MITRE ATT&CK', onClick: () => navigate('/mitre') }];
    } else if (path === '/visualize') {
      return [{ label: 'Visualize', onClick: () => navigate('/visualize') }];
    } else if (path === '/agents') {
      // Check if there is search parameter or state for deploy
      const isDeploy = location.search.includes('deploy=true');
      if (isDeploy) {
        return [
          { label: 'Endpoints', onClick: () => navigate('/agents') },
          { label: 'Deploy new agent', onClick: () => {} }
        ];
      }
      return [{ label: 'Endpoints', onClick: () => navigate('/agents') }];
    } else if (path === '/agents/detail') {
      const tab = new URLSearchParams(location.search).get('tab');
      const agentId = new URLSearchParams(location.search).get('id') || 'Agent Details';
      const crumbs = [
        { label: 'Endpoints', onClick: () => navigate('/agents') },
        { label: agentId, onClick: () => navigate(`/agents/detail?id=${agentId}`) }
      ];
      if (tab === 'stats') {
        crumbs.push({ label: 'Stats', onClick: () => {} });
      } else if (tab === 'config') {
        crumbs.push({ label: 'Configuration', onClick: () => {} });
      }
      return crumbs;
    } else if (path.startsWith('/groups')) {
      const parts = path.split('/').filter(Boolean);
      const crumbs = [{ label: 'Groups', onClick: () => navigate('/groups') }];
      if (parts.length > 1) {
        crumbs.push({ label: parts[1], onClick: () => navigate(`/groups/${parts[1]}`) });
      }
      return crumbs;
    } else if (path === '/rules') {
      const tab = new URLSearchParams(location.search).get('tab');
      if (tab === 'decoders') {
        return [{ label: 'Decoders', onClick: () => navigate('/rules?tab=decoders') }];
      } else if (tab === 'cdblists') {
        return [{ label: 'CDB Lists', onClick: () => navigate('/rules?tab=cdblists') }];
      } else if (tab === 'test') {
        return [{ label: 'Ruleset Test', onClick: () => navigate('/rules?tab=test') }];
      }
      return [{ label: 'Rules', onClick: () => navigate('/rules') }];
    } else if (path === '/settings') {
      const tab = new URLSearchParams(location.search).get('tab');
      if (tab === 'config') return [{ label: 'Settings', onClick: () => navigate('/settings?tab=config') }];
      if (tab === 'cluster') return [{ label: 'Cluster', onClick: () => {} }];
      if (tab === 'stats') return [{ label: 'Statistics', onClick: () => {} }];
      if (tab === 'logs') return [{ label: 'Logs', onClick: () => {} }];
      if (tab === 'devtools') return [{ label: 'Dev Tools', onClick: () => navigate('/settings?tab=devtools') }];
      if (tab === 'security') return [{ label: 'Security', onClick: () => navigate('/settings?tab=security') }];
      if (tab === 'indices') return [{ label: 'Index Management', onClick: () => navigate('/settings?tab=indices') }];
      if (tab === 'snapshots') return [{ label: 'Snapshot Management', onClick: () => navigate('/settings?tab=snapshots') }];
      if (tab === 'indexsecurity') {
        const subtab = new URLSearchParams(location.search).get('subtab') || 'get_started';
        const subLabels: Record<string, string> = {
          get_started: 'Get Started',
          authentication: 'Authentication',
          roles: 'Roles',
          internal_users: 'Internal users',
          permissions: 'Permissions',
          audit_logs: 'Audit logs'
        };
        const crumbs = [
          { label: 'Security', onClick: () => navigate('/settings?tab=indexsecurity') }
        ];
        if (subtab && subtab !== 'get_started') {
          crumbs.push({ label: subLabels[subtab] || subtab, onClick: () => {} });
        }
        return crumbs;
      }
      if (tab === 'apis') return [{ label: 'Server APIs', onClick: () => {} }];
      if (tab === 'about') return [{ label: 'About', onClick: () => {} }];
      return [{ label: 'Status', onClick: () => navigate('/settings?tab=status') }];
    }
    return [{ label: 'Overview', onClick: () => navigate('/dashboard') }];
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="wz-header">
      <div className="wz-header-left">
        <button className="wz-menu-btn" onClick={onToggleSidebar}>
          <FiMenu size={18} />
        </button>
        <div className="wz-logo" onClick={() => navigate('/dashboard')}>
          w<span style={{ color: '#005cca', fontWeight: 900 }}>.</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {breadcrumbs.map((bc, index) => (
            <React.Fragment key={bc.label}>
              <div 
                onClick={bc.onClick}
                className="wz-breadcrumb-tab"
                style={{ 
                  cursor: index < breadcrumbs.length - 1 ? 'pointer' : 'default',
                  opacity: index < breadcrumbs.length - 1 ? 0.75 : 1,
                  marginLeft: index > 0 ? '4px' : '8px',
                  background: index === 0 ? '#e6f0fa' : '#e0f2fe',
                  color: index === 0 ? '#005cca' : '#0369a1',
                  borderLeft: index === 0 ? '3px solid #005cca' : '3px solid #0369a1'
                }}
              >
                {bc.label}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="wz-header-right">
        {location.pathname === '/malware' && (
          <div 
            onClick={() => {
              navigate('/agents');
              toast('Redirecting to Agent Explorer', { icon: '🔍' });
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: '#005cca',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              marginRight: '16px'
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="2"/>
              <path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/>
            </svg>
            <span>Explore agent</span>
          </div>
        )}
        <span style={{ color: '#64748b', fontWeight: 500 }}>API</span>
        <div 
          onClick={() => toast.error('API Context switching requires backend integration')}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '4px',
            border: '1px solid #cbd5e1',
            padding: '4px 8px',
            borderRadius: '4px',
            background: '#ffffff',
            cursor: 'pointer',
            userSelect: 'none',
            fontSize: '12px',
            color: '#1e293b'
          }}
        >
          <span>default</span>
          <FiChevronDown size={12} />
        </div>
        
        {/* User Profile and Dropdown */}
        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <button className="wz-user-avatar" onClick={() => setShowDropdown(!showDropdown)}>
            {username.charAt(0).toLowerCase()}
          </button>
          
          {showDropdown && (
            <div className="wz-user-menu">
              <div className="wz-user-menu-header">
                <span className="wz-user-avatar" style={{ cursor: 'default' }}>
                  {username.charAt(0).toLowerCase()}
                </span>
                <span style={{ fontWeight: 600, color: '#1e293b' }}>{username}</span>
              </div>
              
              <div style={{ height: '1px', background: '#e2e8f0', margin: '4px 0' }} />
              
              <button 
                className="wz-user-menu-item" 
                style={{ color: '#005cca', fontWeight: 500 }} 
                onClick={() => {
                  setShowDropdown(false);
                  navigate('/settings?tab=indexsecurity');
                  toast.success('Navigated to Roles & Identities');
                }}
              >
                View roles and identities
              </button>
              <button 
                className="wz-user-menu-item" 
                style={{ color: '#005cca', fontWeight: 500 }} 
                onClick={() => {
                  setShowDropdown(false);
                  toast.error('Password reset not configured yet.');
                }}
              >
                Reset password
              </button>
              
              <div style={{ height: '1px', background: '#e2e8f0', margin: '4px 0' }} />
              
              <button 
                className="wz-user-menu-item" 
                style={{ color: '#cc0000', fontWeight: 600 }}
                onClick={() => {
                  setShowDropdown(false);
                  toast.success('Logged out successfully');
                  onLogout();
                }}
              >
                Log out
              </button>
            </div>
          )}
        </div>

        {/* Help Circle */}
        <button 
          onClick={() => toast('Documentation portal coming soon!', { icon: '📚' })}
          style={{ 
            border: 'none', 
            background: 'none', 
            color: '#64748b', 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            padding: '4px'
          }}
        >
          <FiHelpCircle size={18} />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
