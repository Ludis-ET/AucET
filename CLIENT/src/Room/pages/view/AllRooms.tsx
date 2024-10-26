import { useEffect, useState } from "react";
import { getRooms, RoomType } from "../../requests";
import { RoomCardSkeleton } from "./MyRooms";
import { RoomCard } from "../../components";

export const AllRooms = () => {
  const [loading, setLoading] = useState(true);
  const [room, setRoom] = useState<RoomType[] | null>(null);

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      const response = await getRooms();
      console.log(response);
      setRoom(response);
      setLoading(false);
    };
    fetchRooms();
  }, []);

  return (
    <div className="bg-mainBackground min-h-screen p-8 grid grid-cols-4 gap-4">
      <div className="col-span-3">
        <div className="w-full flex flex-wrap gap-12 p-12">
          {loading || !room ? (
            loading ? (
              <>
                {[1, 2, 4, 5, 6, 7, 8, 9, 0, 11, 22, 23, 24, 25].map((k) => (
                  <RoomCardSkeleton key={k} />
                ))}
              </>
            ) : (
              <div className="text-center w-full">
                <h1 className="text-2xl font-bold">No Rooms Found</h1>
                <p className="text-gray-500">No one created any rooms yet</p>
              </div>
            )
          ) : (
            <>
              {room.map((r) => (
                <RoomCard key={r.id} room={r} />
              ))}
            </>
          )}
        </div>
      </div>
      <div className="col-span-1"></div>
    </div>
  );
};
