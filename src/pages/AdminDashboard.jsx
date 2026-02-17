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
    <div>
      <h1>Admin Dashboard</h1>

      <div>
        <p>
          Total Members: <span>{totalMembers}</span>
        </p>
        <p>
          Active Members: <span>{activeMembers}</span>
        </p>
        <p>
          Monthly Revenue:{" "}
          <span>
            {monthlyRevenue.toLocaleString("en-us", {
              style: "currency",
              currency: "USD",
            })}
          </span>
        </p>
        <div>
          <h2>Manage Members</h2>
          <p>View and manage gym members</p>
        </div>

        <div>
          <h2>Manage Classes</h2>
          <p>Create and edit gym classes</p>
        </div>

        <div>
          <h2>Reports</h2>
          <p>View gym statistics and reports</p>
        </div>

        <div>
          <h2>Settings</h2>
          <p>Manage gym settings and configuration</p>
        </div>
      </div>
    </div>
  );
}
