import { adminDb } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { verifyAuth } from "@/lib/auth-middleware";

export async function POST(request) {
    try {
        const userId = await verifyAuth(request);
        const { chatId } = await request.json();

        if (!chatId) return NextResponse.json({ error: "Chat ID missing" }, { status: 400 });

        const chatRef = adminDb.collection("chats").doc(chatId);
        const chatDoc = await chatRef.get();

        if (!chatDoc.exists) return NextResponse.json({ error: "Chat not found" }, { status: 404 });

        await chatRef.update({
            members: FieldValue.arrayRemove(userId)
        });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}