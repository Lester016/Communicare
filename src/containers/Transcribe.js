import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { downSampleBuffer } from "../utils/downSampleBuffer";
import { getUserMedia } from "../utils/getUserMedia";

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
    socket.on("transcribedMessage", (data) => {
      setMessage(data.results[0].alternatives[0].transcript);
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
  );
};

const mapStateToProps = (state) => {
  return {
    userID: state.auth.userID,
  };
};

export default connect(mapStateToProps)(Transcribe);
