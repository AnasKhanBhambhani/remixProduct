import { supabase } from "supabase.server";

export const fetchCategories = async () => {
  let { data: categories, error } = await supabase
    .from("categories")
    .select("*");
  return { categories, error };
};
export const fetchQuantityById = async (id: FormDataEntryValue | null) => {
  let { data: categories, error } = await supabase
    .from("categories")
    .select("quantity")
    .eq("id", id);
  return { categories, error };
};
export const fetchCategoriesName = async () => {
  let { data: categories, error } = await supabase
    .from("categories")
    .select("category");
  return { categories, error };
};

export const insertCategory = async (category: FormDataEntryValue | null) => {
  const { data, error } = await supabase
    .from("categories")
    .insert({ category: category })
    .select();
  return category;
};

export const updateQuantity = async (
  categoryId: FormDataEntryValue | null,
  quantity: number
) => {
  const { data, error } = await supabase
    .from("categories")
    .update({ quantity: quantity })
    .eq("id", categoryId)
    .select();
};

export const DeleteQuantity = async (
  categoryId: FormDataEntryValue | string
) => {
  await supabase.from("categories").delete().eq("id", categoryId);
  await supabase.from("ProductsDetail").delete().eq("category_id", categoryId);
};
