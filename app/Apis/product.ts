export const fetchProducts = async () => {
  const response = await fetch("http://localhost:3001/products");
  const products = await response.json();
  return products;
};
export const fetchProductById = async (id: string) => {
  const response = await fetch(`http://localhost:3001/products/${id}`);
  return await response.json();
};

export const updateProduct = async (id: unknown, updatedData: unknown) => {
  await fetch(`http://localhost:3001/products/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedData),
  });
};

export const deleteProduct = async (id: unknown) => {
  await fetch(`http://localhost:3001/products/${id}`, {
    method: "DELETE",
  });
};
