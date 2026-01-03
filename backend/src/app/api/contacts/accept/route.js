import { adminDb } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(request) {
    try {
        // TODO: IMPORTANT
        // Switch currentUserId from body for firebase ID Token later
        const { currentUserId, requesterId } = await request.json();

        if (!currentUserId || !requesterId) {
            return NextResponse.json({ error: "Missing IDs" }, { status: 400 });
        }

        const currentUserRef = adminDb.collection("users").doc(currentUserId);
        const requesterRef = adminDb.collection("users").doc(requesterId);

        await adminDb.runTransaction(async (t) => {
            const currentUserDoc = await t.get(currentUserRef);

            if (!currentUserDoc.exists) throw new Error("USER_NOT_FOUND");

            const userData = currentUserDoc.data();

            if (!userData.contactRequestsReceived.includes(requesterId)) {
                throw new Error("NO_REQUEST_FOUND");
            }

            t.update(currentUserRef, {
                contactRequestsReceived: FieldValue.arrayRemove(requesterId),
                contacts: FieldValue.arrayUnion(requesterId)
            });


            t.update(requesterRef, {
                contactRequestsSent: FieldValue.arrayRemove(currentUserId),
                contacts: FieldValue.arrayUnion(currentUserId)
            });

            // add chat document here maybe we'll see
        });

        return NextResponse.json({ message: "Contact request accepted" }, { status: 200 });

    } catch (error) {
        console.error("Accept Error:", error);
        if (error.message === "NO_REQUEST_FOUND") return NextResponse.json({ error: "No open request found." }, { status: 404 });
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}