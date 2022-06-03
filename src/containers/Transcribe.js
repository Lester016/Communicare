import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { downSampleBuffer } from "../utils/downSampleBuffer";
import { getUserMedia } from "../utils/getUserMedia";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Toolbar from "@mui/material/Toolbar";

import List from "@mui/material/Box";
import ListItem from "@mui/material/Box";

import Typography from "../components/Typography";
import Button from "../components/Button";

let bufferSize = 2048;
let AudioContext = window.AudioContext || window.webkitAudioContext;
let context = new AudioContext({
  // if Non-interactive, use 'playback' or 'balanced' // https://developer.mozilla.org/en-US/docs/Web/API/AudioContextLatencyCategory
  latencyHint: "interactive",
});
let processor = context.createScriptProcessor(bufferSize, 1, 1);
processor.connect(context.destination);
context.resume();

const Transcribe = ({ userID, socket }) => {
  const [isTranscribeEnabled, setIsTranscribeEnabled] = useState(false);
  const [message, setMessage] = useState(null);
  const [stream, setStream] = useState();

  useEffect(() => {
    socket.on("transcribedMessage", ({ message }) => {
      setMessage(message);
    });
  }, []);

  const startLocalTranscription = async () => {
    setIsTranscribeEnabled((prevState) => !prevState);

    if (!isTranscribeEnabled) {
      socket.emit("startGoogleCloudStream", { callerID: userID });

      let stream = await getUserMedia({ video: false, audio: true });
      handleSuccess(stream);
      setStream(stream);
    } else {
      setMessage(null);
      stopAudioOnly(stream);
      socket.emit("endGoogleCloudStream");
    }
  };

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

  // stop mic only
  const stopAudioOnly = (stream) => {
    stream.getTracks().forEach((track) => {
      if (track.readyState === "live" && track.kind === "audio") {
        track.stop();
      }
    });
  };

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        width: { sm: `calc(100vw - 300px)` },
        height: "100vh",
        p: 4,
        backgroundColor: "#F9FAFF",
      }}
    >
      <Toolbar sx={{ display: { xs: "block", md: "none" } }} />

      <Box
        component={Paper}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "left",
          p: 2,
        }}
      >
        <Typography sx={{ fontSize: "24px", fontWeight: "600" }}>
          Transcribe
        </Typography>

        <List
          component="ul"
          sx={{
            listStylePosition: "inside",
            textAlign: "left",
            color: "#22BB72",
            fontSize: "16px",
            fontWeight: "600",
          }}
        >
          <ListItem sx={{ display: "list-item" }}>
            Speak and this tool will transcribe the words spoken into written
            text.
          </ListItem>
          <ListItem sx={{ display: "list-item" }}>
            Make sure the speaking voice is clear for a better translation
            quality.
          </ListItem>
          <ListItem sx={{ display: "list-item" }}>
            Rotate your phone for better usage.
          </ListItem>
          <ListItem sx={{ display: "list-item" }}>
            Click the button to start transcribing.
          </ListItem>
        </List>

        <Button
          onClick={startLocalTranscription}
          sx={{
            width: "200px",
            backgroundColor: isTranscribeEnabled ? "#22BB72" : "#BB223E",
          }}
        >
          Transcribe: {isTranscribeEnabled ? "On" : "Off"}
        </Button>

        <Box sx={{ flex: 1, width: "100%", p: 4 }}>
          <Box
            sx={{
              width: "100%",
              height: "100%",
              backgroundColor: "#EAEFFF",
              borderRadius: 4,
              p: 4,
            }}
          >
            <Typography sx={{ fontSize: "24px", fontWeight: "500" }}>
              {message}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    userID: state.auth.userID,
  };
};

export default connect(mapStateToProps)(Transcribe);

/*
<div>
  <h1>TRANSCRIBE</h1>

  <div>
    <ul>
      <li>
        Speak and this tool will transcribe the words spoken into written
        text.
      </li>
      <li>
        Make sure the speaking voice is clear for a better translation
        quality.
      </li>
      <li>Rotate your phone for better usage.</li>
      <li>Click the button to start transcribing.</li>
    </ul>
  </div>

  <button onClick={startLocalTranscription}>
    {isTranscribeEnabled ? "Stop Transcribing" : "Transcribe now"}
  </button>
  <h3>{message && message}</h3>
</div>
*/
