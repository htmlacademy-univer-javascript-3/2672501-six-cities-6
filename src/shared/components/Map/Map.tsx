import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Offer } from '../../../mocks/offers';

interface MapProps {
  offers: Offer[];
  center: [number, number];
  zoom?: number;
}

const defaultIcon = new Icon({
  iconUrl: 'img/pin.svg',
  iconSize: [27, 39],
  iconAnchor: [13.5, 39]
});

export const Map: React.FC<MapProps> = ({ offers, center, zoom = 12 }) => (
  <MapContainer
    center={center}
    zoom={zoom}
    style={{ height: '100%', width: '100%' }}
  >
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    {offers.map((offer) => (
      <Marker
        key={offer.id}
        position={[offer.location.latitude, offer.location.longitude]}
        icon={defaultIcon}
      >
        <Popup>
          {offer.title}
        </Popup>
      </Marker>
    ))}
  </MapContainer>
);

