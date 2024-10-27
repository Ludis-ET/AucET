import { Routes, Route } from "react-router-dom";
import { Dashboard } from "./pages";
import { Callback } from "./pages/CallBack";

function Payment() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/success/:txref" element={<Callback />} />
    </Routes>
  );
}

export default Payment;
