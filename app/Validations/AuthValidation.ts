import { z } from "zod";

export const authSchema = z.object({
  email: z.string().email({ message: "Please enter the valid Email" }),
  password: z.string().min(4, "Passwords length should be greater than 4"),
});
