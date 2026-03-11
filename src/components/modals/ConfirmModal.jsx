import { useEffect } from "react";

export default function ConfirmModal({ isOpen, onClose, onConfirm, message }) {
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
          <p>{message}</p>
          <div className="modal-buttons">
            <button onClick={onClose}>Go Back</button>
            <button onClick={onConfirm}>Confirm</button>
          </div>
        </div>
      </div>
    )
  );
}
