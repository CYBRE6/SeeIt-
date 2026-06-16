import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiChevronDown, FiPlus, FiRefreshCw, FiDownload } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Filler } from 'chart.js';
import { Doughnut, Line, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Filler);

const MitreAttack: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'intelligence' | 'framework' | 'events'>('dashboard');
  const [intelTab, setIntelTab] = useState<'groups' | 'mitigations' | 'software' | 'tactics' | 'techniques'>('groups');
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [selectedTechnique, setSelectedTechnique] = useState<any>(null);
  const [selectedTactic, setSelectedTactic] = useState<string | null>('Impact');
  
  const [filters, setFilters] = useState([
    { key: 'cluster.name', value: 'wazuh' },
    { key: 'rule.mitre.id', value: 'exists' }
  ]);

  const removeFilter = (idx: number) => {
    setFilters(filters.filter((_, i) => i !== idx));
  };

  // Mock Groups
  const mockGroups = [
    {
      id: 'G0018',
      name: 'admin@338',
      created: 'May 31, 2017 @\n21:31:53.579',
      modified: 'Mar 18, 2020 @\n20:54:59.120',
      version: '1.2',
      desc: 'admin@338 is a China-based cyber threat group. It has previously used newsworthy events as lures to deliver malware and has primarily targeted organizations involved in financial, economic, and trade policy, typically using publicly available RATs such as PoisonIvy, as well as some non-public backdoors. (Citation: FireEye admin@338)',
      software: [
        { id: 'S0104', name: 'netstat', desc: 'netstat is an operating system utility that displays active TCP connections, listening ports, and network statistics. (Citation: TechNet Netstat)' },
        { id: 'S0100', name: 'ipconfig', desc: 'ipconfig is a Windows utility that can be used to find information about a system\'s TCP/IP, DNS, DHCP, and adapter configuration. (Citation: TechNet Ipconfig)' },
        { id: 'S0096', name: 'Systeminfo', desc: 'Systeminfo is a Windows utility that can be used to gather detailed information about a computer. (Citation: TechNet Systeminfo)' },
        { id: 'S0012', name: 'PoisonIvy', desc: 'PoisonIvy is a popular remote access tool (RAT) that has been used by many groups. (Citation: FireEye Poison Ivy)(Citation: Symantec Elderwood Sept 2012)(Citation: Symantec Darkmoon Aug 2005)' },
        { id: 'S0039', name: 'Net', desc: 'The Net utility is a component of the Windows operating system. It is used in command-line operations for control of users, groups, services, and network connections. (Citation: Microsoft Net Utility)\n\nNet has a great deal of functionality, (Citation: Savill 1999) much of which is useful for an adversary, such as gathering system and network information for Discovery, moving laterally through SMB/Windows Admin Shares using net use commands, and interacting with services. The net1.exe utility is executed for certain functionality when net.exe is run and can be used directly in commands such as net1 user.' }
      ],
      techniques: [
        { id: 'T1059.003', name: 'Windows Command Shell', desc: 'Adversaries may abuse the Windows command shell for execution. The Windows command shell (cmd) is the primary command prompt on Windows systems. The Windows command prompt can be used to control almost any aspect of a system, with various permission levels required for different subsets of commands. The command prompt can be invoked remotely via Remote Services such as SSH. (Citation: SSH in Windows)\n\nBatch files (ex: .bat or .cmd) also provide the shell with a list of sequential commands to run, as well as normal scripting operations such as conditionals and loops. Common uses of batch files include long or repetitive tasks, or the need to run the same set of commands on multiple systems.\n\nAdversaries may leverage cmd to execute various commands and payloads. Common uses include cmd to execute a single command, or abusing cmd interactively with input and output...' },
        { id: 'T1007', name: 'System Service Discovery', desc: 'Adversaries may try to gather information about registered local system services. Adversaries may obtain information about services using tools as well as OS utility commands such as sc query, tasklist /svc, systemctl --type=service, and net start.\n\nAdversaries may use the information from System Service Discovery during automated discovery to shape follow-on behaviors, including whether or not the adversary fully infects the target and/or attempts specific actions.' },
        { id: 'T1049', name: 'System Network Connections Discovery', desc: 'Adversaries may attempt to get a listing of network connections to or from the compromised system they are currently accessing or from remote systems by querying for information over the network.\n\nAn adversary who gains access to a system that is part of a cloud-based environment may map out Virtual Private Clouds or Virtual Networks in order to determine what systems and services are connected. The actions performed are likely the same types of discovery techniques depending on the operating system, but the resulting information may include details about the networked cloud environment relevant to the adversary\'s goals. Cloud providers may have different ways in which their virtual networks operate. (Citation: Amazon AWS VPC Guide)(Citation: Microsoft Azure Virtual Network Overview)(Citation: Google VPC Overview) Similarly, adversaries who gain access to network devices may also perform similar discovery activities to gather information about connected systems and services.\n\nUtilities and commands that acquire this information include netstat, "net use," and "net session" with Net. In Mac and Linux, netstat and lsof can be used to list current connections. who -a and w can be used to show which users are currently logged in, similar to "net session". Additionally, built-in features native to network devices and Network Device CLI may be used (e.g. show ip sockets, show tcp brief). (Citation: US-CERT-TA18-106A)' },
        { id: 'T1016', name: 'System Network Configuration Discovery', desc: 'Adversaries may look for details about the network configuration and settings, such as IP and/or MAC addresses, of systems they access or through information discovery of remote systems. Several operating system administration utilities exist that can be used to gather this information. Examples include Arp, ipconfig/ifconfig, nbtstat, and route.\n\nAdversaries may also leverage a Network Device CLI on network devices to gather information about configurations and settings, such as IP addresses of configured interfaces and static/dynamic routes (e.g. show ip route, show ip interface). (Citation: US-CERT-TA18-106A)(Citation: Mandiant APT41 Global Intrusion )\n\nAdversaries may use the information from System Network Configuration Discovery during automated discovery to shape follow-on behaviors, including determining certain access within the target network and what actions to do next.' },
        { id: 'T1082', name: 'System Information Discovery', desc: 'An adversary may attempt to get detailed information about the operating system and hardware, including version, patches, hotfixes, service packs, and architecture. Adversaries may use the information from System Information Discovery during automated discovery to shape follow-on behaviors, including whether or not the adversary fully infects the target and/or attempts specific actions.\n\nTools such as Systeminfo can be used to gather detailed system information. If running with privileged access, a breakdown of system data can be gathered through the systemsetup configuration tool on macOS. As an example, adversaries with user-level access can execute the df -aH command to obtain currently mounted disks and associated freely available space. Adversaries may also leverage a Network Device CLI on network devices to gather detailed system information (e.g. show version). (Citation: US-CERT-TA18-106A) System Information Discovery combined with information gathered from other forms of discovery and reconnaissance can drive payload development and concealment. (Citation: OSX.FairyTale)(Citation: 20 macOS Common Tools and Techniques)\n\nInfrastructure as a Service (IaaS) cloud providers such as AWS, GCP, and Azure allow access to instance and virtual machine information via APIs. Successful authenticated API calls can return data such as the operating system platform and status of a particular instance or the model view of a virtual machine. (Citation: Amazon Describe Instance)(Citation: Google Instances Resource)(Citation: Microsoft Virutal Machine API)' }
      ]
    },
    {
      id: 'G0130',
      name: 'Ajax Security Team',
      created: 'Apr 14, 2021 @\n13:17:43.941',
      modified: 'Dec 17, 2021 @\n20:27:27.246',
      version: '1.0',
      desc: 'Ajax Security Team is a group that has been active since at least 2010 and believed to be operating out of Iran. By 2014 Ajax Security Team transitioned from website defacement operations to malware-based cyber espionage campaigns targeting the US defense industrial base and Iranian users of anti-censorship technologies. (Citation: FireEye Operation Saffron Rose 2013)',
      software: [
        { id: 'S0225', name: 'sqlmap', desc: 'sqlmap is an open source penetration testing tool that can be used to automate the process of detecting and exploiting SQL injection flaws. (Citation: sqlmap Introduction)' },
        { id: 'S0224', name: 'Havij', desc: 'Havij is an automatic SQL Injection tool distributed by the Iranian ITSecTeam security company. Havij has been used by penetration testers and adversaries. (Citation: Check Point Havij Analysis)' }
      ],
      techniques: [
        { id: 'T1566.003', name: 'Spearphishing via Service', desc: 'Adversaries may send spearphishing messages via third-party services in an attempt to gain access to victim systems. Spearphishing via service is a specific variant of spearphishing. It is different from other forms of spearphishing in that it employs the use of third party services rather than directly via enterprise email channels.\n\nAll forms of spearphishing are electronically delivered social engineering targeted at a specific individual, company, or industry. In this scenario, adversaries send messages through various social media services, personal webmail, and other non-enterprise controlled services. These services are more likely to have a less-strict security policy than an enterprise. As with most kinds of spearphishing, the goal is to generate rapport with the target or get the target\'s interest in some way. Adversaries will create fake social media accounts and message employees for potential job opportunities. Doing so allows a plausible reason for asking about services, policies, and software that\'s running in an environment. The adversary can then send malicious links or attachments through these services.\n\nA common example is to build rapport with a target via social media, then send content to a personal webmail service that the target uses on their work computer. This allows an adversary to bypass some email restrictions on the work account, and the target is more likely to open the file since it\'s something they were expecting. If the payload doesn\'t work as expected, the adversary can continue normal communications and troubleshoot with the target on how to get it working.' }
      ]
    },
    {
      id: 'G0138',
      name: 'Andariel',
      created: 'May 31, 2017 @\n21:31:53.579',
      modified: 'Mar 18, 2020 @\n20:54:59.120',
      version: '1.1',
      desc: 'Andariel is a North Korean state-sponsored threat group that has been active since at least 2009. Andariel has primarily focused its operations-which have included destructive attacks-against South Korean government agencies, military organizations, and a variety of domestic companies; they have also conducted cyber financial operations against ATMs, banks, and cryptocurrency exchanges. Andariel\'s notable activity includes Operation Black Mine, Operation GoldenAxe, and Campaign Rifle. (Citation: FSI Andariel Campaign Rifle July 2017)(Citation: IssueMakersLab Andariel GoldenAxe May 2017)(Citation: AhnLab Andariel Subgroup of Lazarus June 2018)(Citation: TrendMicro New Andariel Tactics July 2018)',
      software: [],
      techniques: []
    }
  ];

  const highlightName = (name: string, desc: string) => {
    if (!name || !desc) return desc;
    const idx = desc.toLowerCase().indexOf(name.toLowerCase());
    if (idx === -1) return desc;
    return (
      <>
        {desc.substring(0, idx)}
        <span style={{ color: '#005cca', cursor: 'pointer' }}>{desc.substring(idx, idx + name.length)}</span>
        {desc.substring(idx + name.length)}
      </>
    );
  };

  // Mock Framework Techniques with tactic and description
  const mockTechniques = [
    { id: 'T1565.001', name: 'Stored Data Manipulation', count: 2, tactic: 'Impact', desc: 'Adversaries may insert, delete, or manipulate data in order to influence external outcomes or compromise system integrity.' },
    { id: 'T1557', name: 'Adversary-in-the-Middle', count: 0, tactic: 'Credential Access', desc: 'Adversaries may position themselves between two or more networked devices to follow communications.' },
    { id: 'T1556.003', name: 'Pluggable Authentication...', count: 0, tactic: 'Credential Access', desc: 'Adversaries may modify pluggable authentication modules to access user credentials.' },
    { id: 'T1056.001', name: 'Keylogging', count: 0, tactic: 'Credential Access', desc: 'Adversaries may log user keystrokes to capture credentials.' },
    { id: 'T1110.001', name: 'Password Guessing', count: 0, tactic: 'Credential Access', desc: 'Adversaries may guess user passwords without prior knowledge.' },
    { id: 'T1003', name: 'OS Credential Dumping', count: 0, tactic: 'Credential Access', desc: 'Adversaries may dump credentials from operating systems.' },
    { id: 'T1171', name: 'LLMNR/NBT-NS Poisoning a...', count: 0, tactic: 'Credential Access', desc: 'Adversaries may poison LLMNR/NBT-NS to capture hashed credentials.' },
    { id: 'T1539', name: 'Steal Web Session Cookie', count: 0, tactic: 'Credential Access', desc: 'Adversaries may steal web session cookies to impersonate users.' },
    { id: 'T1003.002', name: 'Security Account Mana...', count: 0, tactic: 'Credential Access', desc: 'Adversaries may dump credentials from SAM registry hives.' },
    { id: 'T1552.005', name: 'Cloud Instance Metadat...', count: 0, tactic: 'Credential Access', desc: 'Adversaries may query cloud instance metadata for credentials.' },
    { id: 'T1555.002', name: 'Securityd Memory', count: 0, tactic: 'Credential Access', desc: 'Adversaries may access securityd memory to steal credentials.' },
    { id: 'T1522', name: 'Cloud Instance Metadata API', count: 0, tactic: 'Credential Access', desc: 'Adversaries may access cloud instance metadata APIs.' },
    { id: 'T1110.002', name: 'Password Cracking', count: 0, tactic: 'Credential Access', desc: 'Adversaries may crack offline password hashes.' },
    { id: 'T1555.001', name: 'Keychain', count: 0, tactic: 'Credential Access', desc: 'Adversaries may access macOS keychain for credentials.' },
    { id: 'T1003.004', name: 'LSA Secrets', count: 0, tactic: 'Credential Access', desc: 'Adversaries may extract LSA secrets from Windows systems.' },
    { id: 'T1608.002', name: 'SAML Tokens', count: 0, tactic: 'Defense Evasion', desc: 'Adversaries may forge SAML tokens for authentication bypass.' },
    { id: 'T1167', name: 'Securityd Memory', count: 0, tactic: 'Credential Access', desc: 'Adversaries may read securityd process memory.' },
    { id: 'T1214', name: 'Credentials in Registry', count: 0, tactic: 'Credential Access', desc: 'Adversaries may search the registry for stored credentials.' },
    { id: 'T1003.007', name: 'Proc Filesystem', count: 0, tactic: 'Credential Access', desc: 'Adversaries may read process filesystem for credentials.' },
    { id: 'T1555.005', name: 'Password Managers', count: 0, tactic: 'Credential Access', desc: 'Adversaries may access password manager databases.' }
  ];

  const alertsEvolutionOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: 'right' as const, labels: { boxWidth: 10, font: { size: 10 }, usePointStyle: true } } },
    scales: { y: { min: 0, max: 1000, ticks: { stepSize: 200 }, title: { display: true, text: 'Count', font: { weight: 'bold' as const } } }, x: { grid: { display: false }, title: { display: true, text: 'timestamp per 30 minutes', font: { weight: 'bold' as const } } } },
    elements: { line: { tension: 0 }, point: { radius: 2 } }
  };

  const alertsEvolutionData = {
    labels: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'],
    datasets: [
      { label: 'Stored Data Manipulat', data: [0, 0, 0, 0, 0, 800, 200, 800], borderColor: '#4ade80', backgroundColor: '#4ade80', fill: false, borderWidth: 2 },
      { label: 'Valid Accounts', data: [0, 0, 0, 0, 100, 0, 0, 0], borderColor: '#3b82f6', backgroundColor: '#3b82f6', fill: false, borderWidth: 2 },
      { label: 'Sudo and Sudo Cachir', data: [0, 0, 0, 0, 0, 1000, 0, 0], borderColor: '#ec4899', backgroundColor: '#ec4899', fill: false, borderWidth: 2 },
      { label: 'Data Destruction', data: [0, 0, 0, 0, 600, 300, 0, 0], borderColor: '#a855f7', backgroundColor: '#a855f7', fill: false, borderWidth: 2 },
      { label: 'File Deletion', data: [0, 0, 0, 0, 0, 0, 0, 0], borderColor: '#d946ef', backgroundColor: '#d946ef', fill: false, borderWidth: 2 }
    ]
  };

  const donutOptions = { cutout: '65%', plugins: { legend: { position: 'right' as const, labels: { boxWidth: 10, font: { size: 10 }, usePointStyle: true } } }, maintainAspectRatio: false };

  const topTacticsData = {
    labels: ['Defense Evasion', 'Impact', 'Privilege Escalation', 'Persistence', 'Initial Access', 'Lateral Movement', 'Collection', 'Credential Access', 'Command and Contro', 'Discovery'],
    datasets: [{ data: [30, 25, 20, 15, 10, 8, 7, 5, 3, 2], backgroundColor: ['#eab308', '#d6d3d1', '#d97706', '#9ca3af', '#ef4444', '#5eead4', '#93c5fd', '#fbcfe8', '#c4b5fd', '#fce7f3'], borderWidth: 2 }]
  };

  const attacksByTechniqueOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: 'right' as const, labels: { boxWidth: 10, font: { size: 10 }, usePointStyle: true } } },
    scales: { x: { stacked: true, grid: { display: false }, title: { display: true, text: 'rule.mitre.tactic: Descending', font: { weight: 'bold' as const } } }, y: { stacked: true, max: 4000, title: { display: true, text: 'Count', font: { weight: 'bold' as const } } } }
  };

  const attacksByTechniqueData = {
    labels: ['Impact', 'Initial Access', 'Defense Evasion', 'Persistence', 'Privilege Escalation'],
    datasets: [
      { label: 'Stored Data Manipulat', data: [2500, 0, 0, 0, 0], backgroundColor: '#4ade80' },
      { label: 'Valid Accounts', data: [0, 1500, 1500, 1500, 0], backgroundColor: '#3b82f6' },
      { label: 'Sudo and Sudo Cachir', data: [700, 0, 1400, 0, 2900], backgroundColor: '#ec4899' },
      { label: 'Data Destruction', data: [600, 0, 0, 0, 0], backgroundColor: '#a855f7' },
      { label: 'File Deletion', data: [0, 0, 1200, 0, 0], backgroundColor: '#d946ef' }
    ]
  };

  const topTacticsByAgentOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: 'right' as const, labels: { boxWidth: 10, font: { size: 10 }, usePointStyle: true } } },
    scales: { x: { stacked: false, grid: { display: false }, title: { display: true, text: 'agent.name: Descending', font: { weight: 'bold' as const } } }, y: { stacked: false, max: 4000, title: { display: true, text: 'Count', font: { weight: 'bold' as const } } } }
  };

  const topTacticsByAgentData = {
    labels: ['saad-cyber...', 'Debian', 'ip-10-0-0-...', 'Amazon', 'RHEL7', 'Centos', 'Ubuntu', 'Windows'],
    datasets: [
      { label: 'Defense Evasion', data: [3500, 20, 10, 5, 0, 0, 0, 0], backgroundColor: '#eab308' },
      { label: 'Impact', data: [3100, 15, 5, 0, 0, 0, 0, 0], backgroundColor: '#d6d3d1' },
      { label: 'Privilege Escalation', data: [2900, 0, 5, 5, 0, 0, 0, 0], backgroundColor: '#d97706' },
      { label: 'Persistence', data: [1600, 0, 5, 5, 0, 0, 0, 0], backgroundColor: '#9ca3af' },
      { label: 'Initial Access', data: [1500, 0, 0, 0, 5, 0, 0, 0], backgroundColor: '#ef4444' }
    ]
  };

  const mitreTechniquesByAgentData = {
    labels: ['saad-cyber6', 'Centos', 'Debian', 'RHEL7', 'Ubuntu'],
    datasets: [
      { 
        data: [70, 10, 8, 7, 5], 
        backgroundColor: ['#4ade80', '#3b82f6', '#ec4899', '#a855f7', '#d946ef'],
        borderWidth: 2 
      },
      { 
        data: [40, 30, 15, 10, 5], 
        backgroundColor: ['#eab308', '#d6d3d1', '#d97706', '#9ca3af', '#ef4444'],
        borderWidth: 2 
      }
    ]
  };

  return (
    <div className="wz-page" style={{ background: '#f8fafc' }}>
      <div className="wz-page-content" style={{ display: 'flex', flexDirection: 'column' }}>
        
        {/* Navigation Tabs Bar */}
        <div style={{ 
          display: 'flex', 
          borderBottom: '1px solid #e2e8f0', 
          gap: '24px', 
          marginBottom: '24px',
          background: '#ffffff',
          padding: '0 24px',
          marginLeft: '-24px',
          marginRight: '-24px',
          marginTop: '-24px',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', gap: '24px' }}>
            {['dashboard', 'intelligence', 'framework', 'events'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                style={{
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === tab ? '2px solid #005cca' : '2px solid transparent',
                  color: activeTab === tab ? '#005cca' : '#475569',
                  fontWeight: activeTab === tab ? 600 : 500,
                  fontSize: '13.5px',
                  padding: '14px 4px',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  transition: 'all 0.15s ease'
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingRight: '24px' }}>
            <button onClick={() => navigate('/agents')} style={{ background: 'none', border: 'none', color: '#005cca', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"></path></svg>
              Explore agent
            </button>
            <button onClick={() => {
              const report = { id: Date.now().toString(), name: `MITRE ATT&CK Report ${new Date().toLocaleDateString()}`, desc: 'MITRE ATT&CK technique investigation report', format: 'PDF', created: new Date().toLocaleString(), status: 'completed' };
              const existing = JSON.parse(localStorage.getItem('wz_reports') || '[]');
              existing.push(report);
              localStorage.setItem('wz_reports', JSON.stringify(existing));
              toast.success('MITRE report generated and saved to Reporting');
            }} style={{ background: 'none', border: 'none', color: '#005cca', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
              <FiDownload size={14} /> Generate report
            </button>
          </div>
        </div>

        {/* Global DQL Filter Bar (Excluded on Intelligence Tab) */}
        {activeTab !== 'intelligence' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                  <FiSearch size={16} />
                </span>
                <input 
                  type="text" 
                  placeholder="Search" 
                  className="wz-search-input"
                  style={{ paddingLeft: '38px', paddingRight: '60px' }}
                />
                <span style={{ 
                  position: 'absolute', 
                  right: '12px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  fontSize: '12px', 
                  fontWeight: 600, 
                  color: '#64748b' 
                }}>
                  DQL
                </span>
              </div>

              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                border: '1px solid #cbd5e1', 
                borderRadius: '4px', 
                padding: '0 12px',
                background: '#ffffff',
                fontSize: '13px',
                color: '#1e293b',
                cursor: 'pointer'
              }}>
                <span style={{ color: '#64748b' }}>📅</span>
                <span>Last 24 hours</span>
                <FiChevronDown size={14} />
              </div>

              <button style={{ background: 'none', border: 'none', color: '#005cca', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                Show dates
              </button>

              <button className="wz-btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FiRefreshCw size={13} /> Refresh
              </button>
            </div>

            {/* Filter Pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
              {filters.map((f, idx) => (
                <div key={idx} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '4px', 
                  padding: '4px 8px', 
                  background: '#f1f5f9',
                  fontSize: '12.5px',
                  color: '#334155'
                }}>
                  <strong style={{ fontWeight: 600 }}>{f.key}:</strong>
                  <span>{f.value}</span>
                  <button 
                    onClick={() => removeFilter(idx)}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      color: '#94a3b8', 
                      cursor: 'pointer', 
                      fontSize: '11px',
                      padding: '2px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}

              <button style={{ 
                background: 'none', 
                border: 'none', 
                color: '#005cca', 
                fontSize: '12.5px', 
                fontWeight: 600, 
                display: 'flex', 
                alignItems: 'center', 
                gap: '4px', 
                cursor: 'pointer' 
              }}>
                <FiPlus size={14} /> Add filter
              </button>
            </div>
          </div>
        )}

        {/* ==========================================
            TAB CONTENT: DASHBOARD
            ========================================== */}
        {activeTab === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Top row: Alerts Evolution and Top Tactics */}
            <div style={{ display: 'grid', gridTemplateColumns: '7fr 3fr', gap: '20px' }}>
              
              {/* Alerts evolution over time */}
              <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '16px', display: 'flex', flexDirection: 'column' }}>
                <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', marginBottom: '16px', margin: 0 }}>Alerts evolution over time</h4>
                <div style={{ flex: 1, position: 'relative', minHeight: '300px' }}>
                  <Line data={alertsEvolutionData} options={alertsEvolutionOptions} />
                </div>
              </div>

              {/* Top tactics */}
              <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '16px', display: 'flex', flexDirection: 'column' }}>
                <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', marginBottom: '16px', margin: 0 }}>Top tactics</h4>
                <div style={{ flex: 1, position: 'relative', minHeight: '300px' }}>
                  <Doughnut data={topTacticsData} options={donutOptions} />
                </div>
              </div>
            </div>

            {/* Bottom row: Attacks by technique, Top tactics by agent, Mitre techniques by agent */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              
              {/* Attacks by technique */}
              <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '16px', display: 'flex', flexDirection: 'column' }}>
                <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', marginBottom: '16px', margin: 0 }}>Attacks by technique</h4>
                <div style={{ flex: 1, position: 'relative', minHeight: '260px' }}>
                  <Bar data={attacksByTechniqueData} options={attacksByTechniqueOptions} />
                </div>
              </div>

              {/* Top tactics by agent */}
              <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '16px', display: 'flex', flexDirection: 'column' }}>
                <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', marginBottom: '16px', margin: 0 }}>Top tactics by agent</h4>
                <div style={{ flex: 1, position: 'relative', minHeight: '260px' }}>
                  <Bar data={topTacticsByAgentData} options={topTacticsByAgentOptions} />
                </div>
              </div>

              {/* Mitre techniques by agent */}
              <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '16px', display: 'flex', flexDirection: 'column' }}>
                <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', marginBottom: '16px', margin: 0 }}>Mitre techniques by agent</h4>
                <div style={{ flex: 1, position: 'relative', minHeight: '260px' }}>
                  <Doughnut data={mitreTechniquesByAgentData} options={donutOptions} />
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ==========================================
            TAB CONTENT: INTELLIGENCE
            ========================================== */}
        {activeTab === 'intelligence' && (
          <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '24px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', minHeight: '450px' }}>
            
            {/* Sidebar list resources */}
            <div style={{ borderRight: '1px solid #e2e8f0', padding: '16px 0' }}>
              <div style={{ padding: '0 16px 12px 16px', borderBottom: '1px solid #f1f5f9' }}>
                <input 
                  type="text" 
                  placeholder="Search in all resources" 
                  className="wz-search-input"
                  style={{ fontSize: '12.5px', height: '32px' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', marginTop: '12px' }}>
                {['groups', 'mitigations', 'software', 'tactics', 'techniques'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setIntelTab(tab as any)}
                    style={{
                      background: intelTab === tab ? '#f1f5f9' : 'none',
                      border: 'none',
                      borderLeft: intelTab === tab ? '3px solid #005cca' : '3px solid transparent',
                      color: intelTab === tab ? '#0f172a' : '#475569',
                      fontWeight: intelTab === tab ? 600 : 500,
                      fontSize: '13px',
                      padding: '10px 16px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      textTransform: 'capitalize'
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* List panel */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>
                  {intelTab === 'groups' && 'Groups (150)'}
                  {intelTab === 'mitigations' && 'Mitigations (50)'}
                  {intelTab === 'software' && 'Software (200)'}
                  {intelTab === 'tactics' && 'Tactics (14)'}
                  {intelTab === 'techniques' && 'Techniques (600)'}
                </h3>
              </div>

              {/* Table search WQL */}
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  placeholder="Search" 
                  className="wz-search-input"
                  style={{ fontSize: '12.5px', height: '32px' }}
                />
                <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '11px', fontWeight: 700, color: '#94a3b8' }}>WQL</span>
              </div>

              <div className="wz-table-wrapper" style={{ border: 'none' }}>
                <table className="wz-table">
                  <thead>
                    <tr>
                      {intelTab === 'groups' && <><th style={{ width: '100px' }}>ID</th><th style={{ width: '120px' }}>Name ↑</th><th>Description</th></>}
                      {intelTab === 'mitigations' && <><th style={{ width: '100px' }}>ID</th><th style={{ width: '120px' }}>Name ↑</th><th>Description</th></>}
                      {intelTab === 'software' && <><th style={{ width: '100px' }}>ID</th><th style={{ width: '120px' }}>Name ↑</th><th>Platforms</th></>}
                      {intelTab === 'tactics' && <><th style={{ width: '120px' }}>ID</th><th>Name ↑</th><th>Description</th></>}
                      {intelTab === 'techniques' && <><th style={{ width: '100px' }}>ID</th><th style={{ width: '120px' }}>Name ↑</th><th>Tactic</th></>}
                    </tr>
                  </thead>
                  <tbody>
                    {intelTab === 'groups' && mockGroups.map((grp, idx) => (
                      <tr key={idx} style={{ cursor: 'pointer' }} onClick={() => setSelectedGroup(grp)}>
                        <td style={{ color: '#005cca', fontWeight: 600 }}>{grp.id}</td>
                        <td style={{ color: '#005cca', fontWeight: 600 }}>{grp.name}</td>
                        <td style={{ fontSize: '12.5px', color: '#334155', lineHeight: 1.6 }}>{grp.desc}</td>
                      </tr>
                    ))}
                    {intelTab === 'mitigations' && [
                      { id: 'M1040', name: 'Behavior Prevention', desc: 'Use behavioral-based detection to monitor and block suspicious activity.' },
                      { id: 'M1041', name: 'Antivirus/Antimalware', desc: 'Deploy antivirus software to detect and block malicious files.' },
                    ].map((m, idx) => (
                      <tr key={idx}>
                        <td style={{ color: '#005cca', fontWeight: 600 }}>{m.id}</td>
                        <td style={{ color: '#005cca', fontWeight: 600 }}>{m.name}</td>
                        <td style={{ fontSize: '12.5px', color: '#334155', lineHeight: 1.6 }}>{m.desc}</td>
                      </tr>
                    ))}
                    {intelTab === 'software' && [
                      { id: 'S0012', name: 'PoisonIvy', platforms: 'Windows' },
                      { id: 'S0039', name: 'Net', platforms: 'Windows' },
                      { id: 'S0104', name: 'netstat', platforms: 'Windows, Linux, macOS' },
                    ].map((s, idx) => (
                      <tr key={idx}>
                        <td style={{ color: '#005cca', fontWeight: 600 }}>{s.id}</td>
                        <td style={{ color: '#005cca', fontWeight: 600 }}>{s.name}</td>
                        <td style={{ fontSize: '12.5px', color: '#334155' }}>{s.platforms}</td>
                      </tr>
                    ))}
                    {intelTab === 'tactics' && [
                      { id: 'TA0001', name: 'Initial Access', desc: 'Adversaries try to get into your network.' },
                      { id: 'TA0002', name: 'Execution', desc: 'Adversaries run malicious code.' },
                      { id: 'TA0003', name: 'Persistence', desc: 'Adversaries maintain access.' },
                    ].map((t, idx) => (
                      <tr key={idx}>
                        <td style={{ color: '#005cca', fontWeight: 600 }}>{t.id}</td>
                        <td style={{ color: '#005cca', fontWeight: 600 }}>{t.name}</td>
                        <td style={{ fontSize: '12.5px', color: '#334155' }}>{t.desc}</td>
                      </tr>
                    ))}
                    {intelTab === 'techniques' && mockTechniques.slice(0, 10).map((t, idx) => (
                      <tr key={idx}>
                        <td style={{ color: '#005cca', fontWeight: 600 }}>{t.id}</td>
                        <td style={{ color: '#005cca', fontWeight: 600 }}>{t.name}</td>
                        <td style={{ fontSize: '12.5px', color: '#334155' }}>{t.tactic}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>

          </div>
        )}

        {/* ==========================================
            TAB CONTENT: FRAMEWORK
            ========================================== */}
        {activeTab === 'framework' && (
          <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '24px', minHeight: '450px' }}>
            
            {/* Tactics sidebar */}
            <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '16px 0' }}>
              <div style={{ padding: '0 16px 12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>Tactics</span>
                <span style={{ color: '#005cca', cursor: 'pointer' }}>⚙</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', marginTop: '12px' }}>
                {[
                  { name: 'Impact', bg: '#db2777' },
                  { name: 'Credential Access', bg: '#db2777' },
                  { name: 'Execution', bg: '#db2777' },
                  { name: 'Persistence', bg: '#db2777' },
                  { name: 'Privilege Escalation', bg: '#db2777' },
                  { name: 'Lateral Movement', bg: '#db2777' },
                  { name: 'Defense Evasion', bg: '#db2777' },
                  { name: 'Exfiltration', bg: '#db2777' },
                  { name: 'Discovery', bg: '#db2777' }
                ].map((t, idx) => {
                  const techCount = mockTechniques.filter(t2 => t2.tactic === t.name && t2.count > 0).length;
                  const totalTech = mockTechniques.filter(t2 => t2.tactic === t.name).length;
                  return (
                    <div key={idx} onClick={() => {
                      setSelectedTactic(selectedTactic === t.name ? null : t.name);
                      if (selectedTactic !== t.name) {
                        toast.success(`Drilling into ${t.name} techniques`);
                        setSelectedTechnique({ name: `${t.name} Techniques`, id: 'overview', description: `All techniques under ${t.name}`, tactics: [t.name] });
                      }
                    }} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      padding: '8px 16px', 
                      background: selectedTactic === t.name ? '#f1f5f9' : 'none',
                      borderLeft: selectedTactic === t.name ? '3px solid #005cca' : '3px solid transparent',
                      cursor: 'pointer'
                    }}>
                      <span style={{ fontSize: '13px', fontWeight: selectedTactic === t.name ? 600 : 500, color: '#334155' }}>{t.name}</span>
                      <span style={{ 
                        fontSize: '10.5px', 
                        fontWeight: 700, 
                        color: '#ffffff', 
                        background: t.bg, 
                        borderRadius: '4px', 
                        padding: '2px 6px' 
                      }}>
                        {techCount}/{totalTech}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Techniques panel */}
            <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '24px' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#0f172a' }}>Techniques — {selectedTactic}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#475569' }}>
                  <span>Hide techniques with no alerts</span>
                  <input type="checkbox" />
                </div>
              </div>

              <div style={{ position: 'relative', marginBottom: '20px' }}>
                <input 
                  type="text" 
                  placeholder="Filter techniques of selected tactic/s" 
                  className="wz-search-input"
                  style={{ fontSize: '12.5px', height: '32px' }}
                />
              </div>

              {/* Matrix-style technique grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {mockTechniques
                  .filter(t => t.tactic === selectedTactic)
                  .map((tech, idx) => (
                    <div 
                      key={idx}
                      onClick={() => {
                        setSelectedTechnique(selectedTechnique?.id === tech.id ? null : tech);
                        if (selectedTechnique?.id !== tech.id) {
                          toast.success(`Technique ${tech.id} selected`);
                        }
                      }}
                      style={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                        gap: '4px',
                        border: `1px solid ${tech.count > 0 ? '#005cca' : '#e2e8f0'}`,
                        borderRadius: '4px', 
                        padding: '10px 12px',
                        background: selectedTechnique?.id === tech.id ? '#f0f7ff' : tech.count > 0 ? '#fffbeb' : '#ffffff',
                        fontSize: '12px',
                        color: '#334155',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 600, color: tech.count > 0 ? '#005cca' : '#64748b' }}>{tech.id}</span>
                        <span style={{ 
                          fontSize: '10.5px', 
                          fontWeight: 700, 
                          background: tech.count > 0 ? '#005cca' : '#f1f5f9',
                          color: tech.count > 0 ? '#ffffff' : '#94a3b8',
                          borderRadius: '4px',
                          padding: '1px 6px'
                        }}>
                          {tech.count}
                        </span>
                      </div>
                      <span style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.3 }}>{tech.name}</span>
                    </div>
                  ))}
                {mockTechniques.filter(t => t.tactic === selectedTactic).length === 0 && (
                  <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '32px', color: '#94a3b8', fontSize: '13px' }}>
                    No techniques found for this tactic.
                  </div>
                )}
              </div>

              {/* Technique detail panel */}
              {selectedTechnique && selectedTechnique.tactic === selectedTactic && (
                <div style={{ marginTop: '20px', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '20px', background: '#f8fafc' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 600, color: '#1e293b' }}>
                        {selectedTechnique.id} — {selectedTechnique.name}
                      </h4>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>Tactic: {selectedTechnique.tactic}</span>
                    </div>
                    <button onClick={() => setSelectedTechnique(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '18px' }}>×</button>
                  </div>
                  <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6, margin: 0 }}>{selectedTechnique.desc}</p>

                  {/* Related Alerts */}
                  <div style={{ marginTop: '16px' }}>
                    <h5 style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b', margin: '0 0 8px 0' }}>Related Alerts (3)</h5>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {[
                        { id: 'alert-1', desc: 'SSH Brute Force - T1059.003', time: 'Jun 11 @ 13:23' },
                        { id: 'alert-2', desc: 'Malware signature - T1059.003', time: 'Jun 10 @ 10:15' },
                        { id: 'alert-3', desc: 'Suspicious cmd.exe - T1059.003', time: 'Jun 9 @ 22:00' },
                      ].map((a, i) => (
                        <div key={i} onClick={() => navigate('/events?search=' + encodeURIComponent(selectedTechnique.id))} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 10px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                          <span style={{ color: '#005cca', fontWeight: 600 }}>{a.desc}</span>
                          <span style={{ color: '#94a3b8' }}>{a.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Related Agents */}
                  <div style={{ marginTop: '12px' }}>
                    <h5 style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b', margin: '0 0 8px 0' }}>Related Agents (2)</h5>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {[
                        { id: '001', name: 'saad-laptop', os: 'Windows 10', ip: '192.168.1.42', status: 'active' },
                        { id: '042', name: 'web-server-1', os: 'Ubuntu 22.04', ip: '10.0.0.5', status: 'active' },
                      ].map((a, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 10px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '12px' }}>
                          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <span style={{ color: '#005cca', fontWeight: 600, cursor: 'pointer' }} onClick={() => navigate(`/agents/detail?agent=${a.id}`)}>{a.name}</span>
                            <span style={{ color: '#64748b' }}>{a.os}</span>
                            <span style={{ color: '#94a3b8' }}>{a.ip}</span>
                          </div>
                          <span style={{ color: '#22c55e', fontWeight: 600, fontSize: '11px' }}>{a.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Related Events */}
                  <div style={{ marginTop: '12px' }}>
                    <h5 style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b', margin: '0 0 8px 0' }}>Related Events (5)</h5>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {[
                        { id: 'evt-001', rule: '550', desc: 'Integrity checksum changed', level: 7 },
                        { id: 'evt-002', rule: '503', desc: 'Wazuh agent started', level: 3 },
                        { id: 'evt-003', rule: '802', desc: 'SSH authentication failure', level: 5 },
                        { id: 'evt-004', rule: '311', desc: 'File modified', level: 6 },
                        { id: 'evt-005', rule: '201', desc: 'Process created', level: 4 },
                      ].map((e, i) => (
                        <div key={i} onClick={() => navigate(`/events?search=${encodeURIComponent(e.desc)}`)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 10px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <span style={{ color: '#005cca', fontWeight: 600 }}>{e.rule}</span>
                            <span style={{ color: '#475569' }}>{e.desc}</span>
                          </div>
                          <span style={{ color: '#64748b' }}>Level {e.level}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                    <button onClick={() => toast.success(`Navigating to alerts for ${selectedTechnique.id}`)} style={{ padding: '6px 14px', fontSize: '12px', border: 'none', borderRadius: '4px', background: '#005cca', color: '#ffffff', cursor: 'pointer' }}>
                      View all related alerts
                    </button>
                    <button onClick={() => window.open(`https://attack.mitre.org/techniques/${selectedTechnique.id.replace('.', '/')}/`, '_blank')} style={{ padding: '6px 14px', fontSize: '12px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#ffffff', cursor: 'pointer', color: '#475569' }}>
                      View on MITRE ATT&CK
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>
        )}

        {/* ==========================================
            TAB CONTENT: EVENTS
            ========================================== */}
        {activeTab === 'events' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Events histogram bar */}
            <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px 24px' }}>
              <div style={{ height: '140px', borderLeft: '1px solid #cbd5e1', borderBottom: '1px solid #cbd5e1', position: 'relative', marginTop: '10px' }}>
                <span style={{ position: 'absolute', left: '-22px', top: '0', fontSize: '9px', color: '#94a3b8' }}>2</span>
                <span style={{ position: 'absolute', left: '-18px', top: '35px', fontSize: '9px', color: '#94a3b8' }}>1.5</span>
                <span style={{ position: 'absolute', left: '-12px', top: '70px', fontSize: '9px', color: '#94a3b8' }}>1</span>
                <span style={{ position: 'absolute', left: '-18px', top: '105px', fontSize: '9px', color: '#94a3b8' }}>0.5</span>
                
                <div style={{ 
                  position: 'absolute', 
                  bottom: 0, 
                  right: '24px', 
                  width: '18px', 
                  height: '115px', 
                  background: '#14b8a6',
                  borderRadius: '2px 2px 0 0'
                }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', position: 'absolute', bottom: '-20px', left: 0, right: 0, fontSize: '9px', color: '#94a3b8' }}>
                  <span>00:00</span>
                  <span>03:00</span>
                  <span>06:00</span>
                  <span>09:00</span>
                  <span>12:00</span>
                  <span>15:00</span>
                  <span>18:00</span>
                  <span>21:00</span>
                </div>
              </div>
            </div>

            {/* Hits Grid */}
            <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '24px' }}>
              
              <div style={{ textAlign: 'center', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
                <div style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b' }}>2 hits</div>
                <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '4px' }}>
                  Jun 11, 2026 @ 22:05:35.935 - Jun 12, 2026 @ 22:05:35.935
                </div>
              </div>

              {/* Toolbar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12.5px', color: '#64748b', marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <button onClick={() => toast.success('Data exported')} style={{ background: 'none', border: 'none', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                    📥 Export Formatted
                  </button>
                  <button style={{ background: 'none', border: 'none', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                    🔄 Reset view
                  </button>
                  <span><strong>496</strong> available fields</span>
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                  <button style={{ background: 'none', border: 'none', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                    Columns
                  </button>
                  <span>Density</span>
                  <span><strong>1</strong> fields sorted</span>
                  <button style={{ background: 'none', border: 'none', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                    Full screen
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="wz-table-wrapper" style={{ border: 'none' }}>
                <table className="wz-table">
                  <thead>
                    <tr>
                      <th style={{ width: '24px' }}></th>
                      <th>timestamp</th>
                      <th>agent.name</th>
                      <th>rule.mitre.id</th>
                      <th>rule.mitre.tactic</th>
                      <th>rule.description</th>
                      <th>rule.level</th>
                      <th>rule.id</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { time: 'Jun 12, 2026 @ 21:38:29.3...', agent: 'Isgasaad', mitreId: 'T1565.001', tactic: 'Impact', desc: 'Integrity checksum changed.', level: 7, id: 550 },
                      { time: 'Jun 12, 2026 @ 21:38:29.3...', agent: 'Isgasaad', mitreId: 'T1565.001', tactic: 'Impact', desc: 'Integrity checksum changed.', level: 7, id: 550 }
                    ].map((ev, idx) => (
                      <tr key={idx}>
                        <td style={{ textAlign: 'center', color: '#94a3b8' }}>▶</td>
                        <td style={{ fontSize: '12.5px' }}>{ev.time}</td>
                        <td><span style={{ color: '#005cca', fontWeight: 600, cursor: 'pointer' }} onClick={() => navigate(`/agents/detail?agent=${ev.agent}`)}>{ev.agent}</span></td>
                        <td style={{ color: '#005cca', fontWeight: 600 }}>{ev.mitreId}</td>
                        <td>{ev.tactic}</td>
                        <td style={{ color: '#1e293b' }}>{ev.desc}</td>
                        <td><strong>{ev.level}</strong></td>
                        <td style={{ color: '#005cca', fontWeight: 600 }}>{ev.id}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* Details Drawer for Intelligence Tab */}
      {selectedGroup && (
        <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '650px', background: '#ffffff', boxShadow: '-4px 0 24px rgba(0,0,0,0.1)', zIndex: 1000, display: 'flex', flexDirection: 'column' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #e2e8f0' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 400, color: '#1e293b', margin: 0 }}>Details</h2>
            <button onClick={() => setSelectedGroup(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1.5fr 1.5fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>ID</div>
                <div style={{ fontSize: '13px', color: '#475569' }}>{selectedGroup.id}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>Name</div>
                <div style={{ fontSize: '13px', color: '#475569' }}>{selectedGroup.name}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>Created Time</div>
                <div style={{ fontSize: '13px', color: '#475569', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>{selectedGroup.created || 'N/A'}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>Modified Time</div>
                <div style={{ fontSize: '13px', color: '#475569', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>{selectedGroup.modified || 'N/A'}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>Version</div>
                <div style={{ fontSize: '13px', color: '#475569' }}>{selectedGroup.version || '1.0'}</div>
              </div>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', marginBottom: '12px' }}>Description</div>
              <div style={{ fontSize: '13.5px', color: '#334155', lineHeight: 1.6 }}>
                {highlightName(selectedGroup.name, selectedGroup.desc)}
              </div>
            </div>

            {/* Software Table */}
            {selectedGroup.software && selectedGroup.software.length > 0 && (
              <div style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontSize: '14.5px', marginBottom: '16px', cursor: 'pointer' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  Software
                </div>
                <div className="wz-table-wrapper" style={{ border: 'none', borderTop: '1px solid #e2e8f0' }}>
                  <table className="wz-table">
                    <thead>
                      <tr>
                        <th style={{ width: '80px', fontSize: '11px', color: '#1e293b' }}>ID</th>
                        <th style={{ width: '120px', fontSize: '11px', color: '#1e293b' }}>Name ↓</th>
                        <th style={{ fontSize: '11px', color: '#1e293b' }}>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedGroup.software.map((sw: any, i: number) => (
                        <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ color: '#005cca', fontWeight: 600, fontSize: '12.5px', verticalAlign: 'top', paddingTop: '12px' }}>{sw.id}</td>
                          <td style={{ color: '#005cca', fontWeight: 600, fontSize: '12.5px', verticalAlign: 'top', paddingTop: '12px' }}>{sw.name}</td>
                          <td style={{ color: '#475569', fontSize: '13.5px', lineHeight: 1.6, paddingBottom: '16px', paddingTop: '12px', whiteSpace: 'pre-wrap' }}>
                            {highlightName(sw.name, sw.desc)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', fontSize: '12.5px', color: '#475569' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>Rows per page: 5 <FiChevronDown /></div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <span style={{ cursor: 'pointer', color: '#94a3b8' }}>&lt;</span>
                    <span style={{ color: '#005cca', fontWeight: 600 }}>1</span>
                    <span style={{ cursor: 'pointer', color: '#94a3b8' }}>&gt;</span>
                  </div>
                </div>
              </div>
            )}

            {/* Techniques Table */}
            {selectedGroup.techniques && selectedGroup.techniques.length > 0 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontSize: '14.5px', marginBottom: '16px', cursor: 'pointer' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  Techniques
                </div>
                <div className="wz-table-wrapper" style={{ border: 'none', borderTop: '1px solid #e2e8f0' }}>
                  <table className="wz-table">
                    <thead>
                      <tr>
                        <th style={{ width: '100px', fontSize: '11px', color: '#1e293b' }}>ID</th>
                        <th style={{ width: '160px', fontSize: '11px', color: '#1e293b' }}>Name ↓</th>
                        <th style={{ fontSize: '11px', color: '#1e293b' }}>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedGroup.techniques.map((t: any, i: number) => (
                        <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ color: '#005cca', fontWeight: 600, fontSize: '12.5px', verticalAlign: 'top', paddingTop: '12px' }}>{t.id}</td>
                          <td style={{ color: '#005cca', fontWeight: 600, fontSize: '12.5px', verticalAlign: 'top', paddingTop: '12px' }}>{t.name}</td>
                          <td style={{ color: '#475569', fontSize: '13.5px', lineHeight: 1.6, paddingBottom: '24px', paddingTop: '12px', whiteSpace: 'pre-wrap' }}>
                            {t.desc}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {selectedGroup.techniques.length > 5 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', fontSize: '12.5px', color: '#475569' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>Rows per page: 5 <FiChevronDown /></div>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <span style={{ cursor: 'pointer', color: '#94a3b8' }}>&lt;</span>
                      <span style={{ color: '#005cca', fontWeight: 600 }}>1</span>
                      <span style={{ cursor: 'pointer' }}>2</span>
                      <span style={{ cursor: 'pointer' }}>3</span>
                      <span style={{ cursor: 'pointer', color: '#475569' }}>&gt;</span>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
};

export default MitreAttack;
