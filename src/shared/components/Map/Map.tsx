import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Offer } from '../../../types/offer';

interface MapProps {
  offers: Offer[];
  center: [number, number];
  zoom?: number;
  activeOfferId?: string | null;
}

const defaultIcon = new Icon({
  iconUrl: 'img/pin.svg',
  iconSize: [27, 39],
  iconAnchor: [13.5, 39]
});

const activeIcon = new Icon({
  iconUrl: 'img/pin-active.svg',
  iconSize: [27, 39],
  iconAnchor: [13.5, 39]
});

const MAP_STYLES: React.CSSProperties = {
  height: '100%',
  width: '100%'
};

const MapComponent: React.FC<MapProps> = ({ offers, center, zoom = 12, activeOfferId = null }) => (
  <MapContainer
    center={center}
    zoom={zoom}
    style={MAP_STYLES}
  >
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    {offers.map((offer) => (
      <Marker
        key={offer.id}
        position={[offer.location.latitude, offer.location.longitude]}
        icon={offer.id === activeOfferId ? activeIcon : defaultIcon}
      >
        <Popup>
          {offer.title}
        </Popup>
      </Marker>
    ))}
  </MapContainer>
);

export const Map = React.memo(MapComponent);
Map.displayName = 'Map';

