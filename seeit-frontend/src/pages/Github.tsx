import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { FiSearch, FiChevronDown, FiPlus, FiRefreshCw, FiDownload, FiAlertTriangle, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler);

/* ── mock data ── */
const orgs = ['Organization10','Organization9','Organization1','Organization2','Organization5'];
const orgColors = ['#22c55e','#6366f1','#ef4444','#a78bfa','#f472b6'];
const actors = [{n:'User4',c:10},{n:'User5',c:8},{n:'User10',c:7},{n:'User6',c:5},{n:'User8',c:5}];
const orgCounts = [{n:'Organization10',c:8},{n:'Organization9',c:8},{n:'Organization1',c:6},{n:'Organization2',c:5},{n:'Organization5',c:5}];
const repos = [{n:'Organization3/Repo5',c:2},{n:'Organization1/Repo10',c:1},{n:'Organization1/Repo2',c:1},{n:'Organization1/Repo3',c:1},{n:'Organization10/Repo2',c:1}];
const actions = [{n:'git.clone',c:8},{n:'team.add_member',c:7},{n:'org.update_member_repository_creation_permission',c:4},{n:'repo.create',c:4},{n:'org.audit_log_export',c:3}];

const actionLabels = ['team.add_member','git.clone','members_can_create_...','git.push','hook.create','org.audit_log_export','repo.create','private_repository_fort'];
const actionColors = ['#22c55e','#6366f1','#ef4444','#a78bfa','#f472b6','#3b82f6','#8b5cf6','#f59e0b','#fb923c','#e879f9','#60a5fa','#fbbf24'];

const userLabels = ['User10','User4','User3','User9','User5','User6','User2','User8','User1','User7'];
const userColors = ['#22c55e','#60a5fa','#f87171','#fbbf24','#a78bfa','#f472b6','#38bdf8','#fb923c','#e879f9','#34d399'];

const allT = Array.from({length:43}, (_,i) => { const h = 15 + Math.floor(i/2); return `${String(h%24).padStart(2,'0')}:${i%2===0?'00':'30'}`; });

const ghEvents = Array.from({length:51}, (_, i) => ({
  ts: `Jun 13, 2026 @ ${String(16 - Math.floor(i/3)).padStart(2,'0')}:${String(Math.floor(Math.random()*60)).padStart(2,'0')}:${String(Math.floor(Math.random()*60)).padStart(2,'0')}.${String(Math.floor(Math.random()*999)).padStart(3,'0')}`,
  agentId: ['005','001','003','002','004'][i%5],
  repo: [`Organization${(i%5)+1}/Repo${(i%10)+1}`, '-'][i%3===1?1:0],
  actor: userLabels[i%10],
  org: orgs[i%5],
  desc: ['GitHub Git clone.','GitHub Generic rule.','GitHub Team add member.','GitHub Repository created.','GitHub Audit log export.'][i%5],
  level: [3,3,5,7,3][i%5],
  ruleId: [91158,91449,91160,91163,91170][i%5],
}));

