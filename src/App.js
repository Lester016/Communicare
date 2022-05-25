import { useEffect, useRef, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { connect } from "react-redux";
import { io } from "socket.io-client";
import Peer from "simple-peer";

import * as actions from "./store/actions";
import Fallback from "./containers/Fallback";
import Home from "./containers/Home";
import Layout from "./hoc/Layout";
import Login from "./containers/Login";
import Register from "./containers/Register";
import ProtectedLayout from "./hoc/ProtectedLayout";
import Contacts from "./containers/Contacts";
import Logout from "./containers/Logout";
import { downSampleBuffer } from "./utils/downSampleBuffer";

// Hosted
// https://communicare-server.herokuapp.com/
// http://localhost:8000/
const socket = io("http://localhost:8000/", {
  autoConnect: false,
});

function App({ onAutoSignup, userID, email }) {
  const [responseMessage, setResponseMessage] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isCallReceived, setIsCallReceived] = useState(false);
  const [stream, setStream] = useState();
  const [isTranscriptionEnabled, setIsTranscriptionEnabled] = useState(false);
  const [isLocalTranscriptionEnabled, setIsLocalTranscriptionEnabled] =
    useState(false);
  const [localTranscriptionMessage, setLocalTranscriptionMessage] =
    useState(null);
  const [callSignal, setCallSignal] = useState();
  const [isCallAccepted, setIsCallAccepted] = useState(false);
  const [isCallEnded, setIsCallEnded] = useState(false);
  const [callerInfo, setCallerInfo] = useState({
    callerID: "",
    callerEmail: "",
  });

  const myMedia = useRef();
  const userMedia = useRef();
  const connectionRef = useRef();
  const iceConfig = [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:global.stun.twilio.com:3478?transport=udp" },
  ];

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

    socket.on("call-user", ({ callerID, callerEmail, signal }) => {
      setIsCallReceived(true);
      setCallSignal(signal);
      setCallerInfo({
        callerID: callerID,
        callerEmail: callerEmail,
      });
    });

    socket.on("transcribedMessage", ({ message }) => {
      setLocalTranscriptionMessage(message);
    });
  }, []);

  const startLocalTranscription = () => {
    setIsLocalTranscriptionEnabled((prevState) => !prevState);

    if (!isLocalTranscriptionEnabled) {
      socket.emit("startGoogleCloudStream", { callerID: userID });

      let bufferSize = 2048;
      let AudioContext = window.AudioContext || window.webkitAudioContext;
      let context = new AudioContext({
        // if Non-interactive, use 'playback' or 'balanced' // https://developer.mozilla.org/en-US/docs/Web/API/AudioContextLatencyCategory
        latencyHint: "interactive",
      });
      let processor = context.createScriptProcessor(bufferSize, 1, 1);
      processor.connect(context.destination);
      context.resume();

      const handleSuccess = (stream) => {
        // myMedia.current.srcObject = stream;
        let input = context.createMediaStreamSource(stream);
        input.connect(processor);

        processor.onaudioprocess = function (e) {
          let left = e.inputBuffer.getChannelData(0);
          // let left16 = convertFloat32ToInt16(left); // old 32 to 16 function
          let left16 = downSampleBuffer(left, 44100, 16000);
          socket.emit("binaryData", left16);
        };
        setStream(stream);
      };

      navigator.mediaDevices
        .getUserMedia({ video: false, audio: true })
        .then(handleSuccess);
    } else {
      setLocalTranscriptionMessage(null);
      socket.emit("endGoogleCloudStream");
    }
  };

  const handleSubmitMessage = (message) => {
    if (message !== "") {
      socket.emit("chat message", { message, userID, email });
    }
  };

  const callUser = (userToCallID) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      config: {
        iceServers: iceConfig,
      },
      stream,
    });

    peer.on("signal", (data) => {
      socket.emit("call-user", {
        userToCallID: userToCallID,
        callerID: userID,
        signal: data,
      });
    });

    peer.on("stream", (stream) => {
      userMedia.current.srcObject = stream;
    });

    socket.on("call-accepted", ({ signal }) => {
      setIsCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    setIsCallAccepted(true);

    const peer = new Peer({
      initiator: false,
      trickle: false,
      config: {
        iceServers: iceConfig,
      },
      stream,
    });

    peer.on("signal", (data) => {
      socket.emit("answer-call", {
        callerID: callerInfo.callerID,
        signal: data,
      });
    });

    peer.on("stream", (stream) => {
      userMedia.current.srcObject = stream;
    });

    peer.signal(callSignal);

    connectionRef.current = peer;
  };

  const endCall = () => {
    setIsCallEnded(true);

    connectionRef.current.destroy();

    window.location.reload();
  };

  const enableTranscriptionHandler = () => {
    setIsTranscriptionEnabled((prevState) => !prevState);
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
            myMedia={myMedia}
            userMedia={userMedia}
            isCallAccepted={isCallAccepted}
            answerCall={answerCall}
            isCallEnded={isCallEnded}
            endCall={endCall}
            enableTranscription={enableTranscriptionHandler}
            isTranscriptionEnabled={isTranscriptionEnabled}
          />
        }
      >
        <Route
          index
          element={
            <Home
              onSubmitMessage={handleSubmitMessage}
              responseMessage={responseMessage}
              startLocalTranscription={startLocalTranscription}
              isLocalTranscriptionEnabled={isLocalTranscriptionEnabled}
              localTranscriptionMessage={localTranscriptionMessage}
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
