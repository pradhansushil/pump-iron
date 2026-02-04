import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
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

  return (
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
  );
}
