import { supabase } from "supabase.server";
import { UpdataCategory } from "~/types/categories";

export const fetchCategoriesList = async () => {
  let { data: categories, error } = await supabase
    .from("categories")
    .select("*");
  return { categories, error };
};

export const fetchCategories = async (
  page: number,
  limit: number,
  search: string
) => {
  let query = supabase
    .from("categories")
    .select("*", { count: "exact" })
    .range(page * limit, (page + 1) * limit - 1);
  if (search) {
    query = query.ilike("category", `%${search}%`);
  }
  const { data: categories, error, count: totalCount } = await query;
  return { categories, error, totalCount };
};

export const fetchCategoryOrQuantityById = async (id: string) => {
  let { data } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .single();
  return data;
};

export const fetchCategoriesName = async () => {
  const { data: categories, error } = await supabase
    .from("categories")
    .select("category");
  return { categories, error };
};

export const insertCategory = async (category?: string) => {
  await supabase.from("categories").insert({ category: category }).select();
  return category;
};

export const updateCategory = async (
  categoryId: string,
  updateData: UpdataCategory
) => {
  const { data, error } = await supabase
    .from("categories")
    .update(updateData)
    .eq("id", categoryId)
    .order("category", { ascending: true })
    .select();
  if (error) {
    console.error("Error updating category:", error);
    return null;
  }
  return data;
};

export const deleteQuantity = async (categoryId?: string) => {
  await supabase.from("ProductsDetail").delete().eq("category_id", categoryId);
  await supabase.from("categories").delete().eq("id", categoryId);
};
