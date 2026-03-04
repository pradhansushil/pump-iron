import { Link } from "react-router-dom";

import {
  formatCurrency,
  formatDate,
  formatPaymentMethod,
} from "../utils/formatters";

export default function RecentPaymentsCard({ payments }) {
  return (
    <div className="recent-payments">
      <h2>Recent Payments</h2>
      {payments.length === 0 ? (
        <p>No payment history yet</p>
      ) : (
        <>
          <table className="members-table">
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Amount</th>
                <th scope="col">Payment Method</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td>{formatDate(payment.date)}</td>
                  <td>{formatCurrency(payment.amount)}</td>
                  <td>{formatPaymentMethod(payment.method)}</td>
                  <td>
                    <span className="status-badge">{payment.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Link to={"/payments"}>View Full Payment History</Link>
        </>
      )}
    </div>
  );
}
