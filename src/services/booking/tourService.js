import {
  collection,
  addDoc,
  getDocs,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "../../firebase";
import { TOUR_STATUS } from "../../data/constants";

export const submitTourRequest = async (tourData) => {
  const tourRequest = collection(db, "tourRequests");
  const docRef = await addDoc(tourRequest, {
    ...tourData,
    status: TOUR_STATUS.PENDING,
    submittedAt: serverTimestamp(),
  });

  return docRef;
};

export const getAllTourRequests = async () => {
  try {
    const requestsRef = collection(db, "tourRequests");
    const snapshot = await getDocs(requestsRef);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch {
    return [];
  }
};

export const updateTourStatus = async (id, status) => {
  try {
    const statusRef = doc(db, "tourRequests", id);
    await updateDoc(statusRef, { status: status });
    return { success: true, tourId: id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
