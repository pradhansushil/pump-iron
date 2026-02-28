import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

import {
  getMemberById,
  getPaymentsByMember,
  getBookingsByMember,
} from "../services/db";
import {
  formatCurrency,
  formatDate,
  formatPaymentMethod,
} from "../utils/formatters";
import LoadingSpinner from "../components/LoadingSpinner";
import CancelModal from "../components/CancelModal";
import { cancelBooking } from "../services/bookingServices";

export default function MemberDashboard() {
  const [memberData, setMemberData] = useState(null);
  const [payments, setPayments] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [nextClass, setNextClass] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState(null);

  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isNewUser = location.state?.isNewUser;

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!currentUser) {
        navigate("/login");
        return;
      }

      try {
        const [member, paymentsData, bookingsData] = await Promise.all([
          getMemberById(currentUser.uid),
          getPaymentsByMember(currentUser.uid),
          getBookingsByMember(currentUser.uid),
        ]);

        const now = new Date();

        const upcomingBookings = bookingsData
          .filter((booking) => booking.dateTime.toDate() >= now)
          .sort((a, b) => a.dateTime.toDate() - b.dateTime.toDate());

        setMemberData(member);
        setPayments(paymentsData.slice(0, 3));
        setNextClass(upcomingBookings[0] || null);
        setBookings(upcomingBookings);
      } catch (error) {
        console.error(error);
        toast.error(
          "Unable to load your dashboard data. Please check your connection and try again.",
        );
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentUser, navigate]);

  if (loading) return <LoadingSpinner message="Loading your dashboard..." />;
  if (!memberData) return <div>No Member Data </div>;

  const firstName = memberData.name.split(" ")[0];

  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const handleCancelBooking = async () => {
    try {
      const result = await cancelBooking(selectedClassId, currentUser.uid);
      toast.success(result.message);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBookings(bookings.filter((booking) => booking.id !== selectedClassId));
      setCancelModalOpen(false);
    }
  };

  return (
    <main aria-labelledby="dashboard-heading">
      <div className="dashboard">
        {error && (
          <div className="dashboard-error">
            <p>Unable to load dashboard data</p>
            <button
              onClick={() => {
                setError(null);
                window.location.reload();
              }}
            >
              Retry
            </button>
          </div>
        )}

        <header className="dashboard-header">
          <div>
            <h1 id="dashboard-heading">
              {isNewUser
                ? `Welcome, ${firstName}!`
                : `Welcome back, ${firstName}!`}
            </h1>
            <p>{formattedDate}</p>
          </div>
        </header>

        {memberData.status === "inactive" && (
          <div className="inactive-banner">
            <h3>Payment Processing Failed</h3>
            <p>
              Your account is inactive because we couldn't process your initial
              payment. Please update your payment method to activate your
              membership.
            </p>
            <button onClick={() => navigate("/payments")}>
              Update Payment Method
            </button>
          </div>
        )}

        <div className="dashboard-cards">
          <div className="dashboard-card">
            <section aria-labelledby="membership-header">
              <h2 id="membership-header">Membership Status</h2>
              <p>{memberData.membershipPlan}</p>
              <span className="status-badge">{memberData.status}</span>
            </section>
          </div>

          <div className="dashboard-card">
            <section aria-labelledby="next-class-heading">
              <h2 id="next-class-heading">Next Class</h2>
              {nextClass ? (
                <div>
                  <p>{nextClass.className}</p>
                  <p>
                    {nextClass.dateTime.toDate().toLocaleString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                  <p>Instructor: {nextClass.instructor}</p>
                </div>
              ) : (
                <p>No upcoming classes scheduled</p>
              )}
            </section>
          </div>

          <div className="dashboard-card">
            <section aria-labelledby="quick-action-header">
              <h2 id="quick-action-header">Quick Action</h2>
              <button onClick={() => navigate("/classes")}>Book a Class</button>
            </section>
          </div>
        </div>

        <div className="recent-payments">
          <h2>Recent Payments</h2>
          {payments.length === 0 ? (
            <p>No payment history yet</p>
          ) : (
            <>
              <table className="members-table">
                <thead>
                  <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Amount</th>
                    <th scope="col">Payment Method</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id}>
                      <td>{formatDate(payment.date)}</td>
                      <td>{formatCurrency(payment.amount)}</td>
                      <td>{formatPaymentMethod(payment.method)}</td>
                      <td>
                        <span className="status-badge">{payment.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Link to={"/payments"}>View Full Payment History</Link>
            </>
          )}
        </div>

        <div className="upcoming-classes">
          <h2>Upcoming Classes</h2>
          {bookings.length >= 1 ? (
            <div className="bookings-list">
              {bookings.map((booking) => (
                <div className="booking-card" key={booking.id}>
                  <div>
                    <h3>{booking.className}</h3>
                  </div>
                  <div>
                    <p>
                      {booking.instructor} | {formatDate(booking.dateTime)}
                    </p>
                  </div>
                  <div className="booking-actions">
                    <button
                      onClick={() => navigate(`/classes/${booking.classId}`)}
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => {
                        setSelectedClassId(booking.id);
                        setCancelModalOpen(true);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-bookings">
              <p>No classes booked yet</p>
              <p>
                Ready to get started? Browse our classes and book your
                favorites!
              </p>
              <button onClick={() => navigate("/classes")}>
                Explore Schedule
              </button>
            </div>
          )}
        </div>

        <CancelModal
          isOpen={cancelModalOpen}
          onClose={() => setCancelModalOpen(false)}
          onConfirm={async () => await handleCancelBooking()}
        />
      </div>
    </main>
  );
}
