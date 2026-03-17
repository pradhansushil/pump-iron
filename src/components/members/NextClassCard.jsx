export default function NextClassCard({ nextClass }) {
  return (
    <div className="dashboard-card">
      <section aria-labelledby="next-class-heading">
        <h2 id="next-class-heading">Next Class</h2>
        {nextClass ? (
          <div className="next-class-details">
            <p>{nextClass.className}</p>
            <p>
              {nextClass.dateTime.toDate().toLocaleString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </p>
            <p>Instructor: {nextClass.instructor}</p>
          </div>
        ) : (
          <p>No upcoming classes scheduled</p>
        )}
      </section>
    </div>
  );
}
