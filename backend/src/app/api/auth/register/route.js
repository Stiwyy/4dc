import { NextResponse } from "next/server";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export async function POST(request) {
    try {
        const body = await request.json();
        const { email, password, username } = body;

        if (!email || !password || !username) {
            return NextResponse.json(
                { error: "Missing email, password or username" },
                { status: 400 }
            );
        }

        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
            username: username,
            createdAt: serverTimestamp(),
            contacts: [],
            contactRequestsSent: [],
            contactRequestsReceived: [],
        });

        return NextResponse.json(
            {
                success: true,
                userId: user.uid,
                username: username,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Register error:", error);

        return NextResponse.json(
            {
                error: error.message || "Registration failed",
            },
            { status: 500 }
        );
    }
}
