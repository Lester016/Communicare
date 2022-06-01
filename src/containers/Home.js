import axios from "axios";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { findContact } from "../utils/findContact";

const firebase_url =
  "https://communicare-4a0ec-default-rtdb.asia-southeast1.firebasedatabase.app";

const Home = ({
  userID,
  email,
  socket,
  callUser,
  myMedia,
  userMedia,
  onMedia,
  isCallAccepted,
  isCallEnded,
  isTranscriptionEnabled,
  enableTranscription,
  endCall,
}) => {
  const [message, setMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [responseMessage, setResponseMessage] = useState([]);
  const [liveTranscription, setLiveTranscription] = useState("");

  useEffect(() => {
    socket.on("get-users", (users) => setOnlineUsers(users));
    socket.on("chat message", (data) =>
      setResponseMessage((prevState) => [...prevState, data])
    );

    axios.get(`${firebase_url}/contacts/${userID}.json`).then((response) => {
      setContacts(response.data !== null ? response.data : []);
    });

    axios
      .get(`${firebase_url}/call-history/${userID}.json`)
      .then((response) => {
        console.log("call history: ", response.data);
      });

    socket.on("transcribedMessage", ({ message }) => {
      setLiveTranscription(message);
    });

    onMedia();
  }, []);

  const handleChangeMessage = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmitMessage = () => {
    if (message !== "") {
      socket.emit("chat message", { message, userID, email });
    }
    setMessage("");
  };

  const addContactHandler = (contactID, contactEmail) => {
    let updatedContacts = [
      ...contacts,
      { userID: contactID, email: contactEmail },
    ];
    axios
      .put(`${firebase_url}/contacts/${userID}.json`, updatedContacts)
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
      .put(`${firebase_url}/contacts/${userID}.json`, updatedContacts)
      .then((response) => setContacts(updatedContacts))
      .catch((error) => console.log("error catched: ", error));
  };

  return (
    <div>
      Home
      <div>
        <video playsInline muted autoPlay ref={myMedia} />
        {isCallAccepted && !isCallEnded ? (
          <>
            <div>
              {isTranscriptionEnabled ? (
                <div>
                  <h3>{liveTranscription && liveTranscription}</h3>
                  <button onClick={enableTranscription}>
                    Disable Transcription
                  </button>
                </div>
              ) : (
                <div>
                  <h3>Transcription is off</h3>
                  <button onClick={enableTranscription}>
                    Enable Transcription
                  </button>
                </div>
              )}
            </div>
            <button onClick={endCall}>Hang up</button>
            <video playsInline autoPlay ref={userMedia} />
          </>
        ) : null}
      </div>
      <div>
        <label>Your message: </label>
        <input type="text" value={message} onChange={handleChangeMessage} />
        <button onClick={handleSubmitMessage}>Send</button>
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
                <button onClick={() => callUser(user.userID, user.email)}>
                  Call
                </button>
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
              <button onClick={() => callUser(user.userID, user.email)}>
                Call
              </button>

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
    email: state.auth.email,
  };
};

export default connect(mapStateToProps)(Home);
