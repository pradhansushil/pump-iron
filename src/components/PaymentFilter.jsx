import { PAYMENT_STATUS } from "../utils/constants";

export default function PaymentFilter({ onChange, selectedStatus }) {
  return (
    <div className="">
      <select
        aria-label="Filter payments by status"
        value={selectedStatus}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value={PAYMENT_STATUS.ALL}>All</option>
        <option value={PAYMENT_STATUS.COMPLETED}>Completed</option>
        <option value={PAYMENT_STATUS.DUE}>Due</option>
        <option value={PAYMENT_STATUS.OVERDUE}>Overdue</option>
      </select>
    </div>
  );
}
