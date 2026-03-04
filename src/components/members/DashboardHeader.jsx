export default function DashboardHeader({
  isNewUser,
  firstName,
  formattedDate,
}) {
  return (
    <header className="dashboard-header">
      <div>
        <h1 id="dashboard-heading">
          {isNewUser ? `Welcome, ${firstName}!` : `Welcome back, ${firstName}!`}
        </h1>
        <p>{formattedDate}</p>
      </div>
    </header>
  );
}
