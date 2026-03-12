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
      toast.error("Failed to update profile. Please try again");
    }
  };

  return (
    <div className="">
      <h2>Basic Info</h2>
      {!isEditing ? (
        <section>
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
          <button onClick={() => setIsEditing(true)}>Edit</button>
        </section>
      ) : (
        <section>
          {errors.name && <p>{errors.name}</p>}
          <label htmlFor="name">Name: </label>
          <input
            type="text"
            id="name"
            value={editedMember.name}
            onChange={(e) =>
              setEditedMember({ ...editedMember, name: e.target.value })
            }
          />
          {errors.email && <p>{errors.email}</p>}
          <label htmlFor="email">Email: </label>
          <input
            type="email"
            id="email"
            value={editedMember.email}
            onChange={(e) =>
              setEditedMember({ ...editedMember, email: e.target.value })
            }
          />
          {errors.phone && <p>{errors.phone}</p>}
          <label htmlFor="phone">Phone Number: </label>
          <input
            type="text"
            id="phone"
            value={editedMember.phone}
            onChange={(e) =>
              setEditedMember({ ...editedMember, phone: e.target.value })
            }
          />

          <button onClick={handleCancel}>Cancel</button>
          <button onClick={handleSubmit}>Save</button>
        </section>
      )}
    </div>
  );
}
