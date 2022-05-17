import { Route, Routes } from "react-router-dom";

import Fallback from "./containers/Fallback";
import Home from "./containers/Home";
import Layout from "./hoc/Layout";
import Login from "./containers/Login";
import Register from "./containers/Register";
import ProtectedLayout from "./hoc/ProtectedLayout";

function App() {
  return (
    <Routes>
      <Route path="/auth" element={<Layout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>

      <Route path="/" element={<ProtectedLayout />}>
        <Route path="home" element={<Home />} />
      </Route>

      <Route path="*" element={<Fallback />} />
    </Routes>
  );
}

export default App;
