import { z } from "zod";
export const customerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email({ message: "Please enter the Email" }),
  phone: z.string().min(11).max(11),
  address: z.string().min(5, "Address is required"),
});
