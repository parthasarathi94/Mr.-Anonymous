import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import { NextResponse } from "next/server";

//POST is used for updating the user’s message acceptance status.
export async function POST(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
    if (!session || !session.user) {
        return NextResponse.json({
            success: false,
            message: "Not Authenticated."
        }, { status: 401 })
    }

    const userId = user._id;
    const { acceptMessages } = await request.json();

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessage: acceptMessages },
            { new: true }
        )

        if (!updatedUser) {
            return NextResponse.json({
                success: false,
                message: "Failed to update user status to accept messages."
            }, { status: 401 })
        }
        return NextResponse.json({
            success: true,
            message: "Message acceptance status updated successfully.",
            updatedUser
        }, { status: 200 })

    } catch (error) {
        console.log("Failed to update user status to accept messages.");
        return NextResponse.json({
            success: false,
            message: "Failed to update user status to accept messages."
        }, { status: 500 })
    }
}

//GET is used for retrieving the user’s current message acceptance status.
export async function GET(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
    if (!session || !session.user) {
        return NextResponse.json({
            success: false,
            message: "Not Authenticated"
        }, { status: 401 })
    }

    const userId = user._id;

    try {
        const foundUser = await UserModel.findByIdAndUpdate(userId);

        if (!foundUser) {
            return NextResponse.json({
                success: false,
                message: "User not found."
            }, { status: 404 })
        }
        return NextResponse.json({
            success: true,
            isAcceptingMessages: foundUser.isAcceptingMessage
        }, { status: 200 })
    } catch (error) {
        console.log("Failed to update user status to accept messages.");
        return NextResponse.json({
            success: false,
            message: "Error in getting message status."
        }, { status: 500 })
    }
}

