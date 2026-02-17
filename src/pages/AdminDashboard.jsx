import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default function AdminDashboard() {
  const [members, setMembers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    monthlyRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

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
