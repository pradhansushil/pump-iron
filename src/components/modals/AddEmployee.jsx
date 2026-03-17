import { useEffect, useRef, useState } from "react";
import { addEmployee } from "../../services/employeesData";
import toast from "react-hot-toast";
import LoadingSpinner from "../LoadingSpinner";

export default function AddEmployeeModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    specialization: "",
    img: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscKey);
    return () => document.removeEventListener("keydown", handleEscKey);
  }, [onClose]);

  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      modalRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (
      formData.name === "" ||
      formData.bio === "" ||
      formData.specialization === "" ||
      formData.img === ""
    ) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      await addEmployee(formData);
      toast.success("Employee added successfully!");
      onSuccess();
      handleClose();
    } catch {
      setError("Something went wrong. Please try again");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleClose = () => {
    setFormData({ name: "", bio: "", specialization: "", img: "" });
    setError(null);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className="modal-box"
        ref={modalRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="modal-title">Add Employee</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            {error && (
              <p className="field-error" role="alert">
                {error}
              </p>
            )}
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label htmlFor="specialization">Position</label>
            <input
              type="text"
              id="specialization"
              name="specialization"
              required
              value={formData.specialization}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label htmlFor="img">Image URL</label>
            <input
              type="text"
              id="img"
              name="img"
              required
              value={formData.img}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
            />
          </div>

          <div className="modal-buttons">
            <button type="button" className="cancel-btn" onClick={handleClose}>
              Cancel
            </button>
            <button className="submit-btn" type="submit" disabled={loading}>
              {loading ? "Adding Employee..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
