import { supabase } from "supabase.server";

export const fetchCategories = async () => {
  let { data: categories, error } = await supabase
    .from("categories")
    .select("*");
  return { categories, error };
};

export const fetchCategoriesName = async () => {
  let { data: categories, error } = await supabase
    .from("categories")
    .select("category");
  return { categories, error };
};

export const insertCategory = async (category: string) => {
  console.log(category, "category");

  // const { data, error } = await supabase
  //   .from("categories")
  //   .insert({ category: category })
  //   .select();
  // if (data) {
  //   console.log(data, "aaaaaa");
  // }
  // if (error) {
  //   console.log(error, "error");
  // }
  return category;
  // return { data, error };
};
