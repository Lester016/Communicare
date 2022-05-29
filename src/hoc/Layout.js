import React from "react";
import { connect } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const Layout = ({ user }) => {
  if (user) {
    return <Navigate to="/" />;
  }

  return <Outlet />
};

const mapStateToProps = (state) => {
  return {
    user: state.auth.token !== null,
  };
};

export default connect(mapStateToProps)(Layout);
