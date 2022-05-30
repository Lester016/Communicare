import React, { useState } from "react";

const Home = ({ onSubmitMessage, responseMessage }) => {
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
    </div>
  );
};

export default Home;
