import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  FiSearch, FiPlus, FiRefreshCw, FiDownload, FiFolder, FiTrash2,
  FiEye, FiEdit2, FiInfo, FiFolderPlus, FiFileText, FiUpload, FiPlay
} from 'react-icons/fi';

const Rules: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get('tab') || 'rules'; // 'rules', 'decoders', 'cdblists', 'test'

  const [searchQuery, setSearchQuery] = useState('');

  // ----------------------------------------------------
  // MOCK DATA
  // ----------------------------------------------------
  const rulesList = [
    { id: '1', desc: 'Generic template for all syslog rules.', groups: 'syslog', level: 0, file: '0010-rules_config.xml', path: 'ruleset/rules' },
    { id: '2', desc: 'Generic template for all firewall rules.', groups: 'firewall', level: 0, file: '0010-rules_config.xml', path: 'ruleset/rules' },
    { id: '3', desc: 'Generic template for all ids rules.', groups: 'ids', level: 0, file: '0010-rules_config.xml', path: 'ruleset/rules' },
    { id: '4', desc: 'Generic template for all web rules.', groups: 'web-log', level: 0, file: '0010-rules_config.xml', path: 'ruleset/rules' },
    { id: '5', desc: 'Generic template for all web proxy rules.', groups: 'squid', level: 0, file: '0010-rules_config.xml', path: 'ruleset/rules' },
    { id: '6', desc: 'Generic template for all windows rules.', groups: 'windows', level: 0, file: '0010-rules_config.xml', path: 'ruleset/rules' },
    { id: '7', desc: 'Generic template for all wazuh rules.', groups: 'ossec', level: 0, file: '0010-rules_config.xml', path: 'ruleset/rules' },
    { id: '200', desc: 'Grouping of wazuh rules.', groups: 'wazuh', level: 0, file: '0016-wazuh_rules.xml', path: 'ruleset/rules' },
    { id: '201', desc: 'Agent event queue rule', groups: 'agent_flooding, wazuh', level: 0, file: '0016-wazuh_rules.xml', path: 'ruleset/rules' },
    { id: '202', desc: 'Agent event queue is level full.', groups: 'agent_flooding, wazuh', level: 7, file: '0016-wazuh_rules.xml', path: 'ruleset/rules' }
  ];

  const decodersList = [
    { name: 'wazuh', progName: '', order: '', file: '0005-wazuh_decoders.xml', path: 'ruleset/decoders' },
    { name: 'agent-buffer', progName: '', order: 'level', file: '0005-wazuh_decoders.xml', path: 'ruleset/decoders' },
    { name: 'agent-upgrade', progName: '', order: 'agent.id, agent.name, status', file: '0005-wazuh_decoders.xml', path: 'ruleset/decoders' },
    { name: 'agent-upgrade', progName: '', order: 'error', file: '0005-wazuh_decoders.xml', path: 'ruleset/decoders' },
    { name: 'agent-upgrade', progName: '', order: 'agent.cur_version', file: '0005-wazuh_decoders.xml', path: 'ruleset/decoders' },
    { name: 'agent-upgrade', progName: '', order: 'agent.new_version', file: '0005-wazuh_decoders.xml', path: 'ruleset/decoders' },
    { name: 'agent-restart', progName: '', order: 'module', file: '0005-wazuh_decoders.xml', path: 'ruleset/decoders' },
    { name: 'fim-state', progName: '', order: '', file: '0005-wazuh_decoders.xml', path: 'ruleset/decoders' },
    { name: 'json-msgraph', progName: '', order: '', file: '0006-json_decoders.xml', path: 'ruleset/decoders' },
    { name: 'json', progName: '', order: '', file: '0006-json_decoders.xml', path: 'ruleset/decoders' }
  ];

  const cdbLists = [
    { name: 'audit-keys', path: 'etc/lists' },
    { name: 'aws-eventnames', path: 'etc/lists/amazon' },
    { name: 'aws-sources', path: 'etc/lists/amazon' },
    { name: 'malicious-domains', path: 'etc/lists/malicious-ioc' },
    { name: 'malicious-ip', path: 'etc/lists/malicious-ioc' },
    { name: 'malware-hashes', path: 'etc/lists/malicious-ioc' },
    { name: 'security-eventchannel', path: 'etc/lists' }
  ];

  // Ruleset test state
  const [logInput, setLogInput] = useState('');
  const [testResult, setTestResult] = useState<any>(null);

  const handleRunTest = () => {
    toast.success('Running ruleset test');
    setTestResult({
      predecoding: {
        hostname: 'Ubuntu20.04-LTS',
        program_name: 'sshd',
        log: 'Failed password for invalid user admin from 192.168.1.100 port 54321 ssh2'
      },
      decoding: {
        decoder: 'sshd',
        srcip: '192.168.1.100',
        srcport: '54321',
        dstuser: 'admin'
      },
      matching: {
        id: '5716',
        level: 5,
        description: 'sshd: Authentication failed.',
        groups: ['syslog', 'sshd', 'authentication_failed'],
        pci_dss: ['10.2.4', '10.2.5'],
        gpg13: ['7.8'],
        gdpr: ['IV_35.7.d'],
        hipaa: ['164.312.b'],
        nist: ['AU_14', 'AC_7']
      }
    });
  };

  // ----------------------------------------------------
  // VIEW RENDER FUNCTIONS
  // ----------------------------------------------------
  const renderRulesTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', margin: 0 }}>Rules (4,513)</h2>
          <span style={{ fontSize: '13.5px', color: '#64748b' }}>From here you can manage your rules.</span>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <button onClick={() => toast.success('Managing rules files')} style={{ background: 'none', border: 'none', color: '#005cca', fontSize: '13.5px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <FiFolder size={15} /> Manage rules files
          </button>
          <button onClick={() => toast.success('Adding new rules file')} style={{ background: 'none', border: 'none', color: '#005cca', fontSize: '13.5px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <FiPlus size={16} /> Add new rules file
          </button>
          <button onClick={() => toast.success('Rules refreshed')} style={{ background: 'none', border: 'none', color: '#005cca', fontSize: '13.5px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <FiRefreshCw size={14} /> Refresh
          </button>
          <button onClick={() => toast.success('Rules exported')} style={{ background: 'none', border: 'none', color: '#005cca', fontSize: '13.5px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <FiDownload size={14} /> Export formatted
          </button>
        </div>
      </div>

      {/* Search tool block */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 36px',
              borderRadius: '4px',
              border: '1px solid #cbd5e1',
              fontSize: '13.5px'
            }}
          />
        </div>
        <button style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '0 16px', fontSize: '13px', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
          WQL
        </button>
        <button style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '0 16px', fontSize: '13px', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
          Custom rules
        </button>
      </div>

      {/* Rules Table */}
      <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
        <table className="wz-table">
          <thead>
            <tr>
              <th>ID ↑</th>
              <th>Description</th>
              <th>Groups</th>
              <th>Level</th>
              <th>File</th>
              <th>Path</th>
            </tr>
          </thead>
          <tbody>
            {rulesList.map(rule => (
              <tr key={rule.id}>
                <td>{rule.id}</td>
                <td style={{ color: '#334155' }}>{rule.desc}</td>
                <td style={{ color: '#475569', fontWeight: 500 }}>{rule.groups}</td>
                <td>
                  <span className={`wz-badge wz-badge-${rule.level >= 7 ? 'critical' : 'active'}`}>
                    {rule.level}
                  </span>
                </td>
                <td style={{ color: '#005cca', fontWeight: 500, cursor: 'pointer' }}>{rule.file}</td>
                <td style={{ color: '#64748b', fontSize: '12.5px' }}>{rule.path}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Footer */}
        <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', fontSize: '13px', color: '#64748b' }}>
          <div>
            Rows per page: 10 <span style={{ fontSize: '10px' }}>▼</span>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{ cursor: 'pointer' }}>&lt;</span>
            <span style={{ fontWeight: 600, color: '#005cca' }}>1</span>
            <span style={{ cursor: 'pointer' }}>2</span>
            <span style={{ cursor: 'pointer' }}>3</span>
            <span style={{ cursor: 'pointer' }}>4</span>
            <span style={{ cursor: 'pointer' }}>5</span>
            <span>...</span>
            <span style={{ cursor: 'pointer' }}>452</span>
            <span style={{ cursor: 'pointer' }}>&gt;</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDecodersTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', margin: 0 }}>Decoders (1,576)</h2>
          <span style={{ fontSize: '13.5px', color: '#64748b' }}>From here you can manage your decoders.</span>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <button onClick={() => toast.success('Managing decoders files')} style={{ background: 'none', border: 'none', color: '#005cca', fontSize: '13.5px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <FiFolder size={15} /> Manage decoders files
          </button>
          <button onClick={() => toast.success('Adding new decoders file')} style={{ background: 'none', border: 'none', color: '#005cca', fontSize: '13.5px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <FiPlus size={16} /> Add new decoders file
          </button>
          <button onClick={() => toast.success('Decoders refreshed')} style={{ background: 'none', border: 'none', color: '#005cca', fontSize: '13.5px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <FiRefreshCw size={14} /> Refresh
          </button>
          <button onClick={() => toast.success('Decoders exported')} style={{ background: 'none', border: 'none', color: '#005cca', fontSize: '13.5px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <FiDownload size={14} /> Export formatted
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 36px',
              borderRadius: '4px',
              border: '1px solid #cbd5e1',
              fontSize: '13.5px'
            }}
          />
        </div>
        <button style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '0 16px', fontSize: '13px', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
          WQL
        </button>
        <button style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '0 16px', fontSize: '13px', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
          Custom decoders
        </button>
      </div>

      <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
        <table className="wz-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Program name</th>
              <th>Order</th>
              <th>File ↑</th>
              <th>Path</th>
            </tr>
          </thead>
          <tbody>
            {decodersList.map((dec, idx) => (
              <tr key={idx}>
                <td style={{ fontWeight: 500, color: '#334155' }}>{dec.name}</td>
                <td>{dec.progName}</td>
                <td style={{ color: '#475569', fontSize: '13px' }}>{dec.order}</td>
                <td style={{ color: '#005cca', fontWeight: 500, cursor: 'pointer' }}>{dec.file}</td>
                <td style={{ color: '#64748b', fontSize: '12.5px' }}>{dec.path}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Footer */}
        <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', fontSize: '13px', color: '#64748b' }}>
          <div>
            Rows per page: 10 <span style={{ fontSize: '10px' }}>▼</span>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{ cursor: 'pointer' }}>&lt;</span>
            <span style={{ fontWeight: 600, color: '#005cca' }}>1</span>
            <span style={{ cursor: 'pointer' }}>2</span>
            <span style={{ cursor: 'pointer' }}>3</span>
            <span style={{ cursor: 'pointer' }}>4</span>
            <span style={{ cursor: 'pointer' }}>5</span>
            <span>...</span>
            <span style={{ cursor: 'pointer' }}>158</span>
            <span style={{ cursor: 'pointer' }}>&gt;</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCdbListsTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', margin: 0 }}>CDB Lists (7)</h2>
          <span style={{ fontSize: '13.5px', color: '#64748b' }}>From here you can manage your lists.</span>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <button onClick={() => toast.success('Adding new lists file')} style={{ background: 'none', border: 'none', color: '#005cca', fontSize: '13.5px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <FiPlus size={16} /> Add new lists file
          </button>
          <button onClick={() => toast.success('Importing files')} style={{ background: 'none', border: 'none', color: '#005cca', fontSize: '13.5px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <FiUpload size={14} /> Import files
          </button>
          <button onClick={() => toast.success('CDB lists refreshed')} style={{ background: 'none', border: 'none', color: '#005cca', fontSize: '13.5px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <FiRefreshCw size={14} /> Refresh
          </button>
          <button onClick={() => toast.success('CDB lists exported')} style={{ background: 'none', border: 'none', color: '#005cca', fontSize: '13.5px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <FiDownload size={14} /> Export formatted
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 36px',
              borderRadius: '4px',
              border: '1px solid #cbd5e1',
              fontSize: '13.5px'
            }}
          />
        </div>
        <button style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '0 16px', fontSize: '13px', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
          WQL
        </button>
        <button style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '0 16px', fontSize: '13px', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
          Custom lists
        </button>
      </div>

      <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
        <table className="wz-table">
          <thead>
            <tr>
              <th>Name ↑</th>
              <th>Path</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cdbLists.map(list => (
              <tr key={list.name}>
                <td style={{ fontWeight: 500, color: '#334155' }}>{list.name}</td>
                <td style={{ color: '#64748b' }}>{list.path}</td>
                <td>
                  <div style={{ display: 'flex', gap: '12px', color: '#005cca' }}>
                    <FiEdit2 onClick={() => toast.success('Editing list')} size={14} style={{ cursor: 'pointer' }} title="Edit List" />
                    <FiTrash2 onClick={() => toast.success('List deleted')} size={15} style={{ cursor: 'pointer', color: '#ef4444' }} title="Delete List" />
                    <FiDownload onClick={() => toast.success('List exported')} size={14} style={{ cursor: 'pointer' }} title="Export List" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Footer */}
        <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', fontSize: '13px', color: '#64748b' }}>
          <div>
            Rows per page: 10 <span style={{ fontSize: '10px' }}>▼</span>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{ cursor: 'pointer' }}>&lt;</span>
            <span style={{ fontWeight: 600, color: '#005cca' }}>1</span>
            <span style={{ cursor: 'pointer' }}>&gt;</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTestTab = () => {
    const isInputEmpty = !logInput.trim();

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', margin: 0 }}>Ruleset Test</h2>
        </div>

        {/* Input box */}
        <div style={{ padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <textarea
            value={logInput}
            onChange={e => setLogInput(e.target.value)}
            placeholder="Type one log per line..."
            style={{
              width: '100%',
              height: '100px',
              padding: '12px',
              fontFamily: 'monospace',
              fontSize: '13px',
              border: '1px solid #cbd5e1',
              borderRadius: '4px',
              background: '#ffffff',
              color: '#334155',
              resize: 'vertical',
              outline: 'none'
            }}
          />

          {/* Action buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button 
              disabled={isInputEmpty}
              onClick={handleRunTest}
              style={{
                background: isInputEmpty ? '#e2e8f0' : '#005cca',
                color: isInputEmpty ? '#94a3b8' : '#ffffff',
                border: 'none',
                borderRadius: '4px',
                padding: '8px 16px',
                fontSize: '13.5px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: isInputEmpty ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <FiPlay size={13} /> Test
            </button>

            <button 
              disabled={isInputEmpty}
              onClick={() => {
                toast.success('Session cleared');
                setLogInput('');
                setTestResult(null);
              }}
              style={{
                background: isInputEmpty ? '#e2e8f0' : '#ffffff',
                color: isInputEmpty ? '#94a3b8' : '#475569',
                border: '1px solid #cbd5e1',
                borderRadius: '4px',
                padding: '8px 16px',
                fontSize: '13.5px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: isInputEmpty ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {/* Broom sweeper icon */}
              <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="14" width="14" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 3L6 15M3 21l3-3M3 17l4 4M8 12l4 4M13 7l4 4" />
              </svg>
              Clear session
            </button>
          </div>
        </div>

        {/* Results viewport */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '24px', minHeight: '300px', display: 'flex', flexDirection: 'column' }}>
          {!testResult ? (
            <div style={{ fontFamily: 'monospace', fontSize: '13px', color: '#64748b' }}>
              The test result will appear here.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', width: '100%' }}>
              {/* Left Column: Predecoding & Decoding */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', marginTop: 0, marginBottom: '12px' }}>Phase 1: Pre-decoding</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                    <div><span style={{ color: '#64748b' }}>Hostname:</span> <strong>{testResult.predecoding.hostname}</strong></div>
                    <div><span style={{ color: '#64748b' }}>Program name:</span> <strong>{testResult.predecoding.program_name}</strong></div>
                    <div><span style={{ color: '#64748b' }}>Log:</span> <code style={{ background: '#f1f5f9', padding: '2px 4px', borderRadius: '3px', fontFamily: 'monospace' }}>{testResult.predecoding.log}</code></div>
                  </div>
                </div>

                <div style={{ padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', marginTop: 0, marginBottom: '12px' }}>Phase 2: Decoding</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                    <div><span style={{ color: '#64748b' }}>Decoder:</span> <strong>{testResult.decoding.decoder}</strong></div>
                    <div><span style={{ color: '#64748b' }}>Source IP:</span> <strong>{testResult.decoding.srcip}</strong></div>
                    <div><span style={{ color: '#64748b' }}>Source Port:</span> <strong>{testResult.decoding.srcport}</strong></div>
                    <div><span style={{ color: '#64748b' }}>User:</span> <strong>{testResult.decoding.dstuser}</strong></div>
                  </div>
                </div>
              </div>

              {/* Right Column: Rules Matching */}
              <div style={{ padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', marginTop: 0, marginBottom: '12px' }}>Phase 3: Rules Matching</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                  <div><span style={{ color: '#64748b' }}>Rule ID:</span> <strong>{testResult.matching.id}</strong></div>
                  <div><span style={{ color: '#64748b' }}>Level:</span> <strong style={{ color: '#eab308' }}>{testResult.matching.level}</strong></div>
                  <div><span style={{ color: '#64748b' }}>Description:</span> <strong>{testResult.matching.description}</strong></div>
                  <div><span style={{ color: '#64748b' }}>Groups:</span> <span style={{ color: '#64748b' }}>{testResult.matching.groups.join(', ')}</span></div>
                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '8px', marginTop: '4px' }}>
                    <strong>Compliance references:</strong>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                      {testResult.matching.pci_dss.map((p: string) => (
                        <span key={p} style={{ background: '#eff6ff', color: '#1e40af', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>PCI DSS {p}</span>
                      ))}
                      {testResult.matching.gdpr.map((g: string) => (
                        <span key={g} style={{ background: '#f0fdf4', color: '#166534', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>GDPR {g}</span>
                      ))}
                      {testResult.matching.nist.map((n: string) => (
                        <span key={n} style={{ background: '#faf5ff', color: '#6b21a8', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>NIST {n}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="wz-page" style={{ background: '#f8fafc' }}>
      <div className="wz-page-content" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Tabs navigation row */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', gap: '24px', margin: '0 0 10px 0' }}>
          <button 
            onClick={() => navigate('/rules?tab=rules')}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'rules' ? '2px solid #005cca' : '2px solid transparent',
              paddingBottom: '8px',
              fontSize: '14.5px',
              fontWeight: activeTab === 'rules' ? 600 : 500,
              color: activeTab === 'rules' ? '#005cca' : '#64748b',
              cursor: 'pointer'
            }}
          >
            Rules
          </button>
          <button 
            onClick={() => navigate('/rules?tab=decoders')}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'decoders' ? '2px solid #005cca' : '2px solid transparent',
              paddingBottom: '8px',
              fontSize: '14.5px',
              fontWeight: activeTab === 'decoders' ? 600 : 500,
              color: activeTab === 'decoders' ? '#005cca' : '#64748b',
              cursor: 'pointer'
            }}
          >
            Decoders
          </button>
          <button 
            onClick={() => navigate('/rules?tab=cdblists')}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'cdblists' ? '2px solid #005cca' : '2px solid transparent',
              paddingBottom: '8px',
              fontSize: '14.5px',
              fontWeight: activeTab === 'cdblists' ? 600 : 500,
              color: activeTab === 'cdblists' ? '#005cca' : '#64748b',
              cursor: 'pointer'
            }}
          >
            CDB Lists
          </button>
          <button 
            onClick={() => navigate('/rules?tab=test')}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'test' ? '2px solid #005cca' : '2px solid transparent',
              paddingBottom: '8px',
              fontSize: '14.5px',
              fontWeight: activeTab === 'test' ? 600 : 500,
              color: activeTab === 'test' ? '#005cca' : '#64748b',
              cursor: 'pointer'
            }}
          >
            Ruleset Test
          </button>
        </div>

        {/* Tab content rendering */}
        {activeTab === 'rules' && renderRulesTab()}
        {activeTab === 'decoders' && renderDecodersTab()}
        {activeTab === 'cdblists' && renderCdbListsTab()}
        {activeTab === 'test' && renderTestTab()}

      </div>
    </div>
  );
};

export default Rules;
