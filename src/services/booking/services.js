import { doc, updateDoc, increment } from "firebase/firestore";
import { getMemberById } from "../db";
import { db } from "../../firebase";

export const cancelBooking = async (classId, userId) => {
  try {
    // Step 1-2: Fetch member document and get bookedClasses array
    const member = await getMemberById(userId);
    const bookedClasses = member.bookedClasses || [];

    // Step 3-4: Find the booking and validate it exists
    if (!bookedClasses.includes(classId)) {
      throw new Error("This class is not in your bookings.");
    }

    // Step 5: Filter out the canceled booking from array
    const updatedBookings = bookedClasses.filter((id) => id !== classId);

    // Step 6: Update member document with new bookedClasses array
    // Done FIRST for fail-safe ordering
    await updateDoc(doc(db, "members", userId), {
      bookedClasses: updatedBookings,
    });

    // Step 7: Update class document (increment capacity)
    await updateDoc(doc(db, "classes", classId), {
      currentBookings: increment(-1),
    });

    // Step 8: Return success
    return {
      success: true,
      message: "Booking canceled successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Failed to cancel booking",
    };
  }
};
