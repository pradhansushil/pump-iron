export function formatDate(date) {
  const firebaseTimestamp = date;
  const jsDate = firebaseTimestamp.toDate();

  return jsDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatCurrency(amount) {
  return `$${amount.toFixed(2)}`;
}

export function formatPaymentMethod(method) {
  switch (method) {
    case "credit card":
      return "Credit Card";
    case "debit card":
      return "Debit Card";
    case "cash":
      return "Cash";
    case "bank transfer":
      return "Bank Transfer";
    case "qr code":
      return "QR Code";
    default:
      return "Unknown Payment Method";
  }
}

export function getStatusColor(status) {
  const statusColor = {
    completed: "green",
    pending: "yellow",
    overdue: "red",
  };

  return statusColor[status];
}
