import { z } from 'zod'; 

export const registerSchema = z
.object({
    name: z.string().min(3, "Name must be at least 3 characters"), 
    email: z.string().email("Invalid email address"), 
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Password confirmation is required"),
})
.refine(
    (data)=>
        data.password === data.confirmPassword, 
    {
        message: 'Passwords do not match', 
        path : ['confirmPassword'], 
    }
)

export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
})