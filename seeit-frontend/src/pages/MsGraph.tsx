import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FiSearch, FiChevronDown, FiPlus, FiRefreshCw, FiDownload, FiAlertTriangle, FiMinus, FiLayers, FiMapPin, FiSquare, FiX, FiExternalLink } from 'react-icons/fi';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler);

const allT = Array.from({length:43},(_,i)=>{const h=15+Math.floor(i/2);return `${String(h%24).padStart(2,'0')}:${i%2===0?'00':'30'}`;});

const actResultData = {labels:['success','timeout','unknownFutureValue','failure'],datasets:[{data:[55,20,15,10],backgroundColor:['#22c55e','#3b82f6','#ef4444','#a78bfa'],borderWidth:0}]};
const regionData = {labels:['London','New York','Vancouver','Andalucia','Paris','Other'],datasets:[{data:[30,25,18,12,10,5],backgroundColor:['#22c55e','#3b82f6','#f59e0b','#2dd4bf','#a78bfa','#ef4444'],borderWidth:0}]};
const donutOpts = {responsive:true,maintainAspectRatio:false,cutout:'60%',plugins:{legend:{display:true,position:'right' as const,labels:{boxWidth:10,font:{size:11}}}}};

const secAlerts = [
  {name:'ClientCertificate stored in certificate inventory',count:2},
  {name:'Anomalous Token involving one user',count:1},
  {name:'Anonymous IP address involving one user',count:1},
  {name:'Create application.',count:1},
  {name:'Create device configuration 2.0 (beta)',count:1},
];

const catColors = ['#ef4444','#f97316','#2dd4bf','#3b82f6'];
const catLabels = ['Enrollment','Application','Device','DeviceConfiguration'];
const catData = {labels:allT,datasets:catLabels.map((l,i)=>({label:l,data:Array.from({length:43},(_,j)=>j<6?[0.3+Math.random()*2.5,0.2+Math.random()*2,0.1+Math.random()*1.5,0.1+Math.random()][i]*[1,1.2,0.8,1.1,0.9,0.7][j]:0),borderColor:catColors[i],backgroundColor:catColors[i]+'44',fill:true,tension:0.3,pointRadius:0,borderWidth:1.5}))};
const catOpts = {responsive:true,maintainAspectRatio:false,plugins:{legend:{display:true,position:'left' as const,labels:{boxWidth:10,font:{size:10}}}},scales:{x:{grid:{color:'rgba(0,0,0,0.04)'},ticks:{font:{size:10},color:'#64748b',maxTicksLimit:9,maxRotation:0},title:{display:true,text:'timestamp per 30 minutes',font:{size:10},color:'#64748b'}},y:{min:0,max:3,ticks:{stepSize:0.5,font:{size:10},color:'#64748b'},grid:{color:'rgba(0,0,0,0.04)'},title:{display:true,text:'Count',font:{size:10},color:'#64748b'}}}};

const opsData = {labels:['Patch','Action','Create'],datasets:[{data:[6,2,1],backgroundColor:'#2dd4bf',borderRadius:2,barPercentage:0.5}]};
const opsOpts = {responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{grid:{display:false},ticks:{font:{size:10},color:'#64748b'},title:{display:true,text:'Activity operation type',font:{size:10},color:'#64748b'}},y:{min:0,max:7,ticks:{stepSize:2,font:{size:10},color:'#64748b'},grid:{color:'rgba(0,0,0,0.04)'},title:{display:true,text:'Count',font:{size:10},color:'#64748b'}}}};

const geoDots = [{x:38,y:38,c:'#ef4444',s:10},{x:42,y:39,c:'#dc2626',s:12},{x:50,y:36,c:'#ef4444',s:11},{x:51,y:35,c:'#dc2626',s:9},{x:64,y:44,c:'#22c55e',s:8},{x:47,y:62,c:'#f59e0b',s:8}];

const histData = {labels:allT,datasets:[{data:Array.from({length:43},(_,i)=>i<7?[1,2,3,3,3,2,1][i]:0),backgroundColor:'#2dd4bf',borderRadius:2,barPercentage:0.8}]};
const histOpts = {responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{grid:{display:false},ticks:{font:{size:10},color:'#64748b',maxTicksLimit:9,maxRotation:0},title:{display:true,text:'timestamp per 30 minutes',font:{size:10},color:'#64748b'}},y:{min:0,max:3,ticks:{stepSize:1,font:{size:10},color:'#64748b'},grid:{color:'rgba(0,0,0,0.04)'},title:{display:true,text:'Count',font:{size:10},color:'#64748b'}}}};

