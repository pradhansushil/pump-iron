import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export const fetchEmployees = async () => {
  const employeesRef = collection(db, "employees");
  const snapshot = await getDocs(employeesRef);

  const employees = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return employees;
};
