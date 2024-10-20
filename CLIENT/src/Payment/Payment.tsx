import { Routes, Route } from "react-router-dom";
import { Dashboard } from "./pages";
import { Callback } from "./pages/CallBack";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/success/:txref" element={<Callback />} />
    </Routes>
  );
}

export default App;
