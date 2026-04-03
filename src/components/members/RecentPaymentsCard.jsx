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
  const getStatusColor = (payment) => {
    const status = getPaymentStatus(payment);
    if (status === "completed") return "bg-green-600";
    if (status === "overdue") return "bg-red-600";
    return "bg-yellow-600";
  };

  return (
    <div className={`${marginBottom}`}>
      <h2 className={h2Heading}>Recent Payments</h2>
      {payments.length === 0 ? (
        <p className={textColorWhite}>No payment history yet</p>
      ) : (
        <>
          {/* Table — hidden on mobile, visible on md and up */}
          <div className="hidden md:block w-full overflow-x-auto rounded-lg border border-gray-600 shadow-xl">
            <table className="w-full">
              <thead>
                <tr
                  className={`${textColor} bg-gray-900 border-b-2 border-gray-500`}
                >
                  <th
                    className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest"
                    scope="col"
                  >
                    Date
                  </th>
                  <th
                    className="px-6 py-4 text-right text-xs font-bold uppercase tracking-widest"
                    scope="col"
                  >
                    Amount
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest"
                    scope="col"
                  >
                    Payment Method
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest"
                    scope="col"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {payments
                  .filter((payment) => getPaymentStatus(payment) !== null)
                  .map((payment) => (
                    <tr
                      className={`even:bg-gray-700 odd:bg-gray-800 ${textColorWhite}`}
                      key={payment.id}
                    >
                      <td className="px-6 py-4 text-sm border-r border-gray-600">
                        {formatDate(payment.date)}
                      </td>
                      <td className="px-6 py-4 text-right text-sm border-r border-gray-600">
                        {formatCurrency(payment.amount)}
                      </td>
                      <td className="px-6 py-4 text-sm border-r border-gray-600">
                        {formatPaymentMethod(payment.method)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`inline-block px-3 py-1 rounded-full ${textSizeSmall} font-semibold ${textColorWhite} ${getStatusColor(payment)}`}
                        >
                          {getPaymentStatus(payment)}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Card list — shown on mobile, hidden on md and up */}
          <div className="md:hidden space-y-3">
            {payments
              .filter((payment) => getPaymentStatus(payment) !== null)
              .map((payment) => (
                <div
                  key={payment.id}
                  className={`bg-gray-700 rounded-lg px-4 py-3 flex justify-between items-center ${textColorWhite}`}
                >
                  <div>
                    <p className="font-medium">{formatDate(payment.date)}</p>
                    <p className={`${textSizeSmall} text-gray-400`}>
                      {formatPaymentMethod(payment.method)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <p className="font-semibold">
                      {formatCurrency(payment.amount)}
                    </p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full ${textSizeSmall} font-semibold ${textColorWhite} ${getStatusColor(payment)}`}
                    >
                      {getPaymentStatus(payment)}
                    </span>
                  </div>
                </div>
              ))}
          </div>

          <Link className="text-blue-400" to={"/payments"}>
            View Full Payment History
          </Link>
        </>
      )}
    </div>
  );
}
