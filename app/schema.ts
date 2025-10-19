import * as z from "zod";

export const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  guest_count: z.number().min(1, "Guest minimum is 1"),
  phone: z.string().min(1, "Phone is required"),
});
