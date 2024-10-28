import { RoomType } from "../../requests";
import { Chat } from "./Chat";
import { Loader } from "../../components";

export const Auction = ({
  room,
  starter,
}: {
  starter: number;
  room: RoomType;
}) => {
  if (!room) {
    return <Loader text="Loading Auction Room..." />;
  }

  return (
    <div className="bg-mainBackground min-h-screen p-8 flex justify-center gap-4 items-center">
      <Chat room={room} starter={starter} />
    </div>
  );
};
