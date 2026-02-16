import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getMemberById, getPaymentsByMember } from "../services/db";
import UpdatePaymentMethodModal from "../components/UpdatePaymentMethodModal";
import {
  formatCurrency,
  formatDate,
  formatPaymentMethod,
} from "../utils/formatters";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Payments() {
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState([]);
  const [memberData, setMemberData] = useState(null);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { currentUser } = useAuth();

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
  if (error) return <p>{error}</p>;

  console.log("Payments data:", payments);
  console.log("First payment:", payments[0]);
  console.log("First payment date:", payments[0]?.date);

  return (
    memberData && (
      <>
        <p>
          Current Payment Method:{" "}
          <span>
            {memberData.paymentMethod
              ? formatPaymentMethod(memberData.paymentMethod)
              : "No payment method on file"}
          </span>
        </p>
        <button onClick={() => setIsModalOpen(true)}>
          Update Payment Method
        </button>

        {payments.length > 0 ? (
          <div>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {[...payments]
                  .sort((a, b) => b.date.toDate() - a.date.toDate())
                  .map((payment) => {
                    console.log("payment in map:", payment.date);
                    return (
                      <tr key={payment.id}>
                        <td>{formatDate(payment.date)}</td>
                        <td>{formatCurrency(payment.amount)}</td>
                        <td>{formatPaymentMethod(payment.method)}</td>
                        <td>{payment.status}</td>
                        <td>{payment.description}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        ) : (
          "No payment records found"
        )}

        {isModalOpen && (
          <UpdatePaymentMethodModal
            method={memberData.paymentMethod}
            onClose={() => setIsModalOpen(false)}
            memberId={currentUser.uid}
            onPaymentMethodUpdate={updatePaymentMethodUI}
          />
        )}
      </>
    )
  );
}
