import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

import LoadingSpinner from "../components/LoadingSpinner";
import { getAllMembers } from "../services/db";

export default function AdminDashboard() {
  const [members, setMembers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        // TODO: refactor to Promise.all() for parallel fetching
        const allMembers = await getAllMembers();

        const paymentsRef = collection(db, "payments");
        const paymentsSnapShot = await getDocs(paymentsRef);

        const paymentsList = paymentsSnapShot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setMembers(allMembers);
        setPayments(paymentsList);
      } catch (error) {
        console.error("Error:", error);
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
    <div className="dashboard">
      <h1 className="dashboard-title">Admin Dashboard</h1>

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
    </div>
  );
}
