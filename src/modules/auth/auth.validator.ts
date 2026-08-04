import { z } from 'zod';

export const SignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
  role: z.enum(['BUYER', 'SELLER', 'AGENT']).optional().default('BUYER')
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

export type SignupDto = z.infer<typeof SignupSchema>;
export type LoginDto = z.infer<typeof LoginSchema>;
