import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { createMember } from "../services/db";

export default function CreateMemberModal({ onClose, fetchMembers }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [membershipPlan, setMembershipPlan] = useState("");
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();

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

    if (password.length < 6) {
      return setError({ password: "Password must be at least 6 characters" });
    }

    try {
      setError({});
      setLoading(true);

      const userCredential = await signup(email, password, "member");
      const uid = userCredential.user.uid;

      const memberData = { name, email, phone, membershipPlan };

      const result = await createMember(uid, memberData);

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
    <form onSubmit={handleSubmit} noValidate>
      {error.general && <p>{error.general}</p>}

      <div>
        <label htmlFor="name">Full Name *</label>
        <input
          type="text"
          id="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
        />
        {error.name && <p>{error.name}</p>}
      </div>

      <div>
        <label htmlFor="email">Email *</label>
        <input
          type="email"
          id="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="john@example.com"
        />
        {error.email && <p>{error.email}</p>}
      </div>

      <div>
        <label htmlFor="phone">Phone Number *</label>
        <input
          type="tel"
          id="phone"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="1234567890"
        />
        {error.phone && <p>{error.phone}</p>}
      </div>

      <div>
        <label htmlFor="membershipPlan">Membership Plan *</label>
        <select
          id="membershipPlan"
          required
          value={membershipPlan}
          onChange={(e) => setMembershipPlan(e.target.value)}
        >
          <option value="basic">Basic - $29/month</option>
          <option value="standard">Standard - $49/month</option>
          <option value="premium">Premium - $79/month</option>
        </select>
      </div>

      <div>
        <label htmlFor="password">Password *</label>
        <input
          type="password"
          id="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 6 characters"
        />
        {error.password && <p>{error.password}</p>}
      </div>

      <button onClick={() => onClose()} disabled={loading}>
        Cancel
      </button>
      <button type="submit" disabled={loading}>
        {loading ? "Creating Member..." : "Save Member"}
      </button>
    </form>
  );
}
