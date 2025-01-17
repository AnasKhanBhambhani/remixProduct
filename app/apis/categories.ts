import { redirect } from "@remix-run/react";
import { supabase } from "supabase.server";

export const fetchCategoriesName = async () => {
  let { data: categories, error } = await supabase
    .from("categories")
    .select("*");
  return { categories, error };
};

export const insertCategory = async (formdata: any) => {
  const { name, quantity } = Object.fromEntries(formdata);

  const { data, error } = await supabase
    .from("categories")
    .insert([{ name: name, quantity: quantity }])
    .select();

  return { data, error };
};
