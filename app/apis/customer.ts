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

export const fetchCustomers = async () => {
  const { data: customers } = await supabase.from("customers").select("*");
  return { customers };
};
