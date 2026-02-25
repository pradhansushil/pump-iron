import { useState, useEffect } from "react";

import { getAllMembers, deleteMember } from "../services/db";
import LoadingSpinner from "../components/LoadingSpinner";
import { formatDate } from "../utils/formatters";
import CreateMemberModal from "../components/CreateMemberModal";
import RecordPaymentModal from "../components/RecordPaymentModal";
import toast from "react-hot-toast";

export default function AdminMembers() {
  const [members, setMembers] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchAllMembers = async () => {
    try {
      const allMembers = await getAllMembers();
      setMembers(allMembers);
    } catch (error) {
      console.error("Error: ", error);
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

  const handleDelete = async (selectedMember) => {
    try {
      await deleteMember(selectedMember.id);
      await fetchAllMembers();
      toast.success(`Successfully deleted ${selectedMember.name}`);
    } catch (error) {
      toast.error(`Couldn't delete member: ${error.message}`);
    }
  };

  if (loading) return <LoadingSpinner message="Loading Members" />;

  if (members.length === 0) return <p>No members have signed up yet.</p>;

  return (
    <div>
      <div>
        <input
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <label htmlFor="filters">Filters: </label>
        <select
          id="filters"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {!isModalOpen && (
        <button onClick={() => setIsModalOpen(true)}>Create Member</button>
      )}

      {isModalOpen && (
        <CreateMemberModal
          onClose={() => setIsModalOpen(false)}
          fetchMembers={fetchAllMembers}
        />
      )}

      {fetchedMembers.length !== 0 ? (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Plan</th>
              <th>Join Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {fetchedMembers.map((member) => (
              <tr key={member.id}>
                <td>{member.name}</td>
                <td>{member.email}</td>
                <td>{member.phone}</td>
                <td>{member.membershipPlan}</td>
                <td>{formatDate(member.joinDate)}</td>
                <td>{member.status}</td>
                <td>
                  <button onClick={() => setSelectedMember(member)}>
                    Record Payment
                  </button>
                  <button onClick={() => handleDelete(member)}>Delete</button>
                  <button>Suspend</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No members match your search</p>
      )}
      {selectedMember && (
        <RecordPaymentModal
          member={selectedMember}
          fetchMembers={fetchAllMembers}
          onClose={() => setSelectedMember(null)}
        />
      )}
    </div>
  );
}
