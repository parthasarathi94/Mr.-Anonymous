import {z} from 'zod'

export const usernameValidation = z.string().min(2, "Username must be of 2 characters.").max(15, "Username must not be more than 15 characters.").regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special character")

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: "Invalid email address."}),
    password: z.string().min(6, {message: "Password must be atleast 6 characters."}).max(8, {message: "Password must be atmost 8 characters."})
})