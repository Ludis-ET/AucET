import { Link, useParams } from "react-router-dom";
import { getRoomById, RoomType, gettingStarter } from "../../requests";
import { CountDown, Loader, Property } from "../../components";
import { Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useFetchRegisters } from "../../hook/useFetchRegisters";
import { useAuth } from "../../../Context";
import { isLoggedin } from "../../../Authentication/isLoggedin";
import { FaLink } from "react-icons/fa6";
import { Auction } from "./Auction";

export const Redirector = () => {
  const { roomId } = useParams();
  const [room, setRoom] = useState<RoomType | null>(null);
  const [loading, setLoading] = useState(true);
  const { currentUser, profile } = useAuth();
  const { isRegistered } = useFetchRegisters(roomId as string, profile);

  const [auctionStatus, setAuctionStatus] = useState<string>("");

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

  useEffect(() => {
    if (room) {
      const startDate = new Date(
        check(room.newFormValues.startdate)
          ? room.newFormValues.startdate
          : (room.newFormValues.startdate as Timestamp).toDate()
      );
      const duration = parseFloat(room.newFormValues.duration as string);
      const endDate = new Date(startDate.getTime() + duration * 60 * 60 * 1000);
      const currentTime = new Date();

      if (currentTime < startDate) {
        setAuctionStatus("About to Start");
      } else if (currentTime >= startDate && currentTime <= endDate) {
        setAuctionStatus("Ongoing");
      } else {
        setAuctionStatus("Ended");
      }
    }
  }, [room]);

  const check = (val: string | Timestamp) => typeof val === "string";

  const starter = gettingStarter(roomId as string);
  const [maxStarter, setMaxStarter] = useState(0);
  useEffect(() => {
    if (
      room &&
      check(room.newFormValues.starter) &&
      room.newFormValues.starter === "people"
    ) {
      starter.then((data) => {
        if (data) {
          data.map((person) => {
            setMaxStarter((prevMax) => Math.max(prevMax, person.bidAmount));
          });
        }
      });
    }
  }, [room, starter]);

  if (loading || !room) return <Loader text="Fetching room details..." />;

  if (auctionStatus === "Ongoing") {
    
    return <Auction room={room} starter={maxStarter} />;
  } else if (auctionStatus === "Ended") {
    return <div>Auction Ended</div>;
  }

  return (
    <div className="bg-mainBackground min-h-screen p-8 flex justify-center">
      <div className="bg-secondaryBackground p-2 min-w-[40vw] max-h-[80vh] rounded-xl shadow-2xl overflow-y-scroll py-4">
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
          <Property title="Auction Status" content={auctionStatus} />
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
          <Property
            title="Starting Bid"
            content={
              check(room.newFormValues.starter)
                ? room.newFormValues.starter === "people"
                  ? maxStarter.toString()
                  : room.newFormValues.starter === "set"
                  ? (room.newFormValues.bid as string)
                  : "0 Bid"
                : ""
            }
          />
        </main>
        <footer className="flex flex-col items-center">
          {isLoggedin(currentUser, profile) &&
            (isRegistered ? (
              <span className="text-green-700">You are registered</span>
            ) : (
              <span className="text-red-700">You are not registered</span>
            ))}
          <Link
            to={`/view/${roomId}`}
            className="flex  items-center gap-2 hover:text-buttonBackground text-xl cursor-pointer"
          >
            <FaLink /> See the item
          </Link>
        </footer>
      </div>
    </div>
  );
};
