import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import { deleteEmployee, fetchEmployees } from "../../services/employeesData";
import AddEmployeeModal from "../../components/modals/AddEmployee";
import ConfirmModal from "../../components/modals/ConfirmModal";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function EmployeesTable() {
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [confirmModal, setConfirmModal] = useState(false);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <LoadingSpinner />;

  return (
    <main aria-labelledby="employees-heading">
      <h1 id="employees-heading">Employees</h1>
      <div className="">
        <button onClick={() => setIsModalOpen(true)}>Add Employee</button>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Bio</th>
              <th>Position</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id}>
                <td>{emp.name}</td>
                <td>{emp.bio}</td>
                <td>{emp.specialization}</td>
                <td>
                  <button
                    onClick={() => handleDeleteClick(emp.id, emp.name)}
                    aria-label={`delete ${emp.name}`}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <AddEmployeeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchAllEmployees}
        />

        <ConfirmModal
          isOpen={confirmModal}
          onClose={() => setConfirmModal(false)}
          onConfirm={() =>
            employeeToDelete && handleDelete(employeeToDelete.id, employeeToDelete.name)
          }
          message={`Are you sure you want to delete ${employeeToDelete?.name}?`}
        />
      </div>
    </main>
  );
}
