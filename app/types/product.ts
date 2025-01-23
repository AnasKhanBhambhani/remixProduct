export type Products = {
  id: number | string;
  name: string;
  description: string;
  price: string;
  ProductImage: string;
  category_id: string;
};

export type Data = {
  data: Products[];
  error: string;
  totalCount: number;
};
export type UpdatedProduct = {
  name: string;
  description: string;
  price: number;
};
