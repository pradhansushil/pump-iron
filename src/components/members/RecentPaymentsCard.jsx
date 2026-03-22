import { Link } from "react-router-dom";
import {
  formatCurrency,
  formatDate,
  formatPaymentMethod,
  getPaymentStatus,
} from "../../utils/formatters";
import {
  h2Heading,
  marginBottom,
  textColor,
  textColorWhite,
  textSizeSmall,
} from "../../utils/styles";

export default function RecentPaymentsCard({ payments }) {
  return (
    <div className={`${marginBottom}`}>
      <h2 className={h2Heading}>Recent Payments</h2>
      {payments.length === 0 ? (
        <p className={textColorWhite}>No payment history yet</p>
      ) : (
        <>
          <table className="w-full">
            <thead>
              <tr className={textColor}>
                <th className="px-4 py-2 text-left" scope="col">
                  Date
                </th>
                <th className="px-4 py-2 text-left" scope="col">
                  Amount
                </th>
                <th className="px-4 py-2 text-left" scope="col">
                  Payment Method
                </th>
                <th className="px-4 py-2 text-left" scope="col">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {payments
                .filter((payment) => getPaymentStatus(payment) !== null)
                .map((payment) => (
                  <tr
                    className={`even:bg-gray-800 odd:bg-gray-700 ${textColorWhite}`}
                    key={payment.id}
                  >
                    <td className="px-4 py-2">{formatDate(payment.date)}</td>
                    <td className="px-4 py-2">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="px-4 py-2">
                      {formatPaymentMethod(payment.method)}
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`inline-block px-3 py-1 rounded-full ${textSizeSmall} font-semibold ${textColorWhite} ${
                          getPaymentStatus(payment) === "completed"
                            ? "bg-green-600"
                            : getPaymentStatus(payment) === "overdue"
                              ? "bg-red-600"
                              : "bg-yellow-600"
                        }`}
                      >
                        {getPaymentStatus(payment)}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <Link className="text-blue-400" to={"/payments"}>
            View Full Payment History
          </Link>
        </>
      )}
    </div>
  );
}
