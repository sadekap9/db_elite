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

    // 2. Seed Customers Table / Collection
    const initialCustomers = [
      {
        id: "1",
        name: "Ayesha Al-Maktoum",
        phone: "+91 98765 43210",
        status: "Almost Elite",
      },
      {
        id: "2",
        name: "Sara Al-Nuaimi",
        phone: "+91 98123 45678",
        status: "Gold VIP Member",
      },
      {
        id: "3",
        name: "Fatima Al-Mansoor",
        phone: "+91 97654 32109",
        status: "Gold VIP Member",
      },
      {
        id: "4",
        name: "Hina Khan",
        phone: "+91 98987 65432",
        status: "Silver VIP Member",
      },
      {
        id: "5",
        name: "Noor Al-Hassan",
        phone: "+91 99123 45678",
        status: "Elite Circle VIP",
      },
    ];

    for (const customer of initialCustomers) {
      await setDoc(doc(db, "customers", customer.id), customer);
    }

    // 3. Seed Purchases Table / Collection
    const initialPurchases = [
      {
        id: "1",
        customerId: "1",
        dressName: "Royal Silk Abaya - Emerald",
        qty: 1,
        amountINR: "₹25,000",
        purchaseDate: "2026-09-03",
      },
      {
        id: "2",
        customerId: "1",
        dressName: "Midnight Velvet Gown",
        qty: 1,
        amountINR: "₹38,000",
        purchaseDate: "2026-08-20",
      },
      {
        id: "3",
        customerId: "2",
        dressName: "Rose Gold Embroidered Abaya",
        qty: 1,
        amountINR: "₹22,000",
        purchaseDate: "2026-08-28",
      },
      {
        id: "4",
        customerId: "5",
        dressName: "Diamond Edition Velvet Kaftan",
        qty: 1,
        amountINR: "₹45,000",
        purchaseDate: "2026-09-01",
      },
    ];

    for (const purchase of initialPurchases) {
      await setDoc(doc(db, "purchases", purchase.id), purchase);
    }

    // 4. Seed Milestone Rules Table / Collection
    const initialRules = [
      {
        id: "1",
        startDate: "2024-01-01",
        endDate: "2024-06-30",
        durationMonths: 6,
        durationLabel: "6 Months",
        targetDresses: 6,
        tierName: "Gold VIP Member",
        description: "Buy 6 dresses between 2024-01-01 and 2024-06-30 (6 Months) to unlock Gold VIP Member status.",
      },
      {
        id: "2",
        startDate: "2024-01-01",
        endDate: "2024-12-31",
        durationMonths: 12,
        durationLabel: "12 Months (1 Year)",
        targetDresses: 12,
        tierName: "Elite Circle VIP",
        description: "Buy 12 dresses between 2024-01-01 and 2024-12-31 (12 Months) to unlock Elite Circle VIP status.",
      },
    ];

    for (const rule of initialRules) {
      await setDoc(doc(db, "milestone_rules", rule.id), rule);
    }

    // 5. Seed Message Templates Table / Collection
    const initialTemplates = [
      { id: "1", title: "Elite Announcement", content: "✨ Something VERY exclusive is coming to Dubai's Boutique. ✨ Be ready for luxury." },
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