/* ── shared header builder ── */
const Header: React.FC<{tab:string, setTab:(t:any)=>void, filters:{label:string}[], remove:(i:number)=>void, isPanel?:boolean, search:string, onSearchChange:(v:string)=>void}> = ({tab, setTab, filters, remove, isPanel, search, onSearchChange}) => (
  <>
    <div style={{display:'flex',borderBottom:'1px solid #e2e8f0',background:'#fff',padding:'0 24px',marginLeft:'-24px',marginRight:'-24px',marginTop:'-24px',justifyContent:'space-between',alignItems:'center'}}>
      <div style={{display:'flex'}}>
        {(['dashboard','panel','events'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{background:'none',border:'none',borderBottom:tab===t?'2.5px solid #005cca':'2.5px solid transparent',color:tab===t?'#005cca':'#475569',fontWeight:tab===t?600:500,fontSize:'13.5px',padding:'14px 16px 12px',cursor:'pointer',textTransform:'capitalize'}}>{t.charAt(0).toUpperCase()+t.slice(1)}</button>
        ))}
      </div>
      <div style={{display:'flex',gap:'12px',paddingRight:'8px'}}>
        <button onClick={() => toast.success('Agent exploration started')} style={{background:'none',border:'none',color:'#005cca',fontSize:'13px',fontWeight:600,display:'flex',alignItems:'center',gap:'5px',cursor:'pointer'}}>◉ Explore agent</button>
        {!isPanel && <button onClick={() => toast.success('Report generated')} style={{background:'none',border:'none',color:'#005cca',fontSize:'13px',fontWeight:600,display:'flex',alignItems:'center',gap:'5px',cursor:'pointer'}}><FiDownload size={13}/> Generate report</button>}
      </div>
    </div>

    {/* Search row — different for panel vs dashboard/events */}
    {isPanel ? (
      <div style={{display:'flex',flexDirection:'column',gap:'10px',margin:'16px 0'}}>
        <div style={{display:'flex',gap:'10px',alignItems:'center',flexWrap:'wrap'}}>
          {['Actor  0','Organization  0','Repository  0','Action  0'].map(l => (
            <div key={l} style={{display:'flex',alignItems:'center',gap:'6px',border:'1px solid #cbd5e1',borderRadius:'4px',padding:'7px 12px',background:'#fff',fontSize:'13px',color:'#334155',cursor:'pointer'}}>{l}<FiChevronDown size={12}/></div>
          ))}
          <div style={{display:'flex',alignItems:'center',gap:'6px',border:'1px solid #cbd5e1',borderRadius:'4px',padding:'7px 12px',background:'#fff',fontSize:'13px',color:'#334155'}}>Last 24 hours<FiChevronDown size={12}/></div>
          <button onClick={() => toast.success('Date picker opened')} style={{background:'none',border:'none',color:'#005cca',fontSize:'13px',fontWeight:600,cursor:'pointer'}}>Show dates</button>
          <button onClick={() => toast.success('Data refreshed')} style={{background:'#fff',border:'1px solid #cbd5e1',borderRadius:'4px',padding:'7px 14px',fontSize:'13px',fontWeight:600,display:'flex',alignItems:'center',gap:'6px',cursor:'pointer',color:'#334155'}}><FiRefreshCw size={13}/> Refresh</button>
        </div>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div style={{display:'flex',flexWrap:'wrap',gap:'6px',alignItems:'center'}}>
            {filters.map((f,i) => (
              <div key={i} style={{display:'flex',alignItems:'center',gap:'5px',border:'1px solid #cbd5e1',borderRadius:'4px',padding:'3px 8px',background:'#fff',fontSize:'12px',color:'#334155'}}>{f.label}<button onClick={()=>remove(i)} style={{background:'none',border:'none',color:'#94a3b8',cursor:'pointer',fontSize:'11px'}}>✕</button></div>
            ))}
            <button onClick={() => toast.success('Add filter clicked')} style={{background:'none',border:'none',color:'#005cca',fontSize:'12.5px',fontWeight:600,display:'flex',alignItems:'center',gap:'4px',cursor:'pointer'}}><FiPlus size={13}/> Add filter</button>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:'8px',fontSize:'13px',color:'#475569'}}>
            <span>✕</span><span>Advanced filters</span>
          </div>
        </div>
      </div>
    ) : (
      <div style={{display:'flex',flexDirection:'column',gap:'10px',margin:'16px 0'}}>
        <div style={{display:'flex',gap:'10px',alignItems:'center'}}>
          <div style={{flex:1,position:'relative'}}>
            <span style={{position:'absolute',left:'10px',top:'50%',transform:'translateY(-50%)',color:'#94a3b8'}}><FiSearch size={14}/></span>
            <input placeholder="Search" value={search} onChange={e=>onSearchChange(e.target.value)} style={{width:'100%',padding:'7px 60px 7px 34px',border:'1px solid #cbd5e1',borderRadius:'4px',fontSize:'13px',background:'#fff',outline:'none'}}/>
            <span style={{position:'absolute',right:'12px',top:'50%',transform:'translateY(-50%)',fontSize:'12px',fontWeight:700,color:'#64748b'}}>DQL</span>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:'6px',border:'1px solid #cbd5e1',borderRadius:'4px',padding:'7px 12px',background:'#fff',fontSize:'13px',color:'#334155',cursor:'pointer'}}>Last 24 hours<FiChevronDown size={12}/></div>
          <button style={{background:'none',border:'none',color:'#005cca',fontSize:'13px',fontWeight:600,cursor:'pointer'}}>Show dates</button>
          <button onClick={() => toast.success('Data refreshed')} style={{background:'#fff',border:'1px solid #cbd5e1',borderRadius:'4px',padding:'7px 14px',fontSize:'13px',fontWeight:600,display:'flex',alignItems:'center',gap:'6px',cursor:'pointer',color:'#334155'}}><FiRefreshCw size={13}/> Refresh</button>
        </div>
        <div style={{display:'flex',flexWrap:'wrap',gap:'6px',alignItems:'center'}}>
          {filters.map((f,i) => (
            <div key={i} style={{display:'flex',alignItems:'center',gap:'5px',border:'1px solid #cbd5e1',borderRadius:'4px',padding:'3px 8px',background:'#fff',fontSize:'12px',color:'#334155'}}>{f.label}<button onClick={()=>remove(i)} style={{background:'none',border:'none',color:'#94a3b8',cursor:'pointer',fontSize:'11px'}}>✕</button></div>
          ))}
          <button onClick={() => toast.success('Add filter clicked')} style={{background:'none',border:'none',color:'#005cca',fontSize:'12.5px',fontWeight:600,display:'flex',alignItems:'center',gap:'4px',cursor:'pointer'}}><FiPlus size={13}/> Add filter</button>
        </div>
      </div>
    )}

    {/* Sample data banner */}
    <div style={{background:'#fffbeb',border:'1px solid #fde68a',borderRadius:'4px',padding:'10px 14px',marginBottom:'20px'}}>
      <div style={{display:'flex',alignItems:'center',gap:'7px',fontSize:'12.5px',fontWeight:600,color:'#92400e'}}><FiAlertTriangle size={13}/> This dashboard contains sample data</div>
      <div style={{fontSize:'12px',color:'#78350f',marginTop:'3px'}}>The data displayed may contain sample data. Go <a href="/dashboard?loadsample=true" style={{color:'#005cca',fontWeight:600,textDecoration:'none'}}>here</a> to configure the sample data.</div>
    </div>
  </>
);

