import { useEffect } from "react";

export default function Lightbox({ img, isOpen, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!isOpen || !img) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      aria-label="close image"
      role="button"
    >
      <img
        src={img.imageUrl}
        alt={img.description}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}
