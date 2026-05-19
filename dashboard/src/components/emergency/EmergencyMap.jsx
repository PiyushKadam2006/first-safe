import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, DirectionsRenderer } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '12px',
};

const mapOptions = {
  styles: [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    {
      featureType: "administrative.locality",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [{ color: "#263c3f" }],
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [{ color: "#6b9a76" }],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#38414e" }],
    },
    {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [{ color: "#212a37" }],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [{ color: "#9ca5b3" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{ color: "#746855" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [{ color: "#1f2835" }],
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.fill",
      stylers: [{ color: "#f3d19c" }],
    },
    {
      featureType: "transit",
      elementType: "geometry",
      stylers: [{ color: "#2f3948" }],
    },
    {
      featureType: "transit.station",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#17263c" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [{ color: "#515c6d" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.stroke",
      stylers: [{ color: "#17263c" }],
    },
  ],
  disableDefaultUI: true,
  zoomControl: true,
};

const EmergencyMap = ({ accidentLocation, targetHospital, apiKey }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
    libraries: ['places', 'directions'],
  });

  const [directions, setDirections] = useState(null);

  useEffect(() => {
    if (isLoaded && targetHospital) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: new window.google.maps.LatLng(targetHospital.lat, targetHospital.lng),
          destination: new window.google.maps.LatLng(accidentLocation.lat, accidentLocation.lng),
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirections(result);
          } else {
            console.error(`error fetching directions ${status}`);
          }
        }
      );
    }
  }, [isLoaded, targetHospital, accidentLocation]);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={accidentLocation}
      zoom={15}
      options={mapOptions}
    >
      {/* Accident Location Marker */}
      <Marker
        position={accidentLocation}
        icon={{
          url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
          scaledSize: new window.google.maps.Size(40, 40),
        }}
        animation={window.google.maps.Animation.BOUNCE}
      />

      {/* Hospital Marker */}
      {targetHospital && (
        <Marker
          position={{ lat: targetHospital.lat, lng: targetHospital.lng }}
          icon={{
            url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
            scaledSize: new window.google.maps.Size(40, 40),
          }}
        />
      )}

      {/* Route Display */}
      {directions && (
        <DirectionsRenderer
          directions={directions}
          options={{
            polylineOptions: {
              strokeColor: "#10b981",
              strokeWeight: 5,
              strokeOpacity: 0.8,
            },
            suppressMarkers: true,
          }}
        />
      )}
    </GoogleMap>
  ) : (
    <div className="flex items-center justify-center h-full bg-gray-900 rounded-xl">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
    </div>
  );
};

export default React.memo(EmergencyMap);
