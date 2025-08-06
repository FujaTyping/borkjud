import { NextResponse } from "next/server";
import db from "@/lib/firebase_db";
import { doc, updateDoc } from "firebase/firestore";

export async function PATCH(request: Request) {
    try {
        const { userid, historyid, scheduleTime } = await request.json();

        if (!userid || !historyid || !scheduleTime) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const historyRef = doc(db, "Users", userid, "history", historyid);

        await updateDoc(historyRef, {
            scheduleTime: scheduleTime,
            booked: true,
            lastUpdated: new Date().toISOString()
        });

        return NextResponse.json(
            { message: "Schedule time updated successfully" },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error updating schedule time:", error);
        return NextResponse.json(
            { error: "Failed to update schedule time" },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const { userid, historyid } = await request.json();

        if (!userid || !historyid) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const historyRef = doc(db, "Users", userid, "history", historyid);

        await updateDoc(historyRef, {
            scheduleTime: null,
            booked: false,
            lastUpdated: new Date().toISOString()
        });

        return NextResponse.json(
            { message: "Booking reset successfully" },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error resetting booking:", error);
        return NextResponse.json(
            { error: "Failed to reset booking" },
            { status: 500 }
        );
    }
}