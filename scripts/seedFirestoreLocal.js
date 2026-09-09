/* eslint-disable @typescript-eslint/no-var-requires */
const { initializeApp, getApps } = require("firebase/app");
const { getFirestore, doc, setDoc } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDubaiBoutiqueEliteKeyPlaceholder",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "dubai-boutique.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "dubai-boutique",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "dubai-boutique.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "9876543210",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:9876543210:web:dubaiboutiqe",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

async function seed() {
  console.log("Seeding Firestore collections...");

  // 1. Admins Table / Collection
  await setDoc(doc(db, "admins", "+919876543210"), {
    phone: "+919876543210",
    password: "admin",
    name: "Siddiqa Parveen",
    createdAt: new Date().toISOString(),
  });
  console.log("✓ Created 'admins' collection");

  // 2. Customers Table / Collection
  const customers = [
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

  for (const c of customers) {
    await setDoc(doc(db, "customers", c.id), c);
  }
  console.log("✓ Created 'customers' collection");

  // 3. Purchases Table / Collection
  const purchases = [
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

  for (const p of purchases) {
    await setDoc(doc(db, "purchases", p.id), p);
  }
  console.log("✓ Created 'purchases' collection");

  // 4. Milestone Rules Table / Collection
  const rules = [
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

  for (const r of rules) {
    await setDoc(doc(db, "milestone_rules", r.id), r);
  }
  console.log("✓ Created 'milestone_rules' collection");

  // 5. Message Templates Table / Collection
  const templates = [
    { id: "1", title: "Elite Announcement", content: "✨ Something VERY exclusive is coming to Dubai's Boutique. ✨ Be ready for luxury." },
    { id: "2", title: "Elite Membership Details", content: "👑 Welcome to Dubai's Boutique Elite! Enjoy private fittings, early releases & VIP rewards." },
    { id: "3", title: "My Elite Status", content: "Hi {{customer_name}}! 👋 You currently have {{purchase_count}} purchases with Dubai's Boutique — ✨ just {{remaining}} more dress to complete your Elite journey! ✨ 12 dresses. One year. One Elite circle. 👑" },
    { id: "4", title: "Elite Unlocked", content: "Congratulations {{customer_name}}! 🎁 You have officially unlocked ELITE CIRCLE VIP status. Thank you for being family! ♥" },
  ];

  for (const t of templates) {
    await setDoc(doc(db, "message_templates", t.id), t);
  }
  console.log("✓ Created 'message_templates' collection");

  console.log("🎉 All Firestore collections created & populated successfully!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Firestore Seed Error:", err);
  process.exit(1);
});
