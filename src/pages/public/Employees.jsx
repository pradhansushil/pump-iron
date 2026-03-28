import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import EmployeeCard from "../../components/EmployeeCard";
import { fetchEmployees } from "../../services/employeesData";
import LoadingSpinner from "../../components/LoadingSpinner";
import { containerStyle, h1Style, marginBottom } from "../../utils/styles";

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
    <main aria-labelledby="employees-heading" className="employees-page">
      <div className={containerStyle}>
        <h1 id="employees-heading" className={`${h1Style} ${marginBottom} text-center`}>
          Meet Our Family
        </h1>
        <ul className="grid grid-cols-3 gap-6">
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
      </div>
    </main>
  );
}
