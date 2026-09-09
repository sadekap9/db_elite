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
    const fetchCustomers = adminDb.collection("customers").get();
    const fetchPurchases = adminDb.collection("purchases").get();
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), 1000)
    );

    const [customersSnap, purchasesSnap] = (await Promise.all([
      Promise.race([fetchCustomers, timeout]),
      Promise.race([fetchPurchases, timeout]),
    ])) as [FirestoreSnap, FirestoreSnap];

    if (customersSnap && customersSnap.docs && customersSnap.docs.length > 0) {
      const purchasesList = (purchasesSnap && purchasesSnap.docs)
        ? purchasesSnap.docs.map((doc: FirestoreDoc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        : [];

      const customers = customersSnap.docs.map((doc: FirestoreDoc) => {
        const custData = doc.data();
        const custId = doc.id;

        const custPurchases = purchasesList.filter(
          (p: Record<string, unknown>) => String(p.customerId) === String(custId)
        );

        let totalDresses = (custData.totalDresses as number) || 0;
        let totalAmountNum = 0;
        let lastDate = (custData.lastPurchaseDate as string) || "";

        custPurchases.forEach((p: Record<string, unknown>) => {
          const qty = Number(p.qty) || 1;
          if (!custData.totalDresses) totalDresses += qty;

          const amtStr = String(p.amountINR || "0").replace(/[^0-9]/g, "");
          totalAmountNum += Number(amtStr) || 0;

          if (p.purchaseDate && (!lastDate || String(p.purchaseDate) > lastDate)) {
            lastDate = String(p.purchaseDate);
          }
        });

        return {
          id: custId,
          name: custData.name || "Anonymous",
          phone: custData.phone || "",
          status: custData.status || "Regular",
          dresses: totalDresses,
          totalAmountINR: custData.totalAmountINR || `₹${totalAmountNum.toLocaleString("en-IN")}`,
          totalAmountNum,
          lastPurchaseDate: lastDate || "N/A",
          purchases: custPurchases,
        };
      });

      return NextResponse.json({ success: true, customers });
    }
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.log("Firestore fetch fallback to localStore:", msg);
  }

  // Fallback to localStore
  const localCustomers = localStore.getCustomers();
  const localPurchases = localStore.getPurchases();

  const customers = localCustomers.map((c) => {
    const custPurchases = localPurchases.filter(
      (p) => String(p.customerId) === String(c.id)
    );

    let totalDresses = c.totalDresses !== undefined ? c.totalDresses : 0;
    let totalAmountNum = 0;
    let lastDate = c.lastPurchaseDate || "";

    custPurchases.forEach((p) => {
      const amtStr = String(p.amountINR || "0").replace(/[^0-9]/g, "");
      totalAmountNum += Number(amtStr) || 0;

      if (p.purchaseDate && (!lastDate || p.purchaseDate > lastDate)) {
        lastDate = p.purchaseDate;
      }
    });

    if (totalDresses === 0 && custPurchases.length > 0) {
      totalDresses = custPurchases.reduce((acc, p) => acc + (Number(p.qty) || 1), 0);
    }

    return {
      id: c.id,
      name: c.name,
      phone: c.phone,
      email: c.email || "",
      city: c.city || "",
      birthday: c.birthday || "",
      preferredStyle: c.preferredStyle || "",
      createdAt: c.createdAt || "",
      status: c.status || "Regular",
      dresses: totalDresses,
      totalAmountINR: c.totalAmountINR || (totalAmountNum > 0 ? `₹${totalAmountNum.toLocaleString("en-IN")}` : "₹0"),
      totalAmountNum,
      lastPurchaseDate: lastDate || "N/A",
      purchases: custPurchases.map((p) => ({
        id: p.id,
        dressName: p.dressName,
        collection: p.collection || "Royal Collection",
        purchaseDate: p.purchaseDate,
        amountINR: p.amountINR,
        qty: p.qty,
      })),
    };
  });

  return NextResponse.json({ success: true, customers });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, status, dressName, qty, amountINR, purchaseDate } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { success: false, error: "Customer name and phone number are required." },
        { status: 400 }
      );
    }

    const qtyNum = Number(qty) || 1;
    const formattedAmount = amountINR ? (String(amountINR).startsWith("₹") ? amountINR : `₹${amountINR}`) : "₹0";

    // Always save to localStore first
    const newCust = localStore.addCustomer({
      name,
      phone,
      status: status || "Regular",
      totalDresses: qtyNum,
      totalAmountINR: formattedAmount,
      lastPurchaseDate: purchaseDate || new Date().toISOString().split("T")[0],
    });

    if (dressName || amountINR) {
      localStore.addPurchase({
        customerId: newCust.id,
        dressName: dressName || "Initial Dress Purchase",
        collection: "Royal Collection",
        purchaseDate: purchaseDate || new Date().toISOString().split("T")[0],
        amountINR: formattedAmount,
        qty: qtyNum,
      });
    }

    // Try saving to Firestore in background/safely
    try {
      const customerRef = await adminDb.collection("customers").add({
        name,
        phone,
        status: newCust.status,
        totalDresses: qtyNum,
        totalAmountINR: formattedAmount,
        lastPurchaseDate: purchaseDate || new Date().toISOString().split("T")[0],
        createdAt: new Date().toISOString(),
      });

      if (dressName || amountINR) {
        await adminDb.collection("purchases").add({
          customerId: customerRef.id,
          dressName: dressName || "Initial Dress Purchase",
          collection: "Royal Collection",
          purchaseDate: purchaseDate || new Date().toISOString().split("T")[0],
          amountINR: formattedAmount,
          qty: qtyNum,
          createdAt: new Date().toISOString(),
        });
      }
    } catch (fsErr: unknown) {
      const msg = fsErr instanceof Error ? fsErr.message : String(fsErr);
      console.log("Firestore write optional warning:", msg);
    }

    return NextResponse.json({
      success: true,
      customerId: newCust.id,
      message: "Customer saved successfully.",
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("POST /api/customers Error:", error);
    return NextResponse.json(
      { success: false, error: msg || "Failed to add customer." },
      { status: 500 }
    );
  }
}
