import { adminDb } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

export async function PUT(request) {
    try {
        const { chatId, messageId, senderId, newContent } = await request.json();

        const msgRef = adminDb
            .collection("chats")
            .doc(chatId)
            .collection("messages")
            .doc(messageId);

        const doc = await msgRef.get();

        if (!doc.exists) return NextResponse.json({ error: "Message not found" }, { status: 404 });

        if (doc.data().senderId !== senderId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        await msgRef.update({
            content: newContent,
            isEdited: true
        });

        return NextResponse.json({ status: "updated" }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: "Update Error" }, { status: 500 });
    }
}