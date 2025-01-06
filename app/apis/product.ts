import { supabase } from "supabase.server";
import { Data, Products, UpdatedProduct } from "~/types/product";

export const fetchProducts = async () => {
  let { data, error } = await supabase
    .from("ProductsDetail")
    .select("*")
    .order("id", { ascending: true });
  return { data, error };
};

export const fetchProductById = async (id: string) => {
  const { data, error } = await supabase
    .from("ProductsDetail")
    .select("*")
    .eq("id", id);
  return { data, error };
};

export const updateProduct = async (
  id: string,
  updatedData: UpdatedProduct
) => {
  const { data, error } = await supabase
    .from("ProductsDetail")
    .update(updatedData)
    .eq("id", id);
  return { data, error };
};

export const deleteProduct = async (id: string | null) => {
  const { error } = await supabase.from("ProductsDetail").delete().eq("id", id);
  return error;
};
