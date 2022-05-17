import React from "react";
import { Link, Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div>
      <h1>Communicare</h1>
      <nav
        style={{
          borderBottom: "solid 1px",
          paddingBottom: "1rem",
        }}
      >
        <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
      </nav>
      <Outlet />
    </div>
  );
};

export default Layout;
