import { NextResponse } from "next/server";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export async function POST(request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { error: "Missing email or password" },
                { status: 400 }
            );
        }

        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        return NextResponse.json(
            {
                success: true,
                userId: user.uid,
                email: user.email,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Login error:", error);

        return NextResponse.json(
            {
                error: error.message || "Login failed",
            },
            { status: 401 }
        );
    }
}
