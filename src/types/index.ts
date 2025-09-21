export type Sex = 'm' | 'f';

export interface TwnImage {
  large: string;
  medium: string;
  small: string;
  alt: string;
  title: string;
}

export interface Article {
  id: string;
  boolean: boolean;
  phone: string;
  date: number; // Unix seconds
  tags: string[];
  sex: Sex;
  firstname: string;
  surname: string;
  email: string;
  title: string;
  intro: string; // HTML
  body: string;  // HTML
  personal_code: number;
  image: TwnImage;
  images: TwnImage[];
}

export interface Row {
  id: number;
  name: string;
  value: number;
  category: string;
}
