import axios from "axios";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { findContact } from "../utils/findContact";

const Home = ({
  userID,
  socket,
  callUser,
  onSubmitMessage,
  responseMessage,
}) => {
  const [message, setMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    socket.on("get-users", (users) => setOnlineUsers(users));
  }, []);

  const handleChangeMessage = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    axios
      .get(
        `https://communicare-4a0ec-default-rtdb.asia-southeast1.firebasedatabase.app/contacts/${userID}.json`
      )
      .then((response) => {
        setContacts(response.data !== null ? response.data : []);
      })
      .catch((error) => console.log("error catched"));
  }, []);

  const addContactHandler = (contactID, contactEmail) => {
    let updatedContacts = [
      ...contacts,
      { userID: contactID, email: contactEmail },
    ];
    axios
      .put(
        `https://communicare-4a0ec-default-rtdb.asia-southeast1.firebasedatabase.app/contacts/${userID}.json`,
        updatedContacts
      )
      .then((response) => setContacts(updatedContacts))
      .catch((error) => console.log("error catched: ", error));
  };

  const removeContactHandler = (item) => {
    let updatedContacts = [...contacts];

    let index = updatedContacts.findIndex((x) => x.userID === item);
    if (index > -1) {
      updatedContacts.splice(index, 1); // 2nd parameter means remove one item only
    }

    axios
      .put(
        `https://communicare-4a0ec-default-rtdb.asia-southeast1.firebasedatabase.app/contacts/${userID}.json`,
        updatedContacts
      )
      .then((response) => setContacts(updatedContacts))
      .catch((error) => console.log("error catched: ", error));
  };

  return (
    <div>
      Home
      <div>
        <label>Your message: </label>
        <input type="text" value={message} onChange={handleChangeMessage} />
        <button
          onClick={() => {
            onSubmitMessage(message);
            setMessage("");
          }}
        >
          Send
        </button>
      </div>
      <div>
        <h4>CONVO: </h4>
        {responseMessage.map((data, index) => (
          <p key={index}>
            {data.email}: {data.message}
          </p>
        ))}
      </div>
      <h3>Your Contacts</h3>
      <div style={{ border: "1px solid grey", marginBottom: 10 }}>
        {contacts.map((user) => (
          <div key={user.userID}>
            <p style={{ color: "blue" }}>{user.email} </p>
            {findContact(onlineUsers, user.userID) ? (
              <>
                <p>(Online)</p>
                <button onClick={() => callUser(user.userID)}>Call</button>
              </>
            ) : (
              "(Offline)"
            )}

            <button onClick={() => removeContactHandler(user.userID)}>
              Remove in contacts
            </button>
          </div>
        ))}
      </div>
      <h3>Online Users</h3>
      {onlineUsers.map((user) => (
        <div
          key={user.userID}
          style={{ border: "1px dashed grey", marginBottom: 10 }}
        >
          {user.userID !== userID ? (
            <div>
              <p style={{ color: "brown" }}>{user.email}</p>
              <button onClick={() => callUser(user.userID)}>Call</button>

              {!findContact(contacts, user.userID) && (
                <button
                  onClick={() => addContactHandler(user.userID, user.email)}
                >
                  Add into contacts
                </button>
              )}
            </div>
          ) : (
            <p style={{ color: "green" }}>{user.email} (You)</p>
          )}
        </div>
      ))}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    userID: state.auth.userID,
  };
};

export default connect(mapStateToProps)(Home);
