import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json({
      success: true,
      message: "Admin logged out successfully.",
    });

    // Expire the Admin Session Cookie
    response.cookies.set({
      name: "dubai_admin_session",
      value: "",
      httpOnly: true,
      path: "/",
      maxAge: 0, // Immediately expire
    });

    return response;
  } catch (error) {
    console.error("Logout API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to log out admin." },
      { status: 500 }
    );
  }
}
