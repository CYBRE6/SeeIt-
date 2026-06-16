import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FiSearch, FiChevronDown, FiPlus, FiRefreshCw, FiDownload, FiAlertTriangle, FiChevronLeft, FiChevronRight, FiMinus, FiLayers, FiMapPin, FiSquare } from 'react-icons/fi';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler);

const n = 43;
const tLabels = ['15:00','18:00','21:00','00:00','03:00','06:00','09:00','12:00'];
const allT = Array.from({length: n}, (_,i) => {
  const h = Math.floor(i * 24 / n); return `${String(h).padStart(2,'0')}:${i%2===0?'00':'30'}`;
});

const events = Array.from({length:58}, (_, i) => ({
  ts: `Jun 13, 2026 @ ${String(16 - Math.floor(i/4)).padStart(2,'0')}:${String(Math.floor(Math.random()*60)).padStart(2,'0')}:${String(Math.floor(Math.random()*60)).padStart(2,'0')}.${String(Math.floor(Math.random()*999)).padStart(3,'0')}`,
  agent: ['Ubuntu','Debian','RHEL7','Amazon','Centos','Windows','ip-10-0-0-180.us-west-1.compute.internal'][i%7],
  accountId: `53133922${9+i%5}...`,
  location: ['us-east2','us-east3','us-east1','us-west3','australia-southeast1','asia-east1','us-west4','us-east2'][i%8],
  project: ['wazuh-dev','wazuh-prod','wazuh-test'][i%3],
  resType: ['dns_query','generic_task','app_script_function'][i%3],
  severity: ['INFO','ALERT','EMERGENCY','CRITICAL','ERROR','NOTICE'][i%6],
}));