/* ── Mini table component ── */
const MiniTable: React.FC<{title:string, col1:string, rows:{n:string,c:number}[], linkColor?:boolean}> = ({title, col1, rows, linkColor}) => (
  <div style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:'6px',padding:'20px'}}>
    <h3 style={{fontSize:'20px',fontWeight:400,color:'#1e293b',margin:'0 0 12px 0'}}>{title}</h3>
    <div style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid #e2e8f0',fontSize:'12.5px',fontWeight:600,color:'#475569'}}>
      <span>{col1}</span><span>Count ↓</span>
    </div>
    {rows.map(r => (
      <div key={r.n} style={{display:'flex',justifyContent:'space-between',padding:'9px 0',borderBottom:'1px solid #f1f5f9',fontSize:'13px'}}>
        <span style={{color:linkColor?'#005cca':'#334155',fontWeight:linkColor?500:400}}>{r.n}</span>
        <span style={{color:'#334155'}}>{r.c}</span>
      </div>
    ))}
    <div style={{display:'flex',justifyContent:'flex-end',gap:'4px',marginTop:'10px'}}>
      <span style={{color:'#cbd5e1',cursor:'not-allowed'}}>‹</span>
      <span style={{color:'#005cca',fontWeight:600}}>1</span>
      <span style={{color:'#cbd5e1',cursor:'not-allowed'}}>›</span>
    </div>
  </div>
);

