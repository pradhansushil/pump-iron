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
    setPassword({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleSubmit = async () => {
    setErrors({});

    if (
      password.currentPassword === "" ||
      password.newPassword === "" ||
      password.confirmPassword === ""
    )
      return setErrors({ currentPassword: "Please fill all fields" });

    if (password.newPassword.length < 6) {
      return setErrors({
        newPassword: "Field must be at least 6 characters long",
      });
    }

    if (password.newPassword !== password.confirmPassword)
      return setErrors({ general: "Passwords do not match. Try again" });

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
      setErrors({ general: "Failed to update password. Please try again." });
    }
  };

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
            {errors.currentPassword && (
              <p
                className="text-red-400 text-sm mb-1"
                id="current-error"
                role="alert"
              >
                {errors.currentPassword}
              </p>
            )}
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
              aria-describedby={
                errors.currentPassword ? "current-error" : undefined
              }
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-md px-3 py-2 mt-1 text-sm focus:outline-none focus:border-blue-400"
            />
          </div>
          <div className={marginBottomSm}>
            {errors.newPassword && (
              <p
                className="text-red-400 text-sm mb-1"
                id="new-error"
                role="alert"
              >
                {errors.newPassword}
              </p>
            )}
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
              aria-describedby={errors.newPassword ? "new-error" : undefined}
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
