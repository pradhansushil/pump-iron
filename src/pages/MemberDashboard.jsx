/** what lines 2-10 are doing: importing components and hooks
 * why: we are preparing to use tools to accomplish what this component needs to do.
 * what would happen if removed: when the tools(components or hooks) are used in the logic, it would give an error, saying that it couldn't find it. In order to use it, you have to import it
 */
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
  getStatusColor,
} from "../utils/formatters";
import LoadingSpinner from "../components/LoadingSpinner";
import CancelModal from "../components/CancelModal";
import { cancelBooking } from "../services/bookingServices";

export default function MemberDashboard() {
  /** what lines 20-28 are doing: declaring state variables and setter functions.
   * why: so React can track what the current value is and re-render when the value changes.
   * what would happen if removed: React wouldn't be able to re-render the page, which means you have to do it manually, which prevents clean code (when using local variables). they work in memory, but won't re-render, hence why useState is used.
   */
  const [memberData, setMemberData] = useState(null);
  const [payments, setPayments] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [nextClass, setNextClass] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState(null);

  /** what this is doing: subscribing to useAuth from AuthContext.
   * why: instead of re-creating the logic, which avoids DRY principle, we have one centralized place where the logic lives and can subscribe to that function.
   * what would happen if removed: We wouldn't be able to tell who the currentUser is and create a more personal UI.
   */
  const { currentUser } = useAuth();
  /** what this is doing: Declaring a constant variable named navigate and storing the useNavigation() within the variable
   * why: Hooks can only be called at the top level, not inside an async functions or conditionals.
   * what would happen if removed: We wouldn't be able to re-direct users to a page.
   */
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
      console.log(result);
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
      <div>
        {error && (
          <div>
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

        <header>
          {/* left side */}
          <div>
            <h1 id="dashboard-heading">
              {isNewUser
                ? `Welcome, ${firstName}!`
                : `Welcome back, ${firstName}!`}
            </h1>
            <p>{formattedDate}</p>
          </div>
          {/* Right side */}
        </header>

        {memberData.status === "inactive" && (
          <div
            style={{
              backgroundColor: "#fef2f2",
              border: "1px solid #ef4444",
              padding: "16px",
              borderRadius: "8px",
              marginBottom: "24px",
            }}
          >
            <h3 style={{ color: "#dc2626", marginBottom: "8px" }}>
              Payment Processing Failed
            </h3>
            <p style={{ marginBottom: "12px" }}>
              Your account is inactive because we couldn't process your initial
              payment. Please update your payment method to activate your
              membership.
            </p>
            <button onClick={() => navigate("/payments")}>
              Update Payment Method
            </button>
          </div>
        )}

        <div>
          <div>
            <section aria-labelledby="membership-header">
              <h2 id="membership-header">Membership Status</h2>
              <p>{memberData.membershipPlan}</p>
              <span
                style={{
                  backgroundColor:
                    memberData.status === "active" ? "green" : "red",
                  color: "white",
                  padding: "4px 8px",
                  borderRadius: "4px",
                }}
              >
                {memberData.status}
              </span>
            </section>
          </div>

          {/* Card 2: Next Class */}
          <div>
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

          {/* Card 3: Quick Action */}
          <div>
            <section aria-labelledby="quick-action-header">
              <h2 id="quick-action-header">Quick Action</h2>
              <button onClick={() => navigate("/classes")}>Book a Class</button>
            </section>
          </div>
        </div>

        <div>
          <h2>Recent Payments</h2>

          {payments.length === 0 ? (
            <p>No payment history yet</p>
          ) : (
            <>
              <table>
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
                        <span
                          style={{
                            backgroundColor: getStatusColor(payment.status),
                            color: "white",
                            padding: "4px 8px",
                            borderRadius: "4px",
                          }}
                        >
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Link to={"/payments"}> View Full Payment History </Link>
            </>
          )}
        </div>

        <div>
          <h2>Upcoming Classes</h2>
          {bookings.length >= 1 ? (
            <div>
              {bookings.map((booking) => (
                <div key={booking.id}>
                  <div>
                    <h3>{booking.className}</h3>
                  </div>
                  <div>
                    <p>
                      {booking.instructor} | {formatDate(booking.dateTime)}
                    </p>
                  </div>
                  <div>
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
            <div>
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