const Github: React.FC = () => {
  const [tab, setTab] = useState<'dashboard'|'panel'|'events'>('dashboard');
  const [filters, setFilters] = useState([{label:'cluster.name: wazuh'},{label:'rule.groups: github'}]);
  const [githubSearch, setGithubSearch] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 15;
  const filteredGhEvents = ghEvents.filter(e => !githubSearch || e.actor.toLowerCase().includes(githubSearch.toLowerCase()) || e.org.toLowerCase().includes(githubSearch.toLowerCase()) || e.repo.toLowerCase().includes(githubSearch.toLowerCase()) || e.desc.toLowerCase().includes(githubSearch.toLowerCase()) || e.agentId.toLowerCase().includes(githubSearch.toLowerCase()));
  const totalPages = Math.ceil(filteredGhEvents.length/perPage);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const evoData = {labels:allT, datasets: orgs.map((o,i) => ({label:o, data:Array.from({length:43},(_,j)=>j<6?[1+Math.random()*3, 0.5+Math.random()*2, 0.3+Math.random()*1.5, 0.2+Math.random(), 0.1+Math.random()*0.8][i]*[1,1.2,0.8,1.1,0.9,0.7][j]:0), borderColor:orgColors[i], backgroundColor:orgColors[i]+'44', fill:false, tension:0.3, pointRadius:0, borderWidth:1.5}))};
  const evoOpts = {responsive:true,maintainAspectRatio:false,plugins:{legend:{display:true,position:'right' as const,labels:{boxWidth:10,font:{size:11}}}},scales:{x:{grid:{color:'rgba(0,0,0,0.04)'},ticks:{font:{size:10},color:'#64748b',maxTicksLimit:9,maxRotation:0},title:{display:true,text:'timestamp per 30 minutes',font:{size:10},color:'#64748b'}},y:{min:0,max:4,ticks:{stepSize:1,font:{size:10},color:'#64748b'},grid:{color:'rgba(0,0,0,0.04)'},title:{display:true,text:'Count',font:{size:10},color:'#64748b'}}}};

  const org5Data = {labels:orgs, datasets:[{data:[32,28,15,13,12], backgroundColor:orgColors, borderWidth:0}]};
  const actionDonutData = {labels:[...orgs,...actionLabels], datasets:[{data:[16,14,10,8,7,6,5,4,3,3,2,2,1], backgroundColor:[...orgColors,'#3b82f6','#8b5cf6','#f59e0b','#fb923c','#e879f9','#60a5fa','#fbbf24','#dc2626'], borderWidth:0}]};

  const userBarData = {
    labels:orgs.map(o=>o.replace('Organization','')),
    datasets:userLabels.map((u,i)=>({label:u, data:orgs.map(()=>Math.floor(Math.random()*3)), backgroundColor:userColors[i], borderRadius:1, barPercentage:0.7}))
  };
  const userBarOpts = {responsive:true,maintainAspectRatio:false,plugins:{legend:{display:true,position:'right' as const,labels:{boxWidth:10,font:{size:10}}}},scales:{x:{stacked:true,grid:{display:false},ticks:{font:{size:10},color:'#64748b',maxRotation:45},title:{display:true,text:'data.github.org: Descending',font:{size:10},color:'#64748b'}},y:{stacked:true,min:0,max:8,ticks:{stepSize:2,font:{size:10},color:'#64748b'},grid:{color:'rgba(0,0,0,0.04)'},title:{display:true,text:'Count',font:{size:10},color:'#64748b'}}}};

  const histData = {labels:allT, datasets:[{data:Array.from({length:43},(_,i)=>i<8?[6,8,10,12,13,11,9,4][i]:0), backgroundColor:'#22c55e', borderRadius:2, barPercentage:0.8}]};
  const histOpts = {responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{grid:{display:false},ticks:{font:{size:10},color:'#64748b',maxTicksLimit:9,maxRotation:0},title:{display:true,text:'timestamp per 30 minutes',font:{size:10},color:'#64748b'}},y:{min:0,max:15,ticks:{stepSize:5,font:{size:10},color:'#64748b'},grid:{color:'rgba(0,0,0,0.04)'},title:{display:true,text:'Count',font:{size:10},color:'#64748b'}}}};

  const paged = filteredGhEvents.slice((page-1)*perPage, page*perPage);
  const remove = (i:number) => setFilters(f=>f.filter((_,idx)=>idx!==i));

  return (
    <div className="wz-page" style={{background:'#f8fafc'}}>
      <div className="wz-page-content" style={{display:'flex',flexDirection:'column'}}>
        <Header tab={tab} setTab={setTab} filters={filters} remove={remove} isPanel={tab==='panel'} search={githubSearch} onSearchChange={setGithubSearch}/>

        {/* ── DASHBOARD ── */}
        {tab === 'dashboard' && (
          <div style={{display:'flex',flexDirection:'column',gap:'20px'}}>
            {/* Stat boxes */}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'1px',background:'#e2e8f0',border:'1px solid #e2e8f0',borderRadius:'6px',overflow:'hidden'}}>
              {[{l:'Organizations',v:10,c:'#005cca'},{l:'Repositories',v:16,c:'#005cca'},{l:'Actors',v:10,c:'#cc0000'}].map(s=>(
                <div key={s.l} style={{background:'#fff',padding:'28px 16px',textAlign:'center'}}>
                  <div style={{fontSize:'42px',fontWeight:700,color:s.c,lineHeight:1.1}}>{s.v}</div>
                  <div style={{fontSize:'12px',color:'#475569',marginTop:'8px',fontWeight:500}}>{s.l}</div>
                </div>
              ))}
            </div>
            {/* Row: evolution + org donut */}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>
              <div style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:'6px',padding:'16px'}}>
                <div style={{fontSize:'13px',fontWeight:600,color:'#1e293b',marginBottom:'10px'}}>Alerts evolution by organization</div>
                <div style={{height:'200px'}}><Line data={evoData} options={evoOpts as any}/></div>
              </div>
              <div style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:'6px',padding:'16px'}}>
                <div style={{fontSize:'13px',fontWeight:600,color:'#1e293b',marginBottom:'10px'}}>Top 5 organizations by alerts</div>
                <div style={{height:'200px'}}><Doughnut data={org5Data} options={{responsive:true,maintainAspectRatio:false,cutout:'60%',plugins:{legend:{display:true,position:'right',labels:{boxWidth:10,font:{size:11}}}}} as any}/></div>
              </div>
            </div>
            {/* Row: action donut + users stacked bar */}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>
              <div style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:'6px',padding:'16px'}}>
                <div style={{fontSize:'13px',fontWeight:600,color:'#1e293b',marginBottom:'10px'}}>Top alerts by action type and organization</div>
                <div style={{height:'220px'}}><Doughnut data={actionDonutData} options={{responsive:true,maintainAspectRatio:false,cutout:'45%',plugins:{legend:{display:true,position:'right',labels:{boxWidth:10,font:{size:10}}}}} as any}/></div>
              </div>
              <div style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:'6px',padding:'16px'}}>
                <div style={{fontSize:'13px',fontWeight:600,color:'#1e293b',marginBottom:'10px'}}>Users with more alerts</div>
                <div style={{height:'220px'}}><Bar data={userBarData} options={userBarOpts as any}/></div>
              </div>
            </div>
          </div>
        )}

        {/* ── PANEL ── */}
        {tab === 'panel' && (
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px'}}>
            <MiniTable title="Actors" col1="Actor" rows={actors} />
            <MiniTable title="Organizations" col1="Organization" rows={orgCounts} linkColor />
            <MiniTable title="Repositories" col1="Repository" rows={repos} />
            <MiniTable title="Actions" col1="Action" rows={actions} linkColor />
          </div>
        )}

        {/* ── EVENTS ── */}
        {tab === 'events' && (
          <div style={{display:'flex',flexDirection:'column',gap:'0'}}>
            <div style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:'6px',padding:'16px',marginBottom:'16px'}}>
              <div style={{height:'140px'}}><Bar data={histData} options={histOpts as any}/></div>
            </div>
            <div style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:'6px 6px 0 0',padding:'10px 16px',textAlign:'center',fontSize:'13.5px',fontWeight:600,color:'#1e293b'}}>51 hits</div>
            <div style={{background:'#fff',border:'1px solid #e2e8f0',borderTop:'none',padding:'4px 16px',textAlign:'center',fontSize:'11.5px',color:'#64748b'}}>Jun 13, 2026 @ 13:49:13.813 – Jun 14, 2026 @ 13:49:13.813</div>
            <div style={{background:'#fff',border:'1px solid #e2e8f0',borderTop:'none',padding:'8px 16px',display:'flex',alignItems:'center',gap:'18px',fontSize:'12.5px',color:'#475569'}}>
              <span onClick={() => toast.success('Data exported')} style={{color:'#005cca',fontWeight:600}}>⬆ Export Formatted</span>
              <span onClick={() => toast.success('View reset')} style={{color:'#64748b'}}>↺ Reset view</span>
              <span>⊛ 898 available fields ⓘ</span>
              <span>≡ Columns</span><span>≣ Density</span><span>↕ 1 fields sorted</span><span>⛶ Full screen</span>
            </div>
            <div style={{overflowX:'auto',background:'#fff',border:'1px solid #e2e8f0',borderTop:'none'}}>
              <table style={{width:'100%',borderCollapse:'collapse',fontSize:'12.5px'}}>
                <thead>
                  <tr style={{background:'#f8fafc',borderBottom:'2px solid #e2e8f0'}}>
                    <th style={{width:'32px',padding:'9px 8px'}}></th>
                    {['↓ timestamp','agent.id','data.github.repo','data.github.actor','data.github.org','rule.description','rule.level','rule.id'].map(c=>(
                      <th key={c} style={{padding:'9px 12px',textAlign:'left',color:'#475569',fontWeight:600,whiteSpace:'nowrap'}}>{c} <FiChevronDown size={10} style={{verticalAlign:'middle',color:'#94a3b8'}}/></th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paged.map((r,i)=>(
                    <tr key={i} onClick={() => setSelectedEvent(r)} style={{borderBottom:'1px solid #f1f5f9',background:i%2===0?'#fff':'#fafafa',cursor:'pointer'}}>
                      <td style={{padding:'7px 8px',textAlign:'center',color:'#94a3b8'}}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></td>
                      <td style={{padding:'7px 12px',color:'#334155',whiteSpace:'nowrap'}}>{r.ts}</td>
                      <td style={{padding:'7px 12px',color:'#005cca',fontWeight:600}}>{r.agentId}</td>
                      <td style={{padding:'7px 12px',color:'#334155'}}>{r.repo}</td>
                      <td style={{padding:'7px 12px',color:'#334155'}}>{r.actor}</td>
                      <td style={{padding:'7px 12px',color:'#334155'}}>{r.org}</td>
                      <td style={{padding:'7px 12px',color:'#64748b'}}>{r.desc}</td>
                      <td style={{padding:'7px 12px',color:'#334155'}}>{r.level}</td>
                      <td style={{padding:'7px 12px',color:'#005cca',fontWeight:600}}>{r.ruleId}</td>
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

export default Github;
