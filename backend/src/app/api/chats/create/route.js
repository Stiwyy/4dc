import { adminDb } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { currentUserId, targetUserId } = await request.json();

        if (!currentUserId || !targetUserId) return NextResponse.json({ error: "IDs missing" }, { status: 400 });

        const chatId = [currentUserId, targetUserId].sort().join("_");

        const chatRef = adminDb.collection("chats").doc(chatId);
        const chatDoc = await chatRef.get();

        if (!chatDoc.exists) {
            await chatRef.set({
                members: [currentUserId, targetUserId],
                createdAt: new Date().toISOString(),
                lastMessageAt: new Date().toISOString(),
                type: "direct"
            });
        }

        return NextResponse.json({ chatId }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}