import { h2Heading, cardStyle, textColor } from "../../utils/styles";

export default function NextClassCard({ nextClass }) {
  return (
    <div className="dashboard-card">
      <section className={cardStyle} aria-labelledby="next-class-heading">
        <h2 id="next-class-heading" className={h2Heading}>
          Next Class
        </h2>
        {nextClass ? (
          <div className={`flex flex-col gap-1 ${textColor}`}>
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
          <p className={textColor}>No upcoming classes scheduled</p>
        )}
      </section>
    </div>
  );
}