const typeIcon: Record<string,string> = {'@sampledata':'⊘','GeoLocation.location':'⊕','_index':'t','data.ms-graph.firstActivityDateTime':'▫','data.ms-graph.createdDateTime':'▫','data.ms-graph.lastUpdateDateTime':'▫','data.ms-graph.lastUpdatedDateTime':'▫','data.ms-graph.detectedDateTime':'▫','rule.firedtimes':'#','rule.level':'#','rule.mail':'⊘','id':'t','timestamp':'▫'};
const linkFields = ['agent.id','agent.name','rule.id'];

const docRows = Array.from({length:10},(_,i)=>({
  id:i,
  fields:[
    {k:'@sampledata',v:'true'},
    {k:'GeoLocation.city_name',v:['Vancouver','London','New York','Paris','Andalucia'][i%5]},
    {k:'GeoLocation.country_name',v:['Canada','United Kingdom','United States','France','Spain'][i%5]},
    {k:'GeoLocation.location',v:`{\n  "lon": ${(-123.119+i*10).toFixed(3)},\n  "lat": ${(49.249+i*5).toFixed(4)}\n}`},
    {k:'GeoLocation.region_name',v:['Vancouver','London','New York','Paris','Andalucia'][i%5]},
    {k:'_index',v:'wazuh-alerts-4.x-sample-security'},
    {k:'agent.id',v:['007','003','005'][i%3]},
    {k:'agent.ip',v:`24.243.97.${14+i}`},
    {k:'agent.name',v:['Debian','Ubuntu','RHEL7'][i%3]},
    {k:'cluster.name',v:'wazuh'},
    {k:'cluster.node',v:'wazuh'},
    {k:'data.integration',v:'ms-graph'},
    {k:'data.ms-graph.activity',v:['signin','audit'][i%2]},
    {k:'data.ms-graph.activityOperationType',v:['Patch','Action','Create'][i%3]},
    {k:'data.ms-graph.activityResult',v:['success','timeout','unknownFutureValue','failure'][i%4]},
    {k:'data.ms-graph.alertWebUrl',v:`https://security.microsoft.com/alerts/adfc42fdba71ff6384${i}eb980ef79cf005919d5e338?tid=0fea4e03-0146-453b-b889-54b4bd1156${i}b`},
    {k:'data.ms-graph.category',v:['Enrollment','Application','Device','DeviceConfiguration'][i%4]},
    {k:'data.ms-graph.comments',v:''},
    {k:'data.ms-graph.correlationId',v:`d1a92a06af53897e57cec13ae9bb66ec`},
    {k:'data.ms-graph.createdDateTime',v:`Jul 18, 2025 @ 20:54:06.193`},
    {k:'data.ms-graph.description',v:'The following properties of this sign-in are unfamiliar for the given user: ASN, Browser, Device, IP, Location, EASId, TenantIPs ubnet'},
    {k:'data.ms-graph.detectedDateTime',v:`2026-06-12T15:58:13.972Z`},
    {k:'data.ms-graph.detectionSource',v:'azureAdIdentityProtection'},
    {k:'data.ms-graph.detectionTimingType',v:'realTime'},
    {k:'data.ms-graph.detectorId',v:'UnfamiliarLocation'},
    {k:'data.ms-graph.displayName',v:['Create application.','Anomalous Token','ClientCertificate stored','Create device configuration 2.0 (beta)','Anonymous IP address'][i%5]},
    {k:'data.ms-graph.firstActivityDateTime',v:'Jul 18, 2025 @ 20:49:46.757'},
    {k:'data.ms-graph.id',v:`ed3a9d8ec5184c7167${i}ae34732a7b552`},
    {k:'data.ms-graph.incidentId',v:`${14+i}`},
    {k:'data.ms-graph.incidentWebUrl',v:`https://security.microsoft.com/incident?/14/overview?tid=0fea4e0${i}`},
    {k:'data.ms-graph.ipAddress',v:`54.10.24.${5+i}`},
    {k:'data.ms-graph.lastActivityDateTime',v:'Jul 18, 2025 @ 20:49:46.757'},
    {k:'data.ms-graph.lastUpdateDateTime',v:'Jul 18, 2025 @ 20:54:07.000'},
    {k:'data.ms-graph.lastUpdatedDateTime',v:`2026-06-10T04:54:23.4187`},
    {k:'data.ms-graph.mitreTechniques',v:'T1078, T1078.004'},
    {k:'data.ms-graph.productName',v:'AAD Identity Protection'},
    {k:'data.ms-graph.providerAlertId',v:`afeaa0a6f464bc518db47d8890d176d34eec14a4893c3c14e659ea0b8916d48f`},
    {k:'data.ms-graph.relationship',v:'alerts_v2'},
    {k:'data.ms-graph.requestId',v:`6c5184c34ac50afcf0b26db275f4c1eb`},
    {k:'data.ms-graph.resource',v:'security'},
    {k:'data.ms-graph.riskDetail',v:'none'},
    {k:'data.ms-graph.riskEventType',v:'unfamiliarFeatures'},
    {k:'data.ms-graph.riskLevel',v:'high'},
    {k:'data.ms-graph.riskState',v:'dismissed'},
    {k:'data.ms-graph.serviceSource',v:'azureAdIdentityProtection'},
    {k:'data.ms-graph.severity',v:'low'},
    {k:'data.ms-graph.status',v:'new'},
    {k:'data.ms-graph.systemTags',v:'Critical asset'},
    {k:'data.ms-graph.tenantId',v:'abcdefab-cdef-abcd-efab-cdefabcdefab'},
    {k:'data.ms-graph.title',v:'Anomalous Token'},
    {k:'data.ms-graph.userId',v:`f14206717075${i}b347f0e4b7a3b1fc07f`},
    {k:'id',v:`158012332${7+i}.4903${1+i}`},
    {k:'location',v:''},
    {k:'manager.name',v:'saad-cyber6'},
    {k:'rule.description',v:'MS Graph message: Indicators associated with prevalent malware and common threats were detected.'},
    {k:'rule.firedtimes',v:'11'},
    {k:'rule.groups',v:'ms-graph'},
    {k:'rule.id',v:'3964'},
    {k:'rule.level',v:'14'},
    {k:'rule.mail',v:'false'},
    {k:'timestamp',v:`Jun 13, 2026 @ 16:06:53.266`},
  ]
}));

