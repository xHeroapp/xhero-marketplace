import { z } from "zod";

export type EditProfileFormData = z.infer<typeof editProfileSchema>;

export const editProfileSchema = z.object({
  full_name: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(50, "Full name must not exceed 50 characters")
    .optional(),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 characters")
    .regex(/^[+]?[\d\s()-]+$/, "Please enter a valid phone number")
    .optional(),
  email: z.string().email("Please enter a valid email address").optional(),
  delivery_address: z
    .string()
    .min(5, "Shipping address must be at least 5 characters")
    .max(200, "Shipping address must not exceed 200 characters")
    .optional(),
});
