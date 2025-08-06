import { NextResponse } from "next/server";
import db from "@/lib/firebase_db";
import { doc, getDoc, setDoc } from "firebase/firestore";

export async function POST(request: Request) {
    try {
        const { uid, email, displayName, photoURL } = await request.json();

        const userRef = doc(db, "Users", uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            await setDoc(userRef, {
                email,
                displayName,
                photoURL,
                isAdmin: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
            return NextResponse.json({ message: "User created successfully" }, { status: 201 });
        }

        return NextResponse.json({ message: "User already exists" }, { status: 200 });
    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
    }
}