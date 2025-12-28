import { adminDb } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(request) {
    try {
        const { chatId, senderId, content, replyToMessageId } = await request.json();

        if (!chatId || !senderId || !content) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const messageData = {
            senderId,
            content,
            sentAt: new Date().toISOString(),
            isEdited: false,
            isDeleted: false,
            replyTo: replyToMessageId || null
        };

        const messageRef = await adminDb
            .collection("chats")
            .doc(chatId)
            .collection("messages")
            .add(messageData);

        await adminDb.collection("chats").doc(chatId).update({
            lastMessageAt: new Date().toISOString()
        });

        return NextResponse.json({ messageId: messageRef.id, status: "sent" }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Send Error" }, { status: 500 });
    }
}