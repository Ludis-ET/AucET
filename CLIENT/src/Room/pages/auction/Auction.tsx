import { useParams } from "react-router-dom";
import { getRoomById, RoomType } from "../../requests";
import { Chat } from "./Chat";
import { Loader } from "../../components";

import { useState, useEffect } from "react";

export const Auction = () => {
  const { roomId } = useParams();
  const [room, setRoom] = useState<RoomType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (roomId) {
      getRoomById(roomId).then((fetchedRoom) => {
        setRoom(fetchedRoom);
        setLoading(false);
      });
    }
  }, [roomId]);

  if (loading || !room) {
    return <Loader text="Loading Auction Room..." />;
  }

  return (
    <div className="bg-mainBackground min-h-screen p-8 flex justify-center gap-4 items-center">
      <Chat room={room} />
      <Chat room={room} />
    </div>
  );
};
