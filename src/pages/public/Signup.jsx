import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Timestamp } from "firebase/firestore";

import { plans } from "../../data/plansData";
import { createMember, updateMember } from "../../services/db";
import { createPayment } from "../../services/paymentsService";
import { PAYMENT_STATUS } from "../../utils/constants";
import { textColorWhite, textSizeSmall } from "../../utils/styles";
import CreditCardForm from "../../components/payment-forms/CreditCardForm";
import BankTransferForm from "../../components/payment-forms/BankTransferForm";
import QRCodeForm from "../../components/payment-forms/QRCodeForm";

export default function Signup() {
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

    const selectedPlan = plans.find(
      (p) => p.name.toLowerCase() === membershipPlan,
    );
    const planPrice = parseInt(selectedPlan.price.replace("$", ""), 10);

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
          memberName: name,
          amount: planPrice,
          date: Timestamp.now(),
          dueDate: Timestamp.fromDate(result.nextBilling),
          method: paymentMethod,
          status: PAYMENT_STATUS.COMPLETED,
          description: `Monthly membership - ${membershipPlan}`,
          email: email,
        });

        if (paymentResult.success) {
          const nextPayment = await createPayment({
            memberId: uid,
            memberName: name,
            amount: planPrice,
            date: Timestamp.now(),
            dueDate: Timestamp.fromDate(result.nextBilling),
            method: paymentMethod,
            status: PAYMENT_STATUS.DUE,
            description: `Monthly membership - ${membershipPlan}`,
            email: email,
          });

          if (!nextPayment.success) {
            throw new Error("Failed to create next billing cycle");
          }
          break;
        }
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
    <main aria-labelledby="signup-heading" className="flex h-screen">
      {/* Left brand panel */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-b from-blue-950 to-blue-900 flex-col items-center justify-center p-12">
        <p className="text-blue-400 text-sm font-bold tracking-widest uppercase mb-6">
          Pump & Iron
        </p>
        <h1
          className={`${textColorWhite} text-5xl font-bold text-center leading-tight mb-6`}
        >
          Train Hard.
          <br />
          Live
          <br />
          Strong.
        </h1>
        <div className="w-12 h-0.5 bg-blue-500 mb-6" />
        <p
          className={`text-gray-400 ${textSizeSmall} tracking-widest uppercase text-center`}
        >
          Your performance. Your community. Your gym.
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex flex-col justify-start w-1/2 h-full px-16 bg-gray-950 overflow-y-auto">
        <div className="w-full max-w-sm mx-auto py-12">
          <h2
            id="signup-heading"
            className={`${textColorWhite} text-3xl font-bold mb-8`}
          >
            Join Our Gym
          </h2>

          {error.general && (
            <p className="text-red-500 text-sm mb-6" role="alert">
              {error.general}
            </p>
          )}

          <form onSubmit={handleSubmit} className="w-full" noValidate>
            {/* Full Name */}
            <div className="mb-6">
              {error.name && (
                <p
                  className="text-red-500 text-xs mb-1"
                  id="name-error"
                  role="alert"
                >
                  {error.name}
                </p>
              )}
              <label
                htmlFor="name"
                className="block text-gray-400 text-xs tracking-widest uppercase mb-2"
              >
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                required
                aria-describedby={error.name ? "name-error" : undefined}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Email */}
            <div className="mb-6">
              {error.email && (
                <p
                  className="text-red-500 text-xs mb-1"
                  id="email-error"
                  role="alert"
                >
                  {error.email}
                </p>
              )}
              <label
                htmlFor="email"
                className="block text-gray-400 text-xs tracking-widest uppercase mb-2"
              >
                Email *
              </label>
              <input
                type="email"
                id="email"
                required
                aria-describedby={error.email ? "email-error" : undefined}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Phone */}
            <div className="mb-6">
              {error.phone && (
                <p
                  className="text-red-500 text-xs mb-1"
                  id="phone-error"
                  role="alert"
                >
                  {error.phone}
                </p>
              )}
              <label
                htmlFor="phone"
                className="block text-gray-400 text-xs tracking-widest uppercase mb-2"
              >
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                required
                aria-describedby={error.phone ? "phone-error" : undefined}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="1234567890"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Membership Plan */}
            <div className="mb-6">
              <label
                htmlFor="membershipPlan"
                className="block text-gray-400 text-xs tracking-widest uppercase mb-2"
              >
                Membership Plan *
              </label>
              <select
                id="membershipPlan"
                required
                value={membershipPlan}
                onChange={(e) => setMembershipPlan(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {plans.map((plan) => (
                  <option key={plan.name} value={plan.name.toLowerCase()}>
                    {plan.name} - {plan.price}/month
                  </option>
                ))}
              </select>
            </div>

            {/* Payment Method */}
            <div className="mb-6">
              {error.paymentMethod && (
                <p
                  className="text-red-500 text-xs mb-1"
                  id="payment-method-error"
                  role="alert"
                >
                  {error.paymentMethod}
                </p>
              )}
              <label
                htmlFor="paymentMethod"
                className="block text-gray-400 text-xs tracking-widest uppercase mb-2"
              >
                Payment Method *
              </label>
              <select
                id="paymentMethod"
                required
                aria-describedby={
                  error.paymentMethod ? "payment-method-error" : undefined
                }
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            <div className="mb-6">
              {error.password && (
                <p
                  className="text-red-500 text-xs mb-1"
                  id="password-error"
                  role="alert"
                >
                  {error.password}
                </p>
              )}
              <label
                htmlFor="password"
                className="block text-gray-400 text-xs tracking-widest uppercase mb-2"
              >
                Password *
              </label>
              <input
                type="password"
                id="password"
                required
                aria-describedby={error.password ? "password-error" : undefined}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Confirm Password */}
            <div className="mb-8">
              {error.confirmPassword && (
                <p
                  className="text-red-500 text-xs mb-1"
                  id="confirm-password-error"
                  role="alert"
                >
                  {error.confirmPassword}
                </p>
              )}
              <label
                htmlFor="confirmPassword"
                className="block text-gray-400 text-xs tracking-widest uppercase mb-2"
              >
                Confirm Password *
              </label>
              <input
                type="password"
                id="confirmPassword"
                required
                aria-describedby={
                  error.confirmPassword ? "confirm-password-error" : undefined
                }
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Submit */}
            <button
              className="w-full bg-blue-500 text-white py-3 rounded-md font-semibold tracking-wide hover:bg-blue-600 transition-colors duration-200"
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
            >
              Log In
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
