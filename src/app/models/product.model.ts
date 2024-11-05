export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: Rating;

  quantity?: number;
  date?: Date;
}

export interface Rating {
  rate: number;
  count: number;
}