const SharedHeader: React.FC<{tab:'dashboard'|'events', setTab:(t:any)=>void, filters:{label:string}[], remove:(i:number)=>void, search:string, onSearchChange:(v:string)=>void}> = ({tab, setTab, filters, remove, search, onSearchChange}) => (
  <>
    <div style={{display:'flex',borderBottom:'1px solid #e2e8f0',background:'#fff',padding:'0 24px',marginLeft:'-24px',marginRight:'-24px',marginTop:'-24px',justifyContent:'space-between',alignItems:'center'}}>
      <div style={{display:'flex'}}>
        {(['dashboard','events'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{background:'none',border:'none',borderBottom:tab===t?'2.5px solid #005cca':'2.5px solid transparent',color:tab===t?'#005cca':'#475569',fontWeight:tab===t?600:500,fontSize:'13.5px',padding:'14px 16px 12px',cursor:'pointer',textTransform:'capitalize'}}>
            {t.charAt(0).toUpperCase()+t.slice(1)}
          </button>
        ))}
      </div>
      <div style={{display:'flex',gap:'12px',paddingRight:'8px'}}>
        <button onClick={() => toast.success('Agent exploration started')} style={{background:'none',border:'none',color:'#005cca',fontSize:'13px',fontWeight:600,display:'flex',alignItems:'center',gap:'5px',cursor:'pointer'}}>◉ Explore agent</button>
        <button onClick={() => toast.success('Report generated')} style={{background:'none',border:'none',color:'#005cca',fontSize:'13px',fontWeight:600,display:'flex',alignItems:'center',gap:'5px',cursor:'pointer'}}><FiDownload size={13}/> Generate report</button>
      </div>
    </div>
    <div style={{display:'flex',flexDirection:'column',gap:'10px',margin:'16px 0'}}>
      <div style={{display:'flex',gap:'10px',alignItems:'center'}}>
        <div style={{flex:1,position:'relative'}}>
          <span style={{position:'absolute',left:'10px',top:'50%',transform:'translateY(-50%)',color:'#94a3b8'}}><FiSearch size={14}/></span>
          <input placeholder="Search" value={search} onChange={e=>onSearchChange(e.target.value)} style={{width:'100%',padding:'7px 60px 7px 34px',border:'1px solid #cbd5e1',borderRadius:'4px',fontSize:'13px',background:'#fff',outline:'none'}}/>
          <span style={{position:'absolute',right:'12px',top:'50%',transform:'translateY(-50%)',fontSize:'12px',fontWeight:700,color:'#64748b'}}>DQL</span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:'6px',border:'1px solid #cbd5e1',borderRadius:'4px',padding:'7px 12px',background:'#fff',fontSize:'13px',color:'#334155',cursor:'pointer'}}>
          <span style={{fontSize:'12px'}}>▤</span><FiChevronDown size={12}/>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:'6px',border:'1px solid #cbd5e1',borderRadius:'4px',padding:'7px 12px',background:'#fff',fontSize:'13px',color:'#334155',cursor:'pointer'}}>
          Last 24 hours<FiChevronDown size={12}/>
        </div>
        <button onClick={() => toast.success('Date picker opened')} style={{background:'none',border:'none',color:'#005cca',fontSize:'13px',fontWeight:600,cursor:'pointer'}}>Show dates</button>
        <button onClick={() => toast.success('Data refreshed')} style={{background:'#fff',border:'1px solid #cbd5e1',borderRadius:'4px',padding:'7px 14px',fontSize:'13px',fontWeight:600,display:'flex',alignItems:'center',gap:'6px',cursor:'pointer',color:'#334155'}}><FiRefreshCw size={13}/> Refresh</button>
      </div>
      <div style={{display:'flex',flexWrap:'wrap',gap:'6px',alignItems:'center'}}>
        {filters.map((f,i) => (
          <div key={i} style={{display:'flex',alignItems:'center',gap:'5px',border:'1px solid #cbd5e1',borderRadius:'4px',padding:'3px 8px',background:'#fff',fontSize:'12px',color:'#334155'}}>
            {f.label}<button onClick={()=>remove(i)} style={{background:'none',border:'none',color:'#94a3b8',cursor:'pointer',fontSize:'11px'}}>✕</button>
          </div>
        ))}
        <span style={{color:'#94a3b8',fontSize:'12px'}}>⊕</span>
        <button onClick={() => toast.success('Add filter clicked')} style={{background:'none',border:'none',color:'#005cca',fontSize:'12.5px',fontWeight:600,display:'flex',alignItems:'center',gap:'4px',cursor:'pointer'}}><FiPlus size={13}/> Add filter</button>
      </div>
    </div>
    <div style={{background:'#fffbeb',border:'1px solid #fde68a',borderRadius:'4px',padding:'10px 14px',marginBottom:'20px'}}>
      <div style={{display:'flex',alignItems:'center',gap:'7px',fontSize:'12.5px',fontWeight:600,color:'#92400e'}}><FiAlertTriangle size={13}/> This dashboard contains sample data</div>
      <div style={{fontSize:'12px',color:'#78350f',marginTop:'3px'}}>The data displayed may contain sample data. Go <a href="/dashboard?loadsample=true" style={{color:'#005cca',fontWeight:600,textDecoration:'none'}}>here</a> to configure the sample data.</div>
    </div>
  </>
);

