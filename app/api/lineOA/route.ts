import { NextRequest, NextResponse } from 'next/server';

const CHANNEL_ACCESS_TOKEN = ''; // Replace with your token

export async function POST(req: NextRequest) {
    const { name, date } = await req.json();

    if (!name || !date) {
        return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const messages = [
        {
            "type": "flex",
            "altText": "มีคิวจองมาใหม่",
            "contents": {
                "type": "bubble",
                "hero": {
                    "type": "image",
                    "url": "https://media-cdn.tripadvisor.com/media/photo-s/1a/d7/1b/3a/caption.jpg",
                    "size": "full",
                    "aspectRatio": "20:13",
                    "aspectMode": "cover",
                    "action": {
                        "type": "uri",
                        "uri": "https://borkjud.siraphop.me/user"
                    }
                },
                "body": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                        {
                            "type": "text",
                            "text": "มีคิวจองมาใหม่",
                            "weight": "bold",
                            "size": "xl"
                        },
                        {
                            "type": "box",
                            "layout": "vertical",
                            "margin": "lg",
                            "spacing": "sm",
                            "contents": [
                                {
                                    "type": "box",
                                    "layout": "baseline",
                                    "spacing": "sm",
                                    "contents": [
                                        {
                                            "type": "text",
                                            "text": "ชื่อคนจอง",
                                            "color": "#aaaaaa",
                                            "size": "sm",
                                            "flex": 1
                                        },
                                        {
                                            "type": "text",
                                            "text": `${name}`,
                                            "wrap": true,
                                            "color": "#666666",
                                            "size": "sm",
                                            "flex": 5
                                        }
                                    ]
                                },
                                {
                                    "type": "box",
                                    "layout": "baseline",
                                    "spacing": "sm",
                                    "contents": [
                                        {
                                            "type": "text",
                                            "text": "วันที่",
                                            "color": "#aaaaaa",
                                            "size": "sm",
                                            "flex": 1
                                        },
                                        {
                                            "type": "text",
                                            "text": `${date}`,
                                            "wrap": true,
                                            "color": "#666666",
                                            "size": "sm",
                                            "flex": 5
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                "footer": {
                    "type": "box",
                    "layout": "vertical",
                    "spacing": "sm",
                    "contents": [
                        {
                            "type": "button",
                            "style": "link",
                            "height": "sm",
                            "action": {
                                "type": "uri",
                                "label": "แดชบอร์ด",
                                "uri": "https://borkjud.siraphop.me/user"
                            }
                        },
                        {
                            "type": "box",
                            "layout": "vertical",
                            "contents": [],
                            "margin": "sm"
                        }
                    ],
                    "flex": 0
                }
            }
        }
    ];

    try {
        const res = await fetch('https://api.line.me/v2/bot/message/push', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${CHANNEL_ACCESS_TOKEN}`
            },
            body: JSON.stringify({
                to: "",
                messages
            })
        });

        if (!res.ok) {
            const error = await res.json();
            return NextResponse.json({ error }, { status: res.status });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }
}