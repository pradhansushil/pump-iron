import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export const submitTourRequest = async (tourData) => {
  const tourRequest = collection(db, "tourRequests");
  const docRef = await addDoc(tourRequest, {
    ...tourData,
    status: "pending",
    submittedAt: serverTimestamp(),
  });

  return docRef;
};
