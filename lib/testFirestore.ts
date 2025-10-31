import { db } from "./firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

export async function testAddData() {
  try {
    const docRef = await addDoc(collection(db, "ev_charging_requests"), {
      user: "Test User",
      vehicle: "Hyundai Kona EV",
      charger_type: "CCS2",
      time: new Date(),
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}
