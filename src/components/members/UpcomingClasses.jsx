import { useState } from "react";
import { formatDate } from "../../utils/formatters";
import {
  cardStyle,
  h2Heading,
  h3Heading,
  subText,
  marginBottomSm,
  ctaButton,
  dangerButton,
} from "../../utils/styles";

export default function UpcomingClasses({
  onClasses,
  bookings,
  handleViewDetails,
  onCancel,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const visibleBookings = isExpanded ? bookings : bookings.slice(0, 2);

  const getGridColumns = () => {
    const count = visibleBookings.length;
    if (count === 1) return "md:grid-cols-1";
    if (count === 2) return "md:grid-cols-2";
    return "md:grid-cols-3";
  };

  return (
    <div>
      <h2 className={`${h2Heading} ${marginBottomSm}`}>Upcoming Classes</h2>

      {bookings.length >= 1 ? (
        <>
          <div className={`grid grid-cols-1 gap-6 ${getGridColumns()}`}>
            {visibleBookings.map((booking) => (
              <div className={`${cardStyle} w-full`} key={booking.id}>
                <h3 className={h3Heading}>{booking.className}</h3>
                <p className={subText}>
                  {booking.instructor} | {formatDate(booking.dateTime)}
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => handleViewDetails(booking.classId)}
                    className={`flex-1 ${ctaButton}`}
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => onCancel(booking.id)}
                    className={`flex-1 ${dangerButton}`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>

          {bookings.length > 2 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-6 w-full py-2 text-blue-400 hover:text-blue-300 text-sm font-medium"
            >
              {isExpanded ? "Show less" : "View all bookings"}
            </button>
          )}
        </>
      ) : (
        <div className="text-center py-10 bg-gray-800/50 rounded-xl border border-dashed border-gray-700">
          <p className="text-gray-300 text-lg font-medium">
            No classes booked yet
          </p>
          <p className="text-gray-500 text-sm mt-2 mb-6">
            Ready to get started? Browse our classes and book your favorites!
          </p>
          <button onClick={onClasses} className={ctaButton}>
            Explore Schedule
          </button>
        </div>
      )}
    </div>
  );
}
