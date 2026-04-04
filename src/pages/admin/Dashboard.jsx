import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTriangleExclamation,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

import LoadingSpinner from "../../components/LoadingSpinner";
import { getAllMembers } from "../../services/db";
import { getAllPayments } from "../../services/paymentsService";
import { getAllTourRequests } from "../../services/booking/tourService";
import TourRequestsWidget from "../../components/admin/TourRequestsWidget";
import {
  containerStyle,
  errorBanner,
  h1Style,
  textSizeSmall,
} from "../../utils/styles";
import StatCard from "../../components/admin/StatCard";

export default function AdminDashboard() {
  const [members, setMembers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [tourRequests, setTourRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const [allMembers, allPayments, allTourRequests] = await Promise.all([
          getAllMembers(),
          getAllPayments(),
          getAllTourRequests(),
        ]);
        setMembers(allMembers);
        setPayments(allPayments);
        setTourRequests(allTourRequests);
      } catch {
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <main className={containerStyle}>
        <div className={`${errorBanner} bg-red-600`} role="alert">
          <FontAwesomeIcon icon={faTriangleExclamation} />
          <p>{error}</p>
          <button
            className={`${textSizeSmall} hover:bg-red-700`}
            onClick={() => {
              setError(null);
              window.location.reload();
            }}
          >
            Try again
          </button>
          <button
            aria-label="Dismiss error"
            className="hover:bg-red-700"
            onClick={() => setError(null)}
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
      </main>
    );

  const totalMembers = members.length;
  const activeMembers = members.filter((s) => s.status === "active").length;

  const today = new Date();
  const monthlyRevenue = payments
    .filter(
      (total) =>
        total.date.toDate().getMonth() === today.getMonth() &&
        total.date.toDate().getFullYear() === today.getFullYear(),
    )
    .reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <main aria-labelledby="admin-dashboard-heading" className={containerStyle}>
      <h1
        id="admin-dashboard-heading"
        className={`${h1Style} text-center mb-6`}
      >
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-3 gap-6">
        <StatCard label="Members" value={totalMembers} />
        <StatCard label="Active Members" value={activeMembers} />
        <StatCard
          label="Monthly Revenue"
          value={monthlyRevenue.toLocaleString("en-us", {
            style: "currency",
            currency: "USD",
          })}
        />
        <TourRequestsWidget tourRequests={tourRequests} />
      </div>
    </main>
  );
}
