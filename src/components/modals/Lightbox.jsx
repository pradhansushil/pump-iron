import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { modalOverlay } from "../../utils/styles";

export default function Lightbox({
  images,
  selectedIndex,
  setSelectedIndex,
  isOpen,
  onClose,
}) {
  const img = images[selectedIndex];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && selectedIndex > 0)
        setSelectedIndex((i) => i - 1);
      if (e.key === "ArrowRight" && selectedIndex < images.length - 1)
        setSelectedIndex((i) => i + 1);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, selectedIndex, images.length, setSelectedIndex]);

  if (!isOpen || !img) return null;

  return (
    <div
      className={modalOverlay}
      onClick={onClose}
      aria-label="close image"
      role="button"
    >
      <div className="relative" onClick={(e) => e.stopPropagation()}>
        <img
          src={img.imageUrl}
          alt={img.description}
          className="max-h-[80vh] max-w-[70vw] object-contain rounded-xl"
        />

        <button
          onClick={() => setSelectedIndex((i) => i - 1)}
          disabled={selectedIndex === 0}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-14 h-14 flex items-center justify-center rounded-full border border-gray-500 bg-black/70 hover:bg-blue-500 hover:border-blue-500 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Previous image"
        >
          <FontAwesomeIcon
            icon={faChevronLeft}
            className="text-white text-2xl"
          />
        </button>

        <button
          onClick={() => setSelectedIndex((i) => i + 1)}
          disabled={selectedIndex === images.length - 1}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-14 h-14 flex items-center justify-center rounded-full border border-gray-500 bg-black/70 hover:bg-blue-500 hover:border-blue-500 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Next image"
        >
          <FontAwesomeIcon
            icon={faChevronRight}
            className="text-white text-2xl"
          />
        </button>
      </div>
    </div>
  );
}
