import { useState } from "react";
import { Timestamp } from "firebase/firestore";

import { createPayment, updateMember } from "../services/db";

export default function RecordPaymentModal({ member, onClose, fetchMembers }) {
  const addMonths = (months) => {
    const d = new Date();
    d.setMonth(d.getMonth() + months);
    return d;
  };
  const oneMonth = addMonths(1);
  const twoMonths = addMonths(2);
  const threeMonths = addMonths(3);
  const sixMonths = addMonths(6);

  const [amount, setAmount] = useState(29);
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(oneMonth.toISOString());
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (date === "") return setError({ date: "Please fill in the date field" });

    setLoading(true);

    try {
      await createPayment({
        memberId: member.uid,
        amount: amount,
        date: Timestamp.fromDate(new Date(date)),
        dueDate: Timestamp.fromDate(new Date(dueDate)),
        method: "cash",
        status: "completed",
        description: description,
        email: member.email,
        createdAt: Timestamp.now(),
      });

      await updateMember(member.uid, { status: "active" });
      await updateMember(member.uid, { nextBillingDate: dueDate });
      fetchMembers();
      onClose();
    } catch {
      setError({ general: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <form onSubmit={handleSubmit} noValidate>
          {error.general && <p className="form-error">{error.general}</p>}
          {error.date && <p className="field-error">{error.date}</p>}

          <div className="form-field">
            <label htmlFor="amount">Amount </label>
            <select
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            >
              <option value={29}>$29</option>
              <option value={49}>$49</option>
              <option value={79}>$79</option>
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="date">Date </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label htmlFor="dueDate">Due Date </label>
            <select
              id="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            >
              <option value={oneMonth.toISOString()}>
                {oneMonth.toLocaleDateString()}
              </option>
              <option value={twoMonths.toISOString()}>
                {twoMonths.toLocaleDateString()}
              </option>
              <option value={threeMonths.toISOString()}>
                {threeMonths.toLocaleDateString()}
              </option>
              <option value={sixMonths.toISOString()}>
                {sixMonths.toLocaleDateString()}
              </option>
            </select>
          </div>

          <div className="form-field">
            <textarea
              className="form-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter an optional description"
            />
          </div>

          <div className="form-buttons">
            <button
              className="cancel-btn"
              onClick={() => onClose()}
              disabled={loading}
            >
              Cancel
            </button>
            <button className="submit-btn" type="submit" disabled={loading}>
              {loading ? "Processing Payment" : "Make Payment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
