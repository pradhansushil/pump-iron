import { useState } from "react";
import CreditCardForm from "./payment-forms/CreditCardForm";
import BankTransferForm from "./payment-forms/BankTransferForm";
import QRCodeForm from "./payment-forms/QRCodeForm";
import { updateMember } from "../services/db";

export default function UpdatePaymentMethodModal({
  memberId,
  method,
  onClose,
  onPaymentMethodUpdate
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
      console.log("Payment method update success!");
      onPaymentMethodUpdate(selectedMethod);
      handleClose();
    } catch (error) {
      console.error("Payment method failed:", error);
    }
  };

  return (
    <div>
      <button onClick={handleClose}>X</button>
      <select
        value={selectedMethod}
        onChange={(e) => setSelectedMethod(e.target.value)}
      >
        <option value="credit card">Credit Card</option>
        <option value="cash">Cash</option>
        <option value="bank transfer">Bank Transfer</option>
        <option value="qr code">QR Code</option>
      </select>

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
      <button onClick={handleClose}>Cancel</button>
      <button onClick={handleSubmit}>Save</button>
    </div>
  );
}
