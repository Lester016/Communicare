import React from "react";
import { connect } from "react-redux";
import { Link, Navigate, Outlet } from "react-router-dom";

const Layout = ({ user }) => {
  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <h1>Landing Page of Communicare</h1>
      <nav
        style={{
          borderBottom: "solid 1px",
          paddingBottom: "1rem",
        }}
      >
        <Link to="/home">Home</Link> | <Link to="/auth/login">Login</Link> |{" "}
        <Link to="/auth/register">Register</Link>
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

export default connect(mapStateToProps)(Layout);
