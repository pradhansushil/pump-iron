import { useState } from "react";
import MakePaymentModal from "../MakePaymentModal";

export default function QuickActionCard({ onBookClass, currentUser }) {
  const [makePaymentModal, setMakePaymentModal] = useState(false);

  return (
    <div className="dashboard-card">
      <section aria-labelledby="quick-action-header">
        <h2 id="quick-action-header">Quick Action</h2>
        <button onClick={onBookClass}>Book a Class</button>
        <button onClick={() => setMakePaymentModal(true)}>
          Make a Payment
        </button>

        <MakePaymentModal
          isOpen={makePaymentModal}
          onClose={() => setMakePaymentModal(false)}
          currentUser={currentUser}
        />
      </section>
    </div>
  );
}
