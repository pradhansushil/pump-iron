import { useEffect, useState } from "react";

import EmployeeCard from "../components/EmployeeCard";
import { fetchEmployees } from "../services/employeesData";

export default function Employees() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const loadEmployees = async () => {
      const data = await fetchEmployees();
      setEmployees(data);
    };

    loadEmployees();
  }, []);

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
