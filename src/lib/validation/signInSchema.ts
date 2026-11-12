import {z} from 'zod';

export const signInSchema = z.object({
  username: z.string().min(1, 'Email or username is required'),
  password: z.string().min(1, 'Password is required'),
});

export const registerCustomerSchema = z.object({
  fullname: z.string().min(1, 'Name is required'),
  role:z.literal('CUSTOMER'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});