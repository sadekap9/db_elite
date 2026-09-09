import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { localStore } from "@/lib/localStore";

export async function GET() {
  try {
    const fetchRules = adminDb.collection("milestone_rules").get();
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), 1000)
    );

    const snap: any = await Promise.race([fetchRules, timeout]);
    if (snap && snap.docs && snap.docs.length > 0) {
      const rules = snap.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return NextResponse.json({ success: true, rules });
    }
  } catch (error: any) {
    console.log("Firestore milestones fallback to localStore:", error?.message);
  }

  // Fallback to localStore
  const rules = localStore.getRules();
  return NextResponse.json({ success: true, rules });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { ruleName, dressesRequired, amountRequiredINR, periodDays, rewardBenefit } = body;

    const newRule = localStore.addRule({
      ruleName: ruleName || `${dressesRequired || 12}-Dress Milestone Rule`,
      dressesRequired: Number(dressesRequired) || 12,
      amountRequiredINR: amountRequiredINR || "₹2,00,000",
      periodDays: Number(periodDays) || 365,
      rewardBenefit: rewardBenefit || "20% Exclusive Discount & Private Preview",
    });

    try {
      await adminDb.collection("milestone_rules").add({
        ruleName: newRule.ruleName,
        dressesRequired: newRule.dressesRequired,
        amountRequiredINR: newRule.amountRequiredINR,
        periodDays: newRule.periodDays,
        rewardBenefit: newRule.rewardBenefit,
        createdAt: new Date().toISOString(),
      });
    } catch (fsErr: any) {
      console.log("Firestore milestone rule write warning:", fsErr?.message);
    }

    return NextResponse.json({
      success: true,
      ruleId: newRule.id,
      message: "Milestone rule created successfully.",
    });
  } catch (error: any) {
    console.error("POST /api/milestones Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to save milestone rule." },
      { status: 500 }
    );
  }
}
