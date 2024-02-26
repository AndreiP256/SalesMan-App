import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const MapComponent = () => {
  const [location, setLocation] = useState({ lat: 0, lng: 0 });

  const handleMapClick = (event:any) => {
    setLocation({ lat: event.latLng.lat(), lng: event.latLng.lng() });
  };

  return (
    <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
      <GoogleMap
        center={location}
        zoom={10}
        onClick={handleMapClick}
        mapContainerStyle={{ height: "400px", width: "800px" }}
      >
        <Marker position={location} />
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;