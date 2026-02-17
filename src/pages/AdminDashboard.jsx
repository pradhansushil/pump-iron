import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

import LoadingSpinner from "../components/LoadingSpinner";

export default function AdminDashboard() {
  const [members, setMembers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    monthlyRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        // TODO: refactor to Promise.all() for parallel fetching
        const membersRef = collection(db, "members");
        const snapshot = await getDocs(membersRef);
        const paymentsRef = collection(db, "payments");
        const paymentsSnapShot = await getDocs(paymentsRef);

        const membersList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const paymentsList = paymentsSnapShot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setMembers(membersList);
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

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <div>
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
