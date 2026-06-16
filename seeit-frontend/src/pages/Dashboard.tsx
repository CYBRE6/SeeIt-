import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  FiShield, FiFileText, FiCheckSquare, FiAlertTriangle, FiSearch, 
  FiActivity, FiServer, FiLock, FiCpu, FiGithub, FiBox, FiCloud,
  FiPlus, FiInfo, FiSettings, FiHeart, FiTarget, FiDatabase, FiLayout, FiClipboard, FiShare2, FiHexagon
} from 'react-icons/fi';

interface ModuleCard {
  title: string;
  desc: string;
  icon: React.ComponentType<any>;
  tab: string;
}

interface Section {
  key: string;
  label: string;
  modules: ModuleCard[];
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isLoadSample = searchParams.get('loadsample') === 'true';

  // Track sample data state per card: idle, loading, added
  const [addedSamples, setAddedSamples] = useState<Record<string, 'idle' | 'loading' | 'added'>>({
    security: 'idle',
    malware: 'idle',
    threat: 'idle',
    system: 'idle',
    vulnerability: 'idle'
  });

  const handleToggleSample = (key: string) => {
    const current = addedSamples[key];
    if (current === 'idle') {
      toast.loading('Adding sample data...');
      setAddedSamples(prev => ({ ...prev, [key]: 'loading' }));
      setTimeout(() => {
        setAddedSamples(prev => ({ ...prev, [key]: 'added' }));
        toast.success('Sample data added');
      }, 800);
    } else if (current === 'added') {
      toast.loading('Removing sample data...');
      setAddedSamples(prev => ({ ...prev, [key]: 'loading' }));
      setTimeout(() => {
        setAddedSamples(prev => ({ ...prev, [key]: 'idle' }));
        toast.success('Sample data removed');
      }, 800);
    }
  };

  const sections: Section[] = [
    {
      key: 'endpoint',
      label: 'Endpoint Security',
      modules: [
        {
          title: 'Configuration Assessment',
          desc: 'Scan your assets as part of a configuration assessment audit.',
          icon: FiSettings,
          tab: 'sca'
        },
        {
          title: 'Malware Detection',
          desc: 'Check indicators of compromise triggered by malware infections or cyberattacks.',
          icon: FiFileText,
          tab: 'malware'
        },
        {
          title: 'File Integrity Monitoring',
          desc: 'Alerts related to file changes, including permissions, content, ownership, and attributes.',
          icon: FiFileText,
          tab: 'fim'
        }
      ]
    },
    {
      key: 'threat',
      label: 'Threat Intelligence',
      modules: [
        {
          title: 'Threat Hunting',
          desc: 'Browse through your security alerts, identifying issues and threats in your environment.',
          icon: FiSearch,
          tab: 'hunting'
        },
        {
          title: 'Vulnerability Detection',
          desc: 'Discover what applications in your environment are affected by well-known vulnerabilities.',
          icon: FiHeart,
          tab: 'vulnerabilities'
        },
        {
          title: 'MITRE ATT&CK',
          desc: 'Explore security alerts mapped to adversary tactics and techniques for better threat understanding.',
          icon: FiTarget,
          tab: 'mitre'
        }
      ]
    },
    {
      key: 'secops',
      label: 'Security Operations',
      modules: [
        {
          title: 'IT Hygiene',
          desc: 'Assess system, software, processes, and network layers to detect misconfigurations, unauthorized changes, and anomalies.',
          icon: FiShare2,
          tab: 'hygiene'
        },
        {
          title: 'PCI DSS',
          desc: 'Global security standard for entities that process, store, or transmit payment cardholder data.',
          icon: FiDatabase,
          tab: 'pci'
        },
        {
          title: 'GDPR',
          desc: 'General Data Protection Regulation (GDPR) sets guidelines for processing of personal data.',
          icon: FiLayout,
          tab: 'gdpr'
        },
        {
          title: 'HIPAA',
          desc: 'Health Insurance Portability and Accountability Act of 1996 (HIPAA) provides data privacy and security provisions for safeguarding medical information.',
          icon: FiActivity,
          tab: 'hipaa'
        },
        {
          title: 'NIST 800-53',
          desc: 'National Institute of Standards and Technology Special Publication 800-53 (NIST 800-53) sets guidelines for federal information systems.',
          icon: FiClipboard,
          tab: 'nist'
        },
        {
          title: 'TSC',
          desc: 'Trust Services Criteria for Security, Availability, Processing Integrity, Confidentiality, and Privacy.',
          icon: FiShare2,
          tab: 'tsc'
        }
      ]
    },
    {
      key: 'cloud',
      label: 'Cloud Security',
      modules: [
        {
          title: 'Docker',
          desc: 'Monitor and collect the activity from Docker containers such as creation, running, starting, stopping or pausing events.',
          icon: FiBox,
          tab: 'docker'
        },
        {
          title: 'Amazon Web Services',
          desc: 'Security events related to your Amazon AWS services, collected directly via AWS API.',
          icon: FiCloud, // Using AWS text logo in real
          tab: 'aws'
        },
        {
          title: 'Google Cloud',
          desc: 'Security events related to your Google Cloud Platform services, collected directly via GCP API.',
          icon: FiHexagon,
          tab: 'gcp'
        },
        {
          title: 'GitHub',
          desc: 'Monitoring events from audit logs of your GitHub organizations.',
          icon: FiGithub,
          tab: 'github'
        },
        {
          title: 'Office 365',
          desc: 'Security events related to your Office 365 services.',
          icon: FiLayout,
          tab: 'o365'
        },
        {
          title: 'Microsoft Graph API',
          desc: 'Security events related to your Microsoft Graph services, collected directly via Microsoft Graph API.',
          icon: FiHexagon,
          tab: 'msgraph'
        }
      ]
    }
  ];

