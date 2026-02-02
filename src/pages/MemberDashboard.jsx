/** what lines 2-10 are doing: importing components and hooks
 * why: we are preparing to use tools to accomplish what this component needs to do.
 * what would happen if removed: when the tools(components or hooks) are used in the logic, it would give an error, saying that it couldn't find it. In order to use it, you have to import it
 */
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getMemberById,
  getPaymentsByMember,
  getBookingsByMember,
} from "../services/db";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
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
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [notificationCount, setNotificationCount] = useState(3);

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

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    /** what this is doing: seeing if the currentUser is not null. if it is, redirect them to /login and exit early
     * why: prevents unauthorized users from accessing protected routes.
     * what would happen if removed: Users would be able to access protected routes.
     */
    if (!currentUser) {
      navigate("/login");
      return;
    }

    try {
      const [member, paymentsData] = await Promise.all([
        getMemberById(currentUser.uid),
        getPaymentsByMember(currentUser.uid),
      ]);

      // Get upcoming bookings from member's bookedClasses
      const upcomingBookings = (member.bookedClasses || [])
        .filter((booking) => booking.dateTime.toDate() >= new Date())
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
      console.log("🔥 handleCancelBooking called");
      console.log("selectedBookingId:", selectedBookingId);
      console.log("typeof selectedBookingId:", typeof selectedBookingId);
      console.log("bookings array:", bookings);

      const result = await cancelBooking(selectedBookingId, currentUser.uid);
      console.log(("result", result));

      if (result.success) {
        setBookings(
          bookings.filter((booking) => booking.id !== selectedBookingId),
        );
        toast.success(result.message);
        setCancelModalOpen(false);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred. Please try again.");
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
                fetchDashboardData();
              }}
            >
              Retry
            </button>
          </div>
        )}

        <header>
          {/* left side */}
          <div>
            <h1 id="dashboard-heading">Welcome back, {firstName}!</h1>
            <p>{formattedDate}</p>
          </div>
          {/* Right side */}
          <div>
            <button
              aria-label={
                notificationCount > 0
                  ? `View ${notificationCount} notifications`
                  : "View notifications"
              }
              onClick={() => toast("Notifications coming soon!")}
            >
              🔔
            </button>
            {notificationCount > 0 && <span>{notificationCount}</span>}
          </div>
        </header>
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
              <button onClick={() => navigate("/schedule")}>
                Book a Class
              </button>
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
                        console.log("cancel button clicked");
                        console.log("setting cancel modal to true");
                        setSelectedBookingId(booking.id);
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
                Ready to get started? Browse our schedule and book your first
                class!
              </p>
              <button onClick={() => navigate("/schedule")}>
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
