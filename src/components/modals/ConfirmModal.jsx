import { useEffect } from "react";
import {
  cancelBtn,
  dangerButton,
  modalBox,
  modalButtons,
  modalOverlay,
  textColor,
  textColorWhite,
  textSizeSmall,
} from "../../utils/styles";

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
      <div className={modalOverlay}>
        <div
          className={modalBox}
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className={`${textColorWhite} text-base font-bold`}>
            Confirm Action
          </h2>
          <p className={`${textColor} ${textSizeSmall}`}>{message}</p>
          <div className={modalButtons}>
            <button onClick={onClose} className={cancelBtn}>
              Go Back
            </button>
            <button onClick={onConfirm} className={dangerButton}>
              Confirm
            </button>
          </div>
        </div>
      </div>
    )
  );
}
