import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { connect } from "react-redux";
import { io } from "socket.io-client";

import * as actions from "./store/actions";
import Fallback from "./containers/Fallback";
import Home from "./containers/Home";
import Layout from "./hoc/Layout";
import Login from "./containers/Login";
import Register from "./containers/Register";
import ProtectedLayout from "./hoc/ProtectedLayout";
import Contacts from "./containers/Contacts";
import Logout from "./containers/Logout";

// Hosted
// https://communicare-server.herokuapp.com/
const socket = io("http://localhost:8000/", {
  autoConnect: false,
});

function App({ onAutoSignup, userID, email }) {
  const [responseMessage, setResponseMessage] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isCallReceived, setIsCallReceived] = useState(false);
  const [callerInfo, setCallerInfo] = useState({
    callerID: "",
    callerEmail: "",
  });

  useEffect(() => {
    if (userID) {
      socket.connect();
      socket.emit("add-user", { userID, email });
    } else {
      socket.disconnect();
    }

    onAutoSignup();
  }, [onAutoSignup, userID, email]);

  useEffect(() => {
    socket.on("get-users", (users) => setOnlineUsers(users));
    socket.on("chat message", (data) =>
      setResponseMessage((prevState) => [...prevState, data])
    );

    socket.on("call-user", ({ callerID, callerEmail }) => {
      setIsCallReceived(true);
      setCallerInfo({
        callerID: callerID,
        callerEmail: callerEmail,
      });
    });
  }, []);

  const handleSubmitMessage = (message) => {
    if (message !== "") {
      socket.emit("chat message", { message, userID, email });
    }
  };

  const callUser = (userToCallID) => {
    socket.emit("call-user", {
      userToCallID: userToCallID,
      callerID: userID,
    });
  };

  return (
    <Routes>
      <Route path="/auth" element={<Layout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>

      <Route
        path="/"
        element={
          <ProtectedLayout
            isCallReceived={isCallReceived}
            callerInfo={callerInfo}
          />
        }
      >
        <Route
          index
          element={
            <Home
              onSubmitMessage={handleSubmitMessage}
              responseMessage={responseMessage}
            />
          }
        />
        <Route
          path="contacts"
          element={
            <Contacts
              onlineUsers={onlineUsers}
              contactUser={callUser}
              userID={userID}
            />
          }
        />
        <Route path="logout" element={<Logout />} />
      </Route>

      <Route path="*" element={<Fallback />} />
    </Routes>
  );
}

const mapStateToProps = (state) => {
  return {
    userID: state.auth.userID,
    email: state.auth.email,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAutoSignup: () => dispatch(actions.authCheckState()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
