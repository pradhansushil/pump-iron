import { useState } from "react";
import {
  reauthenticateWithCredential,
  updatePassword,
  EmailAuthProvider,
} from "firebase/auth";

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
    <div className="profile-card">
      <h3>Password</h3>
      {!isEditing ? (
        <section className="profile-card-view">
          <p>
            <span>Password: </span>
            ****
          </p>
          <button onClick={() => setIsEditing(true)} aria-label="Edit password">
            Edit
          </button>
        </section>
      ) : (
        <section className="profile-card-edit">
          {errors.general && (
            <p id="general-error" role="alert">
              {errors.general}
            </p>
          )}
          {errors.currentPassword && (
            <p id="current-error" role="alert">
              {errors.currentPassword}
            </p>
          )}
          <label htmlFor="current">Current Password</label>
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
          />
          {errors.newPassword && (
            <p id="new-error" role="alert">
              {errors.newPassword}
            </p>
          )}
          <label htmlFor="new">New Password</label>
          <input
            type="password"
            id="new"
            value={password.newPassword}
            onChange={(e) =>
              setPassword({ ...password, newPassword: e.target.value })
            }
            aria-describedby={errors.newPassword ? "new-error" : undefined}
          />
          <label htmlFor="confirm">Confirm Password</label>
          <input
            type="password"
            id="confirm"
            value={password.confirmPassword}
            onChange={(e) =>
              setPassword({ ...password, confirmPassword: e.target.value })
            }
          />
          <button onClick={handleSubmit}>Save</button>
          <button onClick={handleCancel}>Cancel</button>
        </section>
      )}
    </div>
  );
}
