import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Map from './components/Map';
import Analytics from './components/Analytics';
import { ShieldAlert, Users, TrendingUp, History } from 'lucide-react';

const App = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Dashboard');


  const fetchIncidents = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/incidents`);
      const data = await response.json();
      setIncidents(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
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
                </tr>
              </thead>
              <tbody>
                {incidents.map(incident => (
                  <tr key={incident._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px' }}>{new Date(incident.timestamp || incident.createdAt).toLocaleString()}</td>
                    <td style={{ padding: '12px' }}>{(incident.location.latitude ?? incident.location.lat).toFixed(4)}, {(incident.location.longitude ?? incident.location.lng).toFixed(4)}</td>
                    <td style={{ padding: '12px', color: incident.severity === 'high' ? '#ef4444' : '#f59e0b' }}>{incident.severity}</td>
                    <td style={{ padding: '12px' }}>{incident.status}</td>
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
              <div className="card glass" style={{ padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: 600 }}>Recent Alerts</h3>
                <div style={{ flex: 1, overflowY: 'auto' }}>
                  {incidents.slice(0, 10).map((incident) => (
                    <div key={incident._id} style={{
                      padding: '12px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(255,255,255,0.03)',
                      marginBottom: '10px',
                      borderLeft: `4px solid ${incident.severity === 'high' ? '#ef4444' : '#f59e0b'}`
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 600, fontSize: '14px' }}>Impact Detected</span>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                          {new Date(incident.timestamp || incident.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                        Lat: {(incident.location.latitude ?? incident.location.lat).toFixed(4)}, Lng: {(incident.location.longitude ?? incident.location.lng).toFixed(4)}
                      </div>
                    </div>
                  ))}
                  {incidents.length === 0 && <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginTop: '40px' }}>No incidents yet</p>}
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
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
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

        {renderContent()}
      </main>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => (
  <div className="card glass" style={{ padding: '24px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
    <div style={{ backgroundColor: `${color}15`, padding: '12px', borderRadius: '12px' }}>
      {icon}
    </div>
    <div>
      <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '4px' }}>{label}</p>
      <h2 style={{ fontSize: '28px', fontWeight: 'bold' }}>{value}</h2>
    </div>
  </div>
);

export default App;
