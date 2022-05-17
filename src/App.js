import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { connect } from "react-redux";

import Fallback from "./containers/Fallback";
import Home from "./containers/Home";
import Layout from "./hoc/Layout";
import Login from "./containers/Login";
import Register from "./containers/Register";
import ProtectedLayout from "./hoc/ProtectedLayout";
import Contacts from "./containers/Contacts";
import * as actions from "./store/actions";

function App({ onAutoSignup }) {
  useEffect(() => {
    onAutoSignup();
  }, [onAutoSignup]);

  return (
    <Routes>
      <Route path="/auth" element={<Layout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>

      <Route path="/" element={<ProtectedLayout />}>
        <Route path="home" element={<Home />} />
        <Route path="contacts" element={<Contacts />} />
      </Route>

      <Route path="*" element={<Fallback />} />
    </Routes>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    onAutoSignup: () => dispatch(actions.authCheckState()),
  };
};

export default connect(null, mapDispatchToProps)(App);
