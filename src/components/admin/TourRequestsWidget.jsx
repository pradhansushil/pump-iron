import { Link } from "react-router-dom";
import { TOUR_STATUS } from "../../utils/constants";

export default function TourRequestsWidget({ tourRequests }) {
  const totalPendingRequests = tourRequests.filter(
    (request) => request.status === TOUR_STATUS.PENDING,
  );
  return (
    <div className="">
      <h2>Tour Requests</h2>
      <p>
        <span>Pending Total: </span>
        {totalPendingRequests.length}
      </p>
      {tourRequests.slice(0, 3).map((request) => (
        <div className="" key={request.id}>
          <p>
            <span>Name: </span>
            {request.name}
          </p>
          <p>
            <span>Email: </span>
            {request.email}
          </p>
          <p>
            <span>Phone Number: </span>
            {request.phone}
          </p>
          <p>
            <span>Status: </span>
            {request.status}
          </p>
        </div>
      ))}
      <Link to="/admin/tourRequests">View All </Link>
    </div>
  );
}
