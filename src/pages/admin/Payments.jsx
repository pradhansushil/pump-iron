import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import { getAllPayments } from "../../services/db";
import LoadingSpinner from "../../components/LoadingSpinner";
import FilterSelect from "../../components/admin/FilterSelect";

export default function PaymentsTable() {
  const [payments, setPayments] = useState([]);
  const [sort, setSort] = useState("");
  const [name, setName] = useState("");
  const [month, setMonth] = useState("");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const result = await getAllPayments();
        setPayments(result);
      } catch {
        toast.error("Failed to load payments");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const filteredPayments = payments
    .filter((payment) => {
      if (name === "") return true;
      return payment.memberName.toLowerCase().includes(name.toLowerCase());
    })
    .filter((payment) => {
      if (status === "all") return true;
      return payment.status === status;
    })
    .filter((payment) => {
      if (month === "") return true;

      const paymentDate = payment.date.toDate();
      const now = new Date();
      const start = new Date();

      if (month === "current") start.setDate(1);
      if (month === "last") {
        start.setMonth(start.getMonth() - 1);
        start.setDate(1);
        now.setDate(0);
      }
      if (month === "3months") start.setMonth(start.getMonth() - 3);
      if (month === "6months") start.setMonth(start.getMonth() - 6);

      return paymentDate >= start && paymentDate <= now;
    })
    .sort((a, b) => {
      if (sort === "az") return a.memberName.localeCompare(b.memberName);
      if (sort === "za") return b.memberName.localeCompare(a.memberName);
      return 0;
    });

  if (loading) return <LoadingSpinner />;

  return (
    <main aria-labelledby="payments-heading">
      <h2 id="payments-heading">Payments</h2>
      <div className="">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter a name"
        />
        <FilterSelect
          id="sort"
          label="Sort"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          options={[
            { value: "", label: "All" },
            { value: "az", label: "A-Z" },
            { value: "za", label: "Z-A" },
          ]}
        />

        <FilterSelect
          id="period"
          label="Period"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          options={[
            { value: "", label: "All" },
            { value: "current", label: "Current" },
            { value: "last", label: "Last Month" },
            { value: "3months", label: "Last 3 Months" },
            { value: "6months", label: "Last 6 Months" },
          ]}
        />

        <FilterSelect
          id="status"
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          options={[
            { value: "all", label: "All" },
            { value: "completed", label: "Completed" },
            { value: "due", label: "Due" },
            { value: "overdue", label: "Overdue" },
          ]}
        />

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredPayments.length === 0 ? (
              <tr>
                <td colSpan={4}>No payments found.</td>
              </tr>
            ) : (
              filteredPayments.map((payment) => (
                <tr key={payment.id}>
                  <td>{payment.memberName}</td>
                  <td>{payment.date.toDate().toLocaleDateString()}</td>
                  <td>${payment.amount}</td>
                  <td>{payment.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
