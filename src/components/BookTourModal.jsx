import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import { submitTourRequest } from "../services/bookTourService";

export default function BookTourModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscKey);
    return () => document.removeEventListener("keydown", handleEscKey);
  }, [onClose]);

  if (!isOpen) return null;

  const validate = () => {
    if (formData.name.trim() === "") {
      return { name: "Please provide the member's name" };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return { email: "Please enter a valid email address" };
    }

    if (formData.phone.length < 10) {
      return { phone: "Please enter a valid phone number" };
    }

    return {};
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = validate();
    setErrors(result);

    if (Object.keys(result).length === 0) {
      try {
        await submitTourRequest(formData);
        toast.success(
          "Successfully sent! We will contact you within one to two business days.",
          { duration: 6000 },
        );

        onClose();
        setFormData({ name: "", email: "", phone: "" });
      } catch {
        toast.error(
          "Something went wrong. Please try again or contact us directly",
        );
      }
    }
  };

  const handleClose = () => {
    setFormData({ name: "", email: "", phone: "" });
    setErrors({});
    onClose();
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            {errors.name && <p className="field-error">{errors.name}</p>}
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
            />
          </div>

          <div className="form-field">
            {errors.email && <p className="field-error">{errors.email}</p>}
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="johndoe@example.com"
            />
          </div>

          <div className="form-field">
            {errors.phone && <p className="field-error">{errors.phone}</p>}
            <label htmlFor="phone">Phone # *</label>
            <input
              type="text"
              id="phone"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="1023456789"
            />
          </div>

          <div className="form-buttons">
            <button type="button" className="cancel-btn" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
