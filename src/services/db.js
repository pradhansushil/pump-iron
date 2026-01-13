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
  deleteDoc,
  query,
  where,
} from "firebase/firestore";

// Collection name constants - prevents typos and ensures consistency
export const MEMBERS = "members";
export const PAYMENTS = "payments";
export const CLASSES = "classes";
export const TOUR_REQUESTS = "tourRequests";

// Export the database instance for direct use if needed
export { db };
