import { Route, Routes } from "react-router-dom";

import Fallback from "./containers/Fallback";
import Layout from "./containers/Layout";
import Login from "./containers/Login";
import Register from "./containers/Register";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="*" element={<Fallback />} />
      </Route>
    </Routes>
  );
}

export default App;
