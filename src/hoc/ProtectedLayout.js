import React from "react";
import { connect } from "react-redux";
import { Link, Navigate, Outlet } from "react-router-dom";

const ProtectedLayout = ({
  user,
  isCallReceived,
  callerInfo,
  answerCall,
  isCallAccepted,
}) => {
  if (!user) {
    return <Navigate to="/auth/login" />;
  }
  return (
    <div>
      <h1>Communicare</h1>
      <div>
        <h4>My Media</h4>
        {isCallReceived &&
          (!isCallAccepted ? (
            <div>
              <h3>{callerInfo.callerEmail} is calling...</h3>
              <button type="button" onClick={answerCall}>
                Answer call
              </button>
            </div>
          ) : null)}
      </div>

      <nav
        style={{
          borderBottom: "solid 1px",
          paddingBottom: "1rem",
        }}
      >
        <Link to="/">Home</Link> | <Link to="/transcribe">Transcribe</Link> |{" "}
        <Link to="/logout">Logout</Link>
      </nav>

      <Outlet />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.auth.token !== null,
  };
};

export default connect(mapStateToProps)(ProtectedLayout);
