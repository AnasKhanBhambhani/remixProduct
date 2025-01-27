export type AddCategory = {
  name: string;
  quantity: string;
};

interface Category {
  category: string;
  id: string;
  quantity: number;
  sold: number;
}

export interface CategoryName {
  categories: Category[];
}
export type UpdataCategory = {
  quantity?: number | null;
  category?: FormDataEntryValue | null;
};
