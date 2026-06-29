import {email, z} from 'zod'; 

export const registerSchema = z
.object({
    name: z.string().min(3), 
    email: z.string().email(), 
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
})
.refine(
    (data)=>
        data.password === data.confirmPassword, 
    {
        message: 'Password do not match', 
        path : ['confirmpassword'], 
    }
)