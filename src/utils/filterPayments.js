import { PAYMENT_STATUS } from "./constants";

export const filterPayments = (payments, selectedStatus) => {
  if (selectedStatus === PAYMENT_STATUS.ALL) return payments;
  return payments.filter((payment) => payment.status === selectedStatus);
};
