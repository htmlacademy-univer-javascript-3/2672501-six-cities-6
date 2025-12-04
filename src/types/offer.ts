export interface Offer {
  id: string;
  title: string;
  type: string;
  price: number;
  rating: number;
  previewImage: string;
  isPremium: boolean;
  isFavorite: boolean;
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

