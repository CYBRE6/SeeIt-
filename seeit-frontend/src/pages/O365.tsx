import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { FiSearch, FiChevronDown, FiPlus, FiRefreshCw, FiDownload, FiAlertTriangle, FiChevronLeft, FiChevronRight, FiMinus, FiLayers, FiMapPin, FiSquare } from 'react-icons/fi';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler);

const users = ['williams@wazuh.com','frank@wazuh.com','brown@wazuh.com','smith@wazuh.com','jones@wazuh.com'];
const userColors = ['#22c55e','#3b82f6','#f59e0b','#ef4444','#8b5cf6'];
const ips = ['13.226.52.89','77.231.182.17','13.226.52.2','13.226.52.66','172.217.204.94'];
const ipColors = ['#22c55e','#3b82f6','#f59e0b','#ef4444','#8b5cf6','#f472b6','#60a5fa','#fb923c'];
const subColors = ['#f59e0b','#fbbf24','#ef4444'];

const opResults = [
  {op:'FileCheckedOut',user:'frank@wazuh.com',status:'PartiallySucceeded',count:2},
  {op:'FileCheckedOut',user:'williams@wazuh.c...',status:'PartiallySucceeded',count:1},
  {op:'PageViewed',user:'jones@wazuh.com',status:'Succeeded',count:1},
  {op:'PageViewed',user:'smith@wazuh.com',status:'Failed',count:1},
  {op:'PageViewed',user:'williams@wazuh.c...',status:'PartiallySucceeded',count:1},
];
const ruleDescs = [
  {desc:'Office 365: SharePoint events.',level:3,count:8},
  {desc:'Office 365: Admin action.',level:5,count:7},
  {desc:'Office 365: SharePoint file...',level:3,count:7},
  {desc:'Office 365: SharePoint sh...',level:3,count:5},
  {desc:'Office 365: Azure Active...',level:3,count:4},
];
const topUsers = [{n:'williams@wazuh.com',c:10},{n:'brown@wazuh.com',c:9},{n:'frank@wazuh.com',c:9},{n:'smith@wazuh.com',c:7},{n:'jones@wazuh.com',c:3}];
const topIps = [{n:'13.226.52.89',c:8},{n:'77.231.182.17',c:7},{n:'13.226.52.2',c:6},{n:'13.226.52.66',c:6},{n:'172.217.204.94',c:5}];
const topRules = [{n:'Office 365: SharePoint events.',c:8},{n:'Office 365: Admin actions from the Security and Compliance Center.',c:7},{n:'Office 365: SharePoint file operation events.',c:7},{n:'Office 365: SharePoint sharing events.',c:5},{n:'Office 365: Azure Active Directory events.',c:4}];
const topOps = [{n:'FileCheckedOut',c:3},{n:'PageViewed',c:3},{n:'SiteCollectionAdminAdded',c:3},{n:'Add service principal.',c:2},{n:'Get-SupervisoryReviewReport',c:2}];

const allT = Array.from({length:8},(_,i)=>`2026-06-13 ${String(15+i*3).padStart(2,'0')}:00`);
const geoDots = [{x:28,y:42,c:'#22c55e',s:9},{x:51,y:35,c:'#ef4444',s:12},{x:76,y:33,c:'#f59e0b',s:10},{x:88,y:52,c:'#22c55e',s:8},{x:36,y:60,c:'#3b82f6',s:9}];

const MiniTable: React.FC<{title:string,col:string,rows:{n:string,c:number}[]}> = ({title,col,rows}) => (
  <div style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:'6px',padding:'20px'}}>
    <h3 style={{fontSize:'20px',fontWeight:400,color:'#1e293b',margin:'0 0 12px 0'}}>{title}</h3>
    <div style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid #e2e8f0',fontSize:'12.5px',fontWeight:600,color:'#475569'}}><span>{col}</span><span>Count ↓</span></div>
    {rows.map(r=><div key={r.n} style={{display:'flex',justifyContent:'space-between',padding:'9px 0',borderBottom:'1px solid #f1f5f9',fontSize:'13px'}}><span style={{color:'#334155'}}>{r.n}</span><span>{r.c}</span></div>)}
    <div style={{display:'flex',justifyContent:'flex-end',gap:'4px',marginTop:'10px',fontSize:'12px'}}><span style={{color:'#cbd5e1'}}>‹</span><span style={{color:'#005cca',fontWeight:600}}>1</span><span style={{color:'#cbd5e1'}}>›</span></div>
  </div>
);

