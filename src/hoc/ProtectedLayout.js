import React from "react";
import { connect } from "react-redux";
import { Link, Navigate, Outlet } from "react-router-dom";

const ProtectedLayout = ({
  user,
  isCallReceived,
  callerInfo,
  answerCall,
  isCallAccepted,
  callDuration,
}) => {
  if (!user) {
    return <Navigate to="/auth/login" />;
  }
  return (
    <div>
      {/* <h1>Communicare</h1>
        <h1>{callDuration}</h1>
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
        </div> */}

      <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <div class="container-fluid">
          <Link class="navbar-brand" to="/">
            Communicare
          </Link>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarColor01"
            aria-controls="navbarColor01"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>

          <div class="collapse navbar-collapse" id="navbarColor01">
            <ul class="navbar-nav me-auto">
              <li class="nav-item">
                <Link class="nav-link active" to="/">
                  Home
                  <span class="visually-hidden">(current)</span>
                </Link>
              </li>
              <li class="nav-item">
                <Link class="nav-link" to="/transcribe">
                  Transcribe
                </Link>
              </li>
              <li class="nav-item">
                <Link class="nav-link" to="/logout">
                  Logout
                </Link>
              </li>
            </ul>
            <form class="d-flex">
              <input
                class="form-control me-sm-2"
                type="text"
                placeholder="Search"
              />
              <button class="btn btn-secondary my-2 my-sm-0" type="submit">
                Search
              </button>
            </form>
          </div>
        </div>
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
