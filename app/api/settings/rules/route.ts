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
    const fetchRules = adminDb.collection("milestone_rules").get();
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), 1000)
    );

    const snap = (await Promise.race([fetchRules, timeout])) as FirestoreSnap;
    if (snap && snap.docs && snap.docs.length > 0) {
      const rules = snap.docs.map((doc: FirestoreDoc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return NextResponse.json({ success: true, rules });
    }
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.log("Firestore settings rules fallback to localStore:", msg);
  }

  const rules = localStore.getRules();
  return NextResponse.json({ success: true, rules });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const newRule = localStore.addRule(body);

    try {
      await adminDb.collection("milestone_rules").add({
        ...body,
        createdAt: new Date().toISOString(),
      });
    } catch (fsErr: unknown) {
      const msg = fsErr instanceof Error ? fsErr.message : String(fsErr);
      console.log("Firestore settings rule write warning:", msg);
    }

    return NextResponse.json({
      success: true,
      ruleId: newRule.id,
      message: "Milestone target rule saved successfully.",
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("POST Milestone Rule Error:", error);
    return NextResponse.json(
      { success: false, error: msg || "Failed to save milestone rule." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Rule ID is required." },
        { status: 400 }
      );
    }

    localStore.deleteRule(id);

    try {
      await adminDb.collection("milestone_rules").doc(id).delete();
    } catch (fsErr: unknown) {
      const msg = fsErr instanceof Error ? fsErr.message : String(fsErr);
      console.log("Firestore settings rule delete warning:", msg);
    }

    return NextResponse.json({
      success: true,
      message: "Milestone rule deleted successfully.",
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("DELETE Milestone Rule Error:", error);
    return NextResponse.json(
      { success: false, error: msg || "Failed to delete milestone rule." },
      { status: 500 }
    );
  }
}
