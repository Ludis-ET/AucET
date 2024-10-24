import { RoomCard } from "../../components";

export const MyRooms = () => {
  return (
    <div className="col-span-2">
      <div className="w-full flex flex-wrap gap-12 p-12">
        <RoomCard />
        <RoomCard />
        <RoomCard />
        <RoomCard />
      </div>
    </div>
  );
};
