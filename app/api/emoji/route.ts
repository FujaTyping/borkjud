import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const { text } = await req.json();
    const apikey = '9ik8LlUaSnuH75GfLLKp8QLyuIgQWRPU';

    if (!text) {
        return NextResponse.json({ error: 'Missing text parameter' }, { status: 400 });
    }

    const apiUrl = `https://api.aiforthai.in.th/emoji?text=${encodeURIComponent(text)}`;

    try {
        const res = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Apikey': apikey
            }
        });

        const data = await res.json();
        const emo = Object.keys(data)[0]
        return NextResponse.json(emo, { status: res.status });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch emoji' }, { status: 500 });
    }
}