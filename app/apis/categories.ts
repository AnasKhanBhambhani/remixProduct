import { supabase } from "supabase.server";

export const fetchCategoriesList = async () => {
  let { data: categories, error } = await supabase
    .from("categories")
    .select("*");
  return { categories, error };
};
export const fetchCategories = async (page: number, limit: number) => {
  const {
    data: categories,
    error,
    count,
  } = await supabase
    .from("categories")
    .select("*", { count: "exact" })
    .range(page * limit, (page + 1) * limit - 1);
  return { categories, error, totalCount: count };
};
export const fetchCategoryById = async (id: FormDataEntryValue | null) => {
  let { data: categories, error } = await supabase
    .from("categories")
    .select("category")
    .eq("id", id);
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

export const updateCategoryName = async (
  categoryId: string,
  categoryName: FormDataEntryValue | null
) => {
  await supabase
    .from("categories")
    .update({ category: categoryName })
    .eq("id", categoryId)
    .order("category", { ascending: true })
    .select();
};

export const DeleteQuantity = async (categoryId: FormDataEntryValue | null) => {
  await supabase.from("ProductsDetail").delete().eq("category_id", categoryId);
  await supabase.from("categories").delete().eq("id", categoryId);
};
