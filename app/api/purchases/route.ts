import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { localStore } from "@/lib/localStore";

interface FirestoreDoc {
  id: string;
  data: () => Record<string, unknown>;
}

interface FirestoreSnap {
  docs: FirestoreDoc[];
}

export async function GET() {
  try {
    const fetchPurchases = adminDb.collection("purchases").get();
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), 1000)
    );

    const snap = (await Promise.race([fetchPurchases, timeout])) as FirestoreSnap;
    if (snap && snap.docs && snap.docs.length > 0) {
      const purchases = snap.docs.map((doc: FirestoreDoc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return NextResponse.json({ success: true, purchases });
    }
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.log("Firestore purchases fetch fallback to localStore:", msg);
  }

  // Fallback to localStore
  const localPurchases = localStore.getPurchases();
  return NextResponse.json({ success: true, purchases: localPurchases });
}

export async function POST(req: Request) {
  try {
    const { customerId, dressName, collection, purchaseDate, amountINR, qty } = await req.json();

    if (!customerId || !dressName) {
      return NextResponse.json(
        { success: false, error: "Customer ID and Dress Name are required." },
        { status: 400 }
      );
    }

    const qtyNum = Number(qty) || 1;
    const formattedAmount = amountINR ? (String(amountINR).startsWith("₹") ? amountINR : `₹${amountINR}`) : "₹0";

    // 1. Add to localStore
    const newPurchase = localStore.addPurchase({
      customerId: String(customerId),
      dressName,
      collection: collection || "Royal Silk Collection",
      purchaseDate: purchaseDate || new Date().toISOString().split("T")[0],
      amountINR: formattedAmount,
      qty: qtyNum,
    });

    // 2. Try Firestore in background
    try {
      await adminDb.collection("purchases").add({
        customerId: String(customerId),
        dressName,
        collection: collection || "Royal Silk Collection",
        purchaseDate: purchaseDate || new Date().toISOString().split("T")[0],
        amountINR: formattedAmount,
        qty: qtyNum,
        createdAt: new Date().toISOString(),
      });

      const custPurchasesSnap = await adminDb
        .collection("purchases")
        .where("customerId", "==", String(customerId))
        .get();

      let totalDresses = 0;
      custPurchasesSnap.docs.forEach((d) => {
        totalDresses += Number(d.data().qty) || 1;
      });

      let newStatus = "Regular";
      if (totalDresses >= 12) newStatus = "Elite";
      else if (totalDresses === 11) newStatus = "Almost Elite";
      else if (totalDresses >= 8) newStatus = "Gold";
      else if (totalDresses >= 4) newStatus = "Silver";

      await adminDb.collection("customers").doc(String(customerId)).update({
        status: newStatus,
        totalDresses,
      });
    } catch (fsErr: unknown) {
      const msg = fsErr instanceof Error ? fsErr.message : String(fsErr);
      console.log("Firestore purchase write warning:", msg);
    }

    return NextResponse.json({
      success: true,
      purchaseId: newPurchase.id,
      message: "Purchase added and customer status updated successfully.",
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("POST /api/purchases Error:", error);
    return NextResponse.json(
      { success: false, error: msg || "Failed to add purchase." },
      { status: 500 }
    );
  }
}
