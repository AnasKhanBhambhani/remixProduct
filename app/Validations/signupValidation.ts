import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string().min(4, "Name should be more than 4 characters"),
  email: z.string().email({ message: "Please enter the valid Email" }),
  password: z.string().min(4, "Passwords length should be greater than 4"),
});
