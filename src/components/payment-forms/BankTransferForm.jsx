export default function BankTransferForm({
  accountNumber,
  setAccountNumber,
  routingNumber,
  setRoutingNumber,
}) {
  return (
    <div className="bank-transfer-form">
      <label htmlFor="accountNumber">Account Number</label>
      <input
        id="accountNumber"
        type="text"
        onChange={(e) => setAccountNumber(e.target.value)}
        value={accountNumber}
      />

      <label htmlFor="routingNumber">Routing Number</label>
      <input
        id="routingNumber"
        type="text"
        onChange={(e) => setRoutingNumber(e.target.value)}
        value={routingNumber}
      />
    </div>
  );
}
