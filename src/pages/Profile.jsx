import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

import { getMemberById, updateMember } from "../services/db";
import LoadingSpinner from "../components/LoadingSpinner";
import BasicInfo from "../components/members/profile/BasicInfo";
import EditPassword from "../components/members/profile/EditPassword";

export default function Profile() {
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchMember = async () => {
      try {
        setLoading(true);
        setMember(await getMemberById(currentUser.uid));
      } catch {
        setError("Failed to load profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [currentUser.uid]);

  if (loading) return <LoadingSpinner />;
  if (error) return <p role="alert">{error}</p>;

  return (
    <main aria-labelledby="profile-heading">
      <div className="">
        <h1 id="profile-heading">Profile</h1>
        {member !== null && (
          <>
            <BasicInfo
              member={member}
              updateMember={updateMember}
              uid={currentUser.uid}
              setMember={setMember}
            />
            <EditPassword currentUser={currentUser} />
          </>
        )}
      </div>
    </main>
  );
}
