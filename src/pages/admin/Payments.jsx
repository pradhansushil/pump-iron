import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTriangleExclamation,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

import { getAllPayments } from "../../services/paymentsService";
import LoadingSpinner from "../../components/LoadingSpinner";
import FilterSelect from "../../components/admin/FilterSelect";
import { PAYMENT_STATUS } from "../../utils/constants";
import { formatDate } from "../../utils/formatters";
import {
  containerStyle,
  ctaButton,
  errorBanner,
  h1Style,
  marginBottom,
  textColor,
  textSizeSmall,
} from "../../utils/styles";

export default function PaymentsTable() {
  const [payments, setPayments] = useState([]);
  const [sort, setSort] = useState("");
  const [name, setName] = useState("");
  const [month, setMonth] = useState("");
  const [status, setStatus] = useState(PAYMENT_STATUS.ALL);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const result = await getAllPayments();
        setPayments(result);
      } catch {
        setError("Failed to load payments. Please try again");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const handleReset = () => {
    setName("");
    setSort("");
    setMonth("");
    setStatus(PAYMENT_STATUS.ALL);
  };

  const isFiltered =
    name !== "" || sort !== "" || month !== "" || status !== PAYMENT_STATUS.ALL;

  const filteredPayments = payments
    .filter((payment) => {
      if (name === "") return true;
      return payment.memberName.toLowerCase().includes(name.toLowerCase());
    })
    .filter((payment) => {
      if (status === PAYMENT_STATUS.ALL) return true;
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
      return b.date.toDate() - a.date.toDate();
    });

  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <main className={containerStyle}>
        <div className={`${errorBanner} bg-yellow-600`} role="alert">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon icon={faTriangleExclamation} />
            <p>{error}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setError(null);
                window.location.reload();
              }}
              className={`border border-white px-3 py-1 rounded-lg ${textSizeSmall} hover:bg-yellow-700`}
            >
              Try again
            </button>
            <button
              onClick={() => setError(null)}
              className="hover:bg-yellow-700 px-2 py-1 rounded"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
        </div>
      </main>
    );

  return (
    <main aria-labelledby="payments-heading" className={containerStyle}>
      <h1
        id="payments-heading"
        className={`${h1Style} ${marginBottom} text-center`}
      >
        Payments
      </h1>

      <div className={`${marginBottom} flex items-center justify-between`}>
        <div className="flex gap-3">
          <div className="flex items-center gap-2">
            <label htmlFor="name-search" className="sr-only">
              Name
            </label>
            <input
              type="text"
              id="name-search"
              className="px-4 py-2 w-64 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter a name"
            />
          </div>

          <div className="flex items-center gap-2">
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
                { value: PAYMENT_STATUS.ALL, label: "All" },
                { value: PAYMENT_STATUS.COMPLETED, label: "Completed" },
                { value: PAYMENT_STATUS.DUE, label: "Due" },
                { value: PAYMENT_STATUS.OVERDUE, label: "Overdue" },
              ]}
            />
          </div>
        </div>
        <button
          onClick={handleReset}
          disabled={!isFiltered}
          className={`${ctaButton} disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          Reset Filters
        </button>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={textColor}>
              <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                Due Date
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                Amount
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="text-center text-gray-400 py-12 text-sm"
                >
                  No payments found.
                </td>
              </tr>
            ) : (
              filteredPayments.map((payment) => (
                <tr
                  key={payment.id}
                  className="odd:bg-gray-800 even:bg-gray-700 text-white"
                >
                  <td className="px-4 py-3 text-sm">{payment.memberName}</td>
                  <td className="px-4 py-3 text-sm">
                    {formatDate(payment.date)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {payment.status !== "completed"
                      ? formatDate(payment.dueDate)
                      : "N/A"}
                  </td>
                  <td className="px-4 py-3 text-sm">${payment.amount}</td>
                  <td className="px-4 py-3 text-sm">{payment.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
