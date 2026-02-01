// Data types for the e-commerce platform
export interface Carpet {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
}

export interface CartItem extends Carpet {
  quantity: number;
}

// Product type for prayer mats
export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  material: string;
  description: string;
  originalPrice?: number;
}
