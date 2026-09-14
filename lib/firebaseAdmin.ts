import * as admin from "firebase-admin";

if (!admin.apps.length) {
  try {
    const rawKey = process.env.FIREBASE_PRIVATE_KEY || "";
    const cleanKey = rawKey.trim().replace(/^"(.*)"$/s, "$1").replace(/\\n/g, "\n");

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "dubai-boutique",
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: cleanKey || undefined,
      }),
    });
    console.log("Firebase Admin SDK initialized successfully.");
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Firebase Admin initialization error:", msg);
    try {
      admin.initializeApp({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "dubai-boutique",
      });
    } catch {}
  }
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
