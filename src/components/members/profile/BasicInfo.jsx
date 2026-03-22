import { useState } from "react";
import toast from "react-hot-toast";
import {
  cardStyle,
  ctaButton,
  dangerButton,
  errorBanner,
  errorColor,
  h2Heading,
  marginBottomSm,
  textColor,
  textColorWhite,
  textSizeSmall,
} from "../../../utils/styles";

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
    <div className={cardStyle}>
      <h2 className={`${h2Heading} ${marginBottomSm}`}>Basic Info</h2>
      {!isEditing ? (
        <section>
          <div className="flex justify-between py-2 border-b border-gray-700">
            <span className={textColor}>Name</span>
            <span className={textColorWhite}>{member.name}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-700">
            <span className={textColor}>Email</span>
            <span className={textColorWhite}>{member.email}</span>
          </div>
          <div className="flex justify-between py-2 mb-4">
            <span className={textColor}>Phone Number</span>
            <span className={textColorWhite}>{member.phone}</span>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            aria-label="edit basic info"
            className={ctaButton}
          >
            Edit
          </button>
        </section>
      ) : (
        <section>
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
            {errors.name && (
              <p
                className="text-red-400 text-sm mb-1"
                id="name-error"
                role="alert"
              >
                {errors.name}
              </p>
            )}
            <label htmlFor="name" className={`${textColor} ${textSizeSmall}`}>
              Name
            </label>
            <input
              type="text"
              id="name"
              value={editedMember.name}
              onChange={(e) =>
                setEditedMember({ ...editedMember, name: e.target.value })
              }
              aria-describedby={errors.name ? "name-error" : undefined}
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-md px-3 py-2 mt-1 text-sm focus:outline-none focus:border-blue-400"
            />
          </div>

          <div className={marginBottomSm}>
            {errors.email && (
              <p
                className="text-red-400 text-sm mb-1"
                id="email-error"
                role="alert"
              >
                {errors.email}
              </p>
            )}
            <label htmlFor="email" className={`${textColor} ${textSizeSmall}`}>
              Email
            </label>
            <input
              type="email"
              id="email"
              value={editedMember.email}
              onChange={(e) =>
                setEditedMember({ ...editedMember, email: e.target.value })
              }
              aria-describedby={errors.email ? "email-error" : undefined}
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-md px-3 py-2 mt-1 text-sm focus:outline-none focus:border-blue-400"
            />
          </div>

          <div className={marginBottomSm}>
            {errors.phone && (
              <p
                className="text-red-400 text-sm mb-1"
                id="phone-error"
                role="alert"
              >
                {errors.phone}
              </p>
            )}
            <label htmlFor="phone" className={`${textColor} ${textSizeSmall}`}>
              Phone Number
            </label>
            <input
              type="text"
              id="phone"
              value={editedMember.phone}
              onChange={(e) =>
                setEditedMember({ ...editedMember, phone: e.target.value })
              }
              aria-describedby={errors.phone ? "phone-error" : undefined}
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
