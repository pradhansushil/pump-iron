import { useState } from "react";
import { createPayment, updateMember } from "../services/db";
import { Timestamp } from "firebase/firestore";

export default function RecordPaymentModal({ member, onClose, fetchMembers }) {
  const [amount, setAmount] = useState(29);
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      await createPayment({
        userId: member.uid,
        amount: amount,
        date: date ? Timestamp.fromDate(new Date(date)) : Timestamp.now(),
        dueDate: dueDate
          ? Timestamp.fromDate(new Date(dueDate))
          : Timestamp.now(),
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
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const addMonths = (months) => {
    const d = new Date();
    d.setMonth(d.getMonth() + months);
    return d;
  };
  const oneMonth = addMonths(1);
  const twoMonths = addMonths(2);
  const threeMonths = addMonths(3);
  const sixMonths = addMonths(6);

  return (
    <div>
      <form onSubmit={handleSubmit} noValidate>
        <p>{error}</p>

        <div>
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

        <div>
          <label htmlFor="date">Date </label>
          <input
            type="date"
            id="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="dueDate">Date </label>
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
      </form>
    </div>
  );
}
