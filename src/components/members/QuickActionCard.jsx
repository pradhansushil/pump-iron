import { useState } from "react";

import MakePaymentModal from "../modals/MakePaymentModal";
import UpdatePaymentMethodModal from "../modals/UpdatePaymentMethodModal";
import { h2Heading, cardStyle, ctaButton } from "../../utils/styles";

export default function QuickActionCard({
  onBookClass,
  currentUser,
  paymentMethod,
}) {
  const [makePaymentModal, setMakePaymentModal] = useState(false);
  const [updatePaymentModal, setUpdatePaymentModal] = useState(false);

  return (
    <div className={cardStyle}>
      <section aria-labelledby="quick-action-header">
        <h2 id="quick-action-header" className={h2Heading}>
          Quick Action
        </h2>
        <div className="inline-flex flex-col gap-3">
          <button className={ctaButton} onClick={onBookClass}>
            Book a Class
          </button>
          <button
            className={ctaButton}
            onClick={() => setMakePaymentModal(true)}
          >
            Make a Payment
          </button>
          <button
            className={ctaButton}
            onClick={() => setUpdatePaymentModal(true)}
          >
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
