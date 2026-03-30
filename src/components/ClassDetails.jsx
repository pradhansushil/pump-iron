import {
  cancelBtn,
  h2Heading,
  modalOverlay,
  textColor,
  textSizeSmall,
} from "../utils/styles";

export default function ClassDetails({ isOpen, onClose, classDetails }) {
  if (!isOpen) return null;

  return (
    <div className={modalOverlay} onClick={onClose}>
      <div
        className="bg-gray-800 border border-gray-700 p-6 rounded-xl w-96 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <h2 className={`${h2Heading} mb-6`}>{classDetails.name}</h2>
          <p className={`${textColor} ${textSizeSmall} mb-1`}>
            {classDetails.day}
          </p>
          <p className={`${textColor} ${textSizeSmall} mb-1`}>
            {classDetails.time}
          </p>
          <p className={`${textColor} ${textSizeSmall} mb-0`}>
            {classDetails.instructor}
          </p>
        </div>
        <div className="flex justify-end mt-4">
          <button onClick={onClose} className={cancelBtn}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
