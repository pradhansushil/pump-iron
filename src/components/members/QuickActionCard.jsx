export default function QuickActionCard({ onBookClass }) {
  return (
    <div className="dashboard-card">
      <section aria-labelledby="quick-action-header">
        <h2 id="quick-action-header">Quick Action</h2>
        <button onClick={onBookClass}>Book a Class</button>
      </section>
    </div>
  );
}
