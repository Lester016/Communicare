import React, { useState } from "react";
import { connect } from "react-redux";
import { io } from "socket.io-client";

const socket = io("http://localhost:8000/");

const Home = ({ userID }) => {
  const [message, setMessage] = useState("");

  const handleChangeMessage = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmitMessage = (e) => {
    e.preventDefault();
    if (message !== "") {
      console.log("SUBMIT: ", userID, message);
      setMessage("");
    }
  };

  return (
    <div>
      Home
      <div>
        <label>Your message: </label>
        <input type="text" value={message} onChange={handleChangeMessage} />
        <button onClick={handleSubmitMessage}>Send</button>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    userID: state.auth.userID,
  };
};

export default connect(mapStateToProps, null)(Home);
