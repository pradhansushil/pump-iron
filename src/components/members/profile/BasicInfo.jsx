import { useState } from "react";
import toast from "react-hot-toast";

export default function BasicInfo({ member, updateMember, uid, setMember }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedMember, setEditedMember] = useState({
    name: member.name,
    email: member.email,
    phone: member.phone,
  });
  const [errors, setErrors] = useState({});

  const handleCancel = () => {
    setIsEditing(false);
    setEditedMember({
      name: member.name,
      email: member.email,
      phone: member.phone,
    });
  };

  const handleSubmit = async () => {
    setErrors({});

    if (editedMember.name === "") {
      return setErrors({ name: "Please provide your name" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editedMember.email)) {
      return setErrors({ email: "Please enter a valid email address" });
    }

    if (editedMember.phone.length < 10) {
      return setErrors({ phone: "Please enter a valid phone number" });
    }

    try {
      await updateMember(uid, editedMember);
      setIsEditing(false);
      setMember(editedMember);
      toast.success("Update successful!");
    } catch {
      setErrors({ general: "Failed to update profile. Please try again" });
    }
  };

  return (
    <div className="profile-card">
      <h2>Basic Info</h2>
      {!isEditing ? (
        <section className="profile-card-view">
          <p>
            <span>Name: </span>
            {member.name}
          </p>
          <p>
            <span>Email: </span>
            {member.email}
          </p>
          <p>
            <span>Phone Number: </span>
            {member.phone}
          </p>
          <button
            onClick={() => setIsEditing(true)}
            aria-label="edit basic info"
          >
            Edit
          </button>
        </section>
      ) : (
        <section className="profile-card-edit">
          {errors.general && (
            <p className="error-message" id="general-error" role="alert">
              {errors.general}
            </p>
          )}
          {errors.name && (
            <p className="field-error" id="name-error" role="alert">
              {errors.name}
            </p>
          )}
          <label htmlFor="name">Name: </label>
          <input
            type="text"
            id="name"
            value={editedMember.name}
            onChange={(e) =>
              setEditedMember({ ...editedMember, name: e.target.value })
            }
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errors.email && (
            <p className="field-error" id="email-error" role="alert">
              {errors.email}
            </p>
          )}
          <label htmlFor="email">Email: </label>
          <input
            type="email"
            id="email"
            value={editedMember.email}
            onChange={(e) =>
              setEditedMember({ ...editedMember, email: e.target.value })
            }
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.phone && (
            <p className="field-error" id="phone-error" role="alert">
              {errors.phone}
            </p>
          )}
          <label htmlFor="phone">Phone Number: </label>
          <input
            type="text"
            id="phone"
            value={editedMember.phone}
            onChange={(e) =>
              setEditedMember({ ...editedMember, phone: e.target.value })
            }
            aria-describedby={errors.phone ? "phone-error" : undefined}
          />
          <button onClick={handleCancel}>Cancel</button>
          <button onClick={handleSubmit}>Save</button>
        </section>
      )}
    </div>
  );
}
