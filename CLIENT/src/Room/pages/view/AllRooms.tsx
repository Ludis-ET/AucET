import { MyRooms } from "./MyRooms";
import { RightBar } from "./RightBar";

export const AllRooms = () => {
  return (
    <div className="bg-mainBackground min-h-screen p-8 grid grid-cols-4 gap-4">
      <MyRooms />
      <RightBar />
    </div>
  );
};
