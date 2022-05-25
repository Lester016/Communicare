import React, { useState } from "react";

const Home = ({
  onSubmitMessage,
  responseMessage,
  startLocalTranscription,
  isLocalTranscriptionEnabled,
}) => {
  const [message, setMessage] = useState("");

  const handleChangeMessage = (e) => {
    setMessage(e.target.value);
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
          {isLocalTranscriptionEnabled ? "Stop Transcribing" : "Transcribe now"}
        </button>
      </div>
    </div>
  );
};

export default Home;
