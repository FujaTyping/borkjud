import { NextResponse } from "next/server";
import db from "@/lib/firebase_db";
import { collection, getDocs, query, orderBy, deleteDoc, doc, where } from "firebase/firestore";

export async function GET(request: Request) {
    try {
        const allHistory: any[] = [];

        const usersRef = collection(db, "Users");
        const usersSnapshot = await getDocs(usersRef);

        for (const userDoc of usersSnapshot.docs) {
            const userId = userDoc.id;
            const historyRef = collection(db, "Users", userId, "history");
            const q = query(
                historyRef,
                orderBy("lastUpdated", "desc")
            );
            const historySnapshot = await getDocs(q);

            historySnapshot.docs.forEach(doc => {
                const data = doc.data();
                if (data.booked === true) {
                    allHistory.push({
                        id: doc.id,
                        userId: userId,
                        userEmail: userDoc.data().email,
                        userName: userDoc.data().displayName,
                        ...data
                    });
                }
            });
        }

        allHistory.sort((a, b) =>
            new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
        );

        return NextResponse.json(allHistory, { status: 200 });

    } catch (error) {
        console.error("Error fetching all history:", error);
        return NextResponse.json(
            { error: "Failed to fetch history records" },
            { status: 500 }
        );
    }
}