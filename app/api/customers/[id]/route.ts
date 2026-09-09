import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { localStore } from "@/lib/localStore";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, phone, statusText, status, dressesCount, totalDresses, totalAmountINR } = body;

    const newStatus = statusText || status || "Almost Elite";
    const dresses = dressesCount !== undefined ? dressesCount : totalDresses;
    const amount = totalAmountINR || "₹0";

    const updateData: Record<string, any> = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (newStatus) updateData.status = newStatus;
    if (dresses !== undefined) updateData.totalDresses = dresses;
    if (amount) updateData.totalAmountINR = amount;

    // Update localStore
    localStore.updateCustomer(id, updateData);

    // Try updating Firestore
    try {
      await adminDb.collection("customers").doc(String(id)).set(updateData, { merge: true });
    } catch (fsErr: any) {
      console.log("Firestore PATCH warning:", fsErr?.message);
    }

    return NextResponse.json({
      success: true,
      message: "Customer status and details updated successfully.",
    });
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

    return NextResponse.json({
      success: true,
      message: "Customer deleted successfully.",
    });
  } catch (error: any) {
    console.error("DELETE Customer Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete customer." },
      { status: 500 }
    );
  }
}
