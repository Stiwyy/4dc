import { adminDb } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth-middleware";

export async function POST(request) {
    try {
        let currentUserId;
        try {
            currentUserId = await verifyAuth(request);
        } catch (e) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { targetUserId, type, groupName, members } = body;

        if (!type || type === 'direct') {
            if (!targetUserId) {
                return NextResponse.json({ error: "Target Missing" }, { status: 400 });
            }

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
        }

        if (type === 'group') {
            if (!groupName || !members || !Array.isArray(members)) {
                return NextResponse.json({ error: "Group details missing" }, { status: 400 });
            }

            const allMembers = [...new Set([...members, currentUserId])];

            const chatRef = adminDb.collection("chats").doc();

            await chatRef.set({
                type: "group",
                name: groupName,
                admin: currentUserId,
                members: allMembers,
                createdAt: new Date().toISOString(),
                lastMessageAt: new Date().toISOString()
            });

            return NextResponse.json({ chatId: chatRef.id }, { status: 200 });
        }

    } catch (error) {
        console.error("Create Chat Error:", error);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}