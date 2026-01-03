import { adminDb } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

export async function DELETE(request) {
    try {
        const { chatId, messageId, senderId } = await request.json();

        if (!chatId || !messageId || !senderId) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const msgRef = adminDb
            .collection("chats")
            .doc(chatId)
            .collection("messages")
            .doc(messageId);

        const doc = await msgRef.get();

        if (!doc.exists) {
            return NextResponse.json({ error: "Message not found" }, { status: 404 });
        }

        if (doc.data().senderId !== senderId) {
            return NextResponse.json({ error: "Unauthorized operation" }, { status: 403 });
        }

        await msgRef.delete();

        return NextResponse.json({
            status: "permanently deleted",
            id: messageId
        }, { status: 200 });

    } catch (error) {
        console.error("Delete Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}