import { useState } from "react";
import CreditCardForm from "./payment-forms/CreditCardForm";

export default function UpdatePaymentMethodModal({ method, onClose }) {
  const [selectedMethod, setSelectedMethod] = useState(method);

  const [ccNumber, setCCNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [ccv, setCCV] = useState("");

  return (
    <div>
      <select
        value={selectedMethod}
        onChange={(e) => setSelectedMethod(e.target.value)}
      >
        <option value="credit card">Credit Card</option>
        <option value="cash">Cash</option>
        <option value="bank transfer">Bank Transfer</option>
        <option value="qr code">QR Code</option>
      </select>

      {selectedMethod === "Credit Card" && (
        <CreditCardForm
          ccNumber={ccNumber}
          setCCNumber={setCCNumber}
          expiry={expiry}
          setExpiry={setExpiry}
          ccv={ccv}
          setCCV={setCCV}
        />
      )}
      {/* {selectedMethod === "Bank Transfer" && <BankTransferForm />} */}
      {/* {selectedMethod === "QR Code" && (
        <div>
          <p>Scan this code with your payment app (Cash App, Zelle, etc.)</p>
        </div>
      )} */}
    </div>
  );
}
