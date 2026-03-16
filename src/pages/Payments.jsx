import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";

import { getMemberById } from "../services/db";
import { getPaymentsByMember } from "../services/paymentsService";
import UpdatePaymentMethodModal from "../components/modals/UpdatePaymentMethodModal";
import {
  formatCurrency,
  formatDate,
  formatPaymentMethod,
} from "../utils/formatters";
import LoadingSpinner from "../components/LoadingSpinner";
import { filterPayments } from "../utils/filterPayments";
import PaymentFilter from "../components/PaymentFilter";
import { PAYMENT_STATUS } from "../utils/constants";

export default function Payments() {
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState([]);
  const [memberData, setMemberData] = useState(null);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(PAYMENT_STATUS.ALL);

  const { currentUser } = useAuth();

  const filteredPayments = useMemo(() => {
    return filterPayments(payments, selectedStatus);
  }, [payments, selectedStatus]);

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

  if (loading) return <LoadingSpinner message="Loading payment data..." />;
  if (error) return <p role="alert">{error}</p>;

  return (
    memberData && (
      <main aria-labelledby="payments-heading">
        <h1 id="payments-heading">Payments</h1>
        <div className="payment-method">
          <p>
            Current Payment Method:{" "}
            <span>
              {memberData.paymentMethod
                ? formatPaymentMethod(memberData.paymentMethod)
                : "No payment method on file"}
            </span>
          </p>
          <button className="submit-btn" onClick={() => setIsModalOpen(true)}>
            Update Payment Method
          </button>
        </div>

        {payments.length > 0 ? (
          <>
            <div className="payment-filter">
              <PaymentFilter
                onChange={setSelectedStatus}
                selectedStatus={selectedStatus}
              />
            </div>
            {filteredPayments.length > 0 ? (
              <div className="payments-history">
                <table className="members-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Method</th>
                      <th>Description</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...filteredPayments]
                      .sort((a, b) => b.date.toDate() - a.date.toDate())
                      .map((payment) => {
                        return (
                          <tr key={payment.id}>
                            <td>{formatDate(payment.date)}</td>
                            <td>{formatCurrency(payment.amount)}</td>
                            <td>{formatPaymentMethod(payment.method)}</td>
                            <td>{payment.description}</td>
                            <td>
                              <span className="status-badge">
                                {payment.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="no-results">No payments found for this status.</p>
            )}
          </>
        ) : (
          <p className="no-results">No payment records found</p>
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
      </main>
    )
  );
}