const Gcp: React.FC = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'dashboard'|'events'>('dashboard');
  const [filters, setFilters] = useState([{label:'cluster.name: wazuh'},{label:'rule.groups: gcp'}]);
  const [gcpSearch, setGcpSearch] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 15;
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const filteredEvents = events.filter(e => !gcpSearch || e.agent.toLowerCase().includes(gcpSearch.toLowerCase()) || e.location.toLowerCase().includes(gcpSearch.toLowerCase()) || e.project.toLowerCase().includes(gcpSearch.toLowerCase()) || e.resType.toLowerCase().includes(gcpSearch.toLowerCase()) || e.severity.toLowerCase().includes(gcpSearch.toLowerCase()));
  const totalPages = Math.ceil(filteredEvents.length / perPage);
  const paged = filteredEvents.slice((page-1)*perPage, page*perPage);

  const authData = {
    labels: allT,
    datasets: [
      {label:'false', data: Array.from({length:n},(_,i)=>i<6?[0,2,4,8,13,11,10,7,2][Math.min(i,8)]:0), borderColor:'#2dd4bf', backgroundColor:'#2dd4bf44', fill:true, tension:0.4, pointRadius:0, borderWidth:1.5},
      {label:'true',  data: Array.from({length:n},(_,i)=>i<6?[0,1,2,4,6,5,4,3,1][Math.min(i,8)]:0),  borderColor:'#67e8f9', backgroundColor:'#67e8f944', fill:true, tension:0.4, pointRadius:0, borderWidth:1.5},
    ]
  };
  const authOpts = {responsive:true,maintainAspectRatio:false,plugins:{legend:{display:true,position:'right' as const,labels:{boxWidth:10,font:{size:11}}}},scales:{x:{grid:{color:'rgba(0,0,0,0.04)'},ticks:{font:{size:10},color:'#64748b',maxTicksLimit:9,maxRotation:0},title:{display:true,text:'timestamp per 30 minutes',font:{size:10},color:'#64748b'}},y:{min:0,max:15,ticks:{stepSize:5,font:{size:10},color:'#64748b'},grid:{color:'rgba(0,0,0,0.04)'},title:{display:true,text:'Count',font:{size:10},color:'#64748b'}}}};

  const respColors = ['#f472b6','#f59e0b','#a78bfa','#34d399','#60a5fa','#fb923c','#e879f9','#4ade80','#38bdf8','#fbbf24'];
  const respData = {labels:['200','400','403','404','500','503','302','301','401','204'],datasets:[{data:[22,18,15,12,10,8,6,4,3,2],backgroundColor:respColors,borderWidth:0}]};

  const projData = {
    labels:['wazuh-prod','wazuh-dev','wazuh-test'],
    datasets:[
      {label:'app_script_function',data:[8,7,3],backgroundColor:'#f87171',borderRadius:2,barPercentage:0.7},
      {label:'dns_query',          data:[6,6,5],backgroundColor:'#ef4444',borderRadius:2,barPercentage:0.7},
      {label:'generic_task',       data:[7,8,9],backgroundColor:'#2dd4bf',borderRadius:2,barPercentage:0.7},
    ]
  };
  const projOpts = {responsive:true,maintainAspectRatio:false,plugins:{legend:{display:true,position:'right' as const,labels:{boxWidth:10,font:{size:11}}}},scales:{x:{grid:{display:false},ticks:{font:{size:10},color:'#64748b'},title:{display:true,text:'Project ID',font:{size:10},color:'#64748b'}},y:{min:0,max:10,ticks:{stepSize:2,font:{size:10},color:'#64748b'},grid:{color:'rgba(0,0,0,0.04)'},title:{display:true,text:'Count',font:{size:10},color:'#64748b'}}}};

  const srcColors = ['#60a5fa','#34d399','#f472b6','#a78bfa','#fbbf24','#f87171','#38bdf8','#4ade80','#e879f9','#fb923c'];
  const srcData = {labels:['us-east1','us-west1','asia-east1','us-east3','us-central1','wazuh-prod','wazuh-dev','wazuh-test','internet','other'],datasets:[{data:[20,18,15,12,10,8,7,5,3,2],backgroundColor:srcColors,borderWidth:0}]};

  const geoDots = [
    {x:28,y:44,c:'#facc15',s:9},{x:36,y:62,c:'#f59e0b',s:10},{x:51,y:36,c:'#ef4444',s:14},
    {x:52,y:35,c:'#dc2626',s:11},{x:54,y:37,c:'#f59e0b',s:8},{x:54,y:38,c:'#facc15',s:8},
    {x:72,y:33,c:'#ef4444',s:10},{x:80,y:34,c:'#facc15',s:8},{x:88,y:52,c:'#facc15',s:8},
  ];

  const histData = {labels:allT,datasets:[{data:Array.from({length:n},(_,i)=>i<8?[3,6,12,14,11,12,7,4][i]:0),backgroundColor:'#22c55e',borderRadius:2,barPercentage:0.8}]};
  const histOpts = {responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{grid:{display:false},ticks:{font:{size:10},color:'#64748b',maxTicksLimit:9,maxRotation:0},title:{display:true,text:'timestamp per 30 minutes',font:{size:10},color:'#64748b'}},y:{min:0,max:15,ticks:{stepSize:5,font:{size:10},color:'#64748b'},grid:{color:'rgba(0,0,0,0.04)'},title:{display:true,text:'Count',font:{size:10},color:'#64748b'}}}};

  const sevColor: Record<string,string> = {INFO:'#64748b',ALERT:'#f59e0b',EMERGENCY:'#cc0000',CRITICAL:'#cc0000',ERROR:'#ea580c',NOTICE:'#005cca'};

  return (
    <div className="wz-page" style={{background:'#f8fafc'}}>
      <div className="wz-page-content" style={{display:'flex',flexDirection:'column'}}>
        <SharedHeader tab={tab} setTab={setTab} filters={filters} remove={i => setFilters(f=>f.filter((_,idx)=>idx!==i))} search={gcpSearch} onSearchChange={setGcpSearch}/>

        {tab === 'dashboard' ? (
          <div style={{display:'flex',flexDirection:'column',gap:'20px'}}>
            {/* Events over time by auth answer */}
            <div style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:'6px',padding:'16px'}}>
              <div style={{fontSize:'13px',fontWeight:600,color:'#1e293b',marginBottom:'12px'}}>Events over time by auth answer</div>
              <div style={{height:'200px'}}><Line data={authData} options={authOpts as any}/></div>
            </div>
            {/* 3-col row */}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'16px'}}>
              <div style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:'6px',padding:'16px'}}>
                <div style={{fontSize:'13px',fontWeight:600,color:'#1e293b',marginBottom:'10px'}}>Top instances by response code</div>
                <div style={{height:'180px'}}><Doughnut data={respData} options={{responsive:true,maintainAspectRatio:false,cutout:'55%',plugins:{legend:{display:true,position:'right',labels:{boxWidth:10,font:{size:10}}}}} as any}/></div>
              </div>
              <div style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:'6px',padding:'16px'}}>
                <div style={{fontSize:'13px',fontWeight:600,color:'#1e293b',marginBottom:'10px'}}>Resource type by project id</div>
                <div style={{height:'180px'}}><Bar data={projData} options={projOpts as any}/></div>
              </div>
              <div style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:'6px',padding:'16px'}}>
                <div style={{fontSize:'13px',fontWeight:600,color:'#1e293b',marginBottom:'10px'}}>Top project id by sourcetype</div>
                <div style={{height:'180px'}}><Doughnut data={srcData} options={{responsive:true,maintainAspectRatio:false,cutout:'45%',plugins:{legend:{display:true,position:'right',labels:{boxWidth:10,font:{size:10}}}}} as any}/></div>
              </div>
            </div>
            {/* Geo map */}
            <div style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:'6px',padding:'16px'}}>
              <div style={{fontSize:'13px',fontWeight:600,color:'#1e293b',marginBottom:'12px'}}>Top 5 Map by source ip</div>
              <div style={{position:'relative',height:'320px',background:'#a8c8e0',borderRadius:'4px',overflow:'hidden'}}>
                <svg viewBox="0 0 1000 500" style={{position:'absolute',inset:0,width:'100%',height:'100%'}} preserveAspectRatio="xMidYMid slice">
                  <rect width="1000" height="500" fill="#a8c8e0"/>
                  <path d="M 80 80 L 220 80 L 240 120 L 220 180 L 180 220 L 150 250 L 120 240 L 100 200 L 70 160 L 60 120 Z" fill="#e8dcc8"/>
                  <path d="M 160 270 L 200 260 L 220 300 L 230 370 L 210 430 L 180 440 L 160 420 L 145 380 L 140 320 Z" fill="#e8dcc8"/>
                  <path d="M 420 70 L 490 65 L 510 90 L 500 130 L 470 140 L 445 130 L 430 110 Z" fill="#e8dcc8"/>
                  <path d="M 440 150 L 510 140 L 530 170 L 540 240 L 520 310 L 490 360 L 460 370 L 440 340 L 420 270 L 415 200 Z" fill="#e8dcc8"/>
                  <path d="M 510 110 L 580 105 L 600 130 L 590 160 L 560 170 L 525 165 L 510 140 Z" fill="#e8dcc8"/>
                  <path d="M 580 60 L 780 55 L 820 100 L 810 160 L 770 180 L 720 190 L 670 185 L 620 175 L 590 150 L 575 110 Z" fill="#e8dcc8"/>
                  <path d="M 640 170 L 680 165 L 700 200 L 690 240 L 665 260 L 645 240 L 630 200 Z" fill="#e8dcc8"/>
                  <path d="M 730 175 L 780 170 L 800 200 L 790 230 L 760 240 L 735 225 Z" fill="#e8dcc8"/>
                  <path d="M 750 290 L 860 285 L 880 330 L 860 380 L 820 390 L 770 380 L 745 345 Z" fill="#e8dcc8"/>
                </svg>
                {geoDots.map((d,i) => (
                  <div key={i} style={{position:'absolute',left:`${d.x}%`,top:`${d.y}%`,width:`${d.s}px`,height:`${d.s}px`,background:d.c,borderRadius:'50%',transform:'translate(-50%,-50%)',border:'1.5px solid rgba(255,255,255,0.6)',boxShadow:'0 1px 3px rgba(0,0,0,0.3)',zIndex:2}}/>
                ))}
                <div style={{position:'absolute',left:'12px',top:'12px',display:'flex',flexDirection:'column',gap:'2px',zIndex:3}}>
                  {[FiPlus,FiMinus,FiLayers,FiMapPin,FiSquare].map((Icon,i) => (
                    <button key={i} style={{width:'28px',height:'28px',background:'#fff',border:'1px solid #cbd5e1',borderRadius:'3px',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'#475569'}}><Icon size={13}/></button>
                  ))}
                </div>
                <div style={{position:'absolute',bottom:'12px',right:'12px',background:'rgba(255,255,255,0.92)',border:'1px solid #e2e8f0',borderRadius:'4px',padding:'8px 12px',fontSize:'11px',zIndex:3}}>
                  <div style={{fontWeight:600,color:'#1e293b',marginBottom:'6px'}}>Count</div>
                  {[{c:'#facc15',l:'3 – 5'},{c:'#f59e0b',l:'5 – 7'},{c:'#ef4444',l:'7 – 9'},{c:'#dc2626',l:'9 – 11'}].map(item=>(
                    <div key={item.l} style={{display:'flex',alignItems:'center',gap:'6px',marginBottom:'3px'}}>
                      <span style={{width:'10px',height:'10px',borderRadius:'50%',background:item.c,display:'inline-block'}}/>
                      <span style={{color:'#475569'}}>{item.l}</span>
                    </div>
                  ))}
                </div>
                <div style={{position:'absolute',bottom:'4px',left:'50%',transform:'translateX(-50%)',fontSize:'10px',color:'rgba(0,0,0,0.5)',zIndex:3}}>Map data © OpenStreetMap contributors</div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{display:'flex',flexDirection:'column',gap:'0'}}>
            {/* Histogram */}
            <div style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:'6px',padding:'16px',marginBottom:'16px'}}>
              <div style={{height:'140px'}}><Bar data={histData} options={histOpts as any}/></div>
            </div>
            {/* Hits + toolbar */}
            <div style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:'6px 6px 0 0',padding:'10px 16px',textAlign:'center',fontSize:'13.5px',fontWeight:600,color:'#1e293b'}}>58 hits</div>
            <div style={{background:'#fff',border:'1px solid #e2e8f0',borderTop:'none',padding:'4px 16px',textAlign:'center',fontSize:'11.5px',color:'#64748b'}}>Jun 13, 2026 @ 13:40:37.493 – Jun 14, 2026 @ 13:40:37.493</div>
            <div style={{background:'#fff',border:'1px solid #e2e8f0',borderTop:'none',padding:'8px 16px',display:'flex',alignItems:'center',gap:'18px',fontSize:'12.5px',color:'#475569'}}>
              <button onClick={() => toast.success('Data exported')} style={{background:'none',border:'none',color:'#005cca',fontWeight:600,cursor:'pointer',fontSize:'12.5px',display:'flex',alignItems:'center',gap:'4px'}}>⬆ Export Formatted</button>
              <button onClick={() => toast.success('View reset')} style={{background:'none',border:'none',color:'#64748b',cursor:'pointer',fontSize:'12.5px'}}>↺ Reset view</button>
              <span>⊛ 898 available fields ⓘ</span>
              <span style={{cursor:'pointer'}}>≡ Columns</span>
              <span style={{cursor:'pointer'}}>≣ Density</span>
              <span style={{cursor:'pointer'}}>↕ 1 fields sorted</span>
              <span style={{cursor:'pointer'}}>⛶ Full screen</span>
            </div>
            {/* Table */}
            <div style={{overflowX:'auto',background:'#fff',border:'1px solid #e2e8f0',borderTop:'none'}}>
              <table style={{width:'100%',borderCollapse:'collapse',fontSize:'12.5px'}}>
                <thead>
                  <tr style={{background:'#f8fafc',borderBottom:'2px solid #e2e8f0'}}>
                    <th style={{width:'32px',padding:'9px 8px'}}></th>
                    {['↓ timestamp','agent.name','data.gcp...','data.gcp.resource.labels.location','data.gcp.resource.labels.project_id','data.gcp.resource.type','data.gcp.seve...'].map(c=>(
                      <th key={c} style={{padding:'9px 12px',textAlign:'left',color:'#475569',fontWeight:600,whiteSpace:'nowrap'}}>{c} <FiChevronDown size={10} style={{verticalAlign:'middle',color:'#94a3b8'}}/></th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paged.map((row,i)=>(
                    <tr key={i} onClick={() => setSelectedEvent(row)} style={{borderBottom:'1px solid #f1f5f9',background:i%2===0?'#fff':'#fafafa',cursor:'pointer'}}>
                      <td style={{padding:'7px 8px',textAlign:'center',color:'#94a3b8',fontSize:'12px'}}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                      </td>
                      <td style={{padding:'7px 12px',color:'#334155',whiteSpace:'nowrap'}}>{row.ts}</td>
                      <td style={{padding:'7px 12px',color:'#005cca',fontWeight:600,cursor:'pointer'}} onClick={(e) => { e.stopPropagation(); navigate(`/agents/detail?agent=${row.agent}`); }}>{row.agent}</td>
                      <td style={{padding:'7px 12px',color:'#64748b'}}>{row.accountId}</td>
                      <td style={{padding:'7px 12px',color:'#64748b'}}>{row.location}</td>
                      <td style={{padding:'7px 12px',color:'#64748b'}}>{row.project}</td>
                      <td style={{padding:'7px 12px',color:'#64748b'}}>{row.resType}</td>
                      <td style={{padding:'7px 12px',fontWeight:600,color:sevColor[row.severity]||'#475569'}}>{row.severity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', fontSize: '12px', color: '#64748b', background: '#fff', border: '1px solid #e2e8f0', borderTop: 'none', borderRadius: '0 0 6px 6px' }}>
              <span>Rows per page: {perPage}</span>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))} style={{ border: 'none', background: 'none', cursor: page <= 1 ? 'not-allowed' : 'pointer', color: page <= 1 ? '#cbd5e1' : '#475569' }}>&lt;</button>
                <span style={{ fontWeight: 600, color: '#005cca' }}>{page}</span>
                <span style={{ color: '#94a3b8' }}>of {totalPages}</span>
                <button disabled={page >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))} style={{ border: 'none', background: 'none', cursor: page >= totalPages ? 'not-allowed' : 'pointer', color: page >= totalPages ? '#cbd5e1' : '#475569' }}>&gt;</button>
              </div>
            </div>
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

export default Gcp;
