import { useState, useEffect } from "react";

import { getAllMembers } from "../services/db";
import LoadingSpinner from "../components/LoadingSpinner";
import { formatDate } from "../utils/formatters";
import CreateMemberModal from "../components/CreateMemberModal";

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

  if (loading) return <LoadingSpinner message="Loading Members" />;

  if (members.length === 0) return <p>No members have signed up yet.</p>;

  if (fetchedMembers.length === 0) return <p>No members match your search</p>;

  return (
    <div>
      {!isModalOpen && (
        <button onClick={() => setIsModalOpen(true)}>Create Member</button>
      )}

      {isModalOpen && (
        <CreateMemberModal
          onClose={() => setIsModalOpen(false)}
          fetchMembers={fetchAllMembers}
        />
      )}

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
                <button>Delete</button>
                <button>Suspend</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedMember && <RecordPaymentModal />}
    </div>
  );
}
