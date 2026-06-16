import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { 
  FiSearch, FiPlus, FiRefreshCw, FiDownload, FiFolder, FiTrash2,
  FiEye, FiEdit2, FiInfo, FiChevronLeft, FiFolderPlus, FiFileText,
  FiChevronRight, FiChevronLeft as FiChevronLeftIcon
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const Groups: React.FC = () => {
  const navigate = useNavigate();
  const { groupId, action } = useParams<{ groupId?: string; action?: string }>();
  const location = useLocation();
  
  // Tabs for detail view
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get('tab') || 'agents'; // 'agents' or 'files'

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Mock group data
  const groupsList = [
    { name: 'default', agents: 1, checksum: '670e09e0304c20627539e09bd26357a0' },
    { name: 'linux-servers', agents: 5, checksum: 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6' },
    { name: 'windows-workstations', agents: 12, checksum: 'f1e2d3c4b5a69788796a5b4c3d2e1f0' },
    { name: 'web-servers', agents: 3, checksum: '0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d' },
  ];

  // Manage agents state
  const [availableAgents] = useState([
    { id: '002', name: 'web-server-2', os: 'Ubuntu 22.04', ip: '10.0.0.6' },
    { id: '003', name: 'db-master', os: 'CentOS 8', ip: '10.0.0.10' },
    { id: '004', name: 'monitoring-host', os: 'Debian 11', ip: '10.0.0.20' },
    { id: '005', name: 'bastion-host', os: 'Ubuntu 24.04', ip: '10.0.0.1' },
    { id: '006', name: 'app-server-2', os: 'RHEL 9', ip: '10.0.0.15' },
  ]);
  const [groupAgents, setGroupAgents] = useState([
    { id: '001', name: 'Isgasaad', os: 'Windows 10', ip: '192.168.122.70' },
  ]);
  const [addedCount, setAddedCount] = useState(0);
  const [removedCount, setRemovedCount] = useState(0);
  const [selectedAvailable, setSelectedAvailable] = useState<string[]>([]);
  const [selectedGroupAgents, setSelectedGroupAgents] = useState<string[]>([]);
  const [availableFilter, setAvailableFilter] = useState('');
  const [groupFilter, setGroupFilter] = useState('');

  const filteredAvailable = availableAgents.filter(a => !availableFilter || a.name.toLowerCase().includes(availableFilter.toLowerCase()) || a.id.includes(availableFilter));
  const filteredGroup = groupAgents.filter(a => !groupFilter || a.name.toLowerCase().includes(groupFilter.toLowerCase()) || a.id.includes(groupFilter));

  // Mock group files
  const groupFiles = [
    { name: 'agent.conf', checksum: '670e09e0304c20627539e09bd26357a0', editable: true },
    { name: 'ar.conf', checksum: 'ed6aa40f37b0ebf910765b5a1633e294', editable: false },
    { name: 'cis_apache2224_rcl.txt', checksum: '8b74055e0b72ad5e06dc0468f4e992ef', editable: false },
    { name: 'cis_debian_linux_rcl.txt', checksum: '52bca6f514fede26c4edaf3112614447', editable: false },
    { name: 'cis_mysql5-6_community_rcl.txt', checksum: '23f48bac6361e28e3cfe9dae65d9cdb7', editable: false },
    { name: 'cis_mysql5-6_enterprise_rcl.txt', checksum: '732e1cc44433ecd8c13be1b6967eaabc', editable: false },
    { name: 'cis_rhel5_linux_rcl.txt', checksum: '80c48eb9dfc25a2bf19f1538d4dc11a', editable: false },
    { name: 'cis_rhel6_linux_rcl.txt', checksum: 'e823532eaa108671cbcb0bf4c687dd8b', editable: false },
    { name: 'cis_rhel7_linux_rcl.txt', checksum: '7331ea6f235ad8cee69441df3a0a94d1', editable: false },
    { name: 'cis_rhel_linux_rcl.txt', checksum: '287276a269d9d412229e06e6aae19aa3', editable: false }
  ];

  // ==========================================
  // VIEW 1: GROUPS LIST
  // ==========================================
  if (!groupId) {
    return (
      <div className="wz-page" style={{ background: '#f8fafc' }}>
        <div className="wz-page-content" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Top Actions Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', margin: 0 }}>Groups ({groupsList.length})</h2>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <button onClick={() => toast.success('Add new group')} style={{ background: 'none', border: 'none', color: '#005cca', fontSize: '13.5px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                <FiPlus size={16} /> Add new group
              </button>
              <button onClick={() => toast.success('Groups refreshed')} style={{ background: 'none', border: 'none', color: '#005cca', fontSize: '13.5px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                <FiRefreshCw size={14} /> Refresh
              </button>
              <button onClick={() => toast.success('Groups exported')} style={{ background: 'none', border: 'none', color: '#005cca', fontSize: '13.5px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                <FiDownload size={14} /> Export formatted
              </button>
            </div>
          </div>

          <p style={{ fontSize: '13.5px', color: '#64748b', margin: '-10px 0 10px 0' }}>
            From here you can list and check your groups, its agents and files.
          </p>

          {/* Search bar */}
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
                  fontSize: '13.5px',
                  background: '#ffffff'
                }}
              />
            </div>
            <button style={{
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '4px',
              padding: '0 16px',
              fontSize: '13px',
              fontWeight: 600,
              color: '#334155',
              cursor: 'pointer'
            }}>
              WQL
            </button>
          </div>

          {/* Table */}
          <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
            <table className="wz-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '12.5px', color: '#475569', fontWeight: 600 }}>Name ↑</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '12.5px', color: '#475569', fontWeight: 600 }}>Agents</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '12.5px', color: '#475569', fontWeight: 600 }}>Configuration checksum</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '12.5px', color: '#475569', fontWeight: 600 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {groupsList.filter(g => !searchQuery || g.name.toLowerCase().includes(searchQuery.toLowerCase())).map(group => (
                  <tr key={group.name} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: '#005cca', fontWeight: 500, cursor: 'pointer' }} onClick={() => navigate(`/groups/${group.name}`)}>
                      {group.name}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: '#334155' }}>
                      {group.agents}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: '#64748b', fontFamily: 'monospace' }}>
                      {group.checksum}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: '12px', color: '#64748b' }}>
                        <FiEye 
                          size={16} 
                          style={{ cursor: 'pointer', color: '#005cca' }} 
                          title="View group details"
                          onClick={() => navigate(`/groups/${group.name}`)}
                        />
                        <FiEdit2 
                          size={15} 
                          style={{ cursor: 'pointer' }} 
                          title="Edit group files"
                          onClick={() => navigate(`/groups/${group.name}?tab=files`)}
                        />
                        <FiTrash2 
                          size={16} 
                          style={{ cursor: 'not-allowed', color: '#cbd5e1' }} 
                          title="Delete group (disabled)"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Table Footer */}
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
      </div>
    );
  }

  // ==========================================
  // VIEW 3: MANAGE AGENTS IN GROUP
  // ==========================================
  if (action === 'manage') {
    return (
      <div className="wz-page" style={{ background: '#f8fafc' }}>
        <div className="wz-page-content" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Header Action Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button 
              onClick={() => navigate(`/groups/${groupId}`)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'none',
                border: 'none',
                fontSize: '18px',
                fontWeight: 600,
                color: '#1e293b',
                cursor: 'pointer',
                padding: 0
              }}
            >
              <FiChevronLeft size={20} /> Manage agents of group {groupId}
            </button>
            <button
              onClick={() => {
                toast.success(`Changes applied: ${addedCount} added, ${removedCount} removed`);
                setAddedCount(0);
                setRemovedCount(0);
              }}
              style={{
                background: addedCount > 0 || removedCount > 0 ? '#005cca' : '#cbd5e1',
                border: 'none',
                borderRadius: '4px',
                padding: '8px 16px',
                fontSize: '13px',
                fontWeight: 600,
                color: addedCount > 0 || removedCount > 0 ? '#ffffff' : '#94a3b8',
                cursor: addedCount > 0 || removedCount > 0 ? 'pointer' : 'not-allowed'
              }}
            >
              Apply changes
            </button>
          </div>

          {/* Manage Dual Panel Layout */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 60px 1fr', gap: '20px', marginTop: '12px' }}>
            
            {/* Left Box: Available Agents */}
            <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '14px', color: '#1e293b' }}>Available agents</strong>
                <FiRefreshCw size={14} style={{ color: '#005cca', cursor: 'pointer' }} />
              </div>
              <div style={{ position: 'relative' }}>
                <FiSearch style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  placeholder="Filter..."
                  value={availableFilter}
                  onChange={e => setAvailableFilter(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '6px 10px 6px 32px',
                    borderRadius: '4px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px'
                  }}
                />
              </div>
              <div style={{
                border: '1px solid #f1f5f9',
                borderRadius: '4px',
                height: '300px',
                background: '#fafafa',
                overflowY: 'auto',
                padding: '8px'
              }}>
                {filteredAvailable.length === 0 ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8', fontSize: '13px' }}>
                    No agents available
                  </div>
                ) : (
                  filteredAvailable.map(a => (
                    <div key={a.id}
                      onClick={() => setSelectedAvailable(prev => prev.includes(a.id) ? prev.filter(x => x !== a.id) : [...prev, a.id])}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '4px',
                        fontSize: '13px',
                        cursor: 'pointer',
                        background: selectedAvailable.includes(a.id) ? '#e6f0fa' : 'transparent',
                        color: '#334155',
                        marginBottom: '4px',
                        display: 'flex',
                        gap: '8px',
                        alignItems: 'center'
                      }}
                    >
                      <input type="checkbox" checked={selectedAvailable.includes(a.id)} readOnly style={{ accentColor: '#005cca' }} />
                      <span style={{ fontWeight: 600, color: '#005cca' }}>{a.id}</span>
                      <span>{a.name}</span>
                      <span style={{ color: '#94a3b8', fontSize: '12px' }}>{a.os}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Middle Controls */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '16px' }}>
              <button
                onClick={() => {
                  if (availableAgents.length > 0) {
                    const allIds = availableAgents.map(a => a.id);
                    const newGroup = [...groupAgents.filter(a => !allIds.includes(a.id)), ...availableAgents];
                    setGroupAgents(newGroup);
                    setAddedCount(prev => prev + availableAgents.filter(a => !groupAgents.find(g => g.id === a.id)).length);
                    toast.success('All agents added to group');
                  }
                }}
                style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '4px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#005cca' }} title="Add all items">
                ➔
              </button>
              <button
                onClick={() => {
                  const toAdd = availableAgents.filter(a => selectedAvailable.includes(a.id));
                  if (toAdd.length > 0) {
                    setGroupAgents(prev => [...prev, ...toAdd.filter(a => !prev.find(g => g.id === a.id))]);
                    setAddedCount(prev => prev + toAdd.length);
                    setSelectedAvailable([]);
                    toast.success(`${toAdd.length} agent(s) added`);
                  }
                }}
                style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '4px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: selectedAvailable.length > 0 ? '#005cca' : '#94a3b8' }} title="Add selected items">
                ➔
              </button>
              <button
                onClick={() => {
                  const toRemove = groupAgents.filter(a => selectedGroupAgents.includes(a.id));
                  if (toRemove.length > 0) {
                    setGroupAgents(prev => prev.filter(a => !selectedGroupAgents.includes(a.id)));
                    setRemovedCount(prev => prev + toRemove.length);
                    setSelectedGroupAgents([]);
                    toast.success(`${toRemove.length} agent(s) removed`);
                  }
                }}
                style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '4px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: selectedGroupAgents.length > 0 ? '#005cca' : '#94a3b8' }} title="Remove selected items">
                ➔
              </button>
              <button
                onClick={() => {
                  const removed = groupAgents.length;
                  if (removed > 0) {
                    setGroupAgents([]);
                    setRemovedCount(prev => prev + removed);
                    setSelectedGroupAgents([]);
                    toast.success('All agents removed from group');
                  }
                }}
                style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '4px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: groupAgents.length > 0 ? 'pointer' : 'not-allowed', color: groupAgents.length > 0 ? '#005cca' : '#cbd5e1' }} title="Remove all items">
                ➔
              </button>
            </div>

            {/* Right Box: Current Agents in the Group */}
            <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '14px', color: '#1e293b' }}>Current agents in the group ({groupAgents.length})</strong>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ background: addedCount > 0 ? '#10b981' : '#e2e8f0', color: addedCount > 0 ? '#ffffff' : '#94a3b8', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>Added: {addedCount}</span>
                  <span style={{ background: removedCount > 0 ? '#ef4444' : '#e2e8f0', color: removedCount > 0 ? '#ffffff' : '#94a3b8', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>Removed: {removedCount}</span>
                </div>
              </div>
              <div style={{ position: 'relative' }}>
                <FiSearch style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  placeholder="Filter..."
                  value={groupFilter}
                  onChange={e => setGroupFilter(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '6px 10px 6px 32px',
                    borderRadius: '4px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px'
                  }}
                />
              </div>
              <div style={{
                border: '1px solid #e2e8f0',
                borderRadius: '4px',
                height: '300px',
                background: '#ffffff',
                padding: '8px',
                overflowY: 'auto'
              }}>
                {filteredGroup.length === 0 ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8', fontSize: '13px' }}>
                    No agents in this group
                  </div>
                ) : (
                  filteredGroup.map(a => (
                    <div key={a.id}
                      onClick={() => setSelectedGroupAgents(prev => prev.includes(a.id) ? prev.filter(x => x !== a.id) : [...prev, a.id])}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '4px',
                        fontSize: '13px',
                        cursor: 'pointer',
                        background: selectedGroupAgents.includes(a.id) ? '#fef2f2' : '#f8fafc',
                        border: '1px solid #e2e8f0',
                        color: '#334155',
                        fontWeight: 500,
                        marginBottom: '4px',
                        display: 'flex',
                        gap: '8px',
                        alignItems: 'center'
                      }}
                    >
                      <input type="checkbox" checked={selectedGroupAgents.includes(a.id)} readOnly style={{ accentColor: '#005cca' }} />
                      <span style={{ fontWeight: 600, color: '#005cca' }}>{a.id}</span>
                      <span>{a.name}</span>
                      <span style={{ color: '#94a3b8', fontSize: '12px' }}>{a.os}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: GROUP DETAIL (AGENTS & FILES TABS)
  // ==========================================
  return (
    <div className="wz-page" style={{ background: '#f8fafc' }}>
      <div className="wz-page-content" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Title Action Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button 
            onClick={() => navigate('/groups')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'none',
              border: 'none',
              fontSize: '18px',
              fontWeight: 600,
              color: '#1e293b',
              cursor: 'pointer',
              padding: 0
            }}
          >
            <FiChevronLeft size={20} /> {groupId}
          </button>
          
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            {activeTab === 'agents' ? (
              <button 
                onClick={() => navigate(`/groups/${groupId}/manage`)}
                style={{ background: 'none', border: 'none', color: '#005cca', fontSize: '13.5px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
              >
                <FiFolderPlus size={16} /> Manage agents
              </button>
            ) : (
              <button onClick={() => toast.success('Editing group configuration')}
                style={{ background: 'none', border: 'none', color: '#005cca', fontSize: '13.5px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
              >
                <FiEdit2 size={15} /> Edit group configuration
              </button>
            )}
            <button onClick={() => toast.success('Exporting PDF...')} style={{ background: 'none', border: 'none', color: '#005cca', fontSize: '13.5px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
              <FiDownload size={14} /> Export PDF
            </button>
          </div>
        </div>

        {/* Tabs Row */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', gap: '24px', margin: '4px 0 10px 0' }}>
          <button 
            onClick={() => navigate(`/groups/${groupId}?tab=agents`)}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'agents' ? '2px solid #005cca' : '2px solid transparent',
              paddingBottom: '8px',
              fontSize: '14.5px',
              fontWeight: activeTab === 'agents' ? 600 : 500,
              color: activeTab === 'agents' ? '#005cca' : '#64748b',
              cursor: 'pointer'
            }}
          >
            Agents
          </button>
          <button 
            onClick={() => navigate(`/groups/${groupId}?tab=files`)}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'files' ? '2px solid #005cca' : '2px solid transparent',
              paddingBottom: '8px',
              fontSize: '14.5px',
              fontWeight: activeTab === 'files' ? 600 : 500,
              color: activeTab === 'files' ? '#005cca' : '#64748b',
              cursor: 'pointer'
            }}
          >
            Files
          </button>
        </div>

        {/* TAB 1: AGENTS LIST */}
        {activeTab === 'agents' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', margin: '0 0 4px 0' }}>Agents (1)</h3>
              <span style={{ fontSize: '13px', color: '#64748b' }}>From here you can list and manage your agents</span>
            </div>

            {/* Search filter */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  placeholder="Search"
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 36px',
                    borderRadius: '4px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13.5px'
                  }}
                />
              </div>
              <button style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '0 16px', fontSize: '13px', fontWeight: 600, color: '#334155' }}>
                WQL
              </button>
            </div>

            {/* Agents Table */}
            <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
              <table className="wz-table">
                <thead>
                  <tr>
                    <th>Id ↑</th>
                    <th>Name</th>
                    <th>IP address</th>
                    <th>Operating system</th>
                    <th>Version</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>001</td>
                    <td style={{ fontWeight: 600, color: '#475569' }}>Isgasaad</td>
                    <td>192.168.122.70</td>
                    <td>🐧 Ubuntu 20.04 LTS</td>
                    <td>v4.14.5</td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#10b981', fontWeight: 600 }}>
                        ● active <FiInfo size={12} style={{ color: '#005cca', cursor: 'pointer' }} />
                      </span>
                    </td>
                    <td>
                      <FiEye 
                        size={16} 
                        style={{ cursor: 'pointer', color: '#005cca' }} 
                        onClick={() => navigate('/agents/detail')}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Footer */}
              <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', fontSize: '13px', color: '#64748b' }}>
                <div>
                  Rows per page: 15 <span style={{ fontSize: '10px' }}>▼</span>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <span style={{ cursor: 'pointer' }}>&lt;</span>
                  <span style={{ fontWeight: 600, color: '#005cca' }}>1</span>
                  <span style={{ cursor: 'pointer' }}>&gt;</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FILES LIST */}
        {activeTab === 'files' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', margin: '0 0 4px 0' }}>Files (24)</h3>
              <span style={{ fontSize: '13px', color: '#64748b' }}>From here you can list and see your group files, also, you can edit the group configuration</span>
            </div>

            {/* Search filter */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  placeholder="Search"
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 36px',
                    borderRadius: '4px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13.5px'
                  }}
                />
              </div>
              <button style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '0 16px', fontSize: '13px', fontWeight: 600, color: '#334155' }}>
                WQL
              </button>
            </div>

            {/* Files Table */}
            <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
              <table className="wz-table">
                <thead>
                  <tr>
                    <th>File ↑</th>
                    <th>Checksum</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {groupFiles.map(file => (
                    <tr key={file.name}>
                      <td style={{ fontWeight: 500, color: '#475569' }}>{file.name}</td>
                      <td style={{ fontFamily: 'monospace', fontSize: '12.5px', color: '#64748b' }}>{file.checksum}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '12px', color: '#64748b' }}>
                          <FiEye size={15} style={{ cursor: 'pointer', color: '#005cca' }} title="View File" onClick={() => toast.success(`Viewing file: ${file.name}`)} />
                          {file.editable && (
                            <FiEdit2 size={14} style={{ cursor: 'pointer', color: '#005cca' }} title="Edit File" onClick={() => toast.success(`Editing file: ${file.name}`)} />
                          )}
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
        )}

      </div>
    </div>
  );
};

export default Groups;
