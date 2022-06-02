import { useEffect, useRef, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { connect } from "react-redux";
import { io } from "socket.io-client";
import Peer from "simple-peer";
import axios from "axios";

import * as actions from "./store/actions";
import Fallback from "./containers/Fallback";
import Home from "./containers/Home";
import Layout from "./hoc/Layout";
import Login from "./containers/Login";
import Register from "./containers/Register";
import ProtectedLayout from "./hoc/ProtectedLayout";
import Contacts from "./containers/Contacts";
import Transcribe from "./containers/Transcribe";
import Logout from "./containers/Logout";
import { downSampleBuffer } from "./utils/downSampleBuffer";
import { iceConfig as iceServers } from "./constants/iceConfig";
import { getUserMedia } from "./utils/getUserMedia";
import { getFormattedDate } from "./utils/getFormattedDate";
import { getFormattedTime } from "./utils/getFormattedTime";

// Hosted
// https://communicare-server.herokuapp.com/
// http://localhost:8000/
const socket = io("https://communicare-server.herokuapp.com/", {
  autoConnect: false,
});

const firebase_url =
  "https://communicare-4a0ec-default-rtdb.asia-southeast1.firebasedatabase.app";
let bufferSize = 2048;
let AudioContext = window.AudioContext || window.webkitAudioContext;
let context = new AudioContext({
  // if Non-interactive, use 'playback' or 'balanced' // https://developer.mozilla.org/en-US/docs/Web/API/AudioContextLatencyCategory
  latencyHint: "interactive",
});
let processor = context.createScriptProcessor(bufferSize, 1, 1);
processor.connect(context.destination);
context.resume();

function App({ onAutoSignup, userID, email }) {
  const [isCallReceived, setIsCallReceived] = useState(false);
  const [isCallSent, setIsCallSent] = useState(false);
  const [stream, setStream] = useState();
  const [isTranscriptionEnabled, setIsTranscriptionEnabled] = useState(false);
  const [otherPartyID, setOtherPartyID] = useState(null);
  const [callSignal, setCallSignal] = useState();
  const [isCallAccepted, setIsCallAccepted] = useState(false);
  const [isCallEnded, setIsCallEnded] = useState(false);
  const [callerInfo, setCallerInfo] = useState({
    callerID: "",
    callerEmail: "",
  });
  const [callRecord, setCallRecord] = useState({
    email: "",
    date: "",
    time: "",
    duration: "-",
    type: "call missed",
  });
  const [callDuration, setCallDuration] = useState(0);
  const [callResponseHistory, setCallResponseHistory] = useState();

  const myMedia = useRef();
  const userMedia = useRef();
  const connectionRef = useRef();
  const iceConfig = [...iceServers];

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
    socket.on("call-user", ({ callerID, callerEmail, signal }) => {
      setIsCallReceived(true);
      setCallSignal(signal);
      setCallerInfo({
        callerID: callerID,
        callerEmail: callerEmail,
      });
      setOtherPartyID(callerID);
    });

    socket.on("end-call", () => {
      setIsCallEnded(true);
      window.location.reload();
    });
  }, []);

  useEffect(() => {
    socket.on("enable-transcribe", ({ transcribeFrom, isEnable }) => {
      console.log("IS LIVE TRANSCRIPTION ENABLE? ", isEnable);
      if (isEnable) {
        socket.emit("startGoogleCloudStream", { callerID: transcribeFrom });
      } else {
        socket.emit("endGoogleCloudStream");
      }
    });
  }, []);

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
  };

  const onMedia = async () => {
    let stream = await getUserMedia({ video: true, audio: true });
    myMedia.current.srcObject = stream;
    handleSuccess(stream);
    setStream(stream);
  };

  const callUser = (userToCallID, email) => {
    addCallHistory(email);
    setOtherPartyID(userToCallID);
    setIsCallSent(true);
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
      setInterval(() => {
        setCallDuration((prevState) => prevState + 1000);
      }, 1000);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    addCallHistory(callerInfo.callerEmail, "call made");
    setInterval(() => {
      setCallDuration((prevState) => prevState + 1000);
    }, 1000);
    setIsCallAccepted(true);
    setIsCallSent(false);

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
    setIsCallSent(false);

    let updatedCallRecord = { ...callRecord };
    updatedCallRecord["duration"] = callDuration;
    updatedCallRecord["type"] = "call made";

    console.log("UPDATED CLAL RECORD: ", updatedCallRecord);

    axios
      .put(
        `${firebase_url}/call-history/${userID}/${callResponseHistory}.json`,
        updatedCallRecord
      )
      .then((response) => {
        socket.emit("end-call", { userID: otherPartyID });
        connectionRef.current.destroy();
        window.location.reload();
      })
      .catch(() => console.log("SOMETHING WENT WRONG WHEN ENDING THE CALL"));
  };

  const enableTranscriptionHandler = () => {
    socket.emit("enable-transcribe", {
      id: otherPartyID,
      myId: userID,
      isEnable: !isTranscriptionEnabled,
    });

    setIsTranscriptionEnabled((prevState) => !prevState);
  };

  const addCallHistory = (email, type = "call missed") => {
    let data = {
      email: email,
      date: "",
      time: "",
      duration: "-",
      type: type,
    };

    let today = new Date();

    data["date"] = getFormattedDate(today);
    data["time"] = getFormattedTime(today);

    console.log("CALL RECORD: ", data);
    setCallRecord(data);
    axios
      .post(`${firebase_url}/call-history/${userID}.json`, data)
      .then((response) => {
        console.log("callResponseHistory: ", response.data.name);
        setCallResponseHistory(response.data.name);
      })
      .catch((error) => console.log("error catched: ", error));
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
          <ProtectedLayout />
        }
      >
        <Route
          index
          element={
            <Home
              socket={socket}
              callUser={callUser}
              answerCall={answerCall}
              myMedia={myMedia}
              userMedia={userMedia}
              onMedia={onMedia}
              callerInfo={callerInfo}
              isCallAccepted={isCallAccepted}
              isCallSent={isCallSent}
              isCallReceived={isCallReceived}
              isCallEnded={isCallEnded}
              callDuration={callDuration}
              endCall={endCall}
              enableTranscription={enableTranscriptionHandler}
              isTranscriptionEnabled={isTranscriptionEnabled}
            />
          }
        />

        <Route path="contacts" element={<Contacts socket={socket} userID={userID} />} />

        <Route path="transcribe" element={<Transcribe socket={socket} />} />
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
