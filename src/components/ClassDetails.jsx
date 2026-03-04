export default function ClassDetails({ isOpen, onClose, classDetails }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h2>{classDetails.name}</h2>
        <p>{classDetails.day}</p>
        <p>{classDetails.time}</p>
        <p>{classDetails.instructor}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
