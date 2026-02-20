/**
 * SignupPage Component
 *
 * Purpose: Registers new users and creates member profile in Firestore
 * - Collects all required member information (name, phone, membership plan)
 * - Creates Firebase Auth account and Firestore member document
 * - All new users → /dashboard (default member role)
 * - Validates password confirmation before submission
 *
 * Interview Notes:
 * - Multi-step form with comprehensive validation
 * - Integrates Firebase Auth with Firestore database
 * - Shows proper error handling for both auth and database operations
 * - Demonstrates controlled form inputs for various field types
 */

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Timestamp } from "firebase/firestore";

import { createMember, createPayment, updateMember } from "../services/db";
import CreditCardForm from "../components/payment-forms/CreditCardForm";
import BankTransferForm from "../components/payment-forms/BankTransferForm";
import QRCodeForm from "../components/payment-forms/QRCodeForm";

export default function SignupPage() {
  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [membershipPlan, setMembershipPlan] = useState("basic");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI state
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  //Payment Method Details
  const [ccNumber, setCCNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [ccv, setCCV] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const amount = {
      basic: 29,
      standard: 49,
      premium: 79,
    };

    const planPrice = amount[membershipPlan];
    if (name === "") {
      return setError("Please provide the name of the member");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError({ email: "Please enter a valid email address" });
      return;
    }

    // Validate passwords match
    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    // Validate phone number (basic check)
    if (phone.length < 10) {
      return setError("Please enter a valid phone number");
    }

    if (!paymentMethod) {
      return setError("Please select a payment method");
    }

    try {
      setError("");
      setLoading(true);

      // Step 1: Create Firebase Auth account
      const userCredential = await signup(email, password, "member");
      const uid = userCredential.user.uid;

      // Step 2: Create member document in Firestore
      const memberData = {
        name,
        email,
        phone,
        membershipPlan,
        paymentMethod: paymentMethod,
      };

      const result = await createMember(uid, memberData);

      if (!result.success) {
        throw new Error(result.error || "Failed to create member profile");
      }

      // Member created successfully, now try payment with retries
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

        if (paymentResult.success) {
          break;
        }

        attempts++;
      }

      // If payment failed after retries, mark member as inactive
      if (!paymentResult.success) {
        await updateMember(uid, { status: "inactive" });
      }

      // Navigate to dashboard
      navigate("/dashboard", { state: { isNewUser: true } });
    } catch (err) {
      // Handle errors with user-friendly messages
      let friendlyMessage = err.message;

      if (err.code === "auth/email-already-in-use") {
        friendlyMessage =
          "This email is already registered. Please log in or use a different email.";
      } else if (err.code === "auth/weak-password") {
        friendlyMessage = "Password should be at least 6 characters long.";
      } else if (err.code === "auth/invalid-email") {
        friendlyMessage = "Please enter a valid email address.";
      }

      setError(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div>
        <h2>Join Our Gym</h2>

        {error && <div>{error}</div>}

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

          {/* Payment Method */}
          <div>
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

          {/* Confirm Password */}
          <div>
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

          {/* Submit Button */}
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
