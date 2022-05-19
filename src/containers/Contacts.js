import React from "react";

const Contacts = ({ onlineUsers }) => {
  return (
    <div>
      Contact
      <h3>Online Users</h3>
      {onlineUsers.map((user) => (
        <p key={user.userID}>{user.email}</p>
      ))}
    </div>
  );
};

export default Contacts;
