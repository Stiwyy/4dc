import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { email, password, username } = await request.json();

        if (!email || !password || !username) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const userRecord = await adminAuth.createUser({
            email,
            password,
            displayName: username,
        });

        await adminDb.collection("users").doc(userRecord.uid).set({
            username,
            createdAt: new Date().toISOString(),
            contacts: [],
            contactRequestsSent: [],
            contactRequestsReceived: [],
        });

        return NextResponse.json({ uid: userRecord.uid, username }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.code || "INTERNAL_SERVER_ERROR" }, { status: 500 });
    }
}
