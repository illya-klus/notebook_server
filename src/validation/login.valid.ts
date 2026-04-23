import { z } from "zod";

export const createloginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});