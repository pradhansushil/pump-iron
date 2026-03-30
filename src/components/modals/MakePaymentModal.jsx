import { useEffect, useState } from "react";
import { Timestamp } from "firebase/firestore";
import toast from "react-hot-toast";

import { getMemberById } from "../../services/db";
import { createPayment } from "../../services/paymentsService";
import { plans } from "../../data/plansData";
import LoadingSpinner from "../LoadingSpinner";
import {
  getPaymentByStatus,
  updatePayment,
} from "../../services/paymentsService";
import { PAYMENT_STATUS } from "../../utils/constants";
import {
  modalOverlay,
  modalBox,
  formField,
  formInput,
  formLabel,
  modalButtons,
  cancelBtn,
  ctaButton,
} from "../../utils/styles";

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
      const result = await getPaymentByStatus(
        currentUser.uid,
        PAYMENT_STATUS.DUE,
      );
      await updatePayment(result.id, { status: PAYMENT_STATUS.COMPLETED });
      const dueDate = new Date();
      dueDate.setMonth(dueDate.getMonth() + 1);
      const paymentData = {
        memberId: currentUser.uid,
        memberName: paymentDetails.name,
        amount: parseInt(paymentDetails.plan.replace("$", "")),
        method: paymentDetails.paymentMethod,
        email: paymentDetails.email,
        description: paymentDetails.description,
        status: PAYMENT_STATUS.DUE,
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
      <div className={modalOverlay}>
        <div className={modalBox}>
          <div className={formField}>
            <label htmlFor="name" className={formLabel}>
              Full Name *
            </label>
            <p id="name" className={`${formInput} cursor-default`}>
              {paymentDetails.name}
            </p>
          </div>

          <div className={formField}>
            <label htmlFor="payment-method" className={formLabel}>
              Payment Method *
            </label>
            <select
              id="payment-method"
              className={`${formInput} cursor-default`}
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
          </div>

          <div className={formField}>
            <label htmlFor="price" className={formLabel}>
              Charge *
            </label>
            <p id="price" className={`${formInput} cursor-default`}>
              {paymentDetails.plan}
            </p>
          </div>

          <div className={modalButtons}>
            <button onClick={onClose} className={cancelBtn}>
              Cancel
            </button>
            <button onClick={handleSubmit} className={ctaButton}>
              Make a Payment
            </button>
          </div>
        </div>
      </div>
    )
  );
}
