import React, { useState, useEffect } from 'react';
import { Hospital, Shield, MapPin, Navigation, Phone, Clock, ArrowLeft } from 'lucide-react';

const IncidentDetails = ({ incident, onBack }) => {
  const [nearbyHospitals, setNearbyHospitals] = useState([]);
  const [nearbyPolice, setNearbyPolice] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNearbyServices = async () => {
    setLoading(true);
    const { latitude, longitude } = incident.location;
    const radius = 5000; // 5km

    // Overpass API Query
    // [out:json];(node["amenity"="hospital"](around:radius,lat,lon);node["amenity"="police"](around:radius,lat,lon););out body;
    const query = `
      [out:json];
      (
        node["amenity"="hospital"](around:${radius},${latitude},${longitude});
        node["amenity"="police"](around:${radius},${latitude},${longitude});
      );
      out body;
    `;

    try {
      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: query
      });
      const data = await response.json();
      
      const hospitals = data.elements
        .filter(el => el.tags.amenity === 'hospital')
        .map(h => ({
          name: h.tags.name || 'Unnamed Hospital',
          distance: calculateDistance(latitude, longitude, h.lat, h.lon).toFixed(2),
          phone: h.tags['phone'] || h.tags['contact:phone'] || 'N/A'
        }))
        .sort((a, b) => a.distance - b.distance);

      const police = data.elements
        .filter(el => el.tags.amenity === 'police')
        .map(p => ({
          name: p.tags.name || 'Unnamed Police Station',
          distance: calculateDistance(latitude, longitude, p.lat, p.lon).toFixed(2),
          phone: p.tags['phone'] || p.tags['contact:phone'] || 'N/A'
        }))
        .sort((a, b) => a.distance - b.distance);

      setNearbyHospitals(hospitals.slice(0, 3));
      setNearbyPolice(police.slice(0, 3));
      setLoading(false);
    } catch (err) {
      console.error('Error fetching nearby services:', err);
      setLoading(false);
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const getDistanceColor = (dist) => {
    const d = parseFloat(dist);
    if (d < 2) return '#10b981'; // Green
    if (d < 5) return '#f59e0b'; // Orange
    return '#ef4444'; // Red
  };

  const openNavigation = (destLat, destLon) => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${incident.location.latitude},${incident.location.longitude}&destination=${destLat},${destLon}&travelmode=driving`;
    window.open(url, '_blank');
  };

  useEffect(() => {
    fetchNearbyServices();
  }, [incident]);

  return (
    <div className="incident-details-overlay">
      <button className="back-button" onClick={onBack}>
        <ArrowLeft size={18} /> Back to Dashboard
      </button>

      <div className="details-container">
        <div className="main-info">
          <div className="card glass info-header">
            <div className="status-badge" style={{ backgroundColor: incident.severity === 'high' ? '#ef444422' : '#f59e0b22', color: incident.severity === 'high' ? '#ef4444' : '#f59e0b' }}>
              {incident.severity.toUpperCase()} PRIORITY
            </div>
            <h2>Impact Detected</h2>
            <p className="timestamp">Detected at {new Date(incident.timestamp || incident.createdAt).toLocaleString()}</p>
            
            <div className="coords-grid">
              <div className="coord-item">
                <MapPin size={16} />
                <span>{incident.location.latitude.toFixed(4)}° N, {incident.location.longitude.toFixed(4)}° E</span>
              </div>
              <div className="coord-item">
                <Navigation size={16} />
                <span>Impact Force: {incident.impactForce} G</span>
              </div>
            </div>
          </div>

          <div className="services-grid">
            {/* Hospitals Section */}
            <div className="card glass service-card">
              <div className="service-header hospital">
                <Hospital size={20} />
                <h3>Nearest Hospitals</h3>
              </div>
              {loading ? <p>Locating medical facilities...</p> : (
                <div className="service-list">
                  {nearbyHospitals.length > 0 ? nearbyHospitals.map((h, i) => (
                    <div key={i} className="service-item">
                      <div className="service-main">
                        <span className="service-name">{h.name}</span>
                        <span className="service-distance" style={{ color: getDistanceColor(h.distance), fontWeight: 'bold' }}>
                          {h.distance} km away
                        </span>
                      </div>
                      <div className="service-actions">
                         <div className="service-info">
                            <Phone size={14} /> <span>{h.phone}</span>
                         </div>
                         <button className="nav-button" onClick={() => openNavigation(h.lat, h.lon)}>
                            <Navigation size={14} /> Navigate
                         </button>
                      </div>
                    </div>
                  )) : <p>No hospitals found within 5km.</p>}
                </div>
              )}
            </div>

            {/* Police Section */}
            <div className="card glass service-card">
              <div className="service-header police">
                <Shield size={20} />
                <h3>Police Stations</h3>
              </div>
              {loading ? <p>Locating law enforcement...</p> : (
                <div className="service-list">
                  {nearbyPolice.length > 0 ? nearbyPolice.map((p, i) => (
                    <div key={i} className="service-item">
                      <div className="service-main">
                        <span className="service-name">{p.name}</span>
                        <span className="service-distance" style={{ color: getDistanceColor(p.distance), fontWeight: 'bold' }}>
                          {p.distance} km away
                        </span>
                      </div>
                      <div className="service-actions">
                         <div className="service-info">
                            <Phone size={14} /> <span>{p.phone}</span>
                         </div>
                         <button className="nav-button" onClick={() => openNavigation(p.lat, p.lon)}>
                            <Navigation size={14} /> Navigate
                         </button>
                      </div>
                    </div>
                  )) : <p>No police stations found within 5km.</p>}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .incident-details-overlay {
          padding: 20px;
          animation: fadeIn 0.3s ease-out;
        }
        .back-button {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: white;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 24px;
          transition: all 0.2s;
        }
        .back-button:hover {
          background: rgba(255,255,255,0.1);
        }
        .info-header {
          padding: 32px;
          margin-bottom: 32px;
          position: relative;
        }
        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 700;
          margin-bottom: 16px;
        }
        h2 { font-size: 28px; margin-bottom: 8px; }
        .timestamp { color: var(--text-secondary); margin-bottom: 24px; }
        .coords-grid { display: flex; gap: 32px; }
        .coord-item { display: flex; align-items: center; gap: 8px; color: var(--text-secondary); }
        
        .services-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .service-card { padding: 24px; }
        .service-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
        .service-header.hospital { color: #10b981; }
        .service-header.police { color: #3b82f6; }
        .service-header h3 { font-size: 18px; color: white; }
        
        .service-list { display: flex; flex-direction: column; gap: 16px; }
        .service-item { 
          padding: 16px; 
          background: rgba(255,255,255,0.03); 
          border-radius: 12px; 
          display: flex; 
          justify-content: space-between;
          align-items: center;
        }
        .service-main { display: flex; flex-direction: column; gap: 4px; }
        .service-name { font-weight: 600; font-size: 14px; }
        .service-distance { font-size: 12px; }
        
        .service-actions { display: flex; flex-direction: column; align-items: flex-end; gap: 10px; }
        .service-info { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--text-secondary); }
        
        .nav-button {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: background 0.2s;
        }
        .nav-button:hover {
          background: #2563eb;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default IncidentDetails;
