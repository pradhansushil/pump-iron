import {
  collection,
  doc,
  getDocs,
  setDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";

import { db } from "../firebase";
import { PAYMENTS } from "../utils/constants";

export const createPayment = async (paymentData) => {
  try {
    const paymentsRef = collection(db, PAYMENTS);
    const newPaymentRef = doc(paymentsRef);

    await setDoc(newPaymentRef, {
      userId: paymentData.memberId,
      amount: paymentData.amount,
      date: paymentData.date || Timestamp.now(),
      dueDate: paymentData.dueDate,
      method: paymentData.method,
      status: paymentData.status,
      description: paymentData.description,
      email: paymentData.email,
      createdAt: Timestamp.now(),
      memberName: paymentData.memberName,
    });

    return { success: true, paymentId: newPaymentRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getAllPayments = async () => {
  try {
    const paymentsRef = collection(db, PAYMENTS);
    const paymentsSnapshot = await getDocs(paymentsRef);

    return paymentsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch {
    return [];
  }
};

export const getPaymentsByMember = async (memberId) => {
  try {
    const paymentsRef = collection(db, PAYMENTS);

    const q = query(
      paymentsRef,
      where("userId", "==", memberId),
      orderBy("date", "desc"),
    );

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((docSnapshot) => ({
      id: docSnapshot.id,
      ...docSnapshot.data(),
    }));
  } catch {
    return [];
  }
};