const MsGraph: React.FC = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'dashboard'|'events'>('dashboard');
  const [filters, setFilters] = useState([{label:'cluster.name: wazuh'},{label:'rule.groups: ms-graph'}]);
  const [expanded, setExpanded] = useState<number|null>(null);
  const [detailTab, setDetailTab] = useState<'table'|'json'>('table');
  const remove = (i:number) => setFilters(f=>f.filter((_,idx)=>idx!==i));
  const [msgraphSearch, setMsgraphSearch] = useState('');

  const filteredDocRows = docRows.filter(doc => !msgraphSearch || doc.fields.some(f => String(f.v).toLowerCase().includes(msgraphSearch.toLowerCase())));
  const [docPage, setDocPage] = useState(1);
  const DOCS_PER_PAGE = 15;
  const totalDocPages = Math.ceil(filteredDocRows.length / DOCS_PER_PAGE);
  const pagedDocs = filteredDocRows.slice((docPage - 1) * DOCS_PER_PAGE, docPage * DOCS_PER_PAGE);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  return (
    <div className="wz-page" style={{background:'#f8fafc'}}>
      <div className="wz-page-content" style={{display:'flex',flexDirection:'column'}}>
        {/* Tab bar */}
        <div style={{display:'flex',borderBottom:'1px solid #e2e8f0',background:'#fff',padding:'0 24px',marginLeft:'-24px',marginRight:'-24px',marginTop:'-24px',justifyContent:'space-between',alignItems:'center'}}>
          <div style={{display:'flex'}}>
            {(['dashboard','events'] as const).map(t=>(
              <button key={t} onClick={()=>setTab(t)} style={{background:'none',border:'none',borderBottom:tab===t?'2.5px solid #005cca':'2.5px solid transparent',color:tab===t?'#005cca':'#475569',fontWeight:tab===t?600:500,fontSize:'13.5px',padding:'14px 16px 12px',cursor:'pointer',textTransform:'capitalize'}}>{t.charAt(0).toUpperCase()+t.slice(1)}</button>
            ))}
          </div>
          <div style={{display:'flex',gap:'12px',paddingRight:'8px'}}>
            <button onClick={() => toast.success('Agent exploration started')} style={{background:'none',border:'none',color:'#005cca',fontSize:'13px',fontWeight:600,display:'flex',alignItems:'center',gap:'5px',cursor:'pointer'}}>◉ Explore agent</button>
            <button onClick={() => toast.success('Report generated')} style={{background:'none',border:'none',color:'#005cca',fontSize:'13px',fontWeight:600,display:'flex',alignItems:'center',gap:'5px',cursor:'pointer'}}><FiDownload size={13}/> Generate report</button>
          </div>
        </div>
        {/* Search */}
        <div style={{display:'flex',flexDirection:'column',gap:'10px',margin:'16px 0'}}>
          <div style={{display:'flex',gap:'10px',alignItems:'center'}}>
            <div style={{flex:1,position:'relative'}}>
              <span style={{position:'absolute',left:'10px',top:'50%',transform:'translateY(-50%)',color:'#94a3b8'}}><FiSearch size={14}/></span>
              <input placeholder="Search" value={msgraphSearch} onChange={e=>setMsgraphSearch(e.target.value)} style={{width:'100%',padding:'7px 60px 7px 34px',border:'1px solid #cbd5e1',borderRadius:'4px',fontSize:'13px',background:'#fff',outline:'none'}}/>
              <span style={{position:'absolute',right:'12px',top:'50%',transform:'translateY(-50%)',fontSize:'12px',fontWeight:700,color:'#64748b'}}>DQL</span>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:'6px',border:'1px solid #cbd5e1',borderRadius:'4px',padding:'7px 12px',background:'#fff',fontSize:'13px',color:'#334155'}}>Last 24 hours<FiChevronDown size={12}/></div>
            <button onClick={() => toast.success('Date picker opened')} style={{background:'none',border:'none',color:'#005cca',fontSize:'13px',fontWeight:600,cursor:'pointer'}}>Show dates</button>
            <button onClick={() => toast.success('Data refreshed')} style={{background:'#fff',border:'1px solid #cbd5e1',borderRadius:'4px',padding:'7px 14px',fontSize:'13px',fontWeight:600,display:'flex',alignItems:'center',gap:'6px',cursor:'pointer',color:'#334155'}}><FiRefreshCw size={13}/> Refresh</button>
          </div>
          <div style={{display:'flex',flexWrap:'wrap',gap:'6px',alignItems:'center'}}>
            {filters.map((f,i)=>(<div key={i} style={{display:'flex',alignItems:'center',gap:'5px',border:'1px solid #cbd5e1',borderRadius:'4px',padding:'3px 8px',background:'#fff',fontSize:'12px',color:'#334155'}}>{f.label}<button onClick={()=>remove(i)} style={{background:'none',border:'none',color:'#94a3b8',cursor:'pointer',fontSize:'11px'}}>✕</button></div>))}
            <button onClick={() => toast.success('Add filter clicked')} style={{background:'none',border:'none',color:'#005cca',fontSize:'12.5px',fontWeight:600,display:'flex',alignItems:'center',gap:'4px',cursor:'pointer'}}><FiPlus size={13}/> Add filter</button>
          </div>
        </div>
        {/* Banner */}
        <div style={{background:'#fffbeb',border:'1px solid #fde68a',borderRadius:'4px',padding:'10px 14px',marginBottom:'20px'}}>
          <div style={{display:'flex',alignItems:'center',gap:'7px',fontSize:'12.5px',fontWeight:600,color:'#92400e'}}><FiAlertTriangle size={13}/> This dashboard contains sample data</div>
          <div style={{fontSize:'12px',color:'#78350f',marginTop:'3px'}}>The data displayed may contain sample data. Go <a href="/dashboard?loadsample=true" style={{color:'#005cca',fontWeight:600,textDecoration:'none'}}>here</a> to configure the sample data.</div>
        </div>

        {tab==='dashboard' && (
          <div style={{display:'flex',flexDirection:'column',gap:'20px'}}>
            {/* Row 1: 2 donuts + table */}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1.2fr',gap:'16px'}}>
              <div style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:'6px',padding:'16px'}}>
                <div style={{fontSize:'13px',fontWeight:600,color:'#1e293b',marginBottom:'10px'}}>Top 5 activity results</div>
                <div style={{height:'160px'}}><Doughnut data={actResultData} options={donutOpts as any}/></div>
              </div>
              <div style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:'6px',padding:'16px'}}>
                <div style={{fontSize:'13px',fontWeight:600,color:'#1e293b',marginBottom:'10px'}}>Top 5 regions</div>
                <div style={{height:'160px'}}><Doughnut data={regionData} options={donutOpts as any}/></div>
              </div>
              <div style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:'6px',padding:'16px'}}>
                <div style={{fontSize:'13px',fontWeight:600,color:'#1e293b',marginBottom:'12px'}}>Top 5 security alerts by display name</div>
                <table style={{width:'100%',borderCollapse:'collapse',fontSize:'12.5px'}}>
                  <thead><tr style={{borderBottom:'1px solid #e2e8f0'}}><th style={{textAlign:'left',padding:'6px 0',color:'#475569',fontWeight:600}}></th><th style={{textAlign:'right',padding:'6px 0',color:'#475569',fontWeight:600}}>Count <FiChevronDown size={10} style={{verticalAlign:'middle'}}/></th></tr></thead>
                  <tbody>{secAlerts.map(a=><tr key={a.name} style={{borderBottom:'1px solid #f1f5f9'}}><td style={{padding:'7px 0',color:'#334155'}}>{a.name}</td><td style={{padding:'7px 0',textAlign:'right',color:'#334155'}}>{a.count}</td></tr>)}</tbody>
                </table>
              </div>
            </div>
            {/* Row 2: area chart + bar */}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>
              <div style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:'6px',padding:'16px'}}>
                <div style={{fontSize:'13px',fontWeight:600,color:'#1e293b',marginBottom:'10px'}}>Events by category over time</div>
                <div style={{height:'200px'}}><Line data={catData} options={catOpts as any}/></div>
              </div>
              <div style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:'6px',padding:'16px'}}>
                <div style={{fontSize:'13px',fontWeight:600,color:'#1e293b',marginBottom:'10px'}}>Top 5 activity operations types</div>
                <div style={{height:'200px'}}><Bar data={opsData} options={opsOpts as any}/></div>
              </div>
            </div>
            {/* Geo map */}
            <div style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:'6px',padding:'16px'}}>
              <div style={{fontSize:'13px',fontWeight:600,color:'#1e293b',marginBottom:'12px'}}>Geolocation map</div>
              <div style={{position:'relative',height:'300px',background:'#a8c8e0',borderRadius:'4px',overflow:'hidden'}}>
                <svg viewBox="0 0 1000 500" style={{position:'absolute',inset:0,width:'100%',height:'100%'}} preserveAspectRatio="xMidYMid slice">
                  <rect width="1000" height="500" fill="#a8c8e0"/>
                  <path d="M80 80L220 80L240 120L220 180L180 220L150 250L120 240L100 200L70 160L60 120Z" fill="#e8dcc8"/>
                  <path d="M160 270L200 260L220 300L230 370L210 430L180 440L160 420L145 380L140 320Z" fill="#e8dcc8"/>
                  <path d="M420 70L490 65L510 90L500 130L470 140L445 130L430 110Z" fill="#e8dcc8"/>
                  <path d="M440 150L510 140L530 170L540 240L520 310L490 360L460 370L440 340L420 270L415 200Z" fill="#e8dcc8"/>
                  <path d="M580 60L780 55L820 100L810 160L770 180L720 190L670 185L620 175L590 150L575 110Z" fill="#e8dcc8"/>
                  <path d="M640 170L680 165L700 200L690 240L665 260L645 240L630 200Z" fill="#e8dcc8"/>
                  <path d="M750 290L860 285L880 330L860 380L820 390L770 380L745 345Z" fill="#e8dcc8"/>
                </svg>
                {geoDots.map((d,i)=><div key={i} style={{position:'absolute',left:`${d.x}%`,top:`${d.y}%`,width:`${d.s}px`,height:`${d.s}px`,background:d.c,borderRadius:'50%',transform:'translate(-50%,-50%)',border:'1.5px solid rgba(255,255,255,0.6)',boxShadow:'0 1px 3px rgba(0,0,0,0.3)',zIndex:2}}/>)}
                <div style={{position:'absolute',left:'12px',top:'12px',display:'flex',flexDirection:'column',gap:'2px',zIndex:3}}>
                  {[FiPlus,FiMinus,FiLayers,FiMapPin,FiSquare].map((Icon,i)=><button key={i} style={{width:'28px',height:'28px',background:'#fff',border:'1px solid #cbd5e1',borderRadius:'3px',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'#475569'}}><Icon size={13}/></button>)}
                </div>
                <div style={{position:'absolute',bottom:'12px',right:'12px',background:'rgba(255,255,255,0.92)',border:'1px solid #e2e8f0',borderRadius:'4px',padding:'8px 12px',fontSize:'11px',zIndex:3}}>
                  <div style={{fontWeight:600,color:'#1e293b',marginBottom:'6px'}}>Count</div>
                  {[{c:'#22c55e',l:'1 – 1.25'},{c:'#f59e0b',l:'1.25 – 1.5'},{c:'#ef4444',l:'1.5 – 1.75'},{c:'#dc2626',l:'1.75 – 2'}].map(i=>(
                    <div key={i.l} style={{display:'flex',alignItems:'center',gap:'6px',marginBottom:'3px'}}><span style={{width:'10px',height:'10px',borderRadius:'50%',background:i.c,display:'inline-block'}}/><span style={{color:'#475569'}}>{i.l}</span></div>
                  ))}
                </div>
                <div style={{position:'absolute',bottom:'4px',left:'50%',transform:'translateX(-50%)',fontSize:'10px',color:'rgba(0,0,0,0.5)',zIndex:3}}>Map data © OpenStreetMap contributors</div>
              </div>
            </div>
          </div>
        )}

        {tab==='events' && (
          <div style={{display:'flex',flexDirection:'column',position:'relative'}}>
            {/* Histogram */}
            <div style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:'6px',padding:'16px',marginBottom:'16px'}}>
              <div style={{height:'120px'}}><Bar data={histData} options={histOpts as any}/></div>
            </div>
            {/* Hits */}
            <div style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:'6px 6px 0 0',padding:'10px 16px',textAlign:'center'}}>
              <div style={{fontSize:'13.5px',fontWeight:600,color:'#1e293b'}}>10 hits</div>
              <div style={{fontSize:'11.5px',color:'#64748b'}}>Jun 13, 2026 @ 13:54:22.654 – Jun 14, 2026 @ 13:54:22.654</div>
            </div>
            <div style={{background:'#fff',border:'1px solid #e2e8f0',borderTop:'none',padding:'8px 16px',display:'flex',alignItems:'center',gap:'18px',fontSize:'12.5px',color:'#475569'}}>
              <span onClick={() => toast.success('Data exported')} style={{color:'#005cca',fontWeight:600}}>⬆ Export Formatted</span>
              <span onClick={() => toast.success('View reset')}>↺ Reset view</span><span>⊛ 898 available fields ⓘ</span><span>≡ Columns</span><span>≣ Density</span><span>↕ Sort fields</span><span>⛶ Full screen</span>
            </div>
            {/* Document rows */}
            <div style={{background:'#fff',border:'1px solid #e2e8f0',borderTop:'none',borderRadius:'0 0 6px 6px'}}>
              {pagedDocs.map(doc=>(
                <div key={doc.id}>
                  <div onClick={()=>{setExpanded(expanded===doc.id?null:doc.id);setDetailTab('table');setSelectedEvent(doc);}} style={{padding:'8px 16px',borderBottom:'1px solid #f1f5f9',display:'flex',alignItems:'center',gap:'8px',cursor:'pointer',fontSize:'12.5px',color:'#64748b'}}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', fontSize: '12px', color: '#64748b', background: '#fff', border: '1px solid #e2e8f0', borderTop: 'none' }}>
              <span>Rows per page: {DOCS_PER_PAGE}</span>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button disabled={docPage <= 1} onClick={() => setDocPage(p => Math.max(1, p - 1))} style={{ border: 'none', background: 'none', cursor: docPage <= 1 ? 'not-allowed' : 'pointer', color: docPage <= 1 ? '#cbd5e1' : '#475569' }}>&lt;</button>
                <span style={{ fontWeight: 600, color: '#005cca' }}>{docPage}</span>
                <span style={{ color: '#94a3b8' }}>of {totalDocPages}</span>
                <button disabled={docPage >= totalDocPages} onClick={() => setDocPage(p => Math.min(totalDocPages, p + 1))} style={{ border: 'none', background: 'none', cursor: docPage >= totalDocPages ? 'not-allowed' : 'pointer', color: docPage >= totalDocPages ? '#cbd5e1' : '#475569' }}>&gt;</button>
              </div>
            </div>

            {/* Side panel */}
            {expanded !== null && (
              <div style={{position:'fixed',top:0,right:0,width:'50%',height:'100vh',background:'#fff',borderLeft:'1px solid #e2e8f0',boxShadow:'-4px 0 12px rgba(0,0,0,0.08)',zIndex:100,overflowY:'auto',padding:'24px'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'16px'}}>
                  <h2 style={{fontSize:'22px',fontWeight:400,color:'#1e293b',margin:0}}>Document Details</h2>
                  <div style={{display:'flex',gap:'12px',alignItems:'center'}}>
                    <a href="#" style={{fontSize:'12px',color:'#005cca',textDecoration:'none',display:'flex',alignItems:'center',gap:'3px'}}>View surrounding documents <FiExternalLink size={11}/></a>
                    <a href="#" style={{fontSize:'12px',color:'#005cca',textDecoration:'none',display:'flex',alignItems:'center',gap:'3px'}}>View single document <FiExternalLink size={11}/></a>
                    <button onClick={()=>setExpanded(null)} style={{background:'none',border:'none',cursor:'pointer',color:'#64748b'}}><FiX size={16}/></button>
                  </div>
                </div>
                <div style={{display:'flex',gap:'0',marginBottom:'16px',borderBottom:'1px solid #e2e8f0'}}>
                  {(['table','json'] as const).map(t=>(
                    <button key={t} onClick={()=>setDetailTab(t)} style={{background:'none',border:'none',borderBottom:detailTab===t?'2px solid #005cca':'2px solid transparent',color:detailTab===t?'#005cca':'#475569',fontWeight:detailTab===t?600:400,fontSize:'13px',padding:'8px 16px',cursor:'pointer',textTransform:'capitalize'}}>{t==='json'?'JSON':t.charAt(0).toUpperCase()+t.slice(1)}</button>
                  ))}
                </div>
                {detailTab==='table' ? (
                  <table style={{width:'100%',borderCollapse:'collapse',fontSize:'12.5px'}}>
                    <tbody>
                      {docRows[expanded].fields.map(f=>(
                        <tr key={f.k} style={{borderBottom:'1px solid #f1f5f9'}}>
                          <td style={{padding:'8px 8px 8px 0',color:'#475569',fontWeight:500,width:'40%',verticalAlign:'top'}}>
                            <span style={{color:'#94a3b8',marginRight:'6px'}}>t</span>{f.k}
                          </td>
                          <td style={{padding:'8px 0',color:f.k==='agent.id'||f.k==='agent.name'?'#005cca':'#334155',fontWeight:f.k==='agent.id'||f.k==='agent.name'?600:400,cursor:f.k==='agent.id'||f.k==='agent.name'?'pointer':'default'}} onClick={() => { if (f.k === 'agent.id' || f.k === 'agent.name') navigate(`/agents/detail?agent=${f.v}`); }}>{f.v}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <pre style={{background:'#f8fafc',border:'1px solid #e2e8f0',borderRadius:'4px',padding:'16px',fontSize:'12px',color:'#334155',overflow:'auto'}}>
                    {JSON.stringify(Object.fromEntries(docRows[expanded].fields.map(f=>[f.k,f.v])),null,2)}
                  </pre>
                )}
              </div>
            )}
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

export default MsGraph;
