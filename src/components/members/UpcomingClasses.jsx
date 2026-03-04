import { formatDate } from "../../utils/formatters";

export default function UpcomingClasses({
  onClasses,
  bookings,
  handleViewDetails,
  onCancel,
}) {
  return (
    <div className="upcoming-classes">
      <h2>Upcoming Classes</h2>
      {bookings.length >= 1 ? (
        <div className="bookings-list">
          {bookings.map((booking) => (
            <div className="booking-card" key={booking.id}>
              <div>
                <h3>{booking.className}</h3>
              </div>
              <div>
                <p>
                  {booking.instructor} | {formatDate(booking.dateTime)}
                </p>
              </div>
              <div className="booking-actions">
                <button onClick={() => handleViewDetails(booking.classId)}>
                  View Details
                </button>
                <button onClick={() => onCancel(booking.id)}>Cancel</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-bookings">
          <p>No classes booked yet</p>
          <p>
            Ready to get started? Browse our classes and book your favorites!
          </p>
          <button onClick={onClasses}>Explore Schedule</button>
        </div>
      )}
    </div>
  );
}
