import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Hospital, 
  MapPin, 
  Clock, 
  Navigation, 
  Phone, 
  Send, 
  X, 
  ChevronRight,
  AlertTriangle,
  Activity,
  CheckCircle2
} from 'lucide-react';
import EmergencyMap from './EmergencyMap';

const EmergencyPanel = ({ incident, onBack, googleApiKey }) => {
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sosStatus, setSosStatus] = useState('idle');

  useEffect(() => {
    const fetchHospitals = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockHospitals = [
        {
          id: 1,
          name: "City Apex Hospital",
          lat: 18.6210,
          lng: 73.7520,
          distance: "0.8 km",
          time: "3 mins",
          phone: "+91 98765 43210",
          rating: 4.8,
          isNearest: true
        },
        {
          id: 2,
          name: "LifeCare Medical Center",
          lat: 18.6150,
          lng: 73.7480,
          distance: "1.4 km",
          time: "6 mins",
          phone: "+91 98765 43211",
          rating: 4.5,
          isNearest: false
        },
        {
          id: 3,
          name: "Apollo Emergency Care",
          lat: 18.6250,
          lng: 73.7550,
          distance: "2.1 km",
          time: "9 mins",
          phone: "+91 98765 43212",
          rating: 4.9,
          isNearest: false
        }
      ];

      setHospitals(mockHospitals);
      setSelectedHospital(mockHospitals[0]);
      setLoading(false);
    };

    if (incident) fetchHospitals();
  }, [incident]);

  const handleSendSOS = async () => {
    setSosStatus('sending');
    await new Promise(resolve => setTimeout(resolve, 2000));
    setSosStatus('success');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      className="emergency-response-system"
      style={{
        backgroundColor: '#0a0a0c',
        height: 'calc(100vh - 120px)',
        borderRadius: '32px',
        display: 'flex',
        flexDirection: 'column',
        padding: '32px',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.03)'
      }}
    >
      {/* Background Decorative Elements */}
      <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(239,68,68,0.05) 0%, transparent 70%)', pointerEvents: 'none' }}></div>
      
      {/* Top Controller Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', zIndex: 10 }}>
        <button 
          onClick={onBack} 
          style={{ 
            background: 'rgba(255,255,255,0.03)', 
            border: 'none', 
            color: '#e5e2e1', 
            padding: '12px 24px', 
            borderRadius: '16px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            transition: 'all 0.3s'
          }}
          className="hover-bright"
        >
          <X size={18} /> Exit Response Mode
        </button>

        <div style={{ display: 'flex', gap: '8px' }}>
          {['Telemetry', 'Hospital Sync', 'Logistics'].map(tag => (
             <span key={tag} style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', color: 'rgba(255,255,255,0.3)', padding: '6px 12px', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px' }}>
               {tag}
             </span>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '32px', flex: 1, overflow: 'hidden' }}>
        
        {/* Left Side: Data & Control */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto' }} className="custom-scrollbar">
          
          {/* Primary Incident Metrics */}
          <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', padding: '32px', borderRadius: '24px' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ef4444', boxShadow: '0 0 15px #ef4444' }} className="pulse"></div>
                <h2 style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '3px', color: '#ef4444' }}>Live Impact Protocol</h2>
             </div>

             <div style={{ marginBottom: '32px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>Force Magnitude</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                   <h1 style={{ fontSize: '72px', fontWeight: 900, letterSpacing: '-4px', lineHeight: 1, color: '#e5e2e1' }}>{incident.impactForce}</h1>
                   <span style={{ fontSize: '24px', fontWeight: 300, color: 'rgba(255,255,255,0.2)' }}>G-FORCE</span>
                </div>
             </div>

             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ padding: '16px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '16px' }}>
                   <p style={{ fontSize: '9px', fontWeight: 900, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: '4px' }}>Severity</p>
                   <p style={{ fontSize: '14px', fontWeight: 800, color: '#ef4444' }}>{incident.severity.toUpperCase()}</p>
                </div>
                <div style={{ padding: '16px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '16px' }}>
                   <p style={{ fontSize: '9px', fontWeight: 900, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: '4px' }}>Status</p>
                   <p style={{ fontSize: '14px', fontWeight: 800, color: '#f59e0b' }}>{sosStatus === 'success' ? 'EN ROUTE' : 'PENDING'}</p>
                </div>
             </div>
          </div>

          {/* Hospital Selection Strip */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h3 style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px', paddingLeft: '8px' }}>Optimal Facilities</h3>
            
            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center' }}>
                <div className="spinner" style={{ width: '24px', height: '24px', border: '2px solid rgba(255,255,255,0.1)', borderTopColor: '#ef4444', borderRadius: '50%', margin: '0 auto 16px' }}></div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.3)' }}>CALCULATING ETA...</span>
              </div>
            ) : (
              hospitals.map((hospital, idx) => (
                <div 
                  key={hospital.id}
                  onClick={() => setSelectedHospital(hospital)}
                  style={{
                    padding: '20px',
                    borderRadius: '20px',
                    backgroundColor: selectedHospital?.id === hospital.id ? 'rgba(16, 185, 129, 0.08)' : idx % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    border: selectedHospital?.id === hospital.id ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid transparent',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', fontWeight: 800, color: selectedHospital?.id === hospital.id ? '#10b981' : '#e5e2e1' }}>{hospital.name}</span>
                    {hospital.isNearest && <span style={{ fontSize: '8px', fontWeight: 900, color: '#000', backgroundColor: '#10b981', padding: '2px 6px', borderRadius: '4px' }}>FASTEST</span>}
                  </div>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Navigation size={12} color="rgba(255,255,255,0.4)" />
                      <span style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.5)' }}>{hospital.distance}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={12} color="#f59e0b" />
                      <span style={{ fontSize: '12px', fontWeight: 900, color: '#f59e0b' }}>{hospital.time}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Master SOS Controller */}
          <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
             <AnimatePresence mode="wait">
              {sosStatus === 'idle' ? (
                <motion.button
                  key="idle"
                  whileHover={{ scale: 1.02, backgroundColor: '#dc2626' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSendSOS}
                  style={{
                    width: '100%',
                    padding: '24px',
                    backgroundColor: '#ef4444',
                    border: 'none',
                    borderRadius: '24px',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    letterSpacing: '3px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '16px',
                    boxShadow: '0 20px 40px rgba(239, 68, 68, 0.2)'
                  }}
                >
                  <Send size={20} /> Deploy Emergency Units
                </motion.button>
              ) : sosStatus === 'sending' ? (
                <motion.div
                  key="sending"
                  style={{ width: '100%', padding: '24px', backgroundColor: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}
                >
                  <div className="spinner" style={{ width: '18px', height: '18px', border: '2px solid rgba(245, 158, 11, 0.2)', borderTopColor: '#f59e0b', borderRadius: '50%' }}></div>
                  <span style={{ color: '#f59e0b', fontSize: '13px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px' }}>Establishing Uplink...</span>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  style={{ width: '100%', padding: '24px', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '24px', textAlign: 'center' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', color: '#10b981', marginBottom: '4px' }}>
                    <CheckCircle2 size={20} />
                    <span style={{ fontSize: '13px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px' }}>Uplink Confirmed</span>
                  </div>
                  <p style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(16, 185, 129, 0.6)', textTransform: 'uppercase' }}>Ambulance unit dispatched (ETA 4m)</p>
                </motion.div>
              )}
             </AnimatePresence>
          </div>
        </div>

        {/* Right Side: Visual Center */}
        <div style={{ position: 'relative', borderRadius: '32px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.03)' }}>
          <EmergencyMap 
            accidentLocation={{ lat: incident.location.latitude, lng: incident.location.longitude }}
            targetHospital={selectedHospital}
            apiKey={googleApiKey}
          />
          
          {/* Aerospace-style Overlays */}
          <div style={{ position: 'absolute', top: '32px', left: '32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
             <div style={{ backgroundColor: 'rgba(10, 10, 12, 0.8)', padding: '16px 24px', borderRadius: '16px', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <p style={{ fontSize: '9px', fontWeight: 900, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: '4px' }}>Active Destination</p>
                <p style={{ fontSize: '16px', fontWeight: 800, color: 'white' }}>{selectedHospital?.name || 'ANALYZING...'}</p>
             </div>
          </div>

          <div style={{ position: 'absolute', bottom: '32px', right: '32px' }}>
             <button 
               onClick={() => {
                 const url = `https://www.google.com/maps/dir/?api=1&origin=${incident.location.latitude},${incident.location.longitude}&destination=${selectedHospital.lat},${selectedHospital.lng}&travelmode=driving`;
                 window.open(url, '_blank');
               }}
               style={{ 
                 background: 'white', 
                 color: 'black', 
                 padding: '20px 32px', 
                 borderRadius: '20px', 
                 display: 'flex', 
                 alignItems: 'center', 
                 gap: '12px',
                 cursor: 'pointer',
                 fontSize: '13px',
                 fontWeight: 900,
                 textTransform: 'uppercase',
                 letterSpacing: '1px',
                 border: 'none',
                 boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
               }}
               className="hover-bright"
             >
                <Navigation size={20} /> Start Navigation
             </button>
          </div>
        </div>
      </div>

    </motion.div>
  );
};

export default EmergencyPanel;
