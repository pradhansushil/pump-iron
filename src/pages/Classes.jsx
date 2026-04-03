import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { increment } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTriangleExclamation,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

import {
  getAllClasses,
  updateClassBookings,
  getMemberById,
  updateMember,
} from "../services/db";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  cardStyle,
  containerStyle,
  ctaButton,
  errorBanner,
  errorColor,
  h1Style,
  h3Heading,
  subText,
  textColor,
  textSizeSmall,
} from "../utils/styles";

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
    setBookingLoading(classId);

    try {
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

      if (!memberData) {
        toast.error("Member profile not found. Please contact support.");
        return;
      }

      if (memberData.status !== "active") {
        setError(
          "You need to have a membership to book. Go to plans to be a gym member.",
        );
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      if (memberData.bookedClasses.includes(classId)) {
        toast.error("You've already booked this class");
        return;
      }

      await updateClassBookings(classId, {
        currentBookings: increment(1),
      });

      await updateMember(currentUser.uid, {
        bookedClasses: [...memberData.bookedClasses, classId],
      });

      toast.success("Class booked successfully.");
      setError(null);
    } catch {
      toast.error("Booking failed. Please try again.");
    } finally {
      setBookingLoading(null);
    }
  };

  return (
    <main>
      {error && (
        <div className={`${errorBanner} ${errorColor}`} role="alert">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon icon={faTriangleExclamation} />
            <p>{error}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/")}
              className={`border border-white px-3 py-1 rounded-lg ${textSizeSmall} hover:bg-red-700`}
            >
              Go to Plans
            </button>
            <button
              onClick={() => setError(null)}
              className="hover:bg-red-700 px-2 py-1 rounded"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
        </div>
      )}
      <section
        className="max-w-7xl mx-auto px-4 pt-8 text-center"
        aria-labelledby="classes-heading"
      >
        <h1 id="classes-heading" className={h1Style}>
          Classes
        </h1>
        <p className={subText}>
          Browse and book from our range of classes. All fitness levels welcome.
        </p>
      </section>
      <ul
        className={`${containerStyle} grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`}
        aria-label="Available classes"
      >
        {classes.map((c) => (
          <li
            className={`${cardStyle} list-none flex flex-col justify-between`}
            key={c.id}
          >
            <h3 className={h3Heading}>{c.name}</h3>
            <div className={textColor}>
              <p>Instructor: {c.instructor}</p>
              <p>Day: {c.day}</p>
              <p>Time: {c.time}</p>
              <p>Available spots: {c.capacity - c.currentBookings}</p>
            </div>
            <p className={subText}>{c.description}</p>
            <div className="mt-4">
              <button
                className={ctaButton}
                disabled={c.id === bookingLoading}
                aria-label={`Book ${c.name}`}
                onClick={() => {
                  if (!currentUser) {
                    navigate("/login");
                  } else {
                    handleBookClass(c.id);
                  }
                }}
              >
                {c.id === bookingLoading
                  ? "Booking..."
                  : currentUser
                    ? "Book"
                    : "Login to Book"}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
