import { supabase } from "supabase.server";

export const fetchProducts = async () => {
  let { data, error } = await supabase.from("ProductsDetail").select("*");
  return { data, error };
};

export const fetchProductById = async (id: string) => {
  const { data, error } = await supabase
    .from("ProductsDetail")
    .select("*")
    .eq("id", id);
  return { data, error };
};

export const updateProduct = async (id: unknown, updatedData: unknown) => {
  const { data, error } = await supabase
    .from("ProductsDetail")
    .update(updatedData)
    .eq("id", id);
  return { data, error };
};

export const deleteProduct = async (id: unknown) => {
  const { error } = await supabase.from("ProductsDetail").delete().eq("id", id);
  return error;
};
