import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTriangleExclamation,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

import { getAllMembers, deleteMember, updateMember } from "../../services/db";
import { formatDate } from "../../utils/formatters";
import LoadingSpinner from "../../components/LoadingSpinner";
import CreateMemberModal from "../../components/modals/CreateMemberModal";
import RecordPaymentModal from "../../components/modals/RecordPaymentModal";
import ConfirmModal from "../../components/modals/ConfirmModal";
import {
  containerStyle,
  ctaButton,
  errorBanner,
  h1Style,
  marginBottom,
  textColor,
  textColorWhite,
  textSizeSmall,
} from "../../utils/styles";

export default function AdminMembers() {
  const [members, setMembers] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllMembers = async () => {
    try {
      const allMembers = await getAllMembers();
      setMembers(allMembers);
    } catch {
      setError("Failed to load members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllMembers();
  }, []);

  const fetchedMembers = members.filter((member) => {
    const matchesSearch =
      searchTerm === "" ||
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "" ||
      filterStatus === "all" ||
      member.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const handleDelete = async () => {
    try {
      await deleteMember(memberToDelete.id);
      await fetchAllMembers();
      toast.success(`Successfully deleted ${memberToDelete.name}`);
    } catch (error) {
      toast.error(`Couldn't delete member: ${error.message}`);
    } finally {
      setMemberToDelete(null);
    }
  };

  const handleSuspend = async (member) => {
    const newStatus = member.status === "suspended" ? "active" : "suspended";
    const result = await updateMember(member.id, { status: newStatus });

    if (!result.success) {
      toast.error("Couldn't update member status.");
      return;
    }

    await fetchAllMembers();
    toast.success(
      newStatus === "suspended"
        ? "Member successfully suspended."
        : "Member successfully unsuspended.",
    );
  };

  if (loading) return <LoadingSpinner message="Loading Members" />;
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
  if (members.length === 0)
    return (
      <main className={containerStyle}>
        <p className="text-center text-gray-400 py-12 text-sm">
          No members have signed up yet.
        </p>
      </main>
    );

  return (
    <main aria-labelledby="admin-members-heading" className={containerStyle}>
      <h1
        id="admin-members-heading"
        className={`${h1Style} text-center ${marginBottom}`}
      >
        Members
      </h1>

      {/* UPDATED TOOLBAR */}
      <div className={`flex items-center justify-between ${marginBottom}`}>
        {/* LEFT WRAPPER */}
        <div className="flex gap-3">
          {/* SEARCH PAIR */}
          <div className="flex items-center gap-2">
            <label htmlFor="member-search" className="sr-only">
              Search members:
            </label>
            <input
              id="member-search"
              className="px-4 py-2 w-64 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              type="search"
              placeholder="Search by name or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* FILTER PAIR */}
          <div className="flex items-center gap-2">
            <label htmlFor="filters" className="sr-only">
              Filters:
            </label>
            <select
              id="filters"
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>

        {/* CONSOLIDATED CREATE MEMBER BUTTON */}
        <button className={ctaButton} onClick={() => setIsModalOpen(true)}>
          Create Member
        </button>
      </div>

      {/* MODAL COMPONENT */}
      {isModalOpen && (
        <CreateMemberModal
          onClose={() => setIsModalOpen(false)}
          fetchMembers={fetchAllMembers}
        />
      )}

      {fetchedMembers.length !== 0 ? (
        /* WRAPPER FOR HORIZONTAL SCROLL */
        <div className="w-full overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={textColor}>
                <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                  Phone Number
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                  Join Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {fetchedMembers.map((member) => (
                <tr
                  key={member.id}
                  className="odd:bg-gray-800 even:bg-gray-700 text-white"
                >
                  <td className="px-4 py-3 text-sm">{member.name}</td>
                  <td className="px-4 py-3 text-sm">{member.email}</td>
                  <td className="px-4 py-3 text-sm">{member.phone}</td>
                  <td className="px-4 py-3 text-sm">{member.membershipPlan}</td>
                  <td className="px-4 py-3 text-sm">
                    {formatDate(member.joinDate)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${textColorWhite} ${
                        member.status === "active"
                          ? "bg-green-600"
                          : member.status === "suspended"
                            ? "bg-yellow-500"
                            : "bg-gray-500"
                      }`}
                    >
                      {member.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex items-center gap-2">
                    <button
                      aria-label={`record payment for ${member.name}`}
                      className={`bg-blue-500 ${textColorWhite} px-3 py-1 rounded-md text-xs hover:bg-blue-600 transition-colors duration-200`}
                      onClick={() => setSelectedMember(member)}
                    >
                      Record Payment
                    </button>
                    <button
                      aria-label={`delete ${member.name}`}
                      className={`bg-red-600 ${textColorWhite} px-3 py-1 rounded-md text-xs hover:bg-red-700 transition-colors duration-200`}
                      onClick={() => setMemberToDelete(member)}
                    >
                      Delete
                    </button>
                    <button
                      aria-label={`${
                        member.status === "suspended" ? "Unsuspend" : "Suspend"
                      } ${member.name}`}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md text-xs transition-colors duration-200"
                      onClick={() => handleSuspend(member)}
                    >
                      {member.status === "suspended" ? "Unsuspend" : "Suspend"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-400 py-12 text-sm">
          No members match your search
        </p>
      )}

      {selectedMember && (
        <RecordPaymentModal
          member={selectedMember}
          fetchMembers={fetchAllMembers}
          onClose={() => setSelectedMember(null)}
        />
      )}

      <ConfirmModal
        isOpen={!!memberToDelete}
        onClose={() => setMemberToDelete(null)}
        onConfirm={handleDelete}
        message="Are you sure you want to delete this member? This action cannot be undone."
      />
    </main>
  );
}
