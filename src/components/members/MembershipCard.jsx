export default function MembershipCard({ membershipPlan, status }) {
  return (
    <div className="dashboard-card">
      <section aria-labelledby="membership-header">
        <h2 id="membership-header">Membership Status</h2>
        <p>{membershipPlan}</p>
        <span className="status-badge">{status}</span>
      </section>
    </div>
  );
}
