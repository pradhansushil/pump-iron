import { useState } from "react";
import {
  reauthenticateWithCredential,
  updatePassword,
  EmailAuthProvider,
} from "firebase/auth";
import toast from "react-hot-toast";

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
      toast.success("Successfully updated your password!");
    } catch {
      toast.error("Failed to update password. Please try again");
    }
  };

  return (
    <div className="">
      <h3>Password</h3>
      {!isEditing ? (
        <section>
          <p>
            <span>Password: </span>
            ****
          </p>
          <button onClick={() => setIsEditing(true)}>Edit</button>
        </section>
      ) : (
        <section>
          {errors.currentPassword && <p>{errors.currentPassword}</p>}
          <label htmlFor="current">Current Password: </label>
          <input
            type="password"
            id="current"
            value={password.currentPassword}
            onChange={(e) =>
              setPassword({ ...password, currentPassword: e.target.value })
            }
          />
          {errors.newPassword && <p>{errors.newPassword}</p>}
          <label htmlFor="new">New Password</label>
          <input
            type="password"
            id="new"
            value={password.newPassword}
            onChange={(e) =>
              setPassword({ ...password, newPassword: e.target.value })
            }
          />
          {errors.general && <p>{errors.general}</p>}
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
