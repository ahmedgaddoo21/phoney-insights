export interface Brand {
  id: string;
  name: string;
  logo: string;
  description: string;
  founded: number;
  country: string;
  color: string;
}

export interface PhoneSpec {
  display: string;
  displaySize: string;
  resolution: string;
  refreshRate: string;
  cpu: string;
  gpu: string;
  ram: string;
  storage: string;
  mainCamera: string;
  selfieCamera: string;
  battery: string;
  charging: string;
  os: string;
  weight: string;
  dimensions: string;
  waterResistance: string;
  connectivity: string;
}

export interface PhoneBenchmark {
  antutu: number;
  geekbenchSingle: number;
  geekbenchMulti: number;
  gpu: number;
}

export interface Phone {
  id: string;
  brandId: string;
  name: string;
  tagline: string;
  images: string[];
  price: number;
  releaseDate: string;
  specs: PhoneSpec;
  benchmark: PhoneBenchmark;
  youtubeReviewId: string;
  tips: string[];
  rating: number;
  ratingCount: number;
  views: number;
  likes: number;
  badges: {
    mostViewed?: boolean;
    mostLiked?: boolean;
    bestValue?: boolean;
  };
}

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: "user" | "admin";
  createdAt: string;
  wishlist: string[];
}

export interface Comment {
  id: string;
  phoneId: string;
  userId: string;
  userName: string;
  text: string;
  rating: number;
  createdAt: string;
}
