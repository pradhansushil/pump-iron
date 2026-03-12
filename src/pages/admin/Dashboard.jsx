import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import LoadingSpinner from "../../components/LoadingSpinner";
import { getAllMembers, getAllPayments } from "../../services/db";
import { getAllTourRequests } from "../../services/booking/tourService";
import TourRequestsWidget from "../../components/admin/TourRequestsWidget";

export default function AdminDashboard() {
  const [members, setMembers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [tourRequests, setTourRequests] = useState([]);
  const [loading, setLoading] = useState(true);

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
        toast.error("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  if (loading) return <LoadingSpinner />;

  const totalMembers = members.length;
  const activeMembers = members.filter((s) => s.status === "active").length;

  const today = new Date();
  const month = today.getMonth();
  const year = today.getFullYear();

  const monthlyRevenue = payments
    .filter(
      (total) =>
        total.date.toDate().getMonth() === month &&
        total.date.toDate().getFullYear() === year,
    )
    .reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <main aria-labelledby="admin-dashboard-heading" className="dashboard">
      <h1 id="admin-dashboard-heading" className="dashboard-title">
        Admin Dashboard
      </h1>

      <div className="stats-container">
        <p className="stat">
          Total Members: <span className="stat-value">{totalMembers}</span>
        </p>
        <p className="stat">
          Active Members: <span className="stat-value">{activeMembers}</span>
        </p>
        <p className="stat">
          Monthly Revenue:{" "}
          <span className="stat-value">
            {monthlyRevenue.toLocaleString("en-us", {
              style: "currency",
              currency: "USD",
            })}
          </span>
        </p>
      </div>
      <TourRequestsWidget tourRequests={tourRequests} />
    </main>
  );
}
