import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

function get10DigitPhone(phone: string): string {
  const digits = String(phone || "").replace(/[^0-9]/g, "");
  if (digits.length === 12 && digits.startsWith("91")) {
    return digits.slice(2);
  }
  if (digits.length === 11 && digits.startsWith("0")) {
    return digits.slice(1);
  }
  if (digits.length > 10) {
    return digits.slice(-10);
  }
  return digits;
}

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
    const digits10 = get10DigitPhone(cleanPhone);

    // Query Firestore admins collection directly
    try {
      const snapshot = await adminDb.collection("admins").get();

      if (snapshot && !snapshot.empty) {
        const matchedDoc = snapshot.docs.find((doc: any) => {
          const docData = doc.data();
          const docPhoneDigits = get10DigitPhone(docData.phone || doc.id);
          const docPassword = String(docData.password || "").trim();
          return (
            (docPhoneDigits === digits10 || docData.phone === cleanPhone) &&
            docPassword === cleanPassword
          );
        });

        if (matchedDoc) {
          const docData = matchedDoc.data();
          const adminData = {
            id: matchedDoc.id,
            name: docData.name || "Admin",
            phone: docData.phone || cleanPhone,
          };

          const response = NextResponse.json({
            success: true,
            admin: adminData,
            message: "Admin authenticated successfully.",
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
      }
    } catch (dbErr) {
      console.error("Firestore authentication error:", dbErr);
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


