import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

import { getMemberById, updateMember } from "../services/db";
import LoadingSpinner from "../components/LoadingSpinner";
import BasicInfo from "../components/members/profile/BasicInfo";
import EditPassword from "../components/members/profile/EditPassword";
import {
  containerStyle,
  ctaButton,
  errorBanner,
  errorColor,
  h1Style,
  marginBottom,
} from "../utils/styles";

export default function Profile() {
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { currentUser } = useAuth();

  const fetchMember = async () => {
    try {
      setLoading(true);
      setError(null);
      setMember(await getMemberById(currentUser.uid));
    } catch {
      setError("Failed to load profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMember();
  }, [currentUser.uid]);

  if (loading) return <LoadingSpinner message="Loading your profile..." />;
  if (error)
    return (
      <main>
        <div className={containerStyle}>
          <div className={`${errorBanner} ${errorColor}`} role="alert">
            <p>{error}</p>
            <button onClick={fetchMember} className={ctaButton}>
              Retry
            </button>
          </div>
        </div>
      </main>
    );

  return (
    <main aria-labelledby="profile-heading">
      <div className={containerStyle}>
        <h1 id="profile-heading" className={`${h1Style} ${marginBottom}`}>
          Profile
        </h1>
        {member !== null && (
          <>
            <BasicInfo
              member={member}
              updateMember={updateMember}
              uid={currentUser.uid}
              setMember={setMember}
            />

            <div className="mt-8">
              <EditPassword currentUser={currentUser} />
            </div>
          </>
        )}
      </div>
    </main>
  );
}
