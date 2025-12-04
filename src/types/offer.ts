export interface Offer {
  id: string;
  title: string;
  type: string;
  price: number;
  rating: number;
  ratingValue?: number;
  previewImage: string;
  images?: string[];
  isPremium: boolean;
  isFavorite: boolean;
  bedrooms?: number;
  maxAdults?: number;
  goods?: string[];
  description?: string;
  host?: {
    name: string;
    avatarUrl: string;
    isPro: boolean;
  };
  city: {
    name: string;
    location: {
      latitude: number;
      longitude: number;
      zoom: number;
    };
  };
  location: {
    latitude: number;
    longitude: number;
    zoom: number;
  };
}

