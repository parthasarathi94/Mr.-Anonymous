import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const {username, code} = await request.json(); 

        const decodedUsername = decodeURIComponent(username);
        const user = await UserModel.findOne({username: decodedUsername});
        if(!user){
            return NextResponse.json({
                success: false,
                message: "User not found."
            },{status: 500})
        } 

        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

        if(isCodeValid && isCodeNotExpired){
            user.isVerified = true;
            await user.save();
            return NextResponse.json({
                success: true,
                message: "Account verified successfully."
            },{status: 200})
        }
        else if(!isCodeNotExpired){
            return NextResponse.json({
                success: false,
                message: "Verification code has expired. Please signup again."
            },{status: 400})
        }else{
            return NextResponse.json({
                success: false,
                message: "Verification code is incorrect."
            },{status: 400})
        }

    } catch (error) {
        console.log("Error in verification.", error);
        return NextResponse.json({
            success: false,
            message: "Error in verification"
        },{status: 500})
    }
}