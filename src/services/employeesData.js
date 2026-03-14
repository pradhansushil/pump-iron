import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";
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

export const deleteEmployee = async (id) => {
  try {
    const employeeRef = doc(db, "employees", id);
    await deleteDoc(employeeRef);
    return { success: true, employeeId: id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const addEmployee = async (data) => {
  try {
    await addDoc(collection(db, "employees"), data);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
