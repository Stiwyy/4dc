import { adminDb } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(request) {
    try {
        // TODO: IMPORTANT
        // Switch currentUserId from body for firebase ID Token later

        const { currentUserId, targetUserId } = await request.json();

        if (!currentUserId || !targetUserId) {
            return NextResponse.json({ error: "Missing User IDs" }, { status: 400 });
        }

        if (currentUserId === targetUserId) {
            return NextResponse.json({ error: "Du kannst dich nicht selbst hinzufügen." }, { status: 400 });
        }

        const targetUserRef = adminDb.collection("users").doc(targetUserId);
        const currentUserRef = adminDb.collection("users").doc(currentUserId);

        await adminDb.runTransaction(async (t) => {
            const targetDoc = await t.get(targetUserRef);
            const currentDoc = await t.get(currentUserRef);

            if (!targetDoc.exists) {
                throw new Error("USER_NOT_FOUND");
            }

            const targetData = targetDoc.data();
            const currentData = currentDoc.data();

            if (currentData.contacts.includes(targetUserId)) {
                throw new Error("ALREADY_CONTACTS");
            }

            if (currentData.contactRequestsSent.includes(targetUserId)) {
                throw new Error("REQUEST_ALREADY_SENT");
            }

            if (currentData.contactRequestsReceived.includes(targetUserId)) {
                throw new Error("CHECK_RECEIVED_REQUESTS");
            }

            t.update(currentUserRef, {
                contactRequestsSent: FieldValue.arrayUnion(targetUserId)
            });

            t.update(targetUserRef, {
                contactRequestsReceived: FieldValue.arrayUnion(currentUserId)
            });
        });

        return NextResponse.json({ message: "Contact request sent." }, { status: 200 });

    } catch (error) {
        console.error(error);
        if (error.message === "USER_NOT_FOUND") return NextResponse.json({ error: "User not found" }, { status: 404 });
        if (error.message === "ALREADY_CONTACTS") return NextResponse.json({ error: "Already in contact list" }, { status: 409 });
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}