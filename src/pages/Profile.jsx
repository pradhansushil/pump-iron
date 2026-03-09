import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

import { getMemberById, updateMember } from "../services/db";
import LoadingSpinner from "../components/LoadingSpinner";
import BasicInfo from "../components/members/profile/BasicInfo";
import EditPassword from "../components/members/EditPassword";

export default function Profile() {
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(false);

  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchMember = async () => {
      try {
        setLoading(true);
        setMember(await getMemberById(currentUser.uid));
      } catch (error) {
        console.error("Error: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [currentUser.uid]);

  if (loading) return <LoadingSpinner />;
  return (
    <main aria-labelledby="profile-heading">
      <div className="">
        <h2 id="profile-heading">Profile</h2>
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
