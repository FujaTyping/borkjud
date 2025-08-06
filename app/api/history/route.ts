import { NextResponse } from "next/server";
import db from "@/lib/firebase_db";
import { collection, doc, setDoc, getDocs, query, orderBy, deleteDoc } from "firebase/firestore";

export async function POST(request: Request) {
    try {
        const { userid, where, symptom, hurt, response } = await request.json();

        if (!userid || !where || !symptom || !hurt) {
            return NextResponse.json(
                { error: "Missing required fields" }, 
                { status: 400 }
            );
        }

        const timestamp = new Date().toISOString();

        const historyRef = doc(
            collection(db, "Users", userid, "history"));

        await setDoc(historyRef, {
            where,
            symptom,
            hurt,
            response,
            scheduleTime: null,
            booked: false,
            createdAt: timestamp
        });

        return NextResponse.json(
            { message: "History saved successfully" }, 
            { status: 201 }
        );

    } catch (error) {
        console.error("Error saving history:", error);
        return NextResponse.json(
            { error: "Failed to save history" }, 
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const userid = searchParams.get('userid');

        if (!userid) {
            return NextResponse.json(
                { error: "User ID is required" }, 
                { status: 400 }
            );
        }

        const historyRef = collection(db, "Users", userid, "history");
        const q = query(historyRef, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        const history = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return NextResponse.json(history, { status: 200 });

    } catch (error) {
        console.error("Error fetching history:", error);
        return NextResponse.json(
            { error: "Failed to fetch history" }, 
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const userid = searchParams.get('userid');
        const historyId = searchParams.get('historyId');

        if (!userid || !historyId) {
            return NextResponse.json(
                { error: "User ID and History ID are required" },
                { status: 400 }
            );
        }

        const historyRef = doc(db, "Users", userid, "history", historyId);
        await deleteDoc(historyRef);

        return NextResponse.json(
            { message: "History deleted successfully" },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error deleting history:", error);
        return NextResponse.json(
            { error: "Failed to delete history" },
            { status: 500 }
        );
    }
}