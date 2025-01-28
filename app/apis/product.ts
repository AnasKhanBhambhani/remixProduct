import { supabase } from "supabase.server";
import { UpdatedProduct } from "~/types/product";

export const fetchProducts = async (category?: string, lessthen?: string) => {
  let products = supabase
    .from("ProductsDetail")
    .select("*")
    .order("id", { ascending: true });
  if (category) {
    products = products.eq("category_id", category);
  }
  if (lessthen) {
    products = products.lte("price", lessthen);
  }
  const { data: allProducts, error } = await products;
  return { allProducts, error };
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

export const deleteProduct = async (id: string) => {
  const { error } = await supabase.from("ProductsDetail").delete().eq("id", id);
  return error;
};

export const storeProductImage = async (
  file: File,
  fileUpload: string,
  fileBuffer: ArrayBuffer
) => {
  const { error: uploadError } = await supabase.storage
    .from("ProductImages")
    .upload(fileUpload, new Uint8Array(fileBuffer), {
      contentType: file.type,
      upsert: false,
    });
  if (uploadError) {
    throw new Error(`File upload failed: ${uploadError.message}`);
  }
  const { data } = await supabase.storage
    .from("ProductImages")
    .getPublicUrl(fileUpload);
  const fileName = data?.publicUrl;
  return fileName;
};

export const getImageUrl = async (file: File) => {
  const img = file as File;
  const fileBuffer = await img.arrayBuffer();
  const fileUpload = `${Date.now()}-${img.name}`;
  const ProductImage = await storeProductImage(file, fileUpload, fileBuffer);
  return ProductImage;
};
