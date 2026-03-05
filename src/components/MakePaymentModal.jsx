import { useEffect, useState } from "react";
import { Timestamp } from "firebase/firestore";

import { createPayment, getMemberById } from "../services/db";
import { plans } from "../data/plansData";
import LoadingSpinner from "./LoadingSpinner";
import toast from "react-hot-toast";

export default function MakePaymentModal({ isOpen, onClose, currentUser }) {
  const [paymentDetails, setPaymentDetails] = useState({
    name: "",
    paymentMethod: "",
    plan: "",
    email: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      setLoading(true);
      try {
        const memberData = await getMemberById(currentUser.uid);
        const matchedPlan = plans.find(
          (plan) =>
            plan.name.toLowerCase() === memberData.membershipPlan.toLowerCase(),
        );

        setPaymentDetails({
          name: memberData.name,
          paymentMethod: memberData.paymentMethod,
          plan: matchedPlan.price,
          email: memberData.email,
          description: "Monthly membership - " + memberData.membershipPlan,
        });
      } catch {
        toast.error("Failed to load payment details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [currentUser.uid]);

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") return onClose();
    };
    window.addEventListener("keydown", handleEscKey);

    return () => window.removeEventListener("keydown", handleEscKey);
  }, [onClose]);

  const handleSubmit = async () => {
    try {
      const dueDate = new Date();
      dueDate.setMonth(dueDate.getMonth() + 1);

      const paymentData = {
        memberId: currentUser.uid,
        amount: parseInt(paymentDetails.plan.replace("$", "")),
        method: paymentDetails.paymentMethod,
        email: paymentDetails.email,
        description: paymentDetails.description,
        status: "completed",
        createdAt: Timestamp.now(),
        dueDate: Timestamp.fromDate(dueDate),
      };

      await createPayment(paymentData);

      toast.success("Payment successful!");
      onClose();
    } catch {
      toast.error("Payment failed. Please try again.");
    }
  };

  if (!isOpen) return null;

  if (loading) return <LoadingSpinner />;

  return (
    isOpen && (
      <div className="modal-overlay">
        <div className="modal-box">
          <label htmlFor="name">Full Name *</label>
          <p id="name">{paymentDetails.name}</p>

          <label htmlFor="payment-method">Payment Method *</label>
          <select
            id="payment-method"
            value={paymentDetails.paymentMethod}
            onChange={(e) =>
              setPaymentDetails({
                ...paymentDetails,
                paymentMethod: e.target.value,
              })
            }
          >
            <option value="credit card">Credit Card</option>
            <option value="bank transfer">Bank Transfer</option>
            <option value="cash">Cash</option>
            <option value="qr code">QR Code</option>
          </select>

          <label htmlFor="price">Charge *</label>
          <p id="price">{paymentDetails.plan}</p>

          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSubmit}>Make a Payment</button>
        </div>
      </div>
    )
  );
}
