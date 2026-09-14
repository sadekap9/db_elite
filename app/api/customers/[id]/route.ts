import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { localStore } from "@/lib/localStore";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const {
      name,
      phone,
      statusText,
      status,
      dressesCount,
      totalDresses,
      totalAmountINR,
      email,
      city,
      birthday,
      preferredStyle,
    } = body;

    const newStatus = statusText || status;
    const dresses = dressesCount !== undefined ? dressesCount : totalDresses;

    const updateData: Record<string, any> = {};
    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (newStatus !== undefined) updateData.status = newStatus;
    if (dresses !== undefined) updateData.totalDresses = Number(dresses);
    if (totalAmountINR !== undefined) updateData.totalAmountINR = totalAmountINR;
    if (email !== undefined) updateData.email = email;
    if (city !== undefined) updateData.city = city;
    if (birthday !== undefined) updateData.birthday = birthday;
    if (preferredStyle !== undefined) updateData.preferredStyle = preferredStyle;

    // Update localStore immediately
    const updatedCustomer = localStore.updateCustomer(id, updateData);

    // Try updating Firestore in background
    try {
      await adminDb.collection("customers").doc(String(id)).set(updateData, { merge: true });
    } catch (fsErr: any) {
      console.log("Firestore PATCH warning:", fsErr?.message);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Customer status and details updated successfully.",
        customer: updatedCustomer,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (error: any) {
    console.error("PATCH Customer Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update customer." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Delete from localStore
    localStore.deleteCustomer(id);

    // Try deleting from Firestore
    try {
      await adminDb.collection("customers").doc(String(id)).delete();
    } catch (fsErr: any) {
      console.log("Firestore DELETE warning:", fsErr?.message);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Customer deleted successfully.",
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (error: any) {
    console.error("DELETE Customer Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete customer." },
      { status: 500 }
    );
  }
}
