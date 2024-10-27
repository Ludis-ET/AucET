import { Route, Routes } from "react-router-dom";
import { AllRooms, CreateRoom, Redirector, RoomDetail, View } from "./pages";

const Room = () => {
  return (
    <Routes>
      <Route path="/" element={<AllRooms />} />
      <Route path="/my" element={<View />} />
      <Route path="/auction/:roomId" element={<Redirector />} />
      <Route path="/view/:id" element={<RoomDetail />} />
      <Route path="/create" element={<CreateRoom />} />
    </Routes>
  );
};

export default Room;
