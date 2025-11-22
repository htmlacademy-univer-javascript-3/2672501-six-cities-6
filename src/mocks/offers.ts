export interface Offer {
  id: string;
  title: string;
  type: string;
  price: number;
  rating: number;
  ratingValue: number;
  image: string;
  images: string[];
  isPremium: boolean;
  isFavorite: boolean;
  bedrooms: number;
  maxAdults: number;
  goods: string[];
  host: {
    name: string;
    avatarUrl: string;
    isPro: boolean;
  };
  description: string;
  city: string;
  location: {
    latitude: number;
    longitude: number;
  };
}

export const offers: Offer[] = [
  {
    id: '1',
    title: 'Beautiful & luxurious apartment at great location',
    type: 'Apartment',
    price: 120,
    rating: 80,
    ratingValue: 4.8,
    image: 'img/apartment-01.jpg',
    images: [
      'img/room.jpg',
      'img/apartment-01.jpg',
      'img/apartment-02.jpg',
      'img/apartment-03.jpg',
      'img/studio-01.jpg',
      'img/apartment-01.jpg'
    ],
    isPremium: true,
    isFavorite: true,
    bedrooms: 3,
    maxAdults: 4,
    goods: [
      'Wi-Fi',
      'Washing machine',
      'Towels',
      'Heating',
      'Coffee machine',
      'Baby seat',
      'Kitchen',
      'Dishwasher',
      'Cabel TV',
      'Fridge'
    ],
    host: {
      name: 'Angelina',
      avatarUrl: 'img/avatar-angelina.jpg',
      isPro: true
    },
    description: 'A quiet cozy and picturesque that hides behind a a river by the unique lightness of Amsterdam. The building is green and from 18th century. An independent House, strategically located between Rembrand Square and National Opera, but where the bustle of the city comes to rest in this alley flowery and colorful.',
    city: 'Amsterdam',
    location: {
      latitude: 52.3909553943508,
      longitude: 4.85309666406198
    }
  },
  {
    id: '2',
    title: 'Wood and stone place',
    type: 'Room',
    price: 80,
    rating: 80,
    ratingValue: 4.0,
    image: 'img/room.jpg',
    images: [
      'img/room.jpg',
      'img/apartment-01.jpg',
      'img/apartment-02.jpg'
    ],
    isPremium: false,
    isFavorite: true,
    bedrooms: 1,
    maxAdults: 2,
    goods: [
      'Wi-Fi',
      'Heating',
      'Kitchen',
      'Fridge',
      'Washing machine',
      'Coffee machine',
      'Dishwasher',
      'Towels',
      'Baby seat',
      'Cabel TV'
    ],
    host: {
      name: 'Max',
      avatarUrl: 'img/avatar-max.jpg',
      isPro: false
    },
    description: 'A quiet cozy and picturesque that hides behind a a river by the unique lightness of Amsterdam. The building is green and from 18th century.',
    city: 'Amsterdam',
    location: {
      latitude: 52.3609553943508,
      longitude: 4.85309666406198
    }
  },
  {
    id: '3',
    title: 'Canal View Prinsengracht',
    type: 'Apartment',
    price: 132,
    rating: 80,
    ratingValue: 4.0,
    image: 'img/apartment-02.jpg',
    images: [
      'img/apartment-02.jpg',
      'img/apartment-01.jpg',
      'img/apartment-03.jpg',
      'img/room.jpg'
    ],
    isPremium: false,
    isFavorite: false,
    bedrooms: 2,
    maxAdults: 3,
    goods: [
      'Wi-Fi',
      'Washing machine',
      'Towels',
      'Heating',
      'Coffee machine',
      'Kitchen',
      'Dishwasher',
      'Cabel TV',
      'Fridge'
    ],
    host: {
      name: 'Oliver',
      avatarUrl: 'img/avatar.svg',
      isPro: false
    },
    description: 'A quiet cozy and picturesque that hides behind a a river by the unique lightness of Amsterdam. The building is green and from 18th century. An independent House, strategically located between Rembrand Square and National Opera.',
    city: 'Amsterdam',
    location: {
      latitude: 52.3909553943508,
      longitude: 4.85309666406198
    }
  },
  {
    id: '4',
    title: 'Nice, cozy, warm big bed apartment',
    type: 'Apartment',
    price: 180,
    rating: 100,
    ratingValue: 5.0,
    image: 'img/apartment-03.jpg',
    images: [
      'img/apartment-03.jpg',
      'img/apartment-01.jpg',
      'img/apartment-02.jpg',
      'img/studio-01.jpg',
      'img/room.jpg'
    ],
    isPremium: true,
    isFavorite: true,
    bedrooms: 4,
    maxAdults: 5,
    goods: [
      'Wi-Fi',
      'Washing machine',
      'Towels',
      'Heating',
      'Coffee machine',
      'Baby seat',
      'Kitchen',
      'Dishwasher',
      'Cabel TV',
      'Fridge',
      'Air conditioning'
    ],
    host: {
      name: 'Angelina',
      avatarUrl: 'img/avatar-angelina.jpg',
      isPro: true
    },
    description: 'A quiet cozy and picturesque that hides behind a a river by the unique lightness of Amsterdam. The building is green and from 18th century. An independent House, strategically located between Rembrand Square and National Opera, but where the bustle of the city comes to rest in this alley flowery and colorful.',
    city: 'Amsterdam',
    location: {
      latitude: 52.3909553943508,
      longitude: 4.929309666406198
    }
  },
  {
    id: '5',
    title: 'White castle',
    type: 'Apartment',
    price: 180,
    rating: 100,
    ratingValue: 5.0,
    image: 'img/apartment-small-04.jpg',
    images: [
      'img/apartment-small-04.jpg',
      'img/apartment-01.jpg',
      'img/apartment-02.jpg'
    ],
    isPremium: false,
    isFavorite: true,
    bedrooms: 2,
    maxAdults: 3,
    goods: [
      'Wi-Fi',
      'Washing machine',
      'Towels',
      'Heating',
      'Coffee machine',
      'Kitchen',
      'Dishwasher',
      'Cabel TV',
      'Fridge'
    ],
    host: {
      name: 'Oliver',
      avatarUrl: 'img/avatar.svg',
      isPro: false
    },
    description: 'A quiet cozy and picturesque that hides behind a a river by the unique lightness of Cologne.',
    city: 'Cologne',
    location: {
      latitude: 50.938361,
      longitude: 6.959974
    }
  }
];

