import {z} from 'zod'


export const messageSchema = z.object({
    content: z.string().min(2, {message: "Message must be atleast of 2 characters."}).max(200, {message: "Message must be no longer than 200 characters."})
})