import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import {
  getAllTourRequests,
  updateTourStatus,
} from "../../services/booking/tourService";
import LoadingSpinner from "../../components/LoadingSpinner";
import { TOUR_STATUS } from "../../utils/constants";

const FILTER_OPTIONS = ["all", ...Object.values(TOUR_STATUS)];

export default function TourRequests() {
  const [tourRequests, setTourRequests] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTourRequests = async () => {
      try {
        const requests = await getAllTourRequests();
        setTourRequests(requests);
      } catch {
        setError("Failed to load tour requests. Please try again");
      } finally {
        setLoading(false);
      }
    };

    fetchTourRequests();
  }, []);

  const statusFilter = tourRequests.filter((request) => {
    if (selectedFilter === "all") return true;
    return request.status === selectedFilter;
  });

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateTourStatus(id, newStatus);
      setTourRequests((prev) =>
        prev.map((request) =>
          request.id === id ? { ...request, status: newStatus } : request,
        ),
      );
      toast.success("Tour status updated successfully");
    } catch {
      toast.error("Failed to update tour status. Please try again");
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <p className="error-message" role="alert">
        {error}
      </p>
    );

  return (
    <main aria-labelledby="tour-requests-heading">
      <h1 id="tour-requests-heading">Tour Requests</h1>
      <div className="">
        {FILTER_OPTIONS.map((f) => (
          <button
            key={f}
            onClick={() => setSelectedFilter(f)}
            aria-pressed={selectedFilter === f}
          >
            {f}
          </button>
        ))}
      </div>
      <div className="">
        {statusFilter.length === 0 ? (
          <p>No data found</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {statusFilter.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.email}</td>
                  <td>{s.phone}</td>
                  <td>
                    <select
                      value={s.status}
                      onChange={(e) => handleStatusChange(s.id, e.target.value)}
                    >
                      {Object.values(TOUR_STATUS).map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
