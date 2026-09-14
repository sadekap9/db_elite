import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { localStore } from "@/lib/localStore";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    // 1. Try reading from Firestore first
    const fetchCustomers = adminDb.collection("customers").get();
    const fetchPurchases = adminDb.collection("purchases").get();
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), 6000)
    );

    const [custSnap, purSnap] = (await Promise.race([
      Promise.all([fetchCustomers, fetchPurchases]),
      timeout,
    ])) as [any, any];

    if (custSnap && custSnap.docs && custSnap.docs.length > 0) {
      const purchasesDocs = purSnap && purSnap.docs ? purSnap.docs.map((d: any) => ({ id: d.id, ...d.data() })) : [];

      const customers = custSnap.docs.map((doc: any) => {
        const data = doc.data();
        const custPurchases = purchasesDocs.filter((p: any) => String(p.customerId) === String(doc.id));

        let dresses = data.totalDresses || data.dresses || 0;
        let totalAmountNum = 0;
        let lastDate = data.lastPurchaseDate || "";

        custPurchases.forEach((p: any) => {
          const amtStr = String(p.amountINR || "0").replace(/[^0-9]/g, "");
          totalAmountNum += Number(amtStr) || 0;
          if (p.purchaseDate && (!lastDate || p.purchaseDate > lastDate)) {
            lastDate = p.purchaseDate;
          }
        });

        if (dresses === 0 && custPurchases.length > 0) {
          dresses = custPurchases.reduce((acc: number, p: any) => acc + (Number(p.qty) || 1), 0);
        }

        return {
          id: doc.id,
          name: data.name || "",
          phone: data.phone || "",
          email: data.email || "",
          city: data.city || "",
          birthday: data.birthday || "",
          preferredStyle: data.preferredStyle || "",
          createdAt: data.createdAt || "",
          status: data.status || "Regular",
          dresses,
          totalAmountINR: data.totalAmountINR || (totalAmountNum > 0 ? `₹${totalAmountNum.toLocaleString("en-IN")}` : "₹0"),
          totalAmountNum,
          lastPurchaseDate: lastDate || "N/A",
          purchases: custPurchases,
        };
      });

      return NextResponse.json(
        { success: true, customers },
        {
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          },
        }
      );
    }
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.log("Firestore customers GET fallback to localStore:", msg);
  }

  // 2. Fallback to localStore
  try {
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

    return NextResponse.json(
      { success: true, customers },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
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
    const cleanDigits = String(amountINR || "").replace(/[^0-9]/g, "").replace(/^0+/, "");
    const formattedAmount = cleanDigits ? `₹${Number(cleanDigits).toLocaleString("en-IN")}` : "₹0";

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

    // Try sync to Firestore in background
    try {
      await adminDb.collection("customers").doc(String(newCust.id)).set({
        name,
        phone,
        status: status || "Regular",
        totalDresses: qtyNum,
        totalAmountINR: formattedAmount,
        lastPurchaseDate: purchaseDate || new Date().toISOString().split("T")[0],
        createdAt: new Date().toISOString(),
      });

      if (dressName || amountINR) {
        await adminDb.collection("purchases").add({
          customerId: String(newCust.id),
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
      console.log("Firestore customer POST sync warning:", msg);
    }

    return NextResponse.json(
      {
        success: true,
        customerId: newCust.id,
        message: "Customer saved successfully.",
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: msg || "Failed to add customer." },
      { status: 500 }
    );
  }
}
