import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import { deleteEmployee, fetchEmployees } from "../../services/employeesData";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
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

  const handleDelete = async (id, name) => {
    try {
      await deleteEmployee(id);
      await fetchAllEmployees();
      toast.success(`${name} deleted successfully`);
    } catch {
      toast.error(`Failed to delete ${name}`);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <main aria-labelledby="employees-heading">
      <h2 id="employees-heading">Employees</h2>
      <div className="">
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
                  <button onClick={() => handleDelete(emp.id, emp.name)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