  if (isLoadSample) {
    return (
      <div className="wz-page" style={{ background: '#f8fafc', padding: '24px' }}>
        <div className="wz-page-content" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 300, color: '#1e293b', margin: '0 0 4px 0' }}>Sample data</h1>
            <p style={{ fontSize: '13.5px', color: '#64748b', margin: 0 }}>Add sample data with events to the modules</p>
          </div>

          <div style={{ 
            background: '#e6f0fa', 
            borderLeft: '4px solid #005cca', 
            padding: '12px 16px', 
            borderRadius: '4px', 
            fontSize: '13px', 
            color: '#005cca', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px'
          }}>
            <FiInfo size={16} style={{ flexShrink: 0 }} />
            <span>These actions require permissions on the managed indices.</span>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
            gap: '24px',
            marginTop: '8px'
          }}>
            {[
              {
                id: 'security',
                title: 'Sample security information',
                desc: 'Sample data, visualizations and dashboards for security information (File Integrity Monitoring, Amazon Web Services, Office 365, Google Cloud, GitHub, Microsoft Graph API, authorization, ssh, web).'
              },
              {
                id: 'malware',
                title: 'Sample Malware Detection',
                desc: 'Sample data, visualizations and dashboards for events of Malware Detection (malware, VirusTotal, YARA).'
              },
              {
                id: 'threat',
                title: 'Sample threat detection and response',
                desc: 'Sample data, visualizations and dashboards for threat events of detection and response (Vulnerability Detection, Docker, MITRE ATT&CK).'
              },
              {
                id: 'system',
                title: 'Sample system inventory',
                desc: 'Sample data, visualizations and dashboards for system inventory (groups, hardware, hotfixes, interfaces, networks, packages, ports, processes, protocols, system, users, services, browser extensions).'
              },
              {
                id: 'vulnerability',
                title: 'Sample vulnerability detection inventory',
                desc: 'Sample data, visualizations and dashboards for vulnerabilities inventory.'
              }
            ].map(card => {
              const state = addedSamples[card.id];
              return (
                <div 
                  key={card.id}
                  className="wz-pill-card" 
                  style={{ 
                    padding: '24px', 
                    background: '#ffffff', 
                    border: '1px solid #e2e8f0', 
                    borderRadius: '6px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '16px',
                    minHeight: '220px'
                  }}
                >
                  <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', margin: 0 }}>{card.title}</h3>
                  <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.6', margin: 0, flex: 1 }}>{card.desc}</p>
                  
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                    <button 
                      onClick={() => handleToggleSample(card.id)}
                      disabled={state === 'loading'}
                      style={{ 
                        background: state === 'added' ? '#eff6ff' : '#ffffff', 
                        border: '1px solid #005cca', 
                        color: '#005cca', 
                        borderRadius: '4px', 
                        padding: '6px 16px', 
                        fontSize: '13px', 
                        fontWeight: 600, 
                        cursor: state === 'loading' ? 'not-allowed' : 'pointer',
                        outline: 'none',
                        transition: 'all 0.1s ease',
                        opacity: state === 'loading' ? 0.7 : 1
                      }}
                    >
                      {state === 'idle' && 'Add data'}
                      {state === 'loading' && 'Loading...'}
                      {state === 'added' && 'Remove data'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wz-page">
      <div className="wz-page-content">
        
        {/* Top Split Cards (Agents Summary & Last 24 Hours Alerts) */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 3fr', gap: '20px', marginBottom: '16px' }}>
          
          {/* AGENTS SUMMARY CARD */}
          <div className="wz-pill-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '180px', cursor: 'pointer' }} onClick={() => navigate('/agents')}>
            <div className="wz-pill-card-header">Agents Summary</div>
            <div style={{ textAlign: 'center', padding: '10px' }}>
              <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 16px 0', lineHeight: 1.5 }}>
                This instance has no agents registered.<br />
                Please deploy agents to begin monitoring your endpoints.
              </p>
              <button 
                className="wz-btn" 
                style={{ margin: '0 auto' }}
                onClick={(e) => { e.stopPropagation(); navigate('/agents?deploy=true'); }}
              >
                <FiPlus size={14} /> Deploy new agent
              </button>
            </div>
          </div>

          {/* LAST 24 HOURS ALERTS CARD */}
          <div className="wz-pill-card" style={{ minHeight: '180px' }}>
            <div className="wz-pill-card-header">Last 24 Hours Alerts</div>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(4, 1fr)', 
              gap: '12px', 
              height: '100%', 
              alignItems: 'center',
              paddingTop: '8px'
            }}>
              {/* Critical */}
              <div
                onClick={() => navigate('/events?search=rule.level:%3E=15')}
                style={{ textAlign: 'center', cursor: 'pointer' }}
              >
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b' }}>Critical severity</span>
                <div style={{ fontSize: '38px', fontWeight: 700, color: '#cc0000', margin: '6px 0' }}>124</div>
                <span style={{ fontSize: '11px', color: '#64748b' }}>events</span>
              </div>
              
              {/* High */}
              <div
                onClick={() => navigate('/events?search=rule.level:12-14')}
                style={{ textAlign: 'center', cursor: 'pointer' }}
              >
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b' }}>High severity</span>
                <div style={{ fontSize: '38px', fontWeight: 700, color: '#f59e0b', margin: '6px 0' }}>1,247</div>
                <span style={{ fontSize: '11px', color: '#64748b' }}>events</span>
              </div>

              {/* Medium */}
              <div
                onClick={() => navigate('/events?search=rule.level:7-11')}
                style={{ textAlign: 'center', cursor: 'pointer' }}
              >
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b' }}>Medium severity</span>
                <div style={{ fontSize: '38px', fontWeight: 700, color: '#005cca', margin: '6px 0' }}>8,532</div>
                <span style={{ fontSize: '11px', color: '#64748b' }}>events</span>
              </div>

              {/* Low */}
              <div
                onClick={() => navigate('/events?search=rule.level:0-6')}
                style={{ textAlign: 'center', cursor: 'pointer' }}
              >
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b' }}>Low severity</span>
                <div style={{ fontSize: '38px', fontWeight: 700, color: '#00a853', margin: '6px 0' }}>12,456</div>
                <span style={{ fontSize: '11px', color: '#64748b' }}>events</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section Grids (Endpoint Security, Threat Intel, etc.) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {sections.filter(s => s.key === 'endpoint' || s.key === 'secops').map(section => (
              <div key={section.key} className="wz-pill-card" style={{ marginBottom: 0 }}>
                <div className="wz-pill-card-header">{section.label}</div>
                
                <div className="wz-module-grid-container">
                  {section.modules.map(mod => {
                    const Icon = mod.icon;
                    return (
                      <div 
                        key={mod.title} 
                        className="wz-module-entry"
                        onClick={() => {
                          if (mod.tab === 'sca') navigate('/sca');
                          else if (mod.tab === 'fim') navigate('/fim');
                          else if (mod.tab === 'malware') navigate('/malware');
                          else if (mod.tab === 'hunting') navigate('/hunting');
                          else if (mod.tab === 'mitre') navigate('/mitre');
                          else if (mod.tab === 'hygiene') navigate('/hygiene');
                          else if (mod.tab === 'pci') navigate('/pci');
                          else if (mod.tab === 'gdpr') navigate('/gdpr');
                          else if (mod.tab === 'hipaa') navigate('/hipaa');
                          else if (mod.tab === 'nist') navigate('/nist');
                          else if (mod.tab === 'tsc') navigate('/tsc');
                          else if (mod.tab === 'docker') navigate('/docker');
                          else if (mod.tab === 'aws') navigate('/aws');
                          else if (mod.tab === 'gcp') navigate('/gcp');
                          else if (mod.tab === 'github') navigate('/github');
                          else if (mod.tab === 'o365') navigate('/o365');
                          else if (mod.tab === 'msgraph') navigate('/msgraph');
                          else navigate(`/events?search=${mod.tab}`);
                        }}
                      >
                        <div className="wz-module-entry-icon">
                          <Icon size={24} />
                        </div>
                        <div>
                          <div className="wz-module-entry-title">{mod.title}</div>
                          <div className="wz-module-entry-desc">{mod.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Right Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {sections.filter(s => s.key === 'threat' || s.key === 'cloud').map(section => (
              <div key={section.key} className="wz-pill-card" style={{ marginBottom: 0 }}>
                <div className="wz-pill-card-header">{section.label}</div>
                
                <div className="wz-module-grid-container">
                  {section.modules.map(mod => {
                    const Icon = mod.icon;
                    return (
                      <div 
                        key={mod.title} 
                        className="wz-module-entry"
                        onClick={() => {
                          if (mod.tab === 'sca') navigate('/sca');
                          else if (mod.tab === 'fim') navigate('/fim');
                          else if (mod.tab === 'malware') navigate('/malware');
                          else if (mod.tab === 'hunting') navigate('/hunting');
                          else if (mod.tab === 'mitre') navigate('/mitre');
                          else if (mod.tab === 'hygiene') navigate('/hygiene');
                          else if (mod.tab === 'pci') navigate('/pci');
                          else if (mod.tab === 'gdpr') navigate('/gdpr');
                          else if (mod.tab === 'hipaa') navigate('/hipaa');
                          else if (mod.tab === 'nist') navigate('/nist');
                          else if (mod.tab === 'tsc') navigate('/tsc');
                          else if (mod.tab === 'docker') navigate('/docker');
                          else if (mod.tab === 'aws') navigate('/aws');
                          else if (mod.tab === 'gcp') navigate('/gcp');
                          else if (mod.tab === 'github') navigate('/github');
                          else if (mod.tab === 'o365') navigate('/o365');
                          else if (mod.tab === 'msgraph') navigate('/msgraph');
                          else navigate(`/events?search=${mod.tab}`);
                        }}
                      >
                        <div className="wz-module-entry-icon">
                          <Icon size={24} />
                        </div>
                        <div>
                          <div className="wz-module-entry-title">{mod.title}</div>
                          <div className="wz-module-entry-desc">{mod.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

// Simple Fallback Grid Icon
const FiGridIcon: React.FC<any> = (props) => (
  <svg 
    stroke="currentColor" 
    fill="none" 
    strokeWidth="2" 
    viewBox="0 0 24 24" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    height="1em" 
    width="1em" 
    {...props}
  >
    <rect x="3" y="3" width="7" height="7"></rect>
    <rect x="14" y="3" width="7" height="7"></rect>
    <rect x="14" y="14" width="7" height="7"></rect>
    <rect x="3" y="14" width="7" height="7"></rect>
  </svg>
);

export default Dashboard;
