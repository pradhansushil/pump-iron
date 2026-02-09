import React, { useState, useEffect } from "react";

const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      // Simulating an API call
      const response = await fetch(`https://api.example.com/users/${userId}`);
      const data = await response.json();
      setUser(data);
      setLoading(false);
    };

    fetchUser();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="profile-card">
      <h2>{user.name}</h2>
      <p>ID: {userId}</p>
    </div>
  );
};

export default UserProfile;
