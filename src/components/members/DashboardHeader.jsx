import { h1Style, marginBottom, textColor } from "../../utils/styles";

export default function DashboardHeader({
  isNewUser,
  firstName,
  formattedDate,
}) {
  return (
    <header className={marginBottom}>
      <div className="dashboard-header-content">
        <h1 className={h1Style} id="dashboard-heading">
          {isNewUser ? `Welcome, ${firstName}!` : `Welcome back, ${firstName}!`}
        </h1>
        <p className={textColor}>{formattedDate}</p>
      </div>
    </header>
  );
}
