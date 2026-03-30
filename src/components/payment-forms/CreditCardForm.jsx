import { formField, formInput, formLabel } from "../../utils/styles";

export default function CreditCardForm({
  ccNumber,
  setCCNumber,
  expiry,
  setExpiry,
  ccv,
  setCCV,
}) {
  return (
    <>
      <div className={formField}>
        <label htmlFor="cardNumber" className={formLabel}>
          Card Number:
        </label>
        <input
          id="cardNumber"
          className={formInput}
          type="text"
          onChange={(e) => setCCNumber(e.target.value)}
          value={ccNumber}
          placeholder="1234 5678 9012 3456"
        />
      </div>

      <div className={formField}>
        <label htmlFor="cardExpiration" className={formLabel}>
          Expiration:
        </label>
        <input
          id="cardExpiration"
          className={formInput}
          type="text"
          onChange={(e) => setExpiry(e.target.value)}
          value={expiry}
          placeholder="MM/YY"
        />
      </div>

      <div className={formField}>
        <label htmlFor="cardCCV" className={formLabel}>
          CCV:
        </label>
        <input
          id="cardCCV"
          className={formInput}
          type="text"
          onChange={(e) => setCCV(e.target.value)}
          value={ccv}
          placeholder="123"
        />
      </div>
    </>
  );
}
