export default function CreditCardForm({
  ccNumber,
  setCCNumber,
  expiry,
  setExpiry,
  ccv,
  setCCV,
}) {
  return (
    <div>
      <label htmlFor="cardNumber">Card Number:</label>
      <input
        id="cardNumber"
        type="text"
        onChange={(e) => setCCNumber(e.target.value)}
        value={ccNumber}
      />

      <label htmlFor="cardExpiration">Expiration:</label>
      <input
        id="cardExpiration"
        type="text"
        onChange={(e) => setExpiry(e.target.value)}
        value={expiry}
      />

      <label htmlFor="cardCCV">CCV:</label>
      <input
        id="cardCCV"
        type="text"
        onChange={(e) => setCCV(e.target.value)}
        value={ccv}
      />
    </div>
  );
}
