import { formField, formInput, formLabel } from "../../utils/styles";

export default function BankTransferForm({
  accountNumber,
  setAccountNumber,
  routingNumber,
  setRoutingNumber,
}) {
  return (
    <>
      <div className={formField}>
        <label htmlFor="accountNumber" className={formLabel}>
          Account Number
        </label>
        <input
          id="accountNumber"
          className={formInput}
          type="text"
          onChange={(e) => setAccountNumber(e.target.value)}
          value={accountNumber}
          placeholder="Enter your account number"
        />
      </div>

      <div className={formField}>
        <label htmlFor="routingNumber" className={formLabel}>
          Routing Number
        </label>
        <input
          id="routingNumber"
          className={formInput}
          type="text"
          onChange={(e) => setRoutingNumber(e.target.value)}
          value={routingNumber}
          placeholder="Enter your routing number"
        />
      </div>
    </>
  );
}
