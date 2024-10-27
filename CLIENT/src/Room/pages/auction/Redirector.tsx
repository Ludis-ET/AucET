import { useParams } from "react-router-dom";
import { getRoomById, RoomType } from "../../requests";
import { CountDown, Loader, Property } from "../../components";
import { Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";

export const Redirector = () => {
  const { roomId } = useParams();
  const [room, setRoom] = useState<RoomType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoom = async () => {
      setLoading(true);
      if (!roomId) {
        setLoading(false);
        return;
      }
      const response = await getRoomById(roomId);
      setRoom(response);
      setLoading(false);
    };

    fetchRoom();
  }, [roomId]);

  if (loading || !room) return <Loader text="Fetching room details..." />;
  const check = (val: string | Timestamp) => typeof val === "string";

  return (
    <div className="bg-mainBackground min-h-screen p-8 flex justify-center">
      <div className="bg-secondaryBackground p-2 min-w-[40vw] max-h-[80vh] rounded-xl shadow-2xl">
        <header>
          <CountDown
            time={
              check(room.newFormValues.startdate)
                ? room.newFormValues.startdate
                : ""
            }
          />
        </header>
        <main className="m-9">
          <Property
            title="Item Name"
            content={
              check(room.newFormValues.name) ? room.newFormValues.name : ""
            }
          />
          <Property
            title="Auction Visibility"
            content={
              check(room.newFormValues.Visibility)
                ? room.newFormValues.Visibility === "closed"
                  ? "You can't see the bids of other people"
                  : "You can see the bids of other people"
                : ""
            }
          />
          <Property
            title="Auction Duration"
            content={
              check(room.newFormValues.duration)
                ? `${room.newFormValues.duration} Hours`
                : ""
            }
          />
        </main>
        <footer></footer>
      </div>
    </div>
  );
};
