import { Detail } from "./Detail";
import { RightBar } from "./RightBar";

export const RoomDetail = () => {
  return (
    <div className="bg-mainBackground relative min-h-screen p-8 grid grid-cols-4 gap-4">
      <Detail />
      <RightBar />
    </div>
  );
}
