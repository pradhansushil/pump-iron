// Import the configured Firestore database instance
import { db } from "../firebase";

// Import Firestore functions for database operations
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";

// Collection name constants - prevents typos and ensures consistency
export const MEMBERS = "members";
export const PAYMENTS = "payments";
export const CLASSES = "classes";
export const TOUR_REQUESTS = "tourRequests";

// Export the database instance for direct use if needed
export { db };

// 10.5: Create a new member
export const createMember = async (uid, memberData) => {
  try {
    // Create a reference to the document location
    const memberRef = doc(db, MEMBERS, uid);

    // Calculate next billing date (30 days from now)
    const today = new Date();
    const nextBilling = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    // Create the member document with all required fields
    const memberDocument = {
      uid: uid,
      name: memberData.name,
      email: memberData.email,
      phone: memberData.phone,
      membershipPlan: memberData.membershipPlan, // "basic" | "standard" | "premium"
      status: "active", // Default to active for new members
      joinDate: Timestamp.now(), // Current timestamp
      nextBillingDate: Timestamp.fromDate(nextBilling), // 30 days from now
      bookedClasses: [], // Empty array initially
      paymentMethod: memberData.paymentMethod || null, // Optional field
    };

    // Write the document to Firestore
    await setDoc(memberRef, memberDocument);

    console.log("Member created successfully with ID:", uid);
    return { success: true, memberId: uid };
  } catch (error) {
    console.error("Error creating member:", error);
    return { success: false, error: error.message };
  }
};

// 10.6: Get member by their uid
export const getMemberById = async (uid) => {
  try {
    // Create a reference to the member document
    const memberRef = doc(db, MEMBERS, uid);

    // Get the document snapshot
    const memberSnapshot = await getDoc(memberRef);

    // Check if the document exists
    if (memberSnapshot.exists()) {
      // Extract and return the data
      const memberData = memberSnapshot.data();
      console.log("Member found:", memberData);
      return memberData;
    } else {
      // Document doesn't exist
      console.log("No member found with uid:", uid);
      return null;
    }
  } catch (error) {
    console.error("Error getting member:", error);
    return null;
  }
};

// 10.7: Update member information
export const updateMember = async (uid, updates) => {
  try {
    // Create a reference to the member document
    const memberRef = doc(db, MEMBERS, uid);

    // Update only the specified fields
    await updateDoc(memberRef, updates);

    console.log("Member updated successfully:", uid);
    return { success: true, memberId: uid };
  } catch (error) {
    console.error("Error updating member:", error);
    return { success: false, error: error.message };
  }
};

// 10.8: Create a new payment
export const createPayment = async (paymentData) => {
  try {
    // Create a reference to the payments collection
    const paymentsRef = collection(db, PAYMENTS);

    // Generate a new document reference with auto-generated ID
    const newPaymentRef = doc(paymentsRef);

    // Create the payment document with the provided data
    await setDoc(newPaymentRef, {
      memberId: paymentData.memberId,
      amount: paymentData.amount,
      date: paymentData.date || Timestamp.now(), // Use provided date or current timestamp
      method: paymentData.method, // e.g., "credit_card", "cash", "bank_transfer"
      status: paymentData.status, // "completed" | "pending" | "failed"
      description: paymentData.description,
    });

    console.log("Payment created successfully with ID:", newPaymentRef.id);
    // Return the ID of the newly created payment
    return { success: true, paymentId: newPaymentRef.id };
  } catch (error) {
    console.error("Error creating payment:", error);
    return { success: false, error: error.message };
  }
};

// 10.9: Get all payments for a specific member
export const getPaymentsByMember = async (memberId) => {
  try {
    // Create a reference to the payments collection
    const paymentsRef = collection(db, PAYMENTS);

    // Build query: get all payments where memberId matches, sorted by date (newest first)
    const q = query(
      paymentsRef,
      where("memberId", "==", memberId),
      orderBy("date", "desc")
    );

    // Execute the query
    const querySnapshot = await getDocs(q);

    // Transform the results into an array of payment objects
    const payments = [];
    querySnapshot.forEach((docSnapshot) => {
      payments.push({
        id: docSnapshot.id,
        ...docSnapshot.data(),
      });
    });

    console.log(`Found ${payments.length} payments for member:`, memberId);
    return payments;
  } catch (error) {
    console.error("Error getting payments for member:", error);
    return [];
  }
};

// 10.10: Get all classes
export const getAllClasses = async () => {
  try {
    // Create a reference to the classes collection
    const classesRef = collection(db, CLASSES);

    // Get all documents from the collection
    const querySnapshot = await getDocs(classesRef);

    // Transform the results into an array of class objects
    const classes = [];
    querySnapshot.forEach((docSnapshot) => {
      classes.push({
        id: docSnapshot.id,
        ...docSnapshot.data(),
      });
    });

    console.log(`Found ${classes.length} classes`);
    return classes;
  } catch (error) {
    console.error("Error getting all classes:", error);
    return [];
  }
};

// 10.11: Update class bookings
export const updateClassBookings = async (classId, updates) => {
  try {
    // Create a reference to the specific class document
    const classRef = doc(db, CLASSES, classId);

    // Update the document with the provided updates
    await updateDoc(classRef, updates);

    console.log("Class bookings updated successfully:", classId);
    return { success: true, classId: classId };
  } catch (error) {
    console.error("Error updating class bookings:", error);
    return { success: false, error: error.message };
  }
};
