import { adminAuth } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

export async function verifyAuth(request) {
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new Error("UNAUTHORIZED");
    }

    const token = authHeader.split("Bearer ")[1];

    try {
        const decodedToken = await adminAuth.verifyIdToken(token);
        return decodedToken.uid;
    } catch (error) {
        console.error("Auth Verification Failed:", error);
        throw new Error("INVALID_TOKEN");
    }
}