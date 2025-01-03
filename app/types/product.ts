export type Products = {
  id: number | string;
  name: string;
  description: string;
  price: string;
  ProductImage: string;
};

export type Data = {
  data: Products[];
  error: string;
};
export type UpdatedProduct = {
  name: string;
  description: string;
  price: number;
};
