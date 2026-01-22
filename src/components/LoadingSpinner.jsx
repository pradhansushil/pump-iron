export default function LoadingSpinner({ message = "Loading your data..." }) {
  return (
    <div>
      <div></div>
      <p>{message}</p>
    </div>
  );
}
