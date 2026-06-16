import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useSearchParams } from 'react-router-dom';
import { FiSearch, FiChevronDown, FiPlus } from 'react-icons/fi';

const Notifications: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeSub = searchParams.get('view') || 'channels';

  const [isCreatingChannel, setIsCreatingChannel] = useState(false);
  const [channelType, setChannelType] = useState('Slack');
  const [channelName, setChannelName] = useState('');
  const [channelDesc, setChannelDesc] = useState('');
  const [channels, setChannels] = useState<Array<{name: string, type: string, status: string, desc: string}>>(() => {
    try { return JSON.parse(localStorage.getItem('wz_notification_channels') || '[]'); } catch { return []; }
  });
  const [senderType, setSenderType] = useState('SMTP sender');
  const [isCreateSMTPOpen, setIsCreateSMTPOpen] = useState(false);
  const [isCreatingSMTPSender, setIsCreatingSMTPSender] = useState(false);
  const [isCreatingSESSender, setIsCreatingSESSender] = useState(false);
  const [isCreateRecipientGroupOpen, setIsCreateRecipientGroupOpen] = useState(false);

  const setView = (view: string) => {
    setSearchParams({ view });
  };

  if (isCreatingSMTPSender) {
    return (
      <div className="wz-page" style={{ background: '#f8fafc', padding: '24px', display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 48px)' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 300, color: '#1e293b', margin: '0 0 24px 0' }}>Create SMTP sender</h1>

        <div style={{ flex: 1, paddingBottom: '80px' }}>
          <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 500, color: '#1e293b', margin: '0 0 16px 0' }}>Configure sender</h2>
            <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '0 -24px 20px -24px' }} />

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Sender name</label>
              <input 
                type="text" 
                placeholder="Enter sender name"
                style={{ width: '100%', maxWidth: '600px', boxSizing: 'border-box', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none', marginBottom: '8px' }} 
              />
              <div style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.5 }}>
                Use a unique, descriptive name. The sender name must contain from 2 to 50 characters. Valid characters are lowercase a-z, 0-9, - (hyphen) and _ (underscore).
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr', gap: '16px', marginBottom: '24px', maxWidth: '800px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Email address</label>
                <input 
                  type="text" 
                  placeholder="name@example.com"
                  style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none' }} 
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Host</label>
                <input 
                  type="text" 
                  placeholder="smtp.example.com"
                  style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none' }} 
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Port</label>
                <input 
                  type="text" 
                  placeholder="465"
                  style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none' }} 
                />
              </div>
            </div>

            <div style={{ maxWidth: '600px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Encryption method</label>
              <select style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none', background: '#ffffff', marginBottom: '8px' }}>
                <option>SSL/TLS</option>
              </select>
              <div style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.5 }}>
                SSL/TLS or STARTTLS is recommended for security. To use either one, you must enter each sender account's credentials to the OpenSearch keystore using the CLI. <span style={{ color: '#005cca', fontWeight: 600, cursor: 'pointer' }}>Learn more</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions Bar */}
        <div style={{ 
          position: 'fixed', 
          bottom: 0, 
          left: 0, 
          right: 0, 
          background: '#ffffff', 
          borderTop: '1px solid #e2e8f0', 
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: '16px',
          zIndex: 10
        }}>
          <button 
            onClick={() => { setIsCreatingSMTPSender(false); toast.success('Cancelled'); }}
            style={{ background: 'none', border: 'none', color: '#005cca', fontWeight: 600, fontSize: '13px', cursor: 'pointer', padding: '8px 16px' }}
          >
            Cancel
          </button>
          <button onClick={() => toast.success('SMTP sender created')} className="wz-btn" style={{ fontWeight: 600, padding: '8px 24px' }}>
            Create
          </button>
        </div>
      </div>
    );
  }

  if (isCreatingSESSender) {
    return (
      <div className="wz-page" style={{ background: '#f8fafc', padding: '24px', display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 48px)' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 300, color: '#1e293b', margin: '0 0 24px 0' }}>Create SES sender</h1>

        <div style={{ flex: 1, paddingBottom: '80px' }}>
          <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 500, color: '#1e293b', margin: '0 0 16px 0' }}>Configure sender</h2>
            <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '0 -24px 20px -24px' }} />

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Sender name</label>
              <input 
                type="text" 
                placeholder="Enter sender name"
                style={{ width: '100%', maxWidth: '600px', boxSizing: 'border-box', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none', marginBottom: '8px' }} 
              />
              <div style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.5 }}>
                Use a unique, descriptive name. The sender name must contain from 2 to 50 characters. Valid characters are lowercase a-z, 0-9, - (hyphen) and _ (underscore).
              </div>
            </div>

            <div style={{ marginBottom: '24px', maxWidth: '600px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Email address</label>
              <input 
                type="text" 
                placeholder="name@example.com"
                style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none' }} 
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', maxWidth: '600px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>IAM Role ARN</label>
                <input 
                  type="text" 
                  placeholder="ARN key"
                  style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none' }} 
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>AWS region</label>
                <input 
                  type="text" 
                  placeholder="us-east-1"
                  style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none' }} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions Bar */}
        <div style={{ 
          position: 'fixed', 
          bottom: 0, 
          left: 0, 
          right: 0, 
          background: '#ffffff', 
          borderTop: '1px solid #e2e8f0', 
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: '16px',
          zIndex: 10
        }}>
          <button 
            onClick={() => { setIsCreatingSESSender(false); toast.success('Cancelled'); }}
            style={{ background: 'none', border: 'none', color: '#005cca', fontWeight: 600, fontSize: '13px', cursor: 'pointer', padding: '8px 16px' }}
          >
            Cancel
          </button>
          <button onClick={() => toast.success('SES sender created')} className="wz-btn" style={{ fontWeight: 600, padding: '8px 24px' }}>
            Create
          </button>
        </div>
      </div>
    );
  }

  if (isCreatingChannel) {
    return (
      <div className="wz-page" style={{ background: '#f8fafc', padding: '24px', display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 48px)' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 300, color: '#1e293b', margin: '0 0 24px 0' }}>Create channel</h1>

        <div style={{ flex: 1, paddingBottom: '80px' }}>
          {/* Name and description */}
          <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '24px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 500, color: '#1e293b', margin: '0 0 16px 0' }}>Name and description</h2>
            <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '0 -24px 20px -24px' }} />

            <div style={{ marginBottom: '20px', maxWidth: '600px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Name</label>
              <input 
                type="text" 
                placeholder="Enter channel name"
                className="wz-input"
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none' }}
              />
            </div>

            <div style={{ maxWidth: '600px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Description - <span style={{ fontWeight: 400, fontStyle: 'italic', color: '#64748b' }}>optional</span></label>
              <textarea 
                placeholder="What is the purpose of this channel?"
                rows={3}
                value={channelDesc}
                onChange={(e) => setChannelDesc(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none', resize: 'vertical' }}
              ></textarea>
            </div>
          </div>

          {/* Configurations */}
          <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 500, color: '#1e293b', margin: '0 0 16px 0' }}>Configurations</h2>
            <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '0 -24px 20px -24px' }} />

            <div style={{ marginBottom: '24px', maxWidth: '600px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>Channel type</label>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>Channel type cannot be changed after the channel is created.</div>
              <select 
                value={channelType}
                onChange={(e) => setChannelType(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none', background: '#ffffff' }}
              >
                <option value="Slack">Slack</option>
                <option value="Chime">Chime</option>
                <option value="Microsoft Teams">Microsoft Teams</option>
                <option value="Custom webhook">Custom webhook</option>
                <option value="Email">Email</option>
                <option value="Amazon SNS">Amazon SNS</option>
              </select>
            </div>

            {channelType === 'Slack' && (
              <div style={{ maxWidth: '600px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Slack webhook URL</label>
                <input 
                  type="text" 
                  placeholder="https://hooks.slack.com/services/XXXXX/XXXXX/XXXXX..."
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none' }}
                />
              </div>
            )}

            {channelType === 'Amazon SNS' && (
              <div style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>SNS topic ARN</label>
                  <input 
                    type="text" 
                    placeholder="ARN key"
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>IAM role ARN</label>
                  <input 
                    type="text" 
                    placeholder="ARN key"
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none' }}
                  />
                </div>
              </div>
            )}

            {channelType === 'Email' && (
              <div style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Sender type</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#1e293b', cursor: 'pointer' }}>
                      <input 
                        type="radio" 
                        checked={senderType === 'SMTP sender'} 
                        onChange={() => setSenderType('SMTP sender')} 
                        style={{ accentColor: '#005cca', width: '16px', height: '16px' }}
                      />
                      SMTP sender
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#64748b', cursor: 'pointer' }}>
                      <input 
                        type="radio" 
                        checked={senderType === 'SES sender'} 
                        onChange={() => setSenderType('SES sender')} 
                        style={{ accentColor: '#005cca', width: '16px', height: '16px' }}
                      />
                      SES sender
                    </label>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#dc2626', marginBottom: '8px' }}>SMTP sender</label>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <select style={{ width: '100%', padding: '8px 12px', border: '1px solid #dc2626', borderRadius: '4px', fontSize: '13px', outline: 'none', background: '#ffffff', color: '#64748b' }}>
                        <option>Sender name</option>
                      </select>
                      <div style={{ fontSize: '12px', color: '#dc2626', marginTop: '4px', fontWeight: 500 }}>Sender cannot be empty.</div>
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', lineHeight: 1.5 }}>
                        A destination only allows one SMTP or SES sender. Use "Create SMTP sender" to create a sender with its email address, host, port, encryption method.
                      </div>
                    </div>
                    <button 
                      onClick={() => setIsCreateSMTPOpen(true)}
                      className="wz-btn-secondary" 
                      style={{ color: '#005cca', borderColor: '#005cca', fontWeight: 600, padding: '8px 16px', whiteSpace: 'nowrap' }}
                    >
                      Create SMTP sender
                    </button>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#dc2626', marginBottom: '8px' }}>Default recipients</label>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <select style={{ width: '100%', padding: '8px 12px', border: '1px solid #dc2626', borderRadius: '4px', fontSize: '13px', outline: 'none', background: '#ffffff', color: '#64748b' }}>
                        <option>Email address, recipient group name</option>
                      </select>
                      <div style={{ fontSize: '12px', color: '#dc2626', marginTop: '4px', fontWeight: 500 }}>Default recipients cannot be empty.</div>
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', lineHeight: 1.5 }}>
                        Add recipient(s) using an email address or pre-created email group. Use "Create email group" to create an email group.
                      </div>
                    </div>
                    <button 
                      onClick={() => setIsCreateRecipientGroupOpen(true)}
                      className="wz-btn-secondary" 
                      style={{ color: '#005cca', borderColor: '#005cca', fontWeight: 600, padding: '8px 16px', whiteSpace: 'nowrap' }}
                    >
                      Create recipient group
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Actions Bar */}
        <div style={{ 
          position: 'fixed', 
          bottom: 0, 
          left: 0, 
          right: 0, 
          background: '#ffffff', 
          borderTop: '1px solid #e2e8f0', 
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: '16px',
          zIndex: 10
        }}>
          <button 
            onClick={() => { setIsCreatingChannel(false); toast.success('Cancelled'); }}
            style={{ background: 'none', border: 'none', color: '#005cca', fontWeight: 600, fontSize: '13px', cursor: 'pointer', padding: '8px 16px' }}
          >
            Cancel
          </button>
          <button onClick={() => toast.success('Test message sent')} className="wz-btn-secondary" style={{ color: '#005cca', borderColor: '#005cca', fontWeight: 600, padding: '8px 16px' }}>
            Send test message
          </button>
          <button onClick={() => {
            const newChannel = { name: channelName || 'New Channel', type: channelType, status: 'Active', desc: channelDesc || '-' };
            const updated = [...channels, newChannel];
            setChannels(updated);
            localStorage.setItem('wz_notification_channels', JSON.stringify(updated));
            setIsCreatingChannel(false);
            setChannelName('');
            setChannelDesc('');
            toast.success('Channel created');
          }} className="wz-btn" style={{ fontWeight: 600, padding: '8px 24px' }}>
            Create
          </button>
        </div>

        {/* Create SMTP sender Modal */}
        {isCreateSMTPOpen && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
            <div style={{ background: '#ffffff', borderRadius: '4px', width: '600px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 300, color: '#1e293b', margin: 0 }}>Create SMTP sender</h2>
                <button onClick={() => { setIsCreateSMTPOpen(false); toast.success('Cancelled'); }} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
              
              <div style={{ padding: '0 24px 24px 24px' }}>
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Sender name</label>
                  <input 
                    type="text" 
                    placeholder="Enter sender name"
                    style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none', marginBottom: '8px' }} 
                  />
                  <div style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.5 }}>
                    Use a unique, descriptive name. The sender name must contain from 2 to 50 characters. Valid characters are lowercase a-z, 0-9, - (hyphen) and _ (underscore).
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr', gap: '16px', marginBottom: '24px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Email address</label>
                    <input 
                      type="text" 
                      placeholder="name@example.com"
                      style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none' }} 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Host</label>
                    <input 
                      type="text" 
                      placeholder="smtp.example.com"
                      style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none' }} 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Port</label>
                    <input 
                      type="text" 
                      placeholder="465"
                      style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none' }} 
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Encryption method</label>
                  <select style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none', background: '#ffffff', marginBottom: '8px' }}>
                    <option>SSL/TLS</option>
                  </select>
                  <div style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.5 }}>
                    SSL/TLS or STARTTLS is recommended for security. To use either one, you must enter each sender account's credentials to the OpenSearch keystore using the CLI. <span style={{ color: '#005cca', fontWeight: 600, cursor: 'pointer' }}>Learn more</span>
                  </div>
                </div>
              </div>

              <div style={{ padding: '16px 24px', background: '#ffffff', display: 'flex', justifyContent: 'flex-end', gap: '12px', borderRadius: '0 0 4px 4px' }}>
                <button onClick={() => { setIsCreateSMTPOpen(false); toast.success('Cancelled'); }} style={{ background: 'none', border: 'none', color: '#005cca', fontWeight: 600, fontSize: '13px', cursor: 'pointer', padding: '8px 16px' }}>Cancel</button>
                <button className="wz-btn" onClick={() => { setIsCreateSMTPOpen(false); toast.success('SMTP sender created'); }} style={{ fontWeight: 600, padding: '8px 24px' }}>
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="wz-page" style={{ background: '#f8fafc', padding: 0 }}>
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
            onClick={() => setView('channels')}
            style={{
              background: 'none',
              border: 'none',
              textAlign: 'left',
              fontSize: '14px',
              fontWeight: activeSub === 'channels' ? 700 : 600,
              color: activeSub === 'channels' ? '#1e293b' : '#64748b',
              padding: '6px 8px',
              cursor: 'pointer',
              borderRadius: '4px'
            }}
          >
            Notifications
          </button>
          
          <button 
            onClick={() => setView('channels')}
            style={{
              background: 'none',
              border: 'none',
              textAlign: 'left',
              fontSize: '13px',
              fontWeight: activeSub === 'channels' ? 600 : 500,
              color: activeSub === 'channels' ? '#005cca' : '#475569',
              padding: '4px 16px',
              cursor: 'pointer',
              textDecoration: activeSub === 'channels' ? 'underline' : 'none'
            }}
          >
            Channels
          </button>
          
          <button 
            onClick={() => setView('senders')}
            style={{
              background: 'none',
              border: 'none',
              textAlign: 'left',
              fontSize: '13px',
              fontWeight: activeSub === 'senders' ? 600 : 500,
              color: activeSub === 'senders' ? '#005cca' : '#475569',
              padding: '4px 16px',
              cursor: 'pointer',
              textDecoration: activeSub === 'senders' ? 'underline' : 'none'
            }}
          >
            Email senders
          </button>

          <button 
            onClick={() => setView('recipient-groups')}
            style={{
              background: 'none',
              border: 'none',
              textAlign: 'left',
              fontSize: '13px',
              fontWeight: activeSub === 'recipient-groups' ? 600 : 500,
              color: activeSub === 'recipient-groups' ? '#005cca' : '#475569',
              padding: '4px 16px',
              cursor: 'pointer',
              textDecoration: activeSub === 'recipient-groups' ? 'underline' : 'none'
            }}
          >
            Email recipient groups
          </button>
        </div>

        {/* Right Content Area */}
        <div style={{ flex: 1, padding: '24px 32px', overflowY: 'auto' }}>
          
          {/* ==========================================
              1. CHANNELS VIEW
              ========================================== */}
          {activeSub === 'channels' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#1e293b', margin: 0 }}>
                  Channels <span style={{ color: '#64748b', fontWeight: 400 }}>({channels.length})</span>
                </h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="wz-btn-secondary" disabled style={{ color: '#94a3b8', background: '#f8fafc', borderColor: '#cbd5e1', cursor: 'not-allowed', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Actions <FiChevronDown size={14} />
                  </button>
                  <button className="wz-btn" style={{ fontWeight: 600 }} onClick={() => { setIsCreatingChannel(true); toast.success('Creating new channel'); }}>
                    Create channel
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
                  <select className="wz-select" style={{ width: '130px' }}>
                    <option>Status</option>
                  </select>
                  <select className="wz-select" style={{ width: '130px' }}>
                    <option>Type</option>
                  </select>
                </div>

                {/* Table */}
                <div className="wz-table-wrapper" style={{ border: 'none' }}>
                  <table className="wz-table">
                    <thead>
                      <tr>
                        <th style={{ width: '30px', padding: '12px 16px' }}><input type="checkbox" disabled /></th>
                        <th style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>Name ↑</th>
                        <th style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>Notification status</th>
                        <th style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>Type</th>
                        <th style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {channels.map((ch, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '12px 16px' }}><input type="checkbox" disabled /></td>
                          <td style={{ padding: '12px 16px', fontSize: '13px', color: '#005cca', fontWeight: 500 }}>{ch.name}</td>
                          <td style={{ padding: '12px 16px', fontSize: '13px', color: '#1e293b' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }}></span>
                              {ch.status}
                            </span>
                          </td>
                          <td style={{ padding: '12px 16px', fontSize: '13px', color: '#1e293b' }}>{ch.type}</td>
                          <td style={{ padding: '12px 16px', fontSize: '13px', color: '#1e293b' }}>{ch.desc}</td>
                        </tr>
                      ))}
                      {channels.length === 0 && (
                        <tr>
                          <td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>No channels configured. Click "Create channel" to add one.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderTop: '1px solid #e2e8f0', background: '#fafafa' }}>
                    <div style={{ fontSize: '13px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      Rows per page: 10 <FiChevronDown />
                    </div>
                    <div style={{ fontSize: '13px', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <span style={{ color: '#94a3b8', cursor: 'not-allowed' }}>&lt;</span>
                      <span style={{ fontWeight: 600, color: '#005cca' }}>1</span>
                      <span style={{ color: '#94a3b8', cursor: 'not-allowed' }}>&gt;</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              2. EMAIL SENDERS VIEW
              ========================================== */}
          {activeSub === 'senders' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              <h1 style={{ fontSize: '32px', fontWeight: 300, color: '#1e293b', margin: '0 0 8px 0' }}>
                Email senders
              </h1>

              {/* SMTP Senders Card */}
              <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '24px 32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', margin: 0 }}>
                    SMTP senders <span style={{ color: '#64748b', fontWeight: 400 }}>(0)</span>
                  </h3>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="wz-btn-secondary" disabled style={{ color: '#94a3b8', background: '#f8fafc', borderColor: '#cbd5e1', cursor: 'not-allowed' }}>
                      Delete
                    </button>
                    <button className="wz-btn-secondary" disabled style={{ color: '#94a3b8', background: '#f8fafc', borderColor: '#cbd5e1', cursor: 'not-allowed' }}>
                      Edit
                    </button>
                    <button className="wz-btn" style={{ fontWeight: 600 }} onClick={() => { setIsCreatingSMTPSender(true); toast.success('Creating SMTP sender'); }}>
                      Create SMTP sender
                    </button>
                  </div>
                </div>

                {/* Filters Row */}
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
                    <option>Encryption method</option>
                  </select>
                  <div style={{ 
                    border: '1px solid #cbd5e1', 
                    borderRadius: '4px', 
                    padding: '8px 12px', 
                    fontSize: '13px', 
                    color: '#1e293b',
                    background: '#f8fafc'
                  }}>
                    0
                  </div>
                </div>

                {/* Table */}
                <div className="wz-table-wrapper" style={{ border: 'none' }}>
                  <table className="wz-table">
                    <thead>
                      <tr>
                        <th style={{ width: '30px', padding: '12px 16px' }}><input type="checkbox" disabled /></th>
                        <th style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>Name ↑</th>
                        <th style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>Outbound email address</th>
                        <th style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>Host</th>
                        <th style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>Port</th>
                        <th style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>Encryption method</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '12px 16px' }}><input type="checkbox" disabled /></td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', color: '#1e293b' }}>saaad</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', color: '#1e293b' }}>saadelkadiri@gmail.com</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', color: '#1e293b' }}>smtp.exapmle.com</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', color: '#1e293b' }}>465</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', color: '#1e293b' }}>SSL/TLS</td>
                      </tr>
                    </tbody>
                  </table>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderTop: '1px solid #e2e8f0', background: '#fafafa' }}>
                    <div style={{ fontSize: '13px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      Rows per page: 5 <FiChevronDown />
                    </div>
                    <div style={{ fontSize: '13px', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <span style={{ color: '#94a3b8', cursor: 'not-allowed' }}>&lt;</span>
                      <span style={{ fontWeight: 600, color: '#005cca' }}>1</span>
                      <span style={{ color: '#94a3b8', cursor: 'not-allowed' }}>&gt;</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SES Senders Card */}
              <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '24px 32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', margin: 0 }}>
                    SES senders <span style={{ color: '#64748b', fontWeight: 400 }}>(0)</span>
                  </h3>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="wz-btn-secondary" disabled style={{ color: '#94a3b8', background: '#f8fafc', borderColor: '#cbd5e1', cursor: 'not-allowed' }}>
                      Delete
                    </button>
                    <button className="wz-btn-secondary" disabled style={{ color: '#94a3b8', background: '#f8fafc', borderColor: '#cbd5e1', cursor: 'not-allowed' }}>
                      Edit
                    </button>
                    <button className="wz-btn" style={{ fontWeight: 600 }} onClick={() => { setIsCreatingSESSender(true); toast.success('Creating SES sender'); }}>
                      Create SES sender
                    </button>
                  </div>
                </div>

                {/* Filters Row */}
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
                </div>

                {/* Table */}
                <div className="wz-table-wrapper" style={{ border: 'none' }}>
                  <table className="wz-table">
                    <thead>
                      <tr>
                        <th style={{ width: '30px', padding: '12px 16px' }}><input type="checkbox" disabled /></th>
                        <th style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>Name ↑</th>
                        <th style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>Outbound email address</th>
                        <th style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>AWS region</th>
                        <th style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>Role ARN</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan={5} style={{ padding: '48px 20px', textAlign: 'center' }}>
                          <h3 style={{ fontSize: '24px', fontWeight: 300, color: '#1e293b', margin: '0 0 12px 0' }}>
                            No SES senders to display
                          </h3>
                          <p style={{ fontSize: '13px', color: '#64748b', margin: '0 auto 20px auto', lineHeight: 1.6, maxWidth: '560px' }}>
                            Set up an outbound email server by creating a sender. You will select a sender when configuring email channels.
                          </p>
                          <button className="wz-btn-secondary" style={{ borderColor: '#005cca', color: '#005cca', fontWeight: 600 }} onClick={() => { setIsCreatingSESSender(true); toast.success('Creating SES sender'); }}>
                            Create SES sender
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              3. EMAIL RECIPIENT GROUPS VIEW
              ========================================== */}
          {activeSub === 'recipient-groups' && (
            <div>
              <h1 style={{ fontSize: '32px', fontWeight: 300, color: '#1e293b', margin: '0 0 16px 0' }}>
                Email recipient groups
              </h1>

              <div className="wz-pill-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '24px 32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', margin: 0 }}>
                    Recipient groups <span style={{ color: '#64748b', fontWeight: 400 }}>(0)</span>
                  </h3>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="wz-btn-secondary" disabled style={{ color: '#94a3b8', background: '#f8fafc', borderColor: '#cbd5e1', cursor: 'not-allowed' }}>
                      Delete
                    </button>
                    <button className="wz-btn-secondary" disabled style={{ color: '#94a3b8', background: '#f8fafc', borderColor: '#cbd5e1', cursor: 'not-allowed' }}>
                      Edit
                    </button>
                    <button className="wz-btn" style={{ fontWeight: 600 }} onClick={() => { setIsCreateRecipientGroupOpen(true); toast.success('Creating recipient group'); }}>
                      Create recipient group
                    </button>
                  </div>
                </div>

                {/* Filters Row */}
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
                </div>

                {/* Table */}
                <div className="wz-table-wrapper" style={{ border: 'none' }}>
                  <table className="wz-table">
                    <thead>
                      <tr>
                        <th style={{ width: '30px', padding: '12px 16px' }}><input type="checkbox" disabled /></th>
                        <th style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>Name ↑</th>
                        <th style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>Email addresses</th>
                        <th style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan={4} style={{ padding: '48px 20px', textAlign: 'center' }}>
                          <h3 style={{ fontSize: '24px', fontWeight: 300, color: '#1e293b', margin: '0 0 12px 0' }}>
                            No recipient groups to display
                          </h3>
                          <p style={{ fontSize: '13px', color: '#64748b', margin: '0 auto 20px auto', lineHeight: 1.6, maxWidth: '560px' }}>
                            Use an email group to manage a list of email addresses you frequently send at a time. You can select recipient groups when configuring email channels.
                          </p>
                          <button className="wz-btn-secondary" style={{ borderColor: '#005cca', color: '#005cca', fontWeight: 600 }} onClick={() => { setIsCreateRecipientGroupOpen(true); toast.success('Creating recipient group'); }}>
                            Create recipient group
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Create Recipient Group Modal */}
      {isCreateRecipientGroupOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#ffffff', borderRadius: '4px', width: '600px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 300, color: '#1e293b', margin: 0 }}>Create recipient group</h2>
              <button onClick={() => { setIsCreateRecipientGroupOpen(false); toast.success('Cancelled'); }} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            
            <div style={{ padding: '0 24px 24px 24px' }}>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Name</label>
                <input 
                  type="text" 
                  placeholder="Enter recipient group name"
                  style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none', marginBottom: '8px' }} 
                />
                <div style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.5 }}>
                  The name must contain 2 to 50 characters. Valid characters are A-Z, a-z, 0-9, (_) underscore, (-) hyphen and unicode characters.
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>Description - <span style={{ fontWeight: 400, fontStyle: 'italic', color: '#64748b' }}>optional</span></label>
                <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '8px' }}>Describe the purpose of the channel.</div>
                <textarea 
                  placeholder="What is the purpose of this recipient group?"
                  rows={3}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none', resize: 'vertical' }}
                ></textarea>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>Emails</label>
                <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '8px' }}>Select or type in one or more email addresses.</div>
                <select style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none', background: '#ffffff', color: '#64748b' }}>
                  <option>Email addresses</option>
                </select>
              </div>
            </div>

            <div style={{ padding: '16px 24px', background: '#ffffff', display: 'flex', justifyContent: 'flex-end', gap: '12px', borderRadius: '0 0 4px 4px' }}>
              <button onClick={() => { setIsCreateRecipientGroupOpen(false); toast.success('Cancelled'); }} style={{ background: 'none', border: 'none', color: '#005cca', fontWeight: 600, fontSize: '13px', cursor: 'pointer', padding: '8px 16px' }}>Cancel</button>
              <button className="wz-btn" onClick={() => { setIsCreateRecipientGroupOpen(false); toast.success('Recipient group created'); }} style={{ fontWeight: 600, padding: '8px 24px' }}>
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
