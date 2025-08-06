import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { text } = body;

        if (!text) {
            return NextResponse.json({ error: "Text is required" }, { status: 400 });
        }

        const apiKey = '9ik8LlUaSnuH75GfLLKp8QLyuIgQWRPU';

        const externalApiResponse = await axios.post(
            'https://api.aiforthai.in.th/vaja',
            {
                text: text,
                speaker: "noina"
            },
            {
                headers: {
                    'Apikey': apiKey,
                    'Content-Type': 'application/json'
                }
            }
        );

        const audioUrl = externalApiResponse.data.audio_url;

        if (!audioUrl) {
            return NextResponse.json({ error: "Could not retrieve audio URL from API response" }, { status: 500 });
        }

        return NextResponse.json({ url: audioUrl });

    } catch (error: any) {
        console.error("Error in /api/tts route:", error.response ? error.response.data : error.message);
        return NextResponse.json({ error: "Failed to generate speech" }, { status: 500 });
    }
}
