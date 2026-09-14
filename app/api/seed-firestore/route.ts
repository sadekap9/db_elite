import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, doc, setDoc } from "firebase/firestore";

export async function GET() {
  try {
    // 1. Seed Admins Table / Collection
    const adminRef = doc(db, "admins", "9510448090");
    await setDoc(adminRef, {
      phone: "9510448090",
      password: "Admin@123",
      name: "Siddiqa Parveen",
      createdAt: new Date().toISOString(),
    });

    // 2. Seed Customers Table / Collection (Cleaned)
    const initialCustomers: any[] = [];

    for (const customer of initialCustomers) {
      await setDoc(doc(db, "customers", customer.id), customer);
    }

    // 3. Seed Purchases Table / Collection (Cleaned)
    const initialPurchases: any[] = [];

    for (const purchase of initialPurchases) {
      await setDoc(doc(db, "purchases", purchase.id), purchase);
    }

    // 4. Seed Milestone Rules Table / Collection (Cleaned)
    const initialRules: any[] = [];

    for (const rule of initialRules) {
      await setDoc(doc(db, "milestone_rules", rule.id), rule);
    }

    // 5. Seed Message Templates Table / Collection
    const initialTemplates = [
      { id: "1", title: "Dubai Elite Progress Update", content: "Hi {{customer_name}} 🤍\n\nYou are currently at {{purchase_count}}/{{target}} purchases toward Dubai's Boutique Elite. 👑\n\nKeep shopping with us to unlock exclusive early access, special privileges and rewards. ✨" },
      { id: "2", title: "Elite Membership Details", content: "👑 Welcome to Dubai's Boutique Elite! Enjoy private fittings, early releases & VIP rewards." },
      { id: "3", title: "My Elite Status", content: "Hi {{customer_name}}! 👋 You currently have {{purchase_count}} purchases with Dubai's Boutique — ✨ just {{remaining}} more dress to complete your Elite journey! ✨ 12 dresses. One year. One Elite circle. 👑" },
      { id: "4", title: "Elite Unlocked", content: "Congratulations {{customer_name}}! 🎁 You have officially unlocked ELITE CIRCLE VIP status. Thank you for being family! ♥" },
    ];

    for (const tpl of initialTemplates) {
      await setDoc(doc(db, "message_templates", tpl.id), tpl);
    }

    return NextResponse.json({
      success: true,
      message: "Firestore collections created and seeded successfully!",
      collectionsCreated: ["admins", "customers", "purchases", "milestone_rules", "message_templates"],
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("Firestore Seed Error:", errorMsg);
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
