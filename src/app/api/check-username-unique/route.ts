import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";
import { NextResponse } from "next/server";

const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request) {  

    await dbConnect();
    try {
        
        const {searchParams} = new URL(request.url);
        const queryParam = {
            username: searchParams.get('username')
        }

        //Validate with zod
        const result = UsernameQuerySchema.safeParse(queryParam);
        console.log(result);
        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || [];
            return NextResponse.json({
                success: false,
                message: usernameErrors?.length>0 ? usernameErrors.join(',') : "Invalid query parameters"
            },{status: 400});
        }

        const {username} = result.data;
        const existingUserVerified = await UserModel.findOne({username, isVerified: true});
        if(existingUserVerified){
            return NextResponse.json({
                success: false,
                message:"Username already taken"
            },{status: 400});
        }
        return NextResponse.json({
            success: true,
            message:"Username is avalaible"
        },{status: 201});

    } catch (error) {
        console.log("Error checking username", error);
        return NextResponse.json({
            success: false,
            message: "Error checking username"
        },{ status: 500})
    }
}