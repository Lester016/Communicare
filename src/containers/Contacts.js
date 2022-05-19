import React from "react";

const Contacts = ({ onlineUsers, contactUser, userID }) => {
  return (
    <div>
      Contact
      <h3>Online Users</h3>
      {onlineUsers.map((user) => (
        <div
          key={user.userID}
          style={{ border: "1px dashed grey", marginBottom: 10 }}
        >
          {user.userID !== userID ? (
            <div>
              <p style={{ color: "brown" }}>{user.email}</p>
              <button onClick={() => contactUser(user.userID)}>call</button>
            </div>
          ) : (
            <p style={{ color: "green" }}>{user.email} (You)</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default Contacts;
