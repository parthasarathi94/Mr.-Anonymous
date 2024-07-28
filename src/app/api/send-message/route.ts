import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";
import { NextResponse } from "next/server";

export async function POST(request:Request) {
    await dbConnect();

    const {username, content} = await request.json();
    try {
        const user = await UserModel.findOne({username});
        if(!user){
            return NextResponse.json({
                success: false,
                message: "User not found by this username."
            }, { status: 404})
        }
        
        //Is user accepting the messages?
        if(!user.isAcceptingMessage){
            return NextResponse.json({
                success: false,
                message: "User is not accepting messages."
            }, { status: 403 })
        }

        const newMessage = {content, createdAt: new Date()};
        user.messages.push(newMessage as Message);
        await user.save();
        return NextResponse.json({
            success: true,
            message: "Message send successfully."
        }, { status: 201})

    } catch (error) {
        console.log("An unexpected error occured: ", error);
        return NextResponse.json({
            success: false,
            message: "An unexpected error occured."
        }, { status: 500 })
    }
}