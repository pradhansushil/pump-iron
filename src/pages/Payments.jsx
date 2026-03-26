import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

import { getMemberById } from "../services/db";
import { getPaymentsByMember } from "../services/paymentsService";
import UpdatePaymentMethodModal from "../components/modals/UpdatePaymentMethodModal";
import {
  formatCurrency,
  formatDate,
  formatPaymentMethod,
  getPaymentStatus,
} from "../utils/formatters";
import LoadingSpinner from "../components/LoadingSpinner";
import { PAYMENT_STATUS } from "../utils/constants";
import {
  pageStyle,
  h1Style,
  containerStyle,
  cardStyle,
  marginBottom,
  ctaButton,
  textColor,
  textColorWhite,
  textSizeSmall,
} from "../utils/styles";

export default function Payments() {
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState([]);
  const [memberData, setMemberData] = useState(null);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { currentUser } = useAuth();

  const completedPayments = payments.filter(
    (p) => p.status === PAYMENT_STATUS.COMPLETED,
  );

  useEffect(() => {
    if (!currentUser) return;

    const fetchData = async () => {
      try {
        const [member, paymentsData] = await Promise.all([
          getMemberById(currentUser.uid),
          getPaymentsByMember(currentUser.uid),
        ]);

        if (!member) {
          setError("Unable to load member data. Please try again.");
          return;
        }

        setMemberData(member);
        setPayments(paymentsData);
      } catch {
        setError("Failed to load payment data. Please try again");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  const updatePaymentMethodUI = (newMethod) => {
    setMemberData({ ...memberData, paymentMethod: newMethod });
  };

  // Helper function to match RecentPaymentsCard styling
  const getStatusColor = (payment) => {
    const status = getPaymentStatus(payment);
    if (status === "completed") return "bg-green-600";
    if (status === "overdue") return "bg-red-600";
    return "bg-yellow-600";
  };

  if (loading) return <LoadingSpinner message="Loading payment data..." />;
  if (error)
    return (
      <p className="error-message" role="alert">
        {error}
      </p>
    );

  return (
    memberData && (
      <main aria-labelledby="payments-heading" className={pageStyle}>
        <div className={containerStyle}>
          <h1 id="payments-heading" className={h1Style}>
            Payments
          </h1>
          <div
            className={`${cardStyle} ${marginBottom} flex items-center justify-between`}
          >
            <p className={textColor}>
              Current Payment Method:{" "}
              <span className={textColorWhite}>
                {memberData.paymentMethod
                  ? formatPaymentMethod(memberData.paymentMethod)
                  : "No payment method on file"}
              </span>
            </p>
            <button className={ctaButton} onClick={() => setIsModalOpen(true)}>
              Update Payment Method
            </button>
          </div>

          {completedPayments.length > 0 ? (
            <>
              {/* Desktop View: Table */}
              <div className="hidden md:block w-full overflow-x-auto">
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
                        Description
                      </th>
                      <th className="px-4 py-2 text-left" scope="col">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...completedPayments]
                      .sort((a, b) => b.date.toDate() - a.date.toDate())
                      .map((payment) => (
                        <tr
                          className={`even:bg-gray-800 odd:bg-gray-700 ${textColorWhite}`}
                          key={payment.id}
                        >
                          <td className="px-4 py-2">
                            {formatDate(payment.date)}
                          </td>
                          <td className="px-4 py-2">
                            {formatCurrency(payment.amount)}
                          </td>
                          <td className="px-4 py-2">
                            {formatPaymentMethod(payment.method)}
                          </td>
                          <td className="px-4 py-2">{payment.description}</td>
                          <td className="px-4 py-2">
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

              {/* Mobile View: Card List */}
              <div className="md:hidden space-y-3">
                {[...completedPayments]
                  .sort((a, b) => b.date.toDate() - a.date.toDate())
                  .map((payment) => (
                    <div
                      key={payment.id}
                      className={`bg-gray-700 rounded-lg px-4 py-3 flex justify-between items-center ${textColorWhite}`}
                    >
                      <div>
                        <p className="font-medium">
                          {formatDate(payment.date)}
                        </p>
                        <p className={`${textSizeSmall} text-gray-400`}>
                          {formatPaymentMethod(payment.method)}
                        </p>
                        {payment.description && (
                          <p className={`${textSizeSmall} text-gray-400 mt-1`}>
                            {payment.description}
                          </p>
                        )}
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
            </>
          ) : (
            <p className={textColorWhite}>No payment records found</p>
          )}

          {isModalOpen && (
            <UpdatePaymentMethodModal
              isOpen={isModalOpen}
              method={memberData.paymentMethod}
              onClose={() => setIsModalOpen(false)}
              memberId={currentUser.uid}
              onPaymentMethodUpdate={updatePaymentMethodUI}
            />
          )}
        </div>
      </main>
    )
  );
}
