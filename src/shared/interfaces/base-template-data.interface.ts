export interface BaseTemplateData {
  company?: {
    name?: string;
    logo?: string;
    icon?: string;
    about?: string[];
    scripts?: string[];
  };
  products?: Array<{
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
  }>;
  contact?: {
    email?: string;
    phone?: string;
    address?: string;
  };
  [key: string]: any;
}