import { Route, Routes } from "react-router-dom";
import { CreateRoom, View } from "./pages";

const Room = () => {
  return (
    <Routes>
      <Route path="/" element={<View />} />
      <Route path="/create" element={<CreateRoom />} />
    </Routes>
  );
};

export default Room;