import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import CreditCardForm from "../payment-forms/CreditCardForm";
import BankTransferForm from "../payment-forms/BankTransferForm";
import QRCodeForm from "../payment-forms/QRCodeForm";
import { updateMember } from "../../services/db";
import {
  formField,
  formLabel,
  formInput,
  modalOverlay,
  modalBox,
  modalButtons,
  cancelBtn,
  ctaButton,
} from "../../utils/styles";

export default function UpdatePaymentMethodModal({
  isOpen,
  memberId,
  method,
  onClose,
  onPaymentMethodUpdate,
}) {
  const [selectedMethod, setSelectedMethod] = useState(method);

  const [ccNumber, setCCNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [ccv, setCCV] = useState("");

  const [accountNumber, setAccountNumber] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");

  const handleClose = () => {
    setSelectedMethod(method);
    setCCNumber("");
    setExpiry("");
    setCCV("");
    setAccountNumber("");
    setRoutingNumber("");
    onClose();
  };

  const handleSubmit = async () => {
    try {
      await updateMember(memberId, { paymentMethod: selectedMethod });
      toast.success("Payment method updated successfully!");
      onPaymentMethodUpdate(selectedMethod);
      handleClose();
    } catch {
      toast.error("Failed to update payment method. Please try again.");
    }
  };

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleEscKey);

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className={modalOverlay} onClick={handleClose}>
      <div className={modalBox} onClick={(e) => e.stopPropagation()}>
        <div className={formField}>
          <label className={formLabel}>Payment Method</label>
          <select
            value={selectedMethod}
            onChange={(e) => setSelectedMethod(e.target.value)}
            className={formInput}
          >
            <option value="credit card">Credit Card</option>
            <option value="cash">Cash</option>
            <option value="bank transfer">Bank Transfer</option>
            <option value="qr code">QR Code</option>
          </select>
        </div>

        {selectedMethod === "credit card" && (
          <CreditCardForm
            ccNumber={ccNumber}
            setCCNumber={setCCNumber}
            expiry={expiry}
            setExpiry={setExpiry}
            ccv={ccv}
            setCCV={setCCV}
          />
        )}
        {selectedMethod === "bank transfer" && (
          <BankTransferForm
            accountNumber={accountNumber}
            setAccountNumber={setAccountNumber}
            routingNumber={routingNumber}
            setRoutingNumber={setRoutingNumber}
          />
        )}
        {selectedMethod === "qr code" && <QRCodeForm />}

        <div className={modalButtons}>
          <button className={cancelBtn} onClick={handleClose}>
            Cancel
          </button>
          <button className={ctaButton} onClick={handleSubmit}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
