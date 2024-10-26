import { Route, Routes } from "react-router-dom";
import { Auction, CreateRoom, RoomDetail, View } from "./pages";

const Room = () => {
  return (
    <Routes>
      <Route path="/" element={<View />} />
      <Route path="/auction/:roomId" element={<Auction />} />
      <Route path="/view/:id" element={<RoomDetail />} />
      <Route path="/create" element={<CreateRoom />} />
    </Routes>
  );
};

export default Room;