import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTriangleExclamation,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";

import {
  getAllTourRequests,
  updateTourStatus,
} from "../../services/booking/tourService";
import LoadingSpinner from "../../components/LoadingSpinner";
import { TOUR_STATUS } from "../../utils/constants";
import {
  containerStyle,
  errorBanner,
  h1Style,
  marginBottom,
  textColor,
  textSizeSmall,
} from "../../utils/styles";

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
      <main className={containerStyle}>
        <div className={`${errorBanner} bg-red-600`} role="alert">
          <FontAwesomeIcon icon={faTriangleExclamation} />
          <p>{error}</p>
          <button
            className={`${textSizeSmall} hover:bg-red-700`}
            onClick={() => {
              setError(null);
              window.location.reload();
            }}
          >
            Try again
          </button>
          <button
            aria-label="Dismiss error"
            className="hover:bg-red-700"
            onClick={() => setError(null)}
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
      </main>
    );

  return (
    <main aria-labelledby="tour-requests-heading" className={containerStyle}>
      <h1
        id="tour-requests-heading"
        className={`${h1Style} ${marginBottom} text-center`}
      >
        Tour Requests
      </h1>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {FILTER_OPTIONS.map((f) => (
          <button
            key={f}
            onClick={() => setSelectedFilter(f)}
            aria-pressed={selectedFilter === f}
            className={`px-4 py-1.5 rounded-md border text-sm capitalize transition-colors duration-150
              ${
                selectedFilter === f
                  ? "bg-blue-500 border-blue-500 text-white"
                  : "bg-transparent border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto rounded-lg border border-gray-600 shadow-xl">
        {statusFilter.length === 0 ? (
          <p className="text-center text-gray-400 py-12 text-sm">
            No data found
          </p>
        ) : (
          <table className="w-full">
            <thead>
              <tr
                className={`${textColor} bg-gray-900 border-b-2 border-gray-500`}
              >
                <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-widest">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-widest">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-widest">
                  Phone Number
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-widest">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {statusFilter.map((s) => (
                <tr
                  key={s.id}
                  className="odd:bg-gray-800 even:bg-gray-700 text-white"
                >
                  <td className="px-6 py-4 text-sm border-r border-gray-600">
                    {s.name}
                  </td>
                  <td className="px-6 py-4 text-sm border-r border-gray-600">
                    {s.email}
                  </td>
                  <td className="px-6 py-4 text-sm border-r border-gray-600">
                    {s.phone}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <select
                      value={s.status}
                      onChange={(e) => handleStatusChange(s.id, e.target.value)}
                      className="bg-gray-800 border border-gray-700 text-gray-200 text-sm rounded-md px-3 py-1.5 capitalize cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
