import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import EmployeeCard from "../components/EmployeeCard";
import { fetchEmployees } from "../services/employeesData";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const data = await fetchEmployees();
        setEmployees(data);
      } catch {
        toast.error("Failed to load employees");
      } finally {
        setLoading(false);
      }
    };

    loadEmployees();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <main aria-labelledby="employees">
      <h2 id="employees">Our Family</h2>
      <ul>
        {employees.map((e) => (
          <EmployeeCard
            key={e.id}
            img={e.img}
            name={e.name}
            specialization={e.specialization}
            bio={e.bio}
          />
        ))}
      </ul>
    </main>
  );
}
