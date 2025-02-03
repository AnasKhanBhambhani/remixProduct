import { supabase } from "supabase.server";
import { Customer } from "~/types/customers";

export const addCustomer = async (customer: Customer) => {
  const { data, error } = await supabase
    .from("customers")
    .insert({ ...customer })
    .select();
  return { data };
};

export const fetchCustomers = async (
  page: number,
  limit: number,
  search: string
) => {
  let query = supabase
    .from("customers")
    .select("*", { count: "exact" })
    .range(page * limit, (page + 1) * limit - 1);
  if (search) {
    query = query.ilike("name", `%${search}%`);
  }
  const { data: customers, count: totalCount } = await query;
  return { customers, totalCount };
};

export const deleteCustomer = async (id: FormDataEntryValue | string) => {
  const { error } = await supabase.from("customers").delete().eq("id", id);
  return { error };
};
