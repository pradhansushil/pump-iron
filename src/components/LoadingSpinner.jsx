export default function LoadingSpinner({ message = "Loading your data..." }) {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
      <p className="spinner-message">{message}</p>
    </div>
  );
}
