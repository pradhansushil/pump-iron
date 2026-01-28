import { doc, updateDoc, increment } from "firebase/firestore";
import { db, getMemberById } from "./db";

export const cancelBooking = async (bookingId, userId) => {
  try {
    // Step 1-2: Fetch member document and get bookedClasses array
    const member = await getMemberById(userId);
    const bookedClasses = member.bookedClasses || [];

    // Step 3-4: Find the booking and validate it exists
    const booking = bookedClasses.find((b) => b.id === bookingId);
    if (!booking) {
      throw new Error("Booking not found. It may have already been canceled.");
    }

    // Step 5: Extract classId from booking
    const classId = booking.classId;

    // Step 6: Update class document (increment capacity)
    // Done FIRST for fail-safe ordering - if next step fails, user can retry
    await updateDoc(doc(db, "classes", classId), {
      capacity: increment(1),
    });

    // Step 7: Filter out the canceled booking from array
    const updatedBookings = bookedClasses.filter((b) => b.id !== bookingId);

    // Step 8: Update member document with new bookedClasses array
    await updateDoc(doc(db, "members", userId), {
      bookedClasses: updatedBookings,
    });

    // Step 9: Return success
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
