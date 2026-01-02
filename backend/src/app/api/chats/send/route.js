import { adminDb } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth-middleware";

export async function POST(request) {
    try {
        let senderId;
        try {
            senderId = await verifyAuth(request);
        } catch (e) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { chatId, content, replyToMessageId } = await request.json();

        if (!chatId || !content) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const chatRef = adminDb.collection("chats").doc(chatId);
        const chatDoc = await chatRef.get();

        if (!chatDoc.exists) {
            return NextResponse.json({ error: "Chat not found" }, { status: 404 });
        }

        const chatData = chatDoc.data();
        if (!chatData.members.includes(senderId)) {
            return NextResponse.json({ error: "You are not a member of this chat" }, { status: 403 });
        }

        const messageData = {
            senderId,
            content,
            sentAt: new Date().toISOString(),
            isEdited: false,
            replyTo: replyToMessageId || null
        };

        const messageRef = await chatRef.collection("messages").add(messageData);

        await chatRef.update({
            lastMessageAt: new Date().toISOString()
        });

        return NextResponse.json({ messageId: messageRef.id, status: "sent" }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Send Error" }, { status: 500 });
    }
}