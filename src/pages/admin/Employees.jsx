import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import { deleteEmployee, fetchEmployees } from "../../services/employeesData";
import AddEmployeeModal from "../../components/modals/AddEmployee";
import ConfirmModal from "../../components/modals/ConfirmModal";
import LoadingSpinner from "../../components/LoadingSpinner";
import {
  containerStyle,
  ctaButton,
  h1Style,
  marginBottom,
  textColor,
  textColorWhite,
} from "../../utils/styles";

export default function EmployeesTable() {
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [confirmModal, setConfirmModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expandedBios, setExpandedBios] = useState({});

  const fetchAllEmployees = async () => {
    try {
      const allEmployees = await fetchEmployees();
      setEmployees(allEmployees);
    } catch {
      toast.error("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadEmployees = async () => {
      await fetchAllEmployees();
    };

    loadEmployees();
  }, []);

  const handleDeleteClick = (id, name) => {
    setEmployeeToDelete({ id, name });
    setConfirmModal(true);
  };

  const handleDelete = async (id, name) => {
    try {
      await deleteEmployee(id);
      await fetchAllEmployees();
      setConfirmModal(false);
      toast.success(`${name} deleted successfully`);
    } catch {
      toast.error(`Failed to delete ${name}`);
    }
  };

  const toggleBio = (id) => {
    setExpandedBios((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading) return <LoadingSpinner />;

  return (
    <main aria-labelledby="employees-heading" className={containerStyle}>
      <h1
        id="employees-heading"
        className={`${h1Style} text-center ${marginBottom}`}
      >
        Employees
      </h1>

      <div className={`flex justify-end ${marginBottom}`}>
        <button className={ctaButton} onClick={() => setIsModalOpen(true)}>
          Add Employee
        </button>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={textColor}>
              <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                Bio
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                Position
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr
                key={emp.id}
                className="odd:bg-gray-800 even:bg-gray-700 text-white"
              >
                <td className="px-4 py-3 text-sm">{emp.name}</td>
                <td className="px-4 py-3 text-sm max-w-xs">
                  {emp.bio?.length > 60 && !expandedBios[emp.id] ? (
                    <p className="text-sm leading-snug break-words">
                      <span className="line-clamp-1">{emp.bio}</span>
                      <button
                        onClick={() => toggleBio(emp.id)}
                        className="text-xs text-gray-400 hover:text-white transition-colors duration-150 whitespace-nowrap"
                      >
                        Read more
                      </button>
                    </p>
                  ) : (
                    <p className="text-sm leading-snug break-words">
                      {emp.bio}
                      {emp.bio?.length > 60 && (
                        <button
                          onClick={() => toggleBio(emp.id)}
                          className="block mt-1 text-xs text-gray-400 hover:text-white transition-colors duration-150 whitespace-nowrap"
                        >
                          Read less
                        </button>
                      )}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3 text-sm">{emp.specialization}</td>
                <td className="px-4 py-3 text-sm">
                  <button
                    onClick={() => handleDeleteClick(emp.id, emp.name)}
                    aria-label={`delete ${emp.name}`}
                    className={`bg-red-600 ${textColorWhite} px-3 py-1 rounded-md text-xs hover:bg-red-700 transition-colors duration-200`}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddEmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchAllEmployees}
      />

      <ConfirmModal
        isOpen={confirmModal}
        onClose={() => setConfirmModal(false)}
        onConfirm={() =>
          employeeToDelete &&
          handleDelete(employeeToDelete.id, employeeToDelete.name)
        }
        message={`Are you sure you want to delete ${employeeToDelete?.name}?`}
      />
    </main>
  );
}
