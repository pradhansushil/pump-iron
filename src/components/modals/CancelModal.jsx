import { useEffect } from "react";

export default function CancelModal({ isOpen, onClose, onConfirm }) {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  return (
    isOpen && (
      <div className="modal-overlay" onClick={onClose}>
        <div
          className="modal-box"
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.stopPropagation()}
        >
          <p>Are you sure you want to cancel this class?</p>
          <div className="modal-buttons">
            <button onClick={onClose}>Go Back</button>
            <button onClick={onConfirm}>Confirm Cancel</button>
          </div>
        </div>
      </div>
    )
  );
}
