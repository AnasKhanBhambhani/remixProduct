import { redirect } from "@remix-run/node";
import { supabase } from "supabase.server";
import { Customer } from "~/types/customers";

export const addCustomer = async (customer: Customer) => {
  const { data, error } = await supabase
    .from("customers")
    .insert([{ ...customer }])
    .select();
  return { data };
};

// export const fetchCustomers = async () => {
//   const { data: customers } = await supabase.from("customers").select("*");
//   return { customers };
// };

export const fetchCustomers = async (page: number, limit: number) => {
  const { data: customers, count: totalCount } = await supabase
    .from("customers")
    .select("*", { count: "exact" })
    .range(page * limit, (page + 1) * limit - 1);
  return { customers, totalCount };
};
