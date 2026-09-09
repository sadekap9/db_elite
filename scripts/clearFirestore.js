const { initializeApp, getApps } = require("firebase/app");
const { getFirestore, collection, getDocs, deleteDoc, doc } = require("firebase/firestore");

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

const collectionsToClear = ["admins", "customers", "purchases", "milestone_rules", "message_templates"];

async function clearCollection(collName) {
  const querySnapshot = await getDocs(collection(db, collName));
  const deletePromises = [];
  querySnapshot.forEach((docSnapshot) => {
    deletePromises.push(deleteDoc(doc(db, collName, docSnapshot.id)));
  });
  await Promise.all(deletePromises);
  console.log(`✓ Cleared collection '${collName}' (${deletePromises.length} documents deleted)`);
}

async function clearAll() {
  console.log("Deleting all data from Firestore...");
  for (const collName of collectionsToClear) {
    await clearCollection(collName);
  }
  console.log("🗑️ All Firestore collection data deleted successfully!");
  process.exit(0);
}

clearAll().catch((err) => {
  console.error("Firestore Clear Error:", err);
  process.exit(1);
});
