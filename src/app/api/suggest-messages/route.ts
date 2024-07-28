// import { createGoogleGenerativeAI } from '@ai-sdk/google';
// import { streamText } from 'ai';
// import { NextResponse } from 'next/server';

// const google = createGoogleGenerativeAI({
//     apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY
// })

// export const runtime = 'edge';

// export async function POST(req: Request) {

//     try {

//         const result = await streamText({
//             model: google('models/gemini-pro'),
//             maxTokens: 400,
//             prompt:
//                 "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.",
//         });
//         return result.toAIStreamResponse();
//     } catch (error) {
//         if (error instanceof Error) {
//             const { name, message } = error;
//             const status = 500;
//             return NextResponse.json({ name, message, status}, { status });
//         }
//         else {
//             console.error("An unexpected error occured.", error);
//             throw error;
//         }
//     }
// }

import { StreamingTextResponse, GoogleGenerativeAIStream} from 'ai';
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request, res: Response) {
    const reqBody = await req.json();
    console.log(reqBody);
    const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment."
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const streamingResponse = await model.generateContentStream(prompt);

    return new StreamingTextResponse(GoogleGenerativeAIStream(streamingResponse))
}
