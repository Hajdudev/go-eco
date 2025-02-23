import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export function Map() {
  return (
    <MapContainer
      center={[53.349805, -6.26031]}
      zoom={13}
      style={{ height: '90%', width: '90%' }}
    >
      <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
      <Marker position={[53.349805, -6.26031]}>
        <Popup>1 Grafton Street, Dublin, Ireland</Popup>
      </Marker>
    </MapContainer>
  );
}

export default Map;
