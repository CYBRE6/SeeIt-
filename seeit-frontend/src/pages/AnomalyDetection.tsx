import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useSearchParams } from 'react-router-dom';
import { FiExternalLink, FiSearch, FiChevronDown, FiPlus, FiFilter } from 'react-icons/fi';

const AnomalyDetection: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeSub = searchParams.get('view') || 'get-started';
  
  const [isCreating, setIsCreating] = useState(false);
  const [createStep, setCreateStep] = useState(1);
  const [detectorName, setDetectorName] = useState('');
  const [detectors, setDetectors] = useState<Array<{name: string, created: string, status: string}>>(() => {
    try { return JSON.parse(localStorage.getItem('wz_anomaly_detectors') || '[]'); } catch { return []; }
  });
  const [activeDetector, setActiveDetector] = useState<string | null>(null);
  const [detectorTab, setDetectorTab] = useState<'real-time' | 'historical' | 'config'>('real-time');
  const [detectorSubTab, setDetectorSubTab] = useState<'feature' | 'occurrences'>('feature');
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const setView = (view: string) => {
    setSearchParams({ view });
  };

  if (isCreating) {
    return (
      <div className="wz-page" style={{ background: '#f8fafc', paddingBottom: '80px', display: 'flex', flexDirection: 'column' }}>
        
        {/* Breadcrumb-style tabs */}
        <div style={{ display: 'flex', padding: '16px 24px', background: '#ffffff', borderBottom: '1px solid #e2e8f0', gap: '8px', zIndex: 10 }}>
          <div style={{ padding: '4px 12px', background: '#e2e8f0', borderRadius: '16px', fontSize: '13px', color: '#475569', cursor: 'pointer' }} onClick={() => setIsCreating(false)}>Anomaly detect...</div>
          <div style={{ padding: '4px 12px', background: '#e2e8f0', borderRadius: '16px', fontSize: '13px', color: '#475569', cursor: 'pointer' }} onClick={() => setIsCreating(false)}>Detectors</div>
          <div style={{ padding: '4px 12px', background: '#dbeafe', borderRadius: '16px', fontSize: '13px', color: '#1e3a8a', fontWeight: 600 }}>Create detector</div>
        </div>

        <div style={{ display: 'flex', flex: 1 }}>
          {/* Create Flow Sidebar */}
          <div style={{ 
            width: '240px', 
            borderRight: '1px solid #e2e8f0', 
            background: '#ffffff', 
            padding: '32px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '32px'
          }}>
            {[
              { num: 1, label: 'Define detector' },
              { num: 2, label: 'Configure model' },
              { num: 3, label: 'Set up detector jobs' },
              { num: 4, label: 'Review and create' }
            ].map(step => (
              <div key={step.num} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setCreateStep(step.num)}>
                <div style={{ 
                  width: '24px', height: '24px', borderRadius: '50%', 
                  background: createStep === step.num ? '#005cca' : '#f1f5f9',
                  color: createStep === step.num ? '#ffffff' : '#94a3b8',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 600
                }}>
                  {step.num}
                </div>
                <span style={{ fontSize: '14px', fontWeight: createStep === step.num ? 600 : 500, color: createStep === step.num ? '#1e293b' : '#64748b' }}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>

          {/* Create Flow Content Area */}
          <div style={{ flex: 1, padding: '32px 48px', overflowY: 'auto' }}>
            
            {createStep === 1 && (
              <div style={{ maxWidth: '800px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 300, color: '#1e293b', margin: '0 0 24px 0' }}>Define detector</h1>

                <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '24px', marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', margin: '0 0 16px 0' }}>Detector details</h2>
                  <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '0 -24px 24px -24px' }} />

                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>Name</label>
                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>Specify a unique and descriptive name that is easy to recognize.</div>
                    <input type="text" placeholder="Enter detector name" value={detectorName} onChange={(e) => setDetectorName(e.target.value)} style={{ width: '400px', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none' }} />
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '8px', maxWidth: '400px', lineHeight: 1.5 }}>
                      Detector name must contain 1-64 characters. Valid characters are a-z, A-Z, 0-9, -(hyphen), _(underscore) and .(period).
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>Description <span style={{ fontWeight: 400, fontStyle: 'italic', color: '#64748b' }}>- optional</span></label>
                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>Describe the purpose of the detector.</div>
                    <textarea placeholder="Describe the detector" style={{ width: '400px', height: '80px', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none', resize: 'vertical' }} />
                  </div>
                </div>

                <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '24px', marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', margin: '0 0 16px 0' }}>Select Data</h2>
                  <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '0 -24px 24px -24px' }} />

                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>Clusters</label>
                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>Select a local cluster or remote clusters from cross-cluster connections.</div>
                    <select style={{ width: '400px', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none', background: '#ffffff' }}>
                      <option>wazuh-cluster (Local)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>Index</label>
                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>Choose an index, index pattern or alias as the data source.</div>
                    <div style={{ position: 'relative', width: '400px' }}>
                      <select style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none', background: '#ffffff', appearance: 'none', color: '#94a3b8' }}>
                        <option>Find indices</option>
                      </select>
                      <FiChevronDown style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    </div>
                  </div>
                </div>

                <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '24px', marginBottom: '20px' }}>
                  <div style={{ marginBottom: '4px', fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>Data filter <span style={{ fontWeight: 400, fontStyle: 'italic', color: '#64748b' }}>- optional</span></div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px', maxWidth: '400px', lineHeight: 1.5 }}>Choose a subset of your data source to focus your data stream and reduce noisy data.</div>
                  <button style={{ background: 'none', border: 'none', color: '#005cca', fontWeight: 600, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', padding: 0 }}>
                    <FiFilter size={14} /> + Add data filter
                  </button>
                </div>

                <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '24px', marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', margin: '0 0 4px 0' }}>Timestamp</h2>
                  <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>Select the time field you want to use for the time filter.</div>
                  <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '0 -24px 24px -24px' }} />

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>Timestamp field</label>
                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>Choose the time field you want to use for time filter.</div>
                    <div style={{ position: 'relative', width: '400px' }}>
                      <select style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none', background: '#ffffff', appearance: 'none', color: '#94a3b8' }}>
                        <option>Find timestamp</option>
                      </select>
                      <FiChevronDown style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    </div>
                  </div>
                </div>

                <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '24px', marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', margin: '0 0 16px 0' }}>Operation settings</h2>
                  <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '0 -24px 24px -24px' }} />

                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>Detector interval</label>
                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px', maxWidth: '400px', lineHeight: 1.5 }}>Define how often the detector collects data to generate anomalies. The shorter the interval is, the more real time the detector results will be, and the more computing resources the detector will need. <a href="#" style={{ color: '#005cca', textDecoration: 'none' }}>Learn more <FiExternalLink size={10} /></a></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input type="number" defaultValue={10} style={{ width: '150px', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none' }} />
                      <span style={{ fontSize: '13px', color: '#1e293b' }}>minutes</span>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>Window delay</label>
                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px', maxWidth: '400px', lineHeight: 1.5 }}>Specify a window of delay for a detector to fetch data, if you need to account for extra processing time. <a href="#" style={{ color: '#005cca', textDecoration: 'none' }}>Learn more <FiExternalLink size={10} /></a></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input type="number" defaultValue={1} style={{ width: '150px', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none' }} />
                      <span style={{ fontSize: '13px', color: '#1e293b' }}>minutes</span>
                    </div>
                  </div>
                </div>

                <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '24px', marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', margin: '0 0 4px 0' }}>Custom result index</h2>
                  <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>Store detector results to your own index. <a href="#" style={{ color: '#005cca', textDecoration: 'none' }}>Learn more <FiExternalLink size={10} /></a></div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input type="checkbox" style={{ accentColor: '#005cca' }} />
                    <span style={{ fontSize: '13px', color: '#1e293b' }}>Enable custom result index</span>
                  </div>
                </div>

              </div>
            )}

            {createStep === 2 && (
              <div style={{ maxWidth: '800px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 300, color: '#1e293b', margin: '0 0 8px 0' }}>Configure model</h1>
                <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 24px 0', lineHeight: 1.5 }}>
                  Set the index fields that you want to find anomalies for by defining the model features. You can also set other model parameters such as category field and shingle size for more granular views. After you set the model features and other optional parameters, you can preview your anomalies from a sample feature output. <a href="#" style={{ color: '#005cca', textDecoration: 'none' }}>Learn more <FiExternalLink size={10} /></a>
                </p>

                <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '24px', marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b', margin: '0 0 4px 0' }}>Features</h2>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 16px 0' }}>A feature is the field in your index that you use to check for anomalies. You can add up to 5 features. <a href="#" style={{ color: '#005cca', textDecoration: 'none' }}>Learn more <FiExternalLink size={10} /></a></p>
                  <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '0 -24px 24px -24px' }} />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FiChevronDown size={18} /> Add feature
                    </div>
                    <button onClick={() => toast.success('Feature deleted')} className="wz-btn-secondary" style={{ borderColor: '#fca5a5', color: '#ef4444' }}>Delete</button>
                  </div>

                  <div style={{ paddingLeft: '26px' }}>
                    <div style={{ marginBottom: '24px' }}>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Feature name</label>
                      <input type="text" placeholder="Enter feature name" style={{ width: '400px', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none' }} />
                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '8px', maxWidth: '400px', lineHeight: 1.5 }}>Enter a descriptive, unique name. The name must contain 1-64 characters. Valid characters are a-z, A-Z, 0-9, -(hyphen) and _(underscore).</div>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Feature state</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input type="checkbox" defaultChecked style={{ accentColor: '#005cca' }} />
                        <span style={{ fontSize: '13px', color: '#1e293b' }}>Enable feature</span>
                      </div>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Find anomalies based on</label>
                      <div style={{ position: 'relative', width: '400px' }}>
                        <select style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none', background: '#ffffff', appearance: 'none' }}>
                          <option>Field value</option>
                        </select>
                        <FiChevronDown style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                      </div>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>Aggregation method</label>
                      <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>The aggregation method determines what constitutes an anomaly.</div>
                      <div style={{ position: 'relative', width: '400px' }}>
                        <select style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none', background: '#ffffff', appearance: 'none' }}>
                          <option>sum()</option>
                        </select>
                        <FiChevronDown style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '8px', maxWidth: '400px', lineHeight: 1.5 }}>E.g, if you choose min(), the detector focuses on finding anomalies based on the minimum values of your feature.</div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Field</label>
                      <div style={{ position: 'relative', width: '400px' }}>
                        <select style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none', background: '#ffffff', appearance: 'none', color: '#94a3b8' }}>
                          <option>Select field</option>
                        </select>
                        <FiChevronDown style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                      </div>
                    </div>

                    <div style={{ marginBottom: '24px', marginTop: '24px' }}>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>Anomaly criteria</label>
                      <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>Acceptable difference between the expected and actual values</div>
                      <div style={{ position: 'relative', width: '400px' }}>
                        <select style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none', background: '#ffffff', appearance: 'none' }}>
                          <option>Deviation in any direction (default)</option>
                        </select>
                        <FiChevronDown style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                      </div>
                    </div>

                    <div style={{ marginBottom: '32px', fontSize: '13px', color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FiChevronDown style={{ transform: 'rotate(-90deg)' }} /> Customize Suppression Rules
                    </div>

                    <div>
                      <button className="wz-btn-secondary" style={{ borderColor: '#005cca', color: '#005cca', fontWeight: 600, padding: '6px 16px', marginBottom: '8px' }}>Add another feature</button>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>You can add up to 4 more features.</div>
                    </div>
                  </div>
                </div>

                <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '24px', marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', margin: '0 0 4px 0' }}>Categorical fields</h2>
                  <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '24px' }}>Split a single time series into multiple time series based on categorical fields. You can select up to 2. <a href="#" style={{ color: '#005cca', textDecoration: 'none' }}>Learn more <FiExternalLink size={10} /></a></div>
                  
                  <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '0 -24px 24px -24px' }} />

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input type="checkbox" style={{ accentColor: '#005cca' }} />
                    <span style={{ fontSize: '13px', color: '#1e293b' }}>Enable categorical fields</span>
                  </div>
                </div>

                <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '24px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', margin: 0 }}>Advanced settings</h2>
                  <span style={{ fontSize: '13px', color: '#005cca', fontWeight: 600, cursor: 'pointer' }}>Show</span>
                </div>

                <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '24px', marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', margin: '0 0 16px 0' }}>Sample anomalies</h2>
                  <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '0 -24px 24px -24px' }} />

                  <div style={{ background: '#f0f9ff', borderLeft: '4px solid #0ea5e9', padding: '16px', borderRadius: '0 4px 4px 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0284c7', fontWeight: 600, fontSize: '14px', marginBottom: '8px' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      You can preview anomalies based on sample feature input
                    </div>
                    <div style={{ fontSize: '13px', color: '#334155', marginBottom: '16px' }}>
                      You can preview how your anomalies may look like from sample feature output and adjust the feature settings as needed. <a href="#" style={{ color: '#005cca', textDecoration: 'none' }}>Learn more <FiExternalLink size={10} /></a>
                    </div>
                    <button onClick={() => toast.success('Previewing anomalies')} className="wz-btn-secondary" style={{ borderColor: '#005cca', color: '#005cca', fontWeight: 600, padding: '6px 16px', background: 'transparent' }}>
                      Preview anomalies
                    </button>
                  </div>
                </div>
              </div>
            )}

            {createStep === 3 && (
              <div style={{ maxWidth: '800px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 300, color: '#1e293b', margin: '0 0 24px 0' }}>Set up detector jobs</h1>

                <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '24px', marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', margin: '0 0 4px 0' }}>Real-time detection</h2>
                  <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px', lineHeight: 1.5 }}>Real-time detection lets you find anomalies in your data in near real-time. To receive accurate and real-time anomalies, the detector needs to start and collect sufficient data to include your latest changes. The earlier the detector starts running, the sooner the real-time anomalies will be available. <a href="#" style={{ color: '#005cca', textDecoration: 'none' }}>Learn more <FiExternalLink size={10} /></a></div>
                  <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '0 -24px 24px -24px' }} />

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input type="checkbox" defaultChecked style={{ accentColor: '#005cca' }} />
                    <span style={{ fontSize: '13px', color: '#1e293b' }}>Start real-time detector automatically (recommended)</span>
                  </div>
                </div>

                <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '24px', marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', margin: '0 0 4px 0' }}>Historical analysis detection</h2>
                  <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px', lineHeight: 1.5 }}>Historical analysis detection lets you analyze and apply machine learning models over long historical data windows (weeks or months). You can identify anomaly patterns, seasonality, and trends. <a href="#" style={{ color: '#005cca', textDecoration: 'none' }}>Learn more <FiExternalLink size={10} /></a></div>
                  <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '0 -24px 24px -24px' }} />

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input type="checkbox" style={{ accentColor: '#005cca' }} />
                    <span style={{ fontSize: '13px', color: '#1e293b' }}>Run historical analysis detection</span>
                  </div>
                </div>
              </div>
            )}

            {createStep === 4 && (
              <div style={{ maxWidth: '800px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 300, color: '#1e293b', margin: '0 0 24px 0' }}>Review and create</h1>

                <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '24px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', margin: 0 }}>Detector settings</h2>
                    <button onClick={() => toast.success('Editing detector settings')} className="wz-btn-secondary" style={{ borderColor: '#cbd5e1', color: '#005cca', fontWeight: 600, padding: '4px 16px' }}>Edit</button>
                  </div>

                  <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '16px', borderRadius: '4px', marginBottom: '24px' }}>
                    <div style={{ color: '#b91c1c', fontWeight: 600, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                      Issues found in the detector settings
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '24px', fontSize: '13px', color: '#475569' }}>
                      <li style={{ marginBottom: '4px' }}>Validation failed for timefield of saad, Exceptions: [Timestamp field: (sss) is not found in the (wazuh-states-inventory-ports-sample-wazuh-inventory-agent) index mapping]</li>
                    </ul>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '24px' }}>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Name</div>
                      <div style={{ fontSize: '13px', color: '#475569' }}>saad</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Data source index</div>
                      <div style={{ fontSize: '13px', color: '#475569' }}>wazuh-states-inventory-ports-sample-<br/>wazuh-inventory-agent... <a href="#" style={{ color: '#005cca', fontWeight: 600, textDecoration: 'none' }}>View all 2</a></div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Data filter</div>
                      <div style={{ fontSize: '13px', color: '#475569' }}>Custom expression: <a href="#" style={{ color: '#005cca', fontWeight: 600, textDecoration: 'none' }}>View code</a></div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Detector interval</div>
                      <div style={{ fontSize: '13px', color: '#475569' }}>10 Minutes</div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '24px' }}>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Description</div>
                      <div style={{ fontSize: '13px', color: '#475569' }}>-</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Timestamp</div>
                      <div style={{ fontSize: '13px', color: '#475569' }}>sss</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Window delay</div>
                      <div style={{ fontSize: '13px', color: '#475569' }}>1 Minutes</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Custom result index</div>
                      <div style={{ fontSize: '13px', color: '#475569' }}>-</div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Flatten custom result index</div>
                      <div style={{ fontSize: '13px', color: '#475569' }}>-</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Custom result index min age</div>
                      <div style={{ fontSize: '13px', color: '#475569' }}>-</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Custom result index min size</div>
                      <div style={{ fontSize: '13px', color: '#475569' }}>-</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Custom result index TTL</div>
                      <div style={{ fontSize: '13px', color: '#475569' }}>-</div>
                    </div>
                  </div>
                </div>

                <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '24px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', margin: 0 }}>Model configuration</h2>
                    <button onClick={() => toast.success('Editing detector settings')} className="wz-btn-secondary" style={{ borderColor: '#cbd5e1', color: '#005cca', fontWeight: 600, padding: '4px 16px' }}>Edit</button>
                  </div>

                  <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '12px 16px', borderRadius: '4px', marginBottom: '24px' }}>
                    <div style={{ color: '#059669', fontWeight: 500, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                      Model configurations are validated
                    </div>
                  </div>

                  <div style={{ border: '1px solid #e2e8f0', borderRadius: '4px', padding: '20px', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b', margin: '0 0 16px 0' }}>Additional settings</h3>
                    <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '0 -20px 16px -20px' }} />
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Category field</div>
                        <div style={{ fontSize: '13px', color: '#475569' }}>-</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Shingle size</div>
                        <div style={{ fontSize: '13px', color: '#475569' }}>8</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Imputation method</div>
                        <div style={{ fontSize: '13px', color: '#475569' }}>ignore</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Custom values</div>
                        <div style={{ fontSize: '13px', color: '#475569' }}>-</div>
                      </div>
                    </div>
                  </div>

                  <div style={{ border: '1px solid #e2e8f0', borderRadius: '4px', padding: '20px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b', margin: '0 0 16px 0' }}>Features (1)</h3>
                    <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '0 -20px 0 -20px' }} />
                    
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
                      <thead>
                        <tr>
                          <th style={{ textAlign: 'left', padding: '12px', fontSize: '12px', color: '#1e293b', fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>Feature name ↑</th>
                          <th style={{ textAlign: 'left', padding: '12px', fontSize: '12px', color: '#1e293b', fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>Feature definition</th>
                          <th style={{ textAlign: 'left', padding: '12px', fontSize: '12px', color: '#1e293b', fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>Feature state</th>
                          <th style={{ textAlign: 'left', padding: '12px', fontSize: '12px', color: '#1e293b', fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>Anomaly Criteria</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={{ padding: '12px', fontSize: '13px', color: '#475569', verticalAlign: 'top' }}>saad</td>
                          <td style={{ padding: '12px', fontSize: '13px', color: '#475569', verticalAlign: 'top' }}>Field: destination.port<br/>Aggregation method: sum</td>
                          <td style={{ padding: '12px', fontSize: '13px', color: '#475569', verticalAlign: 'top' }}>Enabled</td>
                          <td style={{ padding: '12px', fontSize: '13px', color: '#475569', verticalAlign: 'top' }}>any</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '24px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', margin: 0 }}>Detector schedule</h2>
                    <button onClick={() => toast.success('Editing detector settings')} className="wz-btn-secondary" style={{ borderColor: '#cbd5e1', color: '#005cca', fontWeight: 600, padding: '4px 16px' }}>Edit</button>
                  </div>
                  <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '0 -24px 24px -24px' }} />

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Real-time detector</div>
                      <div style={{ fontSize: '13px', color: '#475569' }}>Start automatically</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Historical analysis</div>
                      <div style={{ fontSize: '13px', color: '#475569' }}>Disabled</div>
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>
        </div>

        {/* Fixed Footer */}
        <div style={{ position: 'fixed', bottom: 0, left: 250, right: 0, background: '#ffffff', borderTop: '1px solid #e2e8f0', padding: '16px 24px', display: 'flex', justifyContent: 'flex-end', gap: '12px', zIndex: 10 }}>
          <button               onClick={() => { setIsCreating(false); toast.success('Cancelled'); }}
              style={{ background: 'none', border: 'none', color: '#005cca', fontWeight: 600, fontSize: '13px', cursor: 'pointer', padding: '8px 16px' }}>Cancel</button>
          {createStep > 1 && (
            <button className="wz-btn-secondary" onClick={() => { setCreateStep(s => s - 1); toast.success('Moved to previous step'); }} style={{ fontWeight: 600, padding: '8px 24px', display: 'flex', alignItems: 'center', gap: '4px' }}><FiChevronDown style={{ transform: 'rotate(90deg)' }} size={16} /> Previous</button>
          )}
          <button className="wz-btn" onClick={() => {
            if (createStep === 4) {
              const name = detectorName || 'New Detector';
              const newDetector = { name, created: new Date().toLocaleString(), status: 'Active' };
              const updated = [...detectors, newDetector];
              setDetectors(updated);
              localStorage.setItem('wz_anomaly_detectors', JSON.stringify(updated));
              setActiveDetector(name);
              setIsCreating(false);
              setDetectorName('');
              toast.success('Detector created');
            } else {
              setCreateStep(s => Math.min(s + 1, 4));
              toast.success('Moved to next step');
            }
          }} style={{ fontWeight: 600, padding: '8px 24px' }}>
            {createStep === 4 ? 'Create detector' : 'Next >'}
          </button>
        </div>
      </div>
    );
  }

  if (activeDetector) {
    return (
      <div className="wz-page" style={{ background: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Breadcrumbs */}
        <div style={{ display: 'flex', padding: '16px 24px', background: '#ffffff', borderBottom: '1px solid #e2e8f0', gap: '8px', zIndex: 10 }}>
          <div style={{ padding: '4px 12px', background: '#e2e8f0', borderRadius: '16px', fontSize: '13px', color: '#475569', cursor: 'pointer' }} onClick={() => setActiveDetector(null)}>Anomaly detect...</div>
          <div style={{ padding: '4px 12px', background: '#e2e8f0', borderRadius: '16px', fontSize: '13px', color: '#475569', cursor: 'pointer' }} onClick={() => setActiveDetector(null)}>Detectors</div>
          <div style={{ padding: '4px 12px', background: '#dbeafe', borderRadius: '16px', fontSize: '13px', color: '#1e3a8a', fontWeight: 600 }}>{activeDetector}</div>
        </div>

        <div style={{ padding: '24px 48px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 300, color: '#1e293b', margin: 0 }}>{activeDetector}</h1>
            <div style={{ position: 'relative' }}>
              <button 
                className="wz-btn-secondary" 
                style={{ display: 'flex', alignItems: 'center', gap: '8px', borderColor: '#cbd5e1' }}
                onClick={() => setIsActionsOpen(!isActionsOpen)}
              >
                Actions <FiChevronDown />
              </button>
              {isActionsOpen && (
                <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '4px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '4px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', minWidth: '200px', zIndex: 20 }}>
                  <div onClick={() => toast.success('Editing detector settings')} style={{ padding: '8px 16px', fontSize: '13px', color: '#1e293b', cursor: 'pointer' }}>Edit detector settings</div>
                  <div onClick={() => toast.success('Editing model configuration')} style={{ padding: '8px 16px', fontSize: '13px', color: '#1e293b', cursor: 'pointer' }}>Edit model configuration</div>
                  <div 
                    style={{ padding: '8px 16px', fontSize: '13px', color: '#ef4444', cursor: 'pointer' }}
                    onClick={() => {
                      setIsActionsOpen(false);
                      setIsDeleteModalOpen(true);
                      setDeleteConfirmText('');
                    }}
                  >
                    Delete detector
                  </div>
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '24px', borderBottom: '1px solid #e2e8f0', marginBottom: '24px' }}>
            <div 
              style={{ paddingBottom: '12px', fontSize: '14px', fontWeight: detectorTab === 'real-time' ? 600 : 400, color: detectorTab === 'real-time' ? '#005cca' : '#475569', borderBottom: detectorTab === 'real-time' ? '2px solid #005cca' : '2px solid transparent', cursor: 'pointer' }}
              onClick={() => setDetectorTab('real-time')}
            >
              Real-time results
            </div>
            <div 
              style={{ paddingBottom: '12px', fontSize: '14px', fontWeight: detectorTab === 'historical' ? 600 : 400, color: detectorTab === 'historical' ? '#005cca' : '#475569', borderBottom: detectorTab === 'historical' ? '2px solid #005cca' : '2px solid transparent', cursor: 'pointer' }}
              onClick={() => setDetectorTab('historical')}
            >
              Historical analysis
            </div>
            <div 
              style={{ paddingBottom: '12px', fontSize: '14px', fontWeight: detectorTab === 'config' ? 600 : 400, color: detectorTab === 'config' ? '#005cca' : '#475569', borderBottom: detectorTab === 'config' ? '2px solid #005cca' : '2px solid transparent', cursor: 'pointer' }}
              onClick={() => setDetectorTab('config')}
            >
              Detector configuration
            </div>
          </div>

          {detectorTab === 'real-time' && (
            <div>
              <div style={{ background: '#f0f9ff', borderLeft: '4px solid #0ea5e9', padding: '16px', borderRadius: '0 4px 4px 0', marginBottom: '24px' }}>
                <div style={{ display: 'flex', gap: '12px', color: '#0284c7', fontSize: '13px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: '2px' }}><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/></svg>
                  <div>
                    <span style={{ fontWeight: 500, color: '#0284c7' }}>Attempting to initialize the detector with historical data.</span> This initializing process takes approximately 1 minute if you have data in each of the last 40 consecutive intervals.
                    <div style={{ marginTop: '12px' }}>
                      <button className="wz-btn-secondary" style={{ borderColor: '#0ea5e9', color: '#0284c7', padding: '4px 12px', fontSize: '12px', fontWeight: 600 }}>View detector configuration</button>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 400, color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Real-time results
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 600, color: '#64748b' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0ea5e9' }}></span>
                    Initializing
                  </span>
                </h2>
                <button onClick={() => toast.success('Detector stopped')} className="wz-btn-secondary" style={{ color: '#005cca', borderColor: '#cbd5e1', fontWeight: 600 }}>Stop detector</button>
              </div>

              <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '20px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    Live anomalies
                    <span style={{ background: '#e2e8f0', color: '#475569', fontSize: '10px', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>Live</span>
                  </h3>
                  <button className="wz-btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', padding: '4px 12px', color: '#005cca', borderColor: '#cbd5e1' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
                    View full screen
                  </button>
                </div>
                <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '0 -20px 16px -20px' }} />
                <div style={{ fontSize: '13px', color: '#475569' }}>Not available when the detector is initializing.</div>
              </div>

              <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '20px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b', margin: 0 }}>Anomaly overview</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '6px 12px', fontSize: '12px', color: '#475569' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                      last 7 days
                      <a href="#" style={{ color: '#005cca', marginLeft: '12px', textDecoration: 'none' }}>Show dates</a>
                    </div>
                    <button onClick={() => toast.success('Data refreshed')} className="wz-btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', padding: '6px 12px', color: '#005cca', borderColor: '#cbd5e1' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 1 0 2.63-6.37L21 8"/></svg>
                      Refresh
                    </button>
                    <button onClick={() => toast.success('Setting up alerts')} className="wz-btn-secondary" style={{ fontSize: '12px', padding: '6px 12px', color: '#005cca', borderColor: '#cbd5e1' }}>Set up alerts</button>
                  </div>
                </div>
                <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '0 -20px 24px -20px' }} />

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '24px', marginBottom: '48px' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: '#475569', marginBottom: '4px' }}>Anomaly occurrences</div>
                    <div style={{ fontSize: '20px', fontWeight: 600, color: '#1e293b' }}>0</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#475569', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>Anomaly grade <FiExternalLink size={10} /></div>
                    <div style={{ fontSize: '20px', fontWeight: 600, color: '#1e293b' }}>0</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#475569', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>Confidence <FiExternalLink size={10} /></div>
                    <div style={{ fontSize: '20px', fontWeight: 600, color: '#1e293b' }}>0</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#475569', marginBottom: '4px' }}>Last anomaly occurrence</div>
                    <div style={{ fontSize: '20px', fontWeight: 600, color: '#1e293b' }}>-</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#475569', marginBottom: '4px' }}>Alert <span style={{ color: '#005cca', fontWeight: 600 }}>Info</span></div>
                    <div style={{ fontSize: '20px', fontWeight: 600, color: '#1e293b' }}>0</div>
                  </div>
                </div>

                <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '13px' }}>
                  No data to display
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', gap: '24px', borderBottom: '1px solid #e2e8f0', marginBottom: '24px' }}>
                  <div 
                    style={{ paddingBottom: '12px', fontSize: '13px', fontWeight: detectorSubTab === 'feature' ? 600 : 400, color: detectorSubTab === 'feature' ? '#005cca' : '#475569', borderBottom: detectorSubTab === 'feature' ? '2px solid #005cca' : '2px solid transparent', cursor: 'pointer' }}
                    onClick={() => setDetectorSubTab('feature')}
                  >
                    Feature breakdown
                  </div>
                  <div 
                    style={{ paddingBottom: '12px', fontSize: '13px', fontWeight: detectorSubTab === 'occurrences' ? 600 : 400, color: detectorSubTab === 'occurrences' ? '#005cca' : '#475569', borderBottom: detectorSubTab === 'occurrences' ? '2px solid #005cca' : '2px solid transparent', cursor: 'pointer' }}
                    onClick={() => setDetectorSubTab('occurrences')}
                  >
                    Anomaly occurrences
                  </div>
                </div>

                {detectorSubTab === 'feature' && (
                  <div style={{ border: '1px solid #e2e8f0', borderRadius: '4px', background: '#f8fafc', padding: '16px' }}>
                    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '16px' }}>
                      <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', margin: '0 0 8px 0' }}>saad</h4>
                      <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>
                        <span>Field: destination.port</span>
                        <span>Aggregation method: sum</span>
                        <span>State: Enabled</span>
                      </div>
                      <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '0 0 16px 0' }} />
                      <div style={{ height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '13px' }}>
                        No data to display
                      </div>
                    </div>
                  </div>
                )}
                
                {detectorSubTab === 'occurrences' && (
                  <div style={{ border: '1px solid #e2e8f0', borderRadius: '4px', background: '#f8fafc', padding: '16px' }}>
                    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '16px' }}>
                      <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', margin: '0 0 16px 0' }}>Anomaly occurrences (0)</h4>
                      <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '0 -16px 16px -16px' }} />
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr>
                            <th style={{ textAlign: 'left', paddingBottom: '12px', fontSize: '12px', color: '#1e293b', fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>Start time ↓</th>
                            <th style={{ textAlign: 'left', paddingBottom: '12px', fontSize: '12px', color: '#1e293b', fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>End time</th>
                            <th style={{ textAlign: 'right', paddingBottom: '12px', fontSize: '12px', color: '#1e293b', fontWeight: 600, borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>Anomaly grade <FiExternalLink size={10} /></th>
                          </tr>
                        </thead>
                      </table>
                      <div style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '13px', borderBottom: '1px solid #e2e8f0' }}>
                        There are no anomalies currently.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {detectorTab === 'historical' && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 400, color: '#1e293b', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Historical analysis
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 600, color: '#64748b' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444' }}></span>
                  Failed
                </span>
              </h2>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#e2e8f0', borderRadius: '4px', padding: '6px 12px', fontSize: '12px', color: '#1e293b', fontWeight: 600 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  May 15, 2026 @ 03:42 PM - Jun 14, 2026 @ 03:42 PM
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#005cca', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                  Modify historical analysis range
                </div>
              </div>

              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '16px', borderRadius: '4px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', color: '#b91c1c', fontSize: '13px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                There is no data in the time field.
              </div>

              <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b', margin: 0 }}>Anomaly history</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '6px 12px', fontSize: '12px', color: '#475569' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                      ~ a month ago → ~ a minute ago
                    </div>
                    <button className="wz-btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', padding: '6px 12px', color: '#005cca', borderColor: '#cbd5e1' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 1 0 2.63-6.37L21 8"/></svg>
                      Refresh
                    </button>
                  </div>
                </div>
                <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '0 -20px 24px -20px' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '48px' }}>
                  <div style={{ display: 'flex', gap: '120px' }}>
                    <div>
                      <div style={{ fontSize: '12px', color: '#475569', marginBottom: '4px' }}>Anomaly occurrences</div>
                      <div style={{ fontSize: '20px', fontWeight: 600, color: '#1e293b' }}>0</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#475569', marginBottom: '4px' }}>Average anomaly grade</div>
                      <div style={{ fontSize: '20px', fontWeight: 600, color: '#1e293b' }}></div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ background: '#64748b', color: '#ffffff', fontSize: '12px', fontWeight: 600, padding: '4px 16px', borderRadius: '4px 0 0 4px', cursor: 'pointer' }}>Raw</div>
                    <div style={{ background: '#ffffff', color: '#475569', fontSize: '12px', fontWeight: 500, padding: '4px 16px', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', cursor: 'pointer' }}>Daily max</div>
                    <div style={{ background: '#ffffff', color: '#475569', fontSize: '12px', fontWeight: 500, padding: '4px 16px', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', cursor: 'pointer' }}>Weekly max</div>
                    <div style={{ background: '#ffffff', color: '#475569', fontSize: '12px', fontWeight: 500, padding: '4px 16px', border: '1px solid #e2e8f0', borderRadius: '0 4px 4px 0', cursor: 'pointer' }}>Monthly max</div>
                  </div>
                </div>

                <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '13px' }}>
                  No data to display
                </div>
              </div>
            </div>
          )}

          {detectorTab === 'config' && (
            <div>
              <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '24px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: 500, color: '#1e293b', margin: 0 }}>Detector settings</h2>
                  <button className="wz-btn-secondary" style={{ borderColor: '#cbd5e1', color: '#005cca', fontWeight: 600, padding: '4px 24px' }}>Edit</button>
                </div>
                <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '0 -24px 24px -24px' }} />

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px 24px', marginBottom: '32px' }}>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Name</div>
                    <div style={{ fontSize: '13px', color: '#475569' }}>saad</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Data source index</div>
                    <div style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5 }}>
                      wazuh-states-inventory-ports-sample-<br/>
                      wazuh-inventory-agent... <span style={{ color: '#005cca', fontWeight: 600, cursor: 'pointer' }}>View all 2</span>
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Data filter</div>
                    <div style={{ fontSize: '13px', color: '#475569' }}>Custom expression: <span style={{ color: '#005cca', fontWeight: 600, cursor: 'pointer' }}>View code</span></div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Detector interval</div>
                    <div style={{ fontSize: '13px', color: '#475569' }}>10 Minutes</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>ID</div>
                    <div style={{ fontSize: '13px', color: '#475569' }}>GdCUxp4Bq1gv2ZaMjzTj</div>
                  </div>
                  
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Description</div>
                    <div style={{ fontSize: '13px', color: '#475569' }}>-</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Timestamp</div>
                    <div style={{ fontSize: '13px', color: '#475569' }}>sss</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Last Updated</div>
                    <div style={{ fontSize: '13px', color: '#475569' }}>06/14/26 03:41 PM</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Window delay</div>
                    <div style={{ fontSize: '13px', color: '#475569' }}>1 Minutes</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Custom result index</div>
                    <div style={{ fontSize: '13px', color: '#475569' }}>-</div>
                  </div>

                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Flatten custom result index</div>
                    <div style={{ fontSize: '13px', color: '#475569' }}>-</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Custom result index min age</div>
                    <div style={{ fontSize: '13px', color: '#475569' }}>-</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Custom result index min size</div>
                    <div style={{ fontSize: '13px', color: '#475569' }}>-</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Custom result index TTL</div>
                    <div style={{ fontSize: '13px', color: '#475569' }}>-</div>
                  </div>
                </div>
              </div>

              <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '24px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: 500, color: '#1e293b', margin: 0 }}>Model configuration</h2>
                  <button className="wz-btn-secondary" style={{ borderColor: '#cbd5e1', color: '#005cca', fontWeight: 600, padding: '4px 24px' }}>Edit</button>
                </div>
                <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '0 -24px 24px -24px' }} />

                <div style={{ border: '1px solid #e2e8f0', borderRadius: '4px', padding: '20px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b', margin: '0 0 16px 0' }}>Features (1)</h3>
                  <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '0 -20px 0 -20px' }} />
                  
                  <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
                    <thead>
                      <tr>
                        <th style={{ textAlign: 'left', padding: '12px', fontSize: '12px', color: '#1e293b', fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>Feature name ↑</th>
                        <th style={{ textAlign: 'left', padding: '12px', fontSize: '12px', color: '#1e293b', fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>Feature definition</th>
                        <th style={{ textAlign: 'left', padding: '12px', fontSize: '12px', color: '#1e293b', fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>Feature state</th>
                        <th style={{ textAlign: 'left', padding: '12px', fontSize: '12px', color: '#1e293b', fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>Anomaly Criteria</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ padding: '12px', fontSize: '13px', color: '#475569', verticalAlign: 'top' }}>saad</td>
                        <td style={{ padding: '12px', fontSize: '13px', color: '#475569', verticalAlign: 'top' }}>Field: destination.port<br/>Aggregation method: sum</td>
                        <td style={{ padding: '12px', fontSize: '13px', color: '#475569', verticalAlign: 'top' }}>Enabled</td>
                        <td style={{ padding: '12px', fontSize: '13px', color: '#005cca', verticalAlign: 'top', cursor: 'pointer', fontWeight: 600 }}>2 rules</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div style={{ border: '1px solid #e2e8f0', borderRadius: '4px', padding: '20px', marginTop: '20px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b', margin: '0 0 16px 0' }}>Additional settings</h3>
                  <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '0 -20px 16px -20px' }} />
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Categorical fields</div>
                      <div style={{ fontSize: '13px', color: '#475569' }}>-</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Shingle size</div>
                      <div style={{ fontSize: '13px', color: '#475569' }}>8</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Imputation method</div>
                      <div style={{ fontSize: '13px', color: '#475569' }}>ignore</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Custom values</div>
                      <div style={{ fontSize: '13px', color: '#475569' }}>-</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '24px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 500, color: '#1e293b', margin: '0 0 20px 0' }}>Detector jobs</h2>
                <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '0 -24px 24px -24px' }} />

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Real-time detector</div>
                    <div style={{ fontSize: '13px', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0ea5e9' }}></span>
                      Initializing (0% complete)
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Historical analysis detector</div>
                    <div style={{ fontSize: '12px', color: '#475569' }}>May 15, 2026 @ 03:42 PM - Jun 14, 2026 @ 03:42 PM</div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Delete Modal */}
        {isDeleteModalOpen && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
            <div style={{ background: '#ffffff', borderRadius: '4px', width: '600px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', borderBottom: '1px solid #e2e8f0' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 300, color: '#1e293b', margin: 0 }}>Delete detector?</h2>
                <button onClick={() => { setIsDeleteModalOpen(false); toast.success('Cancelled'); }} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
              <div style={{ padding: '24px' }}>
                <div style={{ background: '#fffbeb', borderLeft: '4px solid #f59e0b', padding: '16px', borderRadius: '0 4px 4px 0', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="2" style={{ flexShrink: 0 }}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  <span style={{ color: '#b45309', fontWeight: 500, fontSize: '13px' }}>The detector is running. Are you sure you want to proceed?</span>
                </div>
                
                <p style={{ fontSize: '13px', color: '#1e293b', margin: '0 0 16px 0', lineHeight: 1.5 }}>
                  Detector and feature configuration will be permanently removed. This action is irreversible. To confirm deletion, type <span style={{ fontStyle: 'italic', fontWeight: 500 }}>delete</span> in the field.
                </p>

                <input 
                  type="text" 
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="delete"
                  style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none' }} 
                />
              </div>
              <div style={{ padding: '16px 24px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '12px', borderRadius: '0 0 4px 4px' }}>
                <button onClick={() => { setIsDeleteModalOpen(false); toast.success('Cancelled'); }} style={{ background: 'none', border: 'none', color: '#005cca', fontWeight: 600, fontSize: '13px', cursor: 'pointer', padding: '8px 16px' }}>Cancel</button>
                <button 
                  disabled={deleteConfirmText !== 'delete'}
                  style={{ 
                    background: deleteConfirmText === 'delete' ? '#dc2626' : '#cbd5e1', 
                    color: '#ffffff', 
                    border: 'none', 
                    borderRadius: '4px', 
                    padding: '8px 24px', 
                    fontWeight: 600, 
                    fontSize: '13px', 
                    cursor: deleteConfirmText === 'delete' ? 'pointer' : 'not-allowed'
                  }}
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setActiveDetector(null);
                    toast.success('Detector deleted');
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    );
  }

  return (
    <div className="wz-page" style={{ background: '#f8fafc', paddingBottom: '24px' }}>
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 48px)' }}>
        
        {/* Left Sub-navigation */}
        <div style={{ 
          width: '220px', 
          borderRight: '1px solid #e2e8f0', 
          background: '#ffffff', 
          padding: '24px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <button 
            onClick={() => setView('get-started')}
            style={{
              background: 'none',
              border: 'none',
              textAlign: 'left',
              fontSize: '14px',
              fontWeight: activeSub === 'get-started' ? 700 : 600,
              color: activeSub === 'get-started' ? '#1e293b' : '#64748b',
              padding: '6px 8px',
              cursor: 'pointer',
              borderRadius: '4px'
            }}
          >
            Anomaly detection
          </button>
          
          <button 
            onClick={() => setView('dashboard')}
            style={{
              background: 'none',
              border: 'none',
              textAlign: 'left',
              fontSize: '13px',
              fontWeight: activeSub === 'dashboard' ? 600 : 500,
              color: activeSub === 'dashboard' ? '#005cca' : '#475569',
              padding: '4px 16px',
              cursor: 'pointer',
              textDecoration: activeSub === 'dashboard' ? 'underline' : 'none'
            }}
          >
            Dashboard
          </button>
          
          <button 
            onClick={() => setView('detectors')}
            style={{
              background: 'none',
              border: 'none',
              textAlign: 'left',
              fontSize: '13px',
              fontWeight: activeSub === 'detectors' ? 600 : 500,
              color: activeSub === 'detectors' ? '#005cca' : '#475569',
              padding: '4px 16px',
              cursor: 'pointer',
              textDecoration: activeSub === 'detectors' ? 'underline' : 'none'
            }}
          >
            Detectors
          </button>
        </div>

        {/* Right Content Area */}
        <div style={{ flex: 1, padding: '24px 32px', overflowY: 'auto' }}>
          
          {/* ==========================================
              1. GET STARTED VIEW
              ========================================== */}
          {activeSub === 'get-started' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h1 style={{ fontSize: '32px', fontWeight: 300, color: '#1e293b', margin: '0 0 16px 0' }}>
                    Get started
                  </h1>
                  <p style={{ fontSize: '13.5px', color: '#475569', margin: 0, lineHeight: 1.6, maxWidth: '800px' }}>
                    The anomaly detection plugin automatically detects anomalies in your data in near real-time using the Random Cut Forest (RCF) algorithm.{' '}
                    <a href="#" style={{ color: '#005cca', display: 'inline-flex', alignItems: 'center', gap: '2px', textDecoration: 'underline' }}>
                      Learn more <FiExternalLink size={12} />
                    </a>
                  </p>
                </div>
                <button onClick={() => { setIsCreating(true); toast.success('Creating new detector'); }} className="wz-btn" style={{ fontWeight: 600 }}>
                  Create detector
                </button>
              </div>

              {/* How it works Card */}
              <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '24px 32px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', margin: '0 0 20px 0' }}>
                  How it works
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', margin: '0 0 8px 0' }}>
                      1. Define your detector
                    </h4>
                    <p style={{ fontSize: '12.5px', color: '#64748b', lineHeight: 1.5, margin: '0 0 8px 0' }}>
                      Select a data source, set the detector interval, and specify a window delay.
                    </p>
                    <a href="#" style={{ color: '#005cca', fontSize: '12.5px', textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                      Learn more <FiExternalLink size={11} />
                    </a>
                  </div>

                  <div style={{ borderLeft: '1px solid #f1f5f9', paddingLeft: '16px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', margin: '0 0 8px 0' }}>
                      2. Configure your detector
                    </h4>
                    <p style={{ fontSize: '12.5px', color: '#64748b', lineHeight: 1.5, margin: '0 0 8px 0' }}>
                      Choose the fields in your index that you want to check for anomalies. You may also set a category field to see a granular view of anomalies within each entity.
                    </p>
                    <a href="#" style={{ color: '#005cca', fontSize: '12.5px', textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                      Learn more <FiExternalLink size={11} />
                    </a>
                  </div>

                  <div style={{ borderLeft: '1px solid #f1f5f9', paddingLeft: '16px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', margin: '0 0 8px 0' }}>
                      3. Preview your detector
                    </h4>
                    <p style={{ fontSize: '12.5px', color: '#64748b', lineHeight: 1.5, margin: '0 0 8px 0' }}>
                      After configuring your model, preview your results with sample data to fine-tune your settings.
                    </p>
                    <a href="#" style={{ color: '#005cca', fontSize: '12.5px', textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                      Learn more <FiExternalLink size={11} />
                    </a>
                  </div>

                  <div style={{ borderLeft: '1px solid #f1f5f9', paddingLeft: '16px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', margin: '0 0 8px 0' }}>
                      4. View results
                    </h4>
                    <p style={{ fontSize: '12.5px', color: '#64748b', lineHeight: 1.5, margin: '0 0 8px 0' }}>
                      Run your detector to observe results in real-time. You can also enable historical analysis to view anomalies in your data history.
                    </p>
                    <a href="#" style={{ color: '#005cca', fontSize: '12.5px', textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                      Learn more <FiExternalLink size={11} />
                    </a>
                  </div>
                </div>
              </div>

              {/* Sample Detectors Card */}
              <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '24px 32px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', margin: '0 0 6px 0' }}>
                  Start with a sample detector to learn about anomaly detection
                </h3>
                <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 24px 0' }}>
                  New to anomaly detection? Get a better understanding of how it works by creating a detector with one of the sample datasets.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                  {/* Card A */}
                  <div style={{ border: '1px solid #e2e8f0', borderRadius: '4px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '180px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <span style={{ fontSize: '18px', color: '#64748b', display: 'flex' }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18"/><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/></svg>
                        </span>
                        <span style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b' }}>Monitor HTTP responses</span>
                        <a href="#" style={{ fontSize: '13px', color: '#005cca', fontWeight: 600, marginLeft: 'auto' }}>Info</a>
                      </div>
                      <p style={{ fontSize: '12.5px', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                        Detect high numbers of error response codes in an index containing HTTP response data.
                      </p>
                    </div>
                    <button className="wz-btn-secondary" style={{ width: '100%', borderColor: '#005cca', color: '#005cca', fontWeight: 600, fontSize: '12px', marginTop: '16px' }}>
                      Create HTTP response detector
                    </button>
                  </div>

                  {/* Card B */}
                  <div style={{ border: '1px solid #e2e8f0', borderRadius: '4px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '180px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <span style={{ fontSize: '18px', color: '#64748b', display: 'flex' }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                        </span>
                        <span style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b' }}>Monitor eCommerce orders</span>
                        <a href="#" style={{ fontSize: '13px', color: '#005cca', fontWeight: 600, marginLeft: 'auto' }}>Info</a>
                      </div>
                      <p style={{ fontSize: '12.5px', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                        Detect any unusual increase or decrease of orders in an index containing online order data.
                      </p>
                    </div>
                    <button className="wz-btn-secondary" style={{ width: '100%', borderColor: '#005cca', color: '#005cca', fontWeight: 600, fontSize: '12px', marginTop: '16px' }}>
                      Create eCommerce orders detector
                    </button>
                  </div>

                  {/* Card C */}
                  <div style={{ border: '1px solid #e2e8f0', borderRadius: '4px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '180px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <span style={{ fontSize: '18px', color: '#64748b', display: 'flex' }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                        </span>
                        <span style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b' }}>Monitor host health</span>
                        <a href="#" style={{ fontSize: '13px', color: '#005cca', fontWeight: 600, marginLeft: 'auto' }}>Info</a>
                      </div>
                      <p style={{ fontSize: '12.5px', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                        Detect increases in CPU and memory utilization in an index containing various health metrics from a host.
                      </p>
                    </div>
                    <button className="wz-btn-secondary" style={{ width: '100%', borderColor: '#005cca', color: '#005cca', fontWeight: 600, fontSize: '12px', marginTop: '16px' }}>
                      Create health monitor detector
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              2. REAL-TIME DASHBOARD VIEW
              ========================================== */}
          {activeSub === 'dashboard' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', minHeight: '350px', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
              <h1 style={{ fontSize: '32px', fontWeight: 300, color: '#1e293b', margin: '0 0 24px 0', alignSelf: 'flex-start' }}>
                Real-time dashboard
              </h1>
              
              <div style={{ maxWidth: '600px', margin: '40px auto 0 auto' }}>
                <h2 style={{ fontSize: '28px', fontWeight: 300, color: '#1e293b', margin: '0 0 16px 0' }}>
                  You have no detectors
                </h2>
                
                <p style={{ fontSize: '13.5px', color: '#64748b', margin: '0 0 8px 0' }}>
                  Create detector first to detect anomalies in your data.
                </p>
                <p style={{ fontSize: '13.5px', color: '#64748b', margin: '0 0 16px 0' }}>
                  Dashboard will generate insights on the anomalies across all of your detectors.
                </p>
                
                <p style={{ fontSize: '13.5px', color: '#64748b', margin: '0 0 24px 0' }}>
                  Read about{' '}
                  <a href="#" style={{ color: '#005cca', textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                    Get started with Anomaly detection <FiExternalLink size={12} />
                  </a>
                </p>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  <button onClick={() => toast.success('Loading sample detector')} className="wz-btn-secondary" style={{ borderColor: '#005cca', color: '#005cca', fontWeight: 600, padding: '10px 20px' }}>
                    Try a sample detector
                  </button>
                  <button onClick={() => { setIsCreating(true); toast.success('Creating new detector'); }} className="wz-btn" style={{ padding: '10px 20px', fontWeight: 600 }}>
                    Create detector
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              3. DETECTORS LIST VIEW
              ========================================== */}
          {activeSub === 'detectors' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#1e293b', margin: 0 }}>
                  Detectors <span style={{ color: '#64748b', fontWeight: 400 }}>({detectors.length})</span>
                </h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="wz-btn-secondary" disabled style={{ color: '#94a3b8', background: '#f8fafc', borderColor: '#cbd5e1', cursor: 'not-allowed', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Actions <FiChevronDown size={14} />
                  </button>
                  <button onClick={() => setIsCreating(true)} className="wz-btn" style={{ fontWeight: 600 }}>
                    Create detector
                  </button>
                </div>
              </div>

              <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '24px 32px' }}>
                {/* Search / Filters Row */}
                <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                  <div style={{ flex: 1, position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                      <FiSearch size={14} />
                    </span>
                    <input 
                      type="text" 
                      placeholder="Search" 
                      className="wz-search-input"
                      style={{ paddingLeft: '38px', fontSize: '13px' }}
                    />
                  </div>
                  <select className="wz-select" style={{ width: '180px' }}>
                    <option>All detector states</option>
                  </select>
                  <select className="wz-select" style={{ width: '150px' }}>
                    <option>All indices</option>
                  </select>
                </div>

                {/* Table */}
                <div className="wz-table-wrapper" style={{ border: 'none' }}>
                  <table className="wz-table">
                    <thead>
                      <tr>
                        <th style={{ width: '30px' }}><input type="checkbox" disabled /></th>
                        <th>Detector</th>
                        <th>Indices</th>
                        <th>Real-time state</th>
                        <th>Historical analysis</th>
                        <th>Anomalies last 24 hours</th>
                        <th>Last real-time occurrence</th>
                        <th>Last started</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detectors.map((det, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0', cursor: 'pointer' }} onClick={() => setActiveDetector(det.name)}>
                          <td><input type="checkbox" disabled /></td>
                          <td style={{ color: '#005cca', fontWeight: 500, padding: '12px 16px', fontSize: '13px' }}>{det.name}</td>
                          <td style={{ padding: '12px 16px', fontSize: '13px' }}>-</td>
                          <td style={{ padding: '12px 16px', fontSize: '13px' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }}></span>
                              {det.status}
                            </span>
                          </td>
                          <td style={{ padding: '12px 16px', fontSize: '13px' }}>Disabled</td>
                          <td style={{ padding: '12px 16px', fontSize: '13px' }}>0</td>
                          <td style={{ padding: '12px 16px', fontSize: '13px' }}>-</td>
                          <td style={{ padding: '12px 16px', fontSize: '13px' }}>{det.created}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {detectors.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '48px 20px', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 20px 0', lineHeight: 1.6, maxWidth: '640px' }}>
                      A detector is an individual anomaly detection task. You can create multiple detectors, and all the detectors can run simultaneously, with each analyzing data from different sources. Create an anomaly detector to get started.
                    </p>
                    <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => {
                      const sampleDetector = { name: 'Sample Threat Detector', created: new Date().toLocaleString(), status: 'Active' };
                      const updated = [...detectors, sampleDetector];
                      setDetectors(updated);
                      localStorage.setItem('wz_anomaly_detectors', JSON.stringify(updated));
                      setActiveDetector('Sample Threat Detector');
                      toast.success('Sample detector created');
                    }} className="wz-btn-secondary" style={{ borderColor: '#005cca', color: '#005cca', fontWeight: 600 }}>
                      Try a sample detector
                    </button>
                    <button onClick={() => { setIsCreating(true); toast.success('Creating new detector'); }} className="wz-btn" style={{ fontWeight: 600 }}>
                      Create detector
                      </button>
                    </div>
                  </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AnomalyDetection;
