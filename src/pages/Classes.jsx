import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { increment } from "firebase/firestore";
import {
  getAllClasses,
  updateClassBookings,
  getMemberById,
  updateMember,
} from "../services/db";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Classes() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(null);
  const [error, setError] = useState(null);

  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchClasses() {
      const data = await getAllClasses();
      setClasses(data);
      setLoading(false);
    }

    fetchClasses();
  }, []);

  if (loading) return <LoadingSpinner message="Loading classes..." />;

  const handleBookClass = async (classId) => {
    const classData = classes.find((c) => c.id === classId);
    const memberData = await getMemberById(currentUser.uid);

    if (!classData) {
      toast.error("Class not found. Please refresh the page.");
      return;
    }

    if (classData.currentBookings >= classData.capacity) {
      toast.error("This class is full.");
      return;
    }

    //Edge case: member document doesn't exist (shouldn't happen, but a safety net)
    if (!memberData) {
      toast.error("Member profile not found. Please contact support.");
      return;
    }

    if (memberData.status != "active") {
      setError(
        "You need to be have a membership to book. go to plans to be a gym member.",
      );
      return;
    }

    if (memberData.bookedClasses.includes(classId)) {
      toast.error("You've already booked this class");
      return;
    }

    try {
      await updateClassBookings(classId, {
        currentBookings: increment(1),
      });

      await updateMember(currentUser.uid, {
        bookedClasses: [...memberData.bookedClasses, classId],
      });

      toast.success("Class booked successfully.");
      setError(null);
    } catch (error) {
      // set this to toast once it's working
      toast.error(`Booking failed: ${error}`);
    } finally {
      // set bookingloading
    }
  };

  return (
    <>
      {error && <div>{error}</div>}
      <ul>
        {classes.map((c) => (
          <li key={c.id}>
            <h3>{c.name}</h3>
            <p>Instructor: {c.instructor}</p>
            <p>Day: {c.day}</p>
            <p>Time: {c.time}</p>
            <p>Available spots: {c.capacity - c.currentBookings}</p>
            <p>{c.description}</p>
            <button
              onClick={() => {
                if (!currentUser) navigate("/login");
              }}
            >
              {currentUser ? "Book" : "Login to Book"}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
