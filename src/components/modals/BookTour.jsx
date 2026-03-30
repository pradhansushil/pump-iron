import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";

import { submitTourRequest } from "../../services/booking/tourService";
import {
  cancelBtn,
  ctaButton,
  errorMessage,
  formField,
  formInput,
  formLabel,
  h1Style,
  modalBox,
  modalButtons,
  modalOverlay,
} from "../../utils/styles";

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

  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      modalRef.current?.focus();
    }
  }, [isOpen]);

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
    e.persist();
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
    <div className={modalOverlay} onClick={handleClose}>
      <div
        className={modalBox}
        ref={modalRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="modal-title" className={`${h1Style} text-center mb-2`}>
          Book a Tour
        </h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className={formField}>
            {errors.name && (
              <p className={errorMessage} id="name-error" role="alert">
                {errors.name}
              </p>
            )}
            <label htmlFor="name" className={formLabel}>
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              className={formInput}
              name="name"
              required
              aria-describedby={errors.name ? "name-error" : undefined}
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
            />
          </div>

          <div className={formField}>
            {errors.email && (
              <p className={errorMessage} id="email-error" role="alert">
                {errors.email}
              </p>
            )}
            <label htmlFor="email" className={formLabel}>
              Email *
            </label>
            <input
              type="email"
              id="email"
              className={formInput}
              name="email"
              required
              aria-describedby={errors.email ? "email-error" : undefined}
              value={formData.email}
              onChange={handleChange}
              placeholder="johndoe@example.com"
            />
          </div>

          <div className={formField}>
            {errors.phone && (
              <p className={errorMessage} id="phone-error" role="alert">
                {errors.phone}
              </p>
            )}
            <label htmlFor="phone" className={formLabel}>
              Phone # *
            </label>
            <input
              type="text"
              id="phone"
              className={formInput}
              name="phone"
              required
              aria-describedby={errors.phone ? "phone-error" : undefined}
              value={formData.phone}
              onChange={handleChange}
              placeholder="1023456789"
            />
          </div>

          <div className={modalButtons}>
            <button type="button" className={cancelBtn} onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className={ctaButton}>
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
