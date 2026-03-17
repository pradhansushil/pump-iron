import { useState } from "react";

import MakePaymentModal from "../modals/MakePaymentModal";
import UpdatePaymentMethodModal from "../modals/UpdatePaymentMethodModal";

export default function QuickActionCard({
  onBookClass,
  currentUser,
  paymentMethod,
}) {
  const [makePaymentModal, setMakePaymentModal] = useState(false);
  const [updatePaymentModal, setUpdatePaymentModal] = useState(false);

  return (
    <div className="dashboard-card">
      <section aria-labelledby="quick-action-header">
        <h2 id="quick-action-header">Quick Action</h2>
        <div className="quick-actions-button">
          <button onClick={onBookClass}>Book a Class</button>
        <button onClick={() => setMakePaymentModal(true)}>
          Make a Payment
        </button>
        <button onClick={() => setUpdatePaymentModal(true)}>
          Update Payment Method
        </button>
        </div>

        <MakePaymentModal
          isOpen={makePaymentModal}
          onClose={() => setMakePaymentModal(false)}
          currentUser={currentUser}
        />

        <UpdatePaymentMethodModal
          isOpen={updatePaymentModal}
          memberId={currentUser.uid}
          method={paymentMethod}
          onClose={() => setUpdatePaymentModal(false)}
          onPaymentMethodUpdate={() => {}}
        />
      </section>
    </div>
  );
}
