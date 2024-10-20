import { Routes, Route } from "react-router-dom";
import { Dashboard, Success } from "./pages";
import { Callback } from "./pages/pay/CallBack";

function App() {
  return (
    <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/return" element={<Success />} />
        <Route path="/success/:txref" element={<Callback />} />
    </Routes>
  );
}

export default App;
