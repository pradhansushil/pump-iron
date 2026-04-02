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
  dangerButton,
  cancelBtn,
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
    fetchAllEmployees();
  }, []);

  const handleEditClick = (employee) => {
    console.log("Edit employee:", employee);
  };

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

      {employees.length >= 1 ? (
        <>
          <div className={`flex justify-end ${marginBottom}`}>
            <button className={ctaButton} onClick={() => setIsModalOpen(true)}>
              Add Employee
            </button>
          </div>

          <div className="w-full overflow-x-auto rounded-lg border border-gray-600 shadow-xl">
            <table className="w-full border-collapse">
              <thead>
                <tr
                  className={`${textColor} bg-gray-900 border-b-2 border-gray-500`}
                >
                  <th className="w-40 px-6 py-4 text-left text-xs font-bold uppercase tracking-widest">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest">
                    Bio
                  </th>
                  <th className="w-48 px-6 py-4 text-center text-xs font-bold uppercase tracking-widest">
                    Position
                  </th>
                  <th className="w-40 px-6 py-4 text-center text-xs font-bold uppercase tracking-widest">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => {
                  const isExpanded = expandedBios[emp.id];
                  const hasLongBio = emp.bio?.length > 60;

                  return (
                    <tr
                      key={emp.id}
                      className="odd:bg-gray-800 even:bg-gray-700 text-white"
                    >
                      <td className="px-6 py-4 text-sm font-semibold border-r border-gray-600 whitespace-nowrap">
                        {emp.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-200 border-r border-gray-600">
                        <p
                          className={`leading-relaxed break-words ${
                            !isExpanded ? "line-clamp-1" : ""
                          }`}
                        >
                          {emp.bio}
                        </p>
                        {hasLongBio && (
                          <button
                            onClick={() => toggleBio(emp.id)}
                            className="mt-1 text-[10px] uppercase font-bold tracking-tight text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            {isExpanded ? "Read Less" : "Read More"}
                          </button>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-center text-gray-300 border-r border-gray-600 whitespace-nowrap">
                        {emp.specialization}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEditClick(emp)}
                            aria-label={`edit ${emp.name}`}
                            className={`${cancelBtn} text-xs py-1 px-3 uppercase font-semibold`}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClick(emp.id, emp.name)}
                            aria-label={`delete ${emp.name}`}
                            className={`${dangerButton} text-xs py-1 px-3 uppercase font-semibold`}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center gap-4 py-12">
          <p className="text-gray-400 text-sm">
            No employees in the directory yet.
          </p>
          <button className={ctaButton} onClick={() => setIsModalOpen(true)}>
            Add Employee
          </button>
        </div>
      )}

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
