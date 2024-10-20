import { Routes, Route } from "react-router-dom";
import { BuyBid } from "./pages";
import { Callback } from "./pages/CallBack";

function App() {
  return (
    <Routes>
      <Route path="/" element={<BuyBid />} />
      <Route path="/success/:txref" element={<Callback />} />
    </Routes>
  );
}

export default App;
