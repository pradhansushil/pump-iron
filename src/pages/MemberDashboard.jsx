import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";

import {
  getMemberById,
  getBookingsByMember,
  getClassById,
} from "../services/db";
import { getPaymentsByMember } from "../services/paymentsService";
import { cancelBooking } from "../services/booking/services";
import LoadingSpinner from "../components/LoadingSpinner";
import ConfirmModal from "../components/modals/ConfirmModal";
import ClassDetails from "../components/ClassDetails";
import DashboardHeader from "../components/members/DashboardHeader";
import MembershipCard from "../components/members/MembershipCard";
import NextClassCard from "../components/members/NextClassCard";
import QuickActionCard from "../components/members/QuickActionCard";
import RecentPaymentsCard from "../components/members/RecentPaymentsCard";
import UpcomingClasses from "../components/members/UpcomingClasses";

export default function MemberDashboard() {
  const [memberData, setMemberData] = useState(null);
  const [payments, setPayments] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [nextClass, setNextClass] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [viewDetailsModalOpen, setViewDetailsModalOpen] = useState(false);
  const [selectedClassDetails, setSelectedClassDetails] = useState(null);

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

  const handleViewDetails = async (classId) => {
    const result = await getClassById(classId);
    setSelectedClassDetails(result);
    setViewDetailsModalOpen(true);
  };

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
          <div className="dashboard-error" role="alert">
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

        <DashboardHeader
          isNewUser={isNewUser}
          firstName={firstName}
          formattedDate={formattedDate}
        />

        {memberData.status === "inactive" && (
          <div className="inactive-banner" role="alert">
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
          <MembershipCard
            membershipPlan={memberData.membershipPlan}
            status={memberData.status}
          />

          <NextClassCard nextClass={nextClass} />

          <QuickActionCard
            onBookClass={() => navigate("/classes")}
            currentUser={currentUser}
            paymentMethod={memberData.paymentMethod}
          />
        </div>

        <RecentPaymentsCard payments={payments} />

        <UpcomingClasses
          onClasses={() => navigate("/classes")}
          bookings={bookings}
          handleViewDetails={handleViewDetails}
          onCancel={(bookingId) => {
            setSelectedClassId(bookingId);
            setCancelModalOpen(true);
          }}
        />

        <ClassDetails
          isOpen={viewDetailsModalOpen}
          onClose={() => setViewDetailsModalOpen(false)}
          classDetails={selectedClassDetails}
        />

        <ConfirmModal
          isOpen={cancelModalOpen}
          onClose={() => setCancelModalOpen(false)}
          onConfirm={async () => await handleCancelBooking()}
          message={"Are you sure you want to cancel this class?"}
        />
      </div>
    </main>
  );
}
