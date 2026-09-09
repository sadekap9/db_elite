import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

export async function POST(req: Request) {
  try {
    const { phone, password } = await req.json();

    if (!phone || !password) {
      return NextResponse.json(
        { success: false, error: "Phone number and password are required." },
        { status: 400 }
      );
    }

    const cleanPhone = String(phone).replace(/\s+/g, "").trim();
    const cleanPassword = String(password).trim();

    // 1. FAST INSTANT CHECK (0ms response time) for configured Admin Account
    if (
      (cleanPhone === "9510448090" || cleanPhone === "+919510448090") &&
      cleanPassword === "Admin@123"
    ) {
      const response = NextResponse.json({
        success: true,
        admin: {
          id: 1,
          name: "Siddiqa Parveen",
          phone: "+91 95104 48090",
        },
        message: "Admin authenticated successfully.",
      });

      response.cookies.set({
        name: "dubai_admin_session",
        value: "session_active_1",
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });

      return response;
    }

    // 2. Query Firestore with 1.2s fast timeout
    try {
      const firestorePromise = adminDb
        .collection("admins")
        .where("phone", "==", cleanPhone)
        .where("password", "==", cleanPassword)
        .limit(1)
        .get();

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Firestore timeout")), 1200)
      );

      const snapshot: any = await Promise.race([firestorePromise, timeoutPromise]);

      if (snapshot && !snapshot.empty) {
        const docData = snapshot.docs[0].data();
        const adminData = {
          id: snapshot.docs[0].id,
          name: docData.name || "Siddiqa Parveen",
          phone: docData.phone || cleanPhone,
        };

        const response = NextResponse.json({
          success: true,
          admin: adminData,
          message: "Admin authenticated successfully via Firestore.",
        });

        response.cookies.set({
          name: "dubai_admin_session",
          value: `session_active_${adminData.id}`,
          httpOnly: true,
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
        });

        return response;
      }
    } catch (dbErr) {
      console.log("Firestore query skipped/timed out:", dbErr);
    }

    return NextResponse.json(
      { success: false, error: "Invalid phone number or admin password." },
      { status: 401 }
    );
  } catch (error: any) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error during login." },
      { status: 500 }
    );
  }
}
