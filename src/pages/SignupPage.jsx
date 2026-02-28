import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Timestamp } from "firebase/firestore";

import { createMember, createPayment, updateMember } from "../services/db";
import CreditCardForm from "../components/payment-forms/CreditCardForm";
import BankTransferForm from "../components/payment-forms/BankTransferForm";
import QRCodeForm from "../components/payment-forms/QRCodeForm";

export default function SignupPage() {
  const location = useLocation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [membershipPlan, setMembershipPlan] = useState(
    (location.state?.plan || "basic").toLowerCase(),
  );
  const [paymentMethod, setPaymentMethod] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);

  const [ccNumber, setCCNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [ccv, setCCV] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (name === "") {
      return setError({ name: "Please provide your name" });
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

    if (confirmPassword === "") {
      return setError({ confirmPassword: "Please confirm your password" });
    } else if (password !== confirmPassword) {
      return setError({ confirmPassword: "Passwords do not match" });
    }

    if (!paymentMethod) {
      return setError({ paymentMethod: "Please select a payment method" });
    }

    const amount = { basic: 29, standard: 49, premium: 79 };
    const planPrice = amount[membershipPlan];

    try {
      setError({});
      setLoading(true);

      const userCredential = await signup(email, password, "member");
      const uid = userCredential.user.uid;

      const memberData = { name, email, phone, membershipPlan, paymentMethod };

      const result = await createMember(uid, memberData);

      if (!result.success) {
        throw new Error(result.error || "Failed to create member profile");
      }

      let paymentResult;
      let attempts = 0;

      while (attempts < 3) {
        paymentResult = await createPayment({
          memberId: uid,
          amount: planPrice,
          date: Timestamp.now(),
          dueDate: Timestamp.now(),
          method: paymentMethod,
          status: "completed",
          description: "First month's payment",
          email: email,
        });

        if (paymentResult.success) break;
        attempts++;
      }

      if (!paymentResult.success) {
        await updateMember(uid, { status: "inactive" });
      }

      navigate("/dashboard", { state: { isNewUser: true } });
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError({
          general:
            "This email is already registered. Please log in or use a different email.",
        });
      } else {
        setError({ general: err.message });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div>
        <h2>Join Our Gym</h2>

        {error.general && <div>{error.general}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div>
            {error.name && <p>{error.name}</p>}
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

          <div>
            {error.email && <p>{error.email}</p>}
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

          <div>
            {error.phone && <p>{error.phone}</p>}
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
            {error.paymentMethod && <p>{error.paymentMethod}</p>}
            <label htmlFor="paymentMethod">Payment Method</label>
            <select
              id="paymentMethod"
              required
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="">Select payment method</option>
              <option value="credit card">Credit Card</option>
              <option value="bank transfer">Bank Transfer</option>
              <option value="cash">Cash</option>
              <option value="qr code">QR Code</option>
            </select>
          </div>

          {paymentMethod === "credit card" && (
            <CreditCardForm
              ccNumber={ccNumber}
              setCCNumber={setCCNumber}
              expiry={expiry}
              setExpiry={setExpiry}
              ccv={ccv}
              setCCV={setCCV}
            />
          )}

          {paymentMethod === "bank transfer" && (
            <BankTransferForm
              accountNumber={accountNumber}
              setAccountNumber={setAccountNumber}
              routingNumber={routingNumber}
              setRoutingNumber={setRoutingNumber}
            />
          )}

          {paymentMethod === "qr code" && <QRCodeForm />}

          <div>
            {error.password && <p>{error.password}</p>}
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

          <div>
            {error.confirmPassword && <p>{error.confirmPassword}</p>}
            <label htmlFor="confirmPassword">Confirm Password *</label>
            <input
              type="password"
              id="confirmPassword"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p>
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </div>
    </div>
  );
}