const O365: React.FC = () => {
  const [tab, setTab] = useState<'dashboard'|'panel'|'events'>('dashboard');
  const [filters, setFilters] = useState([{label:'cluster.name: wazuh'},{label:'rule.groups: office365'}]);
  const [rdPage, setRdPage] = useState(1);
  const remove = (i:number) => setFilters(f=>f.filter((_,idx)=>idx!==i));
  const [o365Search, setO365Search] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const sevData = {labels:allT, datasets:[
    {label:'3',data:[8,12,18,24,14,10,8,5],backgroundColor:'#22c55e',borderRadius:2,barPercentage:0.7},
    {label:'5',data:[4,6,10,12,8,6,4,2],backgroundColor:'#3b82f6',borderRadius:2,barPercentage:0.7},
  ]};
  const sevOpts = {responsive:true,maintainAspectRatio:false,plugins:{legend:{display:true,position:'right' as const,labels:{boxWidth:10,font:{size:11}}}},scales:{x:{grid:{display:false},ticks:{font:{size:9},color:'#64748b',maxRotation:0,maxTicksLimit:4},title:{display:true,text:'timestamp per 3 hours',font:{size:10},color:'#64748b'}},y:{min:0,max:25,ticks:{stepSize:5,font:{size:10},color:'#64748b'},grid:{color:'rgba(0,0,0,0.04)'},title:{display:true,text:'Count',font:{size:10},color:'#64748b'}}}};

  const ipBarData = {labels:ips,datasets:users.map((u,i)=>({label:u,data:ips.map(()=>Math.floor(Math.random()*15)+2),backgroundColor:ipColors[i],borderRadius:1,barPercentage:0.8}))};
  const ipBarOpts = {responsive:true,maintainAspectRatio:false,indexAxis:'y' as const,plugins:{legend:{display:false}},scales:{x:{stacked:true,grid:{color:'rgba(0,0,0,0.04)'},ticks:{font:{size:10},color:'#64748b'},title:{display:true,text:'Count',font:{size:10},color:'#64748b'}},y:{stacked:true,grid:{display:false},ticks:{font:{size:9},color:'#64748b'}}}};

  const subData = {labels:['brown@wazuh.com'],datasets:[
    {label:'Audit.SharePoint',data:[10],backgroundColor:subColors[0],borderRadius:2,barPercentage:0.5},
    {label:'Audit.AzureActiveDirectory',data:[8],backgroundColor:subColors[1],borderRadius:2,barPercentage:0.5},
    {label:'Audit.General',data:[4],backgroundColor:subColors[2],borderRadius:2,barPercentage:0.5},
  ]};
  const subOpts = {responsive:true,maintainAspectRatio:false,plugins:{legend:{display:true,position:'right' as const,labels:{boxWidth:10,font:{size:10}}}},scales:{x:{grid:{display:false},ticks:{font:{size:9},color:'#64748b'},title:{display:true,text:'data.office365.UserId: Descending',font:{size:9},color:'#64748b'}},y:{min:0,max:10,ticks:{stepSize:2,font:{size:10},color:'#64748b'},grid:{color:'rgba(0,0,0,0.04)'},title:{display:true,text:'Count',font:{size:10},color:'#64748b'}}}};

  const sevUserData = {labels:users,datasets:[{data:[12,10,8,6,3],backgroundColor:userColors,borderRadius:2,barPercentage:0.6}]};
  const sevUserOpts = {responsive:true,maintainAspectRatio:false,plugins:{legend:{display:true,position:'top' as const,labels:{boxWidth:10,font:{size:10},generateLabels:()=>users.map((u,i)=>({text:u,fillStyle:userColors[i],strokeStyle:userColors[i],lineWidth:0}))}},tooltip:{enabled:true}},scales:{x:{grid:{display:false},ticks:{font:{size:9},color:'#64748b',maxRotation:0}},y:{min:0,max:50,ticks:{stepSize:10,font:{size:10},color:'#64748b'},grid:{color:'rgba(0,0,0,0.04)'},title:{display:true,text:'Count',font:{size:10},color:'#64748b'}}}};

  const Header = () => (
    <>
      <div style={{display:'flex',borderBottom:'1px solid #e2e8f0',background:'#fff',padding:'0 24px',marginLeft:'-24px',marginRight:'-24px',marginTop:'-24px',justifyContent:'space-between',alignItems:'center'}}>
        <div style={{display:'flex'}}>
          {(['dashboard','panel','events'] as const).map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{background:'none',border:'none',borderBottom:tab===t?'2.5px solid #005cca':'2.5px solid transparent',color:tab===t?'#005cca':'#475569',fontWeight:tab===t?600:500,fontSize:'13.5px',padding:'14px 16px 12px',cursor:'pointer',textTransform:'capitalize'}}>{t.charAt(0).toUpperCase()+t.slice(1)}</button>
          ))}
        </div>
        <div style={{display:'flex',gap:'12px',paddingRight:'8px'}}>
          <button onClick={() => toast.success('Agent exploration started')} style={{background:'none',border:'none',color:'#005cca',fontSize:'13px',fontWeight:600,display:'flex',alignItems:'center',gap:'5px',cursor:'pointer'}}>◉ Explore agent</button>
          <button onClick={() => toast.success('Report generated')} style={{background:'none',border:'none',color:'#005cca',fontSize:'13px',fontWeight:600,display:'flex',alignItems:'center',gap:'5px',cursor:'pointer'}}><FiDownload size={13}/> Generate report</button>
        </div>
      </div>
      {tab==='panel'?(
        <div style={{display:'flex',flexDirection:'column',gap:'10px',margin:'16px 0'}}>
          <div style={{display:'flex',gap:'10px',alignItems:'center',flexWrap:'wrap'}}>
            {['Subscription  0','User Type  0','Result Status  0'].map(l=>(
              <div key={l} style={{display:'flex',alignItems:'center',gap:'6px',border:'1px solid #cbd5e1',borderRadius:'4px',padding:'7px 12px',background:'#fff',fontSize:'13px',color:'#334155',cursor:'pointer',minWidth:'140px'}}>{l}<FiChevronDown size={12}/></div>
            ))}
            <div style={{display:'flex',alignItems:'center',gap:'6px',border:'1px solid #cbd5e1',borderRadius:'4px',padding:'7px 12px',background:'#fff',fontSize:'13px',color:'#334155'}}>Last 24 hours<FiChevronDown size={12}/></div>
            <button style={{background:'none',border:'none',color:'#005cca',fontSize:'13px',fontWeight:600,cursor:'pointer'}}>Show dates</button>
            <button onClick={() => toast.success('Data refreshed')} style={{background:'#fff',border:'1px solid #cbd5e1',borderRadius:'4px',padding:'7px 14px',fontSize:'13px',fontWeight:600,display:'flex',alignItems:'center',gap:'6px',cursor:'pointer',color:'#334155'}}><FiRefreshCw size={13}/> Refresh</button>
          </div>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div style={{display:'flex',flexWrap:'wrap',gap:'6px',alignItems:'center'}}>
              {filters.map((f,i)=>(<div key={i} style={{display:'flex',alignItems:'center',gap:'5px',border:'1px solid #cbd5e1',borderRadius:'4px',padding:'3px 8px',background:'#fff',fontSize:'12px',color:'#334155'}}>{f.label}<button onClick={()=>remove(i)} style={{background:'none',border:'none',color:'#94a3b8',cursor:'pointer',fontSize:'11px'}}>✕</button></div>))}
              <button onClick={() => toast.success('Add filter clicked')} style={{background:'none',border:'none',color:'#005cca',fontSize:'12.5px',fontWeight:600,display:'flex',alignItems:'center',gap:'4px',cursor:'pointer'}}><FiPlus size={13}/> Add filter</button>
            </div>
            <span style={{fontSize:'13px',color:'#475569'}}>✕ Advanced filters</span>
          </div>
        </div>
      ):(
        <div style={{display:'flex',flexDirection:'column',gap:'10px',margin:'16px 0'}}>
          <div style={{display:'flex',gap:'10px',alignItems:'center'}}>
            <div style={{flex:1,position:'relative'}}>
              <span style={{position:'absolute',left:'10px',top:'50%',transform:'translateY(-50%)',color:'#94a3b8'}}><FiSearch size={14}/></span>
              <input placeholder="Search" value={o365Search} onChange={e=>setO365Search(e.target.value)} style={{width:'100%',padding:'7px 60px 7px 34px',border:'1px solid #cbd5e1',borderRadius:'4px',fontSize:'13px',background:'#fff',outline:'none'}}/>
              <span style={{position:'absolute',right:'12px',top:'50%',transform:'translateY(-50%)',fontSize:'12px',fontWeight:700,color:'#64748b'}}>DQL</span>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:'6px',border:'1px solid #cbd5e1',borderRadius:'4px',padding:'7px 12px',background:'#fff',fontSize:'13px',color:'#334155'}}>Last 24 hours<FiChevronDown size={12}/></div>
            <button style={{background:'none',border:'none',color:'#005cca',fontSize:'13px',fontWeight:600,cursor:'pointer'}}>Show dates</button>
            <button onClick={() => toast.success('Data refreshed')} style={{background:'#fff',border:'1px solid #cbd5e1',borderRadius:'4px',padding:'7px 14px',fontSize:'13px',fontWeight:600,display:'flex',alignItems:'center',gap:'6px',cursor:'pointer',color:'#334155'}}><FiRefreshCw size={13}/> Refresh</button>
          </div>
          <div style={{display:'flex',flexWrap:'wrap',gap:'6px',alignItems:'center'}}>
            {filters.map((f,i)=>(<div key={i} style={{display:'flex',alignItems:'center',gap:'5px',border:'1px solid #cbd5e1',borderRadius:'4px',padding:'3px 8px',background:'#fff',fontSize:'12px',color:'#334155'}}>{f.label}<button onClick={()=>remove(i)} style={{background:'none',border:'none',color:'#94a3b8',cursor:'pointer',fontSize:'11px'}}>✕</button></div>))}
            <button onClick={() => toast.success('Add filter clicked')} style={{background:'none',border:'none',color:'#005cca',fontSize:'12.5px',fontWeight:600,display:'flex',alignItems:'center',gap:'4px',cursor:'pointer'}}><FiPlus size={13}/> Add filter</button>
          </div>
        </div>
      )}
      <div style={{background:'#fffbeb',border:'1px solid #fde68a',borderRadius:'4px',padding:'10px 14px',marginBottom:'20px'}}>
        <div style={{display:'flex',alignItems:'center',gap:'7px',fontSize:'12.5px',fontWeight:600,color:'#92400e'}}><FiAlertTriangle size={13}/> This dashboard contains sample data</div>
        <div style={{fontSize:'12px',color:'#78350f',marginTop:'3px'}}>The data displayed may contain sample data. Go <a href="/dashboard?loadsample=true" style={{color:'#005cca',fontWeight:600,textDecoration:'none'}}>here</a> to configure the sample data.</div>
      </div>
    </>
  );

  return (
    <div className="wz-page" style={{background:'#f8fafc'}}>
      <div className="wz-page-content" style={{display:'flex',flexDirection:'column'}}>
        <Header/>

        {tab==='dashboard' && (
          <div style={{display:'flex',flexDirection:'column',gap:'20px'}}>
            {/* Stat boxes */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1px',background:'#e2e8f0',border:'1px solid #e2e8f0',borderRadius:'6px',overflow:'hidden'}}>
              {[{l:'- Max Rule Level -',v:5,c:'#22c55e'},{l:'- Suspicious Downloads -',v:0,c:'#cc0000'},{l:'- Full Access Permissions -',v:0,c:'#cc0000'},{l:'- Phishing and Malware -',v:0,c:'#cc0000'}].map(s=>(
                <div key={s.l} style={{background:'#fff',padding:'28px 16px',textAlign:'center'}}>
                  <div style={{fontSize:'42px',fontWeight:700,color:s.c,lineHeight:1.1}}>{s.v}</div>
                  <div style={{fontSize:'11px',color:'#475569',marginTop:'8px'}}>{s.l}</div>
                </div>
              ))}
            </div>
            {/* Row 1: 3 charts */}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'16px'}}>
              <div style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:'6px',padding:'16px'}}>
                <div style={{fontSize:'13px',fontWeight:600,color:'#1e293b',marginBottom:'10px'}}>Events by severity over time</div>
                <div style={{height:'180px'}}><Bar data={sevData} options={sevOpts as any}/></div>
              </div>
              <div style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:'6px',padding:'16px'}}>
                <div style={{fontSize:'13px',fontWeight:600,color:'#1e293b',marginBottom:'10px'}}>IP address by Users</div>
                <div style={{height:'180px'}}><Bar data={ipBarData} options={ipBarOpts as any}/></div>
              </div>
              <div style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:'6px',padding:'16px'}}>
                <div style={{fontSize:'13px',fontWeight:600,color:'#1e293b',marginBottom:'10px'}}>Top Users By Subscription</div>
                <div style={{height:'180px'}}><Bar data={subData} options={subOpts as any}/></div>
              </div>
            </div>
            {/* Row 2: op result table, severity by user bar, rule desc table */}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'16px'}}>
              <div style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:'6px',padding:'16px'}}>
                <div style={{fontSize:'13px',fontWeight:600,color:'#1e293b',marginBottom:'10px'}}>Users by Operation Result</div>
                <table style={{width:'100%',borderCollapse:'collapse',fontSize:'12px'}}>
                  <thead><tr style={{borderBottom:'1px solid #e2e8f0'}}>{['Operation','User','Result Status','Count'].map(h=><th key={h} style={{padding:'6px 4px',textAlign:'left',color:'#475569',fontWeight:600}}>{h} <FiChevronDown size={9} style={{verticalAlign:'middle'}}/></th>)}</tr></thead>
                  <tbody>{opResults.map((r,i)=><tr key={i} style={{borderBottom:'1px solid #f1f5f9'}}><td style={{padding:'5px 4px',color:'#334155'}}>{r.op}</td><td style={{padding:'5px 4px',color:'#005cca',fontSize:'11px'}}>{r.user}</td><td style={{padding:'5px 4px',color:'#64748b',fontSize:'11px'}}>{r.status}</td><td style={{padding:'5px 4px'}}>{r.count}</td></tr>)}</tbody>
                </table>
                <div style={{display:'flex',justifyContent:'flex-end',gap:'4px',marginTop:'8px',fontSize:'12px'}}><span style={{color:'#cbd5e1'}}>‹</span>{[1,2,3,4].map(p=><span key={p} style={{color:p===1?'#005cca':'#475569',fontWeight:p===1?600:400,cursor:'pointer'}}>{p}</span>)}<span style={{color:'#475569',cursor:'pointer'}}>›</span></div>
              </div>
              <div style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:'6px',padding:'16px'}}>
                <div style={{fontSize:'13px',fontWeight:600,color:'#1e293b',marginBottom:'10px'}}>Severity by user</div>
                <div style={{height:'180px'}}><Bar data={sevUserData} options={sevUserOpts as any}/></div>
              </div>
              <div style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:'6px',padding:'16px'}}>
                <div style={{fontSize:'13px',fontWeight:600,color:'#1e293b',marginBottom:'10px'}}>Rule Description by Level</div>
                <table style={{width:'100%',borderCollapse:'collapse',fontSize:'12px'}}>
                  <thead><tr style={{borderBottom:'1px solid #e2e8f0'}}>{['Rule Description','Rule Level','Count'].map(h=><th key={h} style={{padding:'6px 4px',textAlign:'left',color:'#475569',fontWeight:600}}>{h} <FiChevronDown size={9} style={{verticalAlign:'middle'}}/></th>)}</tr></thead>
                  <tbody>{ruleDescs.map((r,i)=><tr key={i} style={{borderBottom:'1px solid #f1f5f9'}}><td style={{padding:'5px 4px',color:'#334155',fontSize:'11px'}}>{r.desc}</td><td style={{padding:'5px 4px'}}>{r.level}</td><td style={{padding:'5px 4px'}}>{r.count}</td></tr>)}</tbody>
                </table>
                <div style={{display:'flex',justifyContent:'flex-end',gap:'4px',marginTop:'8px',fontSize:'12px'}}><span style={{color:'#cbd5e1'}}>‹</span><span style={{color:'#005cca',fontWeight:600}}>1</span><span style={{color:'#475569',cursor:'pointer'}}>2</span><span style={{color:'#475569',cursor:'pointer'}}>›</span></div>
              </div>
            </div>
            {/* Geo map */}
            <div style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:'6px',padding:'16px'}}>
              <div style={{fontSize:'13px',fontWeight:600,color:'#1e293b',marginBottom:'12px'}}>Geolocation map</div>
              <div style={{position:'relative',height:'280px',background:'#a8c8e0',borderRadius:'4px',overflow:'hidden'}}>
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
              </div>
            </div>
          </div>
        )}

        {tab==='panel' && (
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px'}}>
            <MiniTable title="Top users" col="User" rows={topUsers}/>
            <MiniTable title="Top client IP address" col="Client IP address" rows={topIps}/>
            <MiniTable title="Top rules" col="Rule" rows={topRules}/>
            <MiniTable title="Top operations" col="Operation" rows={topOps}/>
          </div>
        )}

        {tab==='events' && (
          <div style={{textAlign:'center',background:'#fff',border:'1px solid #e2e8f0',borderRadius:'6px',padding:'40px'}}>
            <FiSearch size={40} style={{color:'#cbd5e1',marginBottom:'16px'}}/>
            <h3 style={{fontSize:'18px',fontWeight:300,color:'#1e293b',margin:'0 0 8px 0'}}>No events to display</h3>
            <p style={{fontSize:'13px',color:'#64748b',margin:0}}>Adjust your time range or filters to find Office 365 events.</p>
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

export default O365;
