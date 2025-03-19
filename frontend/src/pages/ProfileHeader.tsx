/*
 ProfileHeader.tsx
*/
import React from "react";
import "../styles/ProfilePage.css";

const ProfileHeader: React.FC = () => {
  return (
    <div className="text-center py-4 border-b border-gray-700">
      <h2 className="text-3xl font-semibold text-white">Profile</h2>
    </div>
  );
};

export default ProfileHeader;
