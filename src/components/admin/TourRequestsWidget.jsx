import { Link } from "react-router-dom";
import {
  cardStyle,
  h2Heading,
  marginBottomSm,
  textColor,
  textColorWhite,
  textSizeSmall,
  ctaButton,
} from "../../utils/styles";

export default function TourRequestsWidget({ tourRequests }) {
  const displayRequests = tourRequests.slice(0, 2);

  return (
    <div className="col-span-3 mt-4">
      <h2 className={`${h2Heading} mb-4`}>Recent Tour Requests</h2>
      <div className="flex flex-wrap gap-6">
        {displayRequests.map((request) => (
          <div key={request.id} className={`${cardStyle} w-full max-w-[280px]`}>
            <div className={marginBottomSm}>
              <p className={`${textSizeSmall} ${textColorWhite}`}>
                <span className={textColor}>Name: </span>
                {request.name}
              </p>
              <p className={`${textSizeSmall} ${textColorWhite}`}>
                <span className={textColor}>Email: </span>
                {request.email}
              </p>
              <p className={`${textSizeSmall} ${textColorWhite}`}>
                <span className={textColor}>Phone: </span>
                {request.phone}
              </p>
              <p className="mt-3">
                <span className="bg-gray-700 text-[10px] uppercase tracking-wider px-2 py-1 rounded text-white font-semibold">
                  {request.status}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <Link to="/admin/tourRequests" className={ctaButton}>
          View All Tour Requests
        </Link>
      </div>
    </div>
  );
}
