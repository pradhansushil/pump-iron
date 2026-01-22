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
      const [member, paymentsData, bookingsData] = await Promise.all([
        getMemberById(currentUser.uid),
        getPaymentsByMember(currentUser.uid),
        getBookingsByMember(currentUser.uid),
      ]);

      const upcoming = bookingsData
        .filter((booking) => booking.dateTime.toDate() >= new Date())
        .sort((a, b) => a.dateTime.toDate() - b.dateTime.toDate());

      const next = upcoming[0] || null;

      setMemberData(member);
      setPayments(paymentsData.slice(0, 3));
      setBookings(upcoming.slice(1, 6));
      setNextClass(next);
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!memberData) return <div>No Member Data </div>;

  const firstName = memberData.name.split(" ")[0];

  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  console.log("bookings length:", bookings.length);
  console.log("bookings data:", bookings);
  return loading ? (
    <div>
      <div></div>
      <p>Loading your dashboard...</p>
    </div>
  ) : (
    <div>
      {/* left side */}
      <div>
        <h1>Welcome back, {firstName}!</h1>
        <p>{formattedDate}</p>
      </div>
      {/* Right side */}
      <div>
        <button onClick={() => toast("Notifications coming soon!")}>🔔</button>
        {notificationCount > 0 && <span>{notificationCount}</span>}
      </div>

      <div>
        <div>
          <h2>Membership Status</h2>
          <p>{memberData.membershipPlan}</p>
          <span
            style={{
              backgroundColor: memberData.status === "active" ? "green" : "red",
              color: "white",
              padding: "4px 8px",
              borderRadius: "4px",
            }}
          >
            {memberData.status}
          </span>
        </div>

        {/* Card 2: Next Class */}
        <div>
          <h2>Next Class</h2>
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
        </div>

        {/* Card 3: Quick Action */}
        <div>
          <h2>Quick Action</h2>
          <button onClick={() => navigate("/schedule")}>Book a Class</button>
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
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Payment Method</th>
                  <th>Status</th>
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

      {bookings.length >= 1 && (
        <div>
          <h2>Upcoming Classes</h2>
          {bookings.map((booking) => (
            <div key={booking.id}>
              <h3>{booking.className}</h3>
              <p>{booking.instructor}</p>
              <p>{formatDate(booking.dateTime)}</p>
              <a href="#">View Details</a>
              <button
                onClick={() => {
                  setSelectedBookingId(booking.id);
                  setCancelModalOpen(true);
                }}
              >
                Cancel
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
