import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

import { getMemberById, updateMember } from "../services/db";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Profile() {
  const [member, setMember] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
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
  return <div></div>;
}
