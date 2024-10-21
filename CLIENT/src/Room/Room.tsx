import { CreateRoom } from "./pages";

const Room = () => {
  return (
    <div className="bg-mainBackground min-h-screen p-8">
      <h1 className="py-4 text-2xl md:text-4xl font-extrabold text-center text-buttonBackground">Creat Auction Room</h1>
      <CreateRoom />
    </div>
  );
};

export default Room;
