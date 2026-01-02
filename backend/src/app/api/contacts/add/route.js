import { adminDb } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { verifyAuth } from "@/lib/auth-middleware";

export async function POST(request) {
    try {
        let currentUserId;
        try {
            currentUserId = await verifyAuth(request);
        } catch (e) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { targetUserId } = await request.json();

        if (!targetUserId) {
            return NextResponse.json({ error: "Missing Target ID" }, { status: 400 });
        }

        if (currentUserId === targetUserId) {
            return NextResponse.json({ error: "Self-add not allowed" }, { status: 400 });
        }

        const targetUserRef = adminDb.collection("users").doc(targetUserId);
        const currentUserRef = adminDb.collection("users").doc(currentUserId);

        await adminDb.runTransaction(async (t) => {
            const targetDoc = await t.get(targetUserRef);
            const currentDoc = await t.get(currentUserRef);

            if (!targetDoc.exists) throw new Error("USER_NOT_FOUND");

            const currentData = currentDoc.data();
            if (currentData.contacts.includes(targetUserId)) throw new Error("ALREADY_CONTACTS");
            if (currentData.contactRequestsSent.includes(targetUserId)) throw new Error("REQUEST_ALREADY_SENT");

            t.update(currentUserRef, { contactRequestsSent: FieldValue.arrayUnion(targetUserId) });
            t.update(targetUserRef, { contactRequestsReceived: FieldValue.arrayUnion(currentUserId) });
        });

        return NextResponse.json({ message: "Request sent." }, { status: 200 });

    } catch (error) {
        console.error(error);
        if (error.message === "USER_NOT_FOUND") return NextResponse.json({ error: "User not found" }, { status: 404 });
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}