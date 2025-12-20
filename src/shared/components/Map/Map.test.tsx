import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Map } from './Map';
import { Offer } from '../../../types/offer';

vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="map-container">{children}</div>,
  TileLayer: () => <div data-testid="tile-layer" />,
  Marker: ({ children }: { children: React.ReactNode }) => <div data-testid="marker">{children}</div>,
  Popup: ({ children }: { children: React.ReactNode }) => <div data-testid="popup">{children}</div>
}));

const makeOffer = (overrides: Partial<Offer> = {}): Offer => ({
  id: '1',
  title: 'Test Offer',
  type: 'apartment',
  price: 100,
  rating: 4,
  previewImage: 'img.jpg',
  isPremium: false,
  isFavorite: false,
  city: { name: 'Paris', location: { latitude: 1, longitude: 1, zoom: 10 } },
  location: { latitude: 52.370216, longitude: 4.895168, zoom: 10 },
  ...overrides
});

describe('Map', () => {
  beforeAll(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should render map container', () => {
    render(<Map offers={[]} center={[52.370216, 4.895168]} />);
    expect(screen.getByTestId('map-container')).toBeInTheDocument();
  });

  it('should render tile layer', () => {
    render(<Map offers={[]} center={[52.370216, 4.895168]} />);
    expect(screen.getByTestId('tile-layer')).toBeInTheDocument();
  });

  it('should render markers for each offer', () => {
    const offers = [
      makeOffer({ id: '1', title: 'Offer 1' }),
      makeOffer({ id: '2', title: 'Offer 2' })
    ];
    render(<Map offers={offers} center={[52.370216, 4.895168]} />);
    const markers = screen.getAllByTestId('marker');
    expect(markers).toHaveLength(2);
  });

  it('should render popup with offer title', () => {
    const offers = [makeOffer({ id: '1', title: 'Test Offer Title' })];
    render(<Map offers={offers} center={[52.370216, 4.895168]} />);
    expect(screen.getByText('Test Offer Title')).toBeInTheDocument();
  });
});


