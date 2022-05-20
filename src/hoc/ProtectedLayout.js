import React from "react";
import { connect } from "react-redux";
import { Link, Navigate, Outlet } from "react-router-dom";

const ProtectedLayout = ({ user, isCallReceived, callerInfo, myMedia }) => {
  if (!user) {
    return <Navigate to="/auth/login" />;
  }

  console.log("callerInfo: ", callerInfo);
  return (
    <div>
      <h1>Communicare</h1>
      <div>
        <h4>My Media</h4>
        <video playsInline muted autoPlay ref={myMedia} />
      </div>
      <nav
        style={{
          borderBottom: "solid 1px",
          paddingBottom: "1rem",
        }}
      >
        <Link to="/">Home</Link> | <Link to="/contacts">Contacts</Link> |{" "}
        <Link to="/logout">Logout</Link>
      </nav>

      {isCallReceived && <h3>{callerInfo.callerEmail} is calling...</h3>}

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
