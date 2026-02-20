import { useState } from "react";

import { useAuth } from "../context/AuthContext";
import { createMember } from "../services/db";

export default function CreateMemberModal({ onClose, fetchMembers }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [membershipPlan, setMembershipPlan] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (name === "") {
      return setError("Please provide the name of the member");
    }

    // Validate passwords match
    if (password.length < 6) {
      return setError("Password needs to be at least 6 characters long");
    }

    // Validate phone number (basic check)
    if (phone.length < 10) {
      return setError("Please enter a valid phone number");
    }

    try {
      setError("");
      setLoading(true);

      const userCredential = await signup(email, password, "member");
      const uid = userCredential.user.uid;

      const memberData = {
        name,
        email,
        phone,
        membershipPlan,
      };

      const result = await createMember(uid, memberData);

      if (!result.success) {
        throw new Error(result.error || "Failed to create member profile");
      }

      fetchMembers();
      onClose();
    } catch (error) {
      let friendlyMessage = error.message;

      if (error.code === "auth/email-already-in-use") {
        friendlyMessage =
          "This email is already registered. Please log in or use a different email.";
      } else if (error.code === "auth/weak-password") {
        friendlyMessage = "Password should be at least 6 characters long.";
      } else if (error.code === "auth/invalid-email") {
        friendlyMessage = "Please enter a valid email address.";
      }

      setError(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Full Name */}
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
      </div>

      {/* Email */}
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
      </div>

      {/* Phone */}
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
      </div>

      {/* Membership Plan */}
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

      {/* Password */}
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
      </div>

      <button onClick={() => onClose()}>Cancel</button>
      <button>Save Member</button>
    </form>
  );
}
