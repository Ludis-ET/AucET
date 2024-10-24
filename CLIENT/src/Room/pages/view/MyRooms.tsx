import { useEffect, useState } from "react";
import { RoomCard } from "../../components";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { getRoom, RoomType } from "../../requests";
import { useAuth } from "../../../Context";

export const MyRooms = () => {
  const [loading, setLoading] = useState(true);
  const [room, setRoom] = useState<RoomType[] | null>(null);
  const { profile } = useAuth();

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      const response = await getRoom(profile);
      console.log(response)
      setRoom(response);
      setLoading(false);
    };
    fetchRooms();
  }, [profile]);

  return (
    <div className="col-span-2">
      <div className="w-full flex flex-wrap gap-12 p-12">
        {loading || !room ? (
          <>
            {[1, 2, 4, 5, 6, 7, 8, 9, 0, 11, 22, 23, 24, 25].map((k) => (
              <RoomCardSkeleton key={k} />
            ))}
          </>
        ) : (
          <>
            {room.map((r) => (
              <RoomCard key={r.id} />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

const RoomCardSkeleton = () => {
  return (
    <div className="w-72 h-96 p-4 bg-white shadow-md rounded-lg flex flex-col gap-4">
      <Skeleton height={150} />
      <Skeleton width={`80%`} height={20} />
      <Skeleton count={3} height={12} />
      <div className="flex gap-4 mt-auto justify-between">
        <Skeleton width={70} height={30} />
        <Skeleton width={70} height={30} />
      </div>
    </div>
  );
};
