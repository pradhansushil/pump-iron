import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

import { plans } from "../data/plansData";
import { createMember } from "../services/db";

export default function CreateMemberModal({ onClose, fetchMembers }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [membershipPlan, setMembershipPlan] = useState("basic");
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);

  const { adminCreateUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (name === "") {
      return setError({ name: "Please provide the member's name" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return setError({ email: "Please enter a valid email address" });
    }

    if (phone.length < 10) {
      return setError({ phone: "Please enter a valid phone number" });
    }

    if (password === "") {
      return setError({ password: "Please enter a valid password" });
    } else if (password.length < 6) {
      return setError({ password: "Password must be at least 6 characters" });
    }

    try {
      setError({});
      setLoading(true);

      const userCredential = await adminCreateUser(email, password, "member");
      const uid = userCredential.user.uid;

      const memberData = { name, email, phone, membershipPlan };

      const result = await createMember(uid, memberData);

      toast.success("Member created successfully");

      if (!result.success) {
        throw new Error(result.error || "Failed to create member profile");
      }

      fetchMembers();
      onClose();
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError({ email: "This email is already registered." });
      } else {
        setError({ general: err.message });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="member-form-container">
      <form onSubmit={handleSubmit} noValidate>
        {error.general && <p className="form-error">{error.general}</p>}

        <div className="form-field">
          {error.name && <p className="field-error">{error.name}</p>}
          <label htmlFor="name">Full Name *</label>
          <input
            type="text"
            id="name"
            required
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError((prev) => ({ ...prev, name: undefined }));
            }}
            placeholder="John Doe"
          />
        </div>

        <div className="form-field">
          {error.email && <p className="field-error">{error.email}</p>}
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError((prev) => ({ ...prev, email: undefined }));
            }}
            placeholder="john@example.com"
          />
        </div>

        <div className="form-field">
          {error.phone && <p className="field-error">{error.phone}</p>}
          <label htmlFor="phone">Phone Number *</label>
          <input
            type="tel"
            id="phone"
            required
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              setError((prev) => ({ ...prev, phone: undefined }));
            }}
            placeholder="1234567890"
          />
        </div>

        <div className="form-field">
          <label htmlFor="membershipPlan">Membership Plan *</label>
          <select
            id="membershipPlan"
            required
            value={membershipPlan}
            onChange={(e) => setMembershipPlan(e.target.value)}
          >
            {plans.map((plan) => (
              <option key={plan.name} value={plan.name.toLowerCase()}>
                {plan.name} - {plan.price}/month
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          {error.password && <p className="field-error">{error.password}</p>}
          <label htmlFor="password">Password *</label>
          <input
            type="password"
            id="password"
            required
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError((prev) => ({ ...prev, password: undefined }));
            }}
            placeholder="At least 6 characters"
          />
        </div>

        <div className="form-buttons">
          <button
            className="cancel-btn"
            onClick={() => onClose()}
            disabled={loading}
          >
            Cancel
          </button>
          <button className="submit-btn" type="submit" disabled={loading}>
            {loading ? "Creating Member..." : "Save Member"}
          </button>
        </div>
      </form>
    </div>
  );
}
