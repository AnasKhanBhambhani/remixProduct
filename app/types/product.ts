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
