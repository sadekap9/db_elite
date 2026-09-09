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
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), 1000)
    );

    const customersSnap = (await Promise.race([fetchCustomers, timeout])) as FirestoreSnap;

    if (customersSnap && customersSnap.docs && customersSnap.docs.length > 0) {
      const totalCustomers = customersSnap.docs.length;
      let eliteMembers = 0;
      let almostElite = 0;
      let activeCustomers = 0;

      customersSnap.docs.forEach((doc: FirestoreDoc) => {
        const status = doc.data().status;
        if (status === "Elite" || status === "Elite Circle VIP" || status === "Elite Circle") {
          eliteMembers++;
          activeCustomers++;
        } else if (status === "Almost Elite") {
          almostElite++;
          activeCustomers++;
        } else if (status === "Gold" || status === "Silver" || status === "Gold VIP Member" || status === "Silver VIP Member" || status === "Bronze") {
          activeCustomers++;
        }
      });

      return NextResponse.json({
        success: true,
        metrics: {
          totalCustomers,
          eliteMembers,
          almostElite,
          activeCustomers,
        },
      });
    }
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.log("Firestore metrics fallback to localStore:", msg);
  }

  // Fallback to localStore
  const customers = localStore.getCustomers();
  const totalCustomers = customers.length;
  let eliteMembers = 0;
  let almostElite = 0;
  let activeCustomers = 0;

  customers.forEach((c) => {
    const status = c.status;
    const dresses = c.totalDresses || 0;
    if (status === "Elite" || status === "Elite Circle VIP" || status === "Elite Circle" || dresses >= 12) {
      eliteMembers++;
      activeCustomers++;
    } else if (status === "Almost Elite" || dresses >= 10) {
      almostElite++;
      activeCustomers++;
    } else {
      activeCustomers++;
    }
  });

  return NextResponse.json({
    success: true,
    metrics: {
      totalCustomers,
      eliteMembers,
      almostElite,
      activeCustomers,
    },
  });
}
