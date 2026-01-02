import { adminDb } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { verifyAuth } from "@/lib/auth-middleware";

export async function POST(request) {
    try {
        const requesterId = await verifyAuth(request);
        const { chatId, newMemberId } = await request.json();

        if (!chatId || !newMemberId) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

        const chatRef = adminDb.collection("chats").doc(chatId);
        const chatDoc = await chatRef.get();

        if (!chatDoc.exists) return NextResponse.json({ error: "Chat not found" }, { status: 404 });

        const data = chatDoc.data();
        if (data.type !== 'group') return NextResponse.json({ error: "Cannot add members to direct chats" }, { status: 400 });
        if (!data.members.includes(requesterId)) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

        await chatRef.update({
            members: FieldValue.arrayUnion(newMemberId)
        });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}