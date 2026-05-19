import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Map from './components/Map';
import Analytics from './components/Analytics';
import { ShieldAlert, Users, TrendingUp, History, Trash2, CheckCircle } from 'lucide-react';
import EmergencyPanel from './components/emergency/EmergencyPanel';

// NOTE: Replace with your actual Google Maps API Key
const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY";

const App = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [selectedIncident, setSelectedIncident] = useState(null);
  const lastIncidentId = React.useRef(null);


  const fetchIncidents = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/incidents`);
      const data = await response.json();

      // Auto-detect new incident
      if (data.length > 0) {
        const latest = data[0];
        if (lastIncidentId.current && latest._id !== lastIncidentId.current) {
          console.log('New Incident Detected! Auto-opening details...');
          setSelectedIncident(latest);
          // Optional: Add a notification sound or visual alert here
        }
        lastIncidentId.current = latest._id;
      }

      setIncidents(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const resolveIncident = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/incidents/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'resolved' })
      });
      if (response.ok) {
        const updatedIncident = await response.json();
        setIncidents(prev => prev.map(i => i._id === id ? updatedIncident : i));
        if (selectedIncident?._id === id) setSelectedIncident(updatedIncident);
      }
    } catch (err) {
      console.error('Error resolving incident:', err);
    }
  };



  useEffect(() => {
    fetchIncidents();
    const interval = setInterval(fetchIncidents, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const highSeverityCount = incidents.filter(i => i.severity === 'high').length;
  const pendingCount = incidents.filter(i => i.status === 'pending').length;

  const renderContent = () => {
    switch (activeTab) {
      case 'Live Map':
        return (
          <div className="card glass" style={{ borderRadius: '16px', overflow: 'hidden', height: '600px' }}>
            <Map incidents={incidents} />
          </div>
        );
      case 'Analytics':
        return (
          <div style={{ height: '600px' }}>
            <Analytics incidents={incidents} />
          </div>
        );
      case 'Incidents':
        return (
          <div className="card glass" style={{ padding: '24px', borderRadius: '16px' }}>
            <h3 style={{ marginBottom: '20px' }}>Incident Logs</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '12px' }}>Time</th>
                  <th style={{ padding: '12px' }}>Location</th>
                  <th style={{ padding: '12px' }}>Severity</th>
                  <th style={{ padding: '12px' }}>Status</th>
                  <th style={{ padding: '12px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {incidents.map(incident => (
                  <tr key={incident._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px' }}>{new Date(incident.timestamp || incident.createdAt).toLocaleString()}</td>
                    <td style={{ padding: '12px' }}>{(incident.location.latitude ?? incident.location.lat).toFixed(4)}, {(incident.location.longitude ?? incident.location.lng).toFixed(4)}</td>
                    <td style={{ padding: '12px', color: incident.severity === 'high' ? '#ef4444' : '#f59e0b' }}>{incident.severity}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        backgroundColor: incident.status === 'resolved' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                        color: incident.status === 'resolved' ? '#10b981' : '#f59e0b',
                        textTransform: 'capitalize'
                      }}>
                        {incident.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      {incident.status === 'pending' ? (
                        <button
                          onClick={() => resolveIncident(incident._id)}
                          style={{
                            background: 'rgba(16, 185, 129, 0.1)',
                            color: '#10b981',
                            border: '1px solid rgba(16, 185, 129, 0.2)',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <CheckCircle size={14} /> Resolve
                        </button>
                      ) : (
                        <div style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                          <CheckCircle size={14} /> Completed
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'Dashboard':
      default:
        return (
          <>
            {/* Top Section: Map & Recent List */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px', marginBottom: '32px', height: '450px' }}>
              <div className="card glass" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                <Map incidents={incidents} />
              </div>
              <div style={{ backgroundColor: 'rgba(18, 18, 22, 0.4)', borderRadius: '24px', padding: '32px', display: 'flex', flexDirection: 'column', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', color: 'rgba(255,255,255,0.4)' }}>Live Telemetry Feed</h3>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', boxShadow: '0 0 10px #10b981' }}></div>
                </div>
                <div style={{ flex: 1, overflowY: 'auto', paddingRight: '8px' }} className="custom-scrollbar">
                   {incidents.slice(0, 10).map((incident, idx) => (
                    <div 
                      key={incident._id} 
                      onClick={() => setSelectedIncident(incident)}
                      style={{
                        padding: '16px',
                        borderRadius: '16px',
                        backgroundColor: idx % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                        marginBottom: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                      className={`alert-item-kinetic ${incident.severity === 'high' ? 'pulse-border' : ''}`}
                    >
                      <div style={{ 
                        width: '48px', 
                        height: '48px', 
                        borderRadius: '12px', 
                        backgroundColor: incident.severity === 'high' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: incident.severity === 'high' ? '#ef4444' : '#f59e0b'
                      }}>
                        <ShieldAlert size={20} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                          <span style={{ fontWeight: 800, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{incident.severity === 'high' ? 'Critical Impact' : 'Minor Collision'}</span>
                          <span style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.3)' }}>
                            {new Date(incident.timestamp || incident.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace' }}>
                          LOC: {(incident.location.latitude ?? incident.location.lat).toFixed(4)}N / {(incident.location.longitude ?? incident.location.lng).toFixed(4)}E
                        </div>
                      </div>
                    </div>
                  ))}
                  {incidents.length === 0 && <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginTop: '40px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Scanning for anomalies...</p>}
                </div>
              </div>
            </div>

            {/* Bottom Section: Analytics */}
            <div style={{ height: '350px' }}>
              <Analytics incidents={incidents} />
            </div>
          </>
        );
    }
  };

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', backgroundColor: 'var(--bg-dark)', color: 'white', overflow: 'hidden' }}>
      <Sidebar activeTab={activeTab} onTabChange={(tab) => {
        setActiveTab(tab);
        setSelectedIncident(null);
      }} />

      <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>{activeTab} Overview</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Real-time monitoring and response system</p>
          </div>
        </div>

        {/* Header Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
          <StatCard icon={<ShieldAlert color="#ef4444" />} label="Total Incidents" value={incidents.length} color="#ef4444" />
          <StatCard icon={<TrendingUp color="#f59e0b" />} label="Critical SOS" value={highSeverityCount} color="#f59e0b" />
          <StatCard icon={<History color="#3b82f6" />} label="Pending" value={pendingCount} color="#3b82f6" />
          <StatCard icon={<Users color="#10b981" />} label="Active Units" value="12" color="#10b981" />
        </div>

        {selectedIncident ? (
          <EmergencyPanel 
            incident={selectedIncident} 
            onBack={() => setSelectedIncident(null)} 
            googleApiKey={GOOGLE_MAPS_API_KEY}
          />
        ) : renderContent()}
      </main>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => (
  <div style={{ 
    backgroundColor: 'rgba(28, 28, 36, 0.4)', 
    padding: '32px', 
    borderRadius: '24px', 
    display: 'flex', 
    flexDirection: 'column',
    gap: '12px',
    border: '1px solid rgba(255,255,255,0.03)',
    backdropFilter: 'blur(10px)',
    transition: 'transform 0.3s ease'
  }} className="stat-card-kinetic">
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ backgroundColor: `${color}10`, padding: '10px', borderRadius: '12px', color: color }}>
        {icon}
      </div>
      <span style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', color: 'rgba(255,255,255,0.3)' }}>{label}</span>
    </div>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
      <h2 style={{ fontSize: '48px', fontWeight: 900, letterSpacing: '-2px', color: 'white', lineHeight: 1 }}>{value}</h2>
      <div style={{ width: '12px', height: '4px', backgroundColor: color, borderRadius: '2px' }}></div>
    </div>
  </div>
);

export default App;
