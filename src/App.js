import { Routes, Route, Redirect, Link, Outlet } from "react-router-dom";

import "./App.css";
import Home from "./containers/Home";
import Login from "./containers/Login";
import Register from "./containers/Register";

function App() {
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
}

export default App;
