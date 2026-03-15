// Import Firestore functions for database operations
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";

import { db } from "../firebase";
import { calculateNextOccurrence } from "../utils/dateHelpers";
import { MEMBERS, PAYMENTS, CLASSES } from "../utils/constants";

const dayOrder = {
  Monday: 0,
  Tuesday: 1,
  Wednesday: 2,
  Thursday: 3,
  Friday: 4,
  Saturday: 5,
  Sunday: 6,
};

// 10.5: Create a new member
export const createMember = async (uid, memberData) => {
  try {
    const memberRef = doc(db, MEMBERS, uid);

    const today = new Date();
    const nextBilling = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    const memberDocument = {
      uid: uid,
      name: memberData.name,
      email: memberData.email,
      phone: memberData.phone,
      membershipPlan: memberData.membershipPlan,
      status: "active",
      joinDate: Timestamp.now(),
      nextBillingDate: Timestamp.fromDate(nextBilling),
      bookedClasses: [],
      paymentMethod: memberData.paymentMethod || null,
    };

    await setDoc(memberRef, memberDocument);
    return { success: true, memberId: uid, nextBilling: nextBilling };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deleteMember = async (uid) => {
  try {
    const memberRef = doc(db, MEMBERS, uid);
    await deleteDoc(memberRef);
    return { success: true, memberId: uid };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getAllMembers = async () => {
  try {
    const membersRef = collection(db, "members");
    const snapshot = await getDocs(membersRef);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch {
    return [];
  }
};

export const getClassById = async (classId) => {
  try {
    const classRef = doc(db, CLASSES, classId);
    const classSnapshot = await getDoc(classRef);

    if (classSnapshot.exists()) {
      return { id: classId, ...classSnapshot.data() };
    }
    return null;
  } catch {
    return null;
  }
};

// 10.6: Get member by their uid
export const getMemberById = async (uid) => {
  try {
    const memberRef = doc(db, MEMBERS, uid);
    const memberSnapshot = await getDoc(memberRef);

    if (memberSnapshot.exists()) {
      return memberSnapshot.data();
    }
    return null;
  } catch {
    return null;
  }
};

// 10.7: Update member information
export const updateMember = async (uid, updates) => {
  try {
    const memberRef = doc(db, MEMBERS, uid);
    await updateDoc(memberRef, updates);
    return { success: true, memberId: uid };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 10.8: Create a new payment

// 10.9: Get all payments for a specific member

// 10.10: Get all classes
export const getAllClasses = async () => {
  try {
    const classesRef = collection(db, CLASSES);
    const querySnapshot = await getDocs(classesRef);

    const classes = querySnapshot.docs.map((docSnapshot) => ({
      id: docSnapshot.id,
      ...docSnapshot.data(),
    }));

    classes.sort((a, b) => dayOrder[a.day] - dayOrder[b.day]);
    return classes;
  } catch {
    return [];
  }
};

export const getBookingsByMember = async (memberId) => {
  try {
    const member = await getMemberById(memberId);

    if (!member) {
      return [];
    }

    const classIds = member.bookedClasses || [];
    const classes = await Promise.all(
      classIds.map((classId) => getClassById(classId)),
    );

    const validClasses = classes.filter((classObj) => classObj !== null);

    return validClasses.map((classObj) => {
      const nextDate = calculateNextOccurrence(classObj.day, classObj.time);
      const dateTimeTimestamp = Timestamp.fromDate(nextDate);
      return {
        id: classObj.id,
        classId: classObj.id,
        className: classObj.name,
        instructor: classObj.instructor,
        dateTime: dateTimeTimestamp,
        day: classObj.day,
        time: classObj.time,
      };
    });
  } catch {
    return [];
  }
};

// 10.11: Update class bookings
export const updateClassBookings = async (classId, updates) => {
  try {
    const classRef = doc(db, CLASSES, classId);
    await updateDoc(classRef, updates);
    return { success: true, classId: classId };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
