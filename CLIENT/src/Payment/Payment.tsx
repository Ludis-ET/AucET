import { Routes, Route } from "react-router-dom";
import { Dashboard, Success } from "./pages";

function App() {
  return (
    <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/success" element={<Success />} />
    </Routes>
  );
}

export default App;
