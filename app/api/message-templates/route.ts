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
    const fetchTemplates = adminDb.collection("message_templates").get();
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), 1000)
    );

    const snap = (await Promise.race([fetchTemplates, timeout])) as FirestoreSnap;
    if (snap && snap.docs && snap.docs.length > 0) {
      const templates = snap.docs.map((doc: FirestoreDoc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return NextResponse.json({ success: true, templates });
    }
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.log("Firestore message-templates fallback to localStore:", msg);
  }

  // Fallback to localStore
  const localTemplates = localStore.getTemplates();
  return NextResponse.json({ success: true, templates: localTemplates });
}

export async function POST(req: Request) {
  try {
    const { templateName, category, targetAudience, messageText } = await req.json();

    if (!templateName || !messageText) {
      return NextResponse.json(
        { success: false, error: "Template Name and Message Text are required." },
        { status: 400 }
      );
    }

    // Always add to localStore
    const newTmpl = localStore.addTemplate({
      templateName,
      category: category || "General",
      targetAudience: targetAudience || "All Customers",
      messageText,
    });

    // Try Firestore in background
    try {
      await adminDb.collection("message_templates").add({
        templateName,
        category: category || "General",
        targetAudience: targetAudience || "All Customers",
        messageText,
        createdAt: new Date().toISOString(),
      });
    } catch (fsErr: unknown) {
      const msg = fsErr instanceof Error ? fsErr.message : String(fsErr);
      console.log("Firestore template write warning:", msg);
    }

    return NextResponse.json({
      success: true,
      templateId: newTmpl.id,
      message: "Template added successfully.",
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("POST /api/message-templates Error:", error);
    return NextResponse.json(
      { success: false, error: msg || "Failed to add template." },
      { status: 500 }
    );
  }
}
