import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom red icon for accidents
const emergencyIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const ChangeView = ({ center, zoom }) => {
    const map = useMap();
    map.setView(center, zoom);
    return null;
};

const Map = ({ incidents }) => {
    const defaultCenter = [20.5937, 78.9629]; // Center of India
    const hasIncidents = incidents.length > 0;
    const center = hasIncidents ? [incidents[0].location.latitude ?? incidents[0].location.lat, incidents[0].location.longitude ?? incidents[0].location.lng] : defaultCenter;
    const zoom = hasIncidents ? 14 : 5;

    return (
        <div style={{ height: '100%', width: '100%', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border)' }}>
            <MapContainer center={center} zoom={zoom} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />
                <ChangeView center={center} zoom={zoom} />
                {incidents.map((incident) => (
                    <Marker 
                        key={incident._id} 
                        position={[incident.location.latitude ?? incident.location.lat, incident.location.longitude ?? incident.location.lng]}
                        icon={emergencyIcon}
                    >
                        <Popup>
                            <div style={{ color: '#333' }}>
                                <strong>Accident Detected</strong><br />
                                Severity: <span style={{ color: incident.severity === 'high' ? 'red' : 'orange' }}>{incident.severity.toUpperCase()}</span><br />
                                Time: {new Date(incident.timestamp || incident.createdAt).toLocaleString()}<br />
                                Status: {incident.status}
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default Map;
