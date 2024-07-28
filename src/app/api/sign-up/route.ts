import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from 'bcryptjs'
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request:NextRequest) {

    await dbConnect();

    try {
        const {username, email, password} = await request.json();

        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true  
        })

        if(existingUserVerifiedByUsername){
            return NextResponse.json({success: false, message: "Username already exist. Try another."}, {status:400})
        }

        const existingUserByEmail = await UserModel.findOne({email})
        
        const verifyCode = Math.floor(100000 + Math.random()*900000).toString();

        //User exist already
        if(existingUserByEmail){
            //User exist and also verified
            if(existingUserByEmail.isVerified){
                return NextResponse.json({success: false, message: "User already exist with this email."}, {status: 400})
            }
            //User exist but not verified. Just update the user.
            else{
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await existingUserByEmail.save();
            }
        }
        //User newly come to the site
        else{
            const hashesPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new UserModel({
                username,
                email,
                password: hashesPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
            })
            await newUser.save();
        }

        // Send verification email
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        )
        if(!emailResponse.success){
            return NextResponse.json({success: false, message: emailResponse.message}, {status: 500})
        }
        return NextResponse.json({success:true, message: "User registered successfully. Please verify your email."},{status:201})

    } catch (error) {
        console.log("Error in user registration.", error);
        return NextResponse.json(
            {
            success: false,
            message: "Error in user registration.",
            },
            {
                status: 500
            }
        )
    }
}