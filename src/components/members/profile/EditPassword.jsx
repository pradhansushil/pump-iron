import { useState } from "react";
import {
  reauthenticateWithCredential,
  updatePassword,
  EmailAuthProvider,
} from "firebase/auth";

import {
  cardStyle,
  ctaButton,
  dangerButton,
  errorBanner,
  errorColor,
  h3Heading,
  marginBottomSm,
  textColor,
  textColorWhite,
  textSizeSmall,
} from "../../../utils/styles";

export default function EditPassword({ currentUser }) {
  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});

  const handleCancel = () => {
    setIsEditing(false);
    setPassword({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setErrors({});
  };

  const handleSubmit = async () => {
    setErrors({});

    if (
      password.currentPassword === "" ||
      password.newPassword === "" ||
      password.confirmPassword === ""
    )
      return setErrors({ general: "Please fill all fields" }); // was errors.currentPassword

    if (password.newPassword.length < 6)
      return setErrors({
        general: "New password must be at least 6 characters long",
      }); // was errors.newPassword

    if (password.newPassword !== password.confirmPassword)
      return setErrors({ general: "Passwords do not match. Try again" }); // unchanged

    try {
      const emailCredential = EmailAuthProvider.credential(
        currentUser.email,
        password.currentPassword,
      );
      await reauthenticateWithCredential(currentUser, emailCredential);
      await updatePassword(currentUser, password.newPassword);

      setIsEditing(false);
      setErrors({});
      setPassword({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch {
      setErrors({ general: "Failed to update password. Please try again." }); // unchanged
    }
  };

  const generalErrorProps = errors.general
    ? { "aria-describedby": "general-error" }
    : {};

  return (
    <div className={cardStyle}>
      <h3 className={h3Heading}>Password</h3>
      {!isEditing ? (
        <section>
          <div className="flex justify-between py-2 mb-4">
            <span className={textColor}>Password</span>
            <span className={textColorWhite}>••••••••</span>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            aria-label="Edit password"
            className={ctaButton}
          >
            Edit
          </button>
        </section>
      ) : (
        <section className="profile-card-edit">
          {errors.general && (
            <p
              className={`${errorBanner} ${errorColor}`}
              id="general-error"
              role="alert"
            >
              {errors.general}
            </p>
          )}
          <div className={marginBottomSm}>
            <label
              htmlFor="current"
              className={`${textColor} ${textSizeSmall}`}
            >
              Current Password
            </label>
            <input
              type="password"
              id="current"
              value={password.currentPassword}
              onChange={(e) =>
                setPassword({ ...password, currentPassword: e.target.value })
              }
              {...generalErrorProps}
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-md px-3 py-2 mt-1 text-sm focus:outline-none focus:border-blue-400"
            />
          </div>
          <div className={marginBottomSm}>
            <label htmlFor="new" className={`${textColor} ${textSizeSmall}`}>
              New Password
            </label>
            <input
              type="password"
              id="new"
              value={password.newPassword}
              onChange={(e) =>
                setPassword({ ...password, newPassword: e.target.value })
              }
              {...generalErrorProps}
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-md px-3 py-2 mt-1 text-sm focus:outline-none focus:border-blue-400"
            />
          </div>
          <div className={marginBottomSm}>
            <label
              htmlFor="confirm"
              className={`${textColor} ${textSizeSmall}`}
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm"
              value={password.confirmPassword}
              onChange={(e) =>
                setPassword({ ...password, confirmPassword: e.target.value })
              }
              {...generalErrorProps}
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-md px-3 py-2 mt-1 text-sm focus:outline-none focus:border-blue-400"
            />
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={handleCancel} className={dangerButton}>
              Cancel
            </button>
            <button onClick={handleSubmit} className={ctaButton}>
              Save
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
