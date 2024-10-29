import { useCallback, useEffect, useState } from "react";
import { FaUser } from "react-icons/fa6";
import { RoomType } from "../../requests";
import { realtimeDb, db } from "../../../firebase";
import { ref, onValue, remove, set } from "firebase/database";
import { useAuth, usePayment } from "../../../Context";
import { useNavigate } from "react-router-dom";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import toast from "react-hot-toast";

export const Chat = ({
  room,
  starter,
}: {
  room: RoomType;
  starter: number;
}) => {
  const { profile } = useAuth();
  const { net } = usePayment();
  const navigate = useNavigate();

  type MessageType = {
    id: string;
    bid: number;
    timestamp: string;
    senderId: string;
    name: string;
  };

  const [messages, setMessages] = useState<MessageType[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [maxBid, setMaxBid] = useState<number>(starter);
  const [timer, setTimer] = useState<number>(() => {
    const startTimestamp =
      typeof room.newFormValues.startdate === "object" &&
      "toDate" in room.newFormValues.startdate
        ? room.newFormValues.startdate.toDate().getTime()
        : new Date(room.newFormValues.startdate).getTime();

    const durationSeconds = Number(room.newFormValues.duration) * 3600;
    const endTime = startTimestamp + durationSeconds * 1000;
    const currentTime = Date.now();

    return Math.max(0, Math.floor((endTime - currentTime) / 1000));
  });

  const [winner, setWinner] = useState<string | null>(null);
  const [uniqueBidders, setUniqueBidders] = useState<Set<string>>(new Set());

  const formatTime = (seconds: number) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  useEffect(() => {
    const messagesRef = ref(realtimeDb, `rooms/${room.id}/messages`);

    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const fetchedMessages: MessageType[] = [];
      let maxBidValue = 0;
      const bidders = new Set<string>();

      snapshot.forEach((childSnapshot) => {
        const message = {
          id: childSnapshot.key,
          ...childSnapshot.val(),
        };
        fetchedMessages.push(message);
        bidders.add(message.senderId);

        if (message.bid > maxBidValue) {
          maxBidValue = message.bid;
        }
      });

      setMessages(fetchedMessages);
      setMaxBid(Math.max(maxBidValue, maxBid));
      setUniqueBidders(bidders);
    });

    return () => unsubscribe();
  }, [room.id, maxBid]);

  const handleCloseRoom = useCallback(async () => {
    const highestBidder = messages.reduce<MessageType>(
      (prev, current) => (prev.bid > current.bid ? prev : current),
      { id: "", bid: 0, timestamp: "", senderId: "", name: "" }
    );

    setWinner(highestBidder.senderId);

    const userMaxBids = Array.from(uniqueBidders).map((userId) => {
      const userMessages = messages.filter((msg) => msg.senderId === userId);
      const maxBidMessage = userMessages.reduce((prev, current) =>
        prev.bid > current.bid ? prev : current
      );
      return {
        userId,
        name: maxBidMessage.name,
        maxBid: maxBidMessage.bid,
        timestamp: maxBidMessage.timestamp,
      };
    });

    await setDoc(doc(db, "auctionAnalytics", room.id), {
      roomId: room.id,
      highestBid: maxBid,
      winner: highestBidder.senderId,
      totalBidders: uniqueBidders.size,
      userMaxBids,
      timestamp: new Date().toISOString(),
    });

    const roomRef = ref(realtimeDb, `rooms/${room.id}`);
    await remove(roomRef);

    navigate("/auction-summary");
  }, [messages, maxBid, navigate, room.id, uniqueBidders]);

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          handleCloseRoom();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [handleCloseRoom]);

  const handleSendMessage = async () => {
    if (newMessage.trim() && profile) {
      const bidAmount = parseFloat(newMessage);
      if (bidAmount <= maxBid) {
        toast.error("Bid must be higher than the current max bid.");
        return;
      } else if (bidAmount > net) {
        toast.error("You don't have enough bid.");
        return;
      }

      const messageId = Date.now().toString();
      await set(ref(realtimeDb, `rooms/${room.id}/messages/${messageId}`), {
        bid: bidAmount,
        timestamp: new Date().toISOString(),
        senderId: profile.userId,
        name: `${profile.firstName} ${profile.lastName}`,
      });
      setNewMessage("");
    }
  };

  return (
    <div className="bg-secondaryBackground p-4 rounded-lg max-w-[90vw]">
      <header className="border-b border-buttonBackground p-4">
        <span className="flex gap-2 text-xl">
          Room Id
          <p className="font-bold text-buttonBackground">:{room.id}</p>
        </span>
        <span className="w-full flex justify-between">
          <span className="bg-buttonBackground text-white p-2 rounded-full flex gap-2 items-center">
            {uniqueBidders.size} <FaUser />
          </span>
          <span className="bg-buttonBackground text-white p-2 rounded-full flex gap-2 items-center">
            {maxBid} <p>BID</p>
          </span>
        </span>
        <div className="text-red-500">Time Left: {formatTime(timer)}</div>
        {winner && <div className="text-green-500">Winner: {winner}</div>}
      </header>
      <main className="w-[500px] p-4 max-w-[90vw] h-[500px] max-h-[80vh] bg-mainBackground overflow-x-hidden overflow-y-scroll">
        {messages.map((message) => (
          <div key={message.id} className="flex gap-4 p-4">
            <div className="w-12 h-12 rounded-full bg-buttonBackground text-white flex items-center justify-center">
              {message.name.charAt(0)}
            </div>
            <div className="flex-1">
              <p className="font-bold">{message.name}</p>
              <p className="text-sm">
                I will pay{" "}
                <b className="text-buttonBackground text-md">{message.bid}</b>{" "}
                Bids
              </p>
            </div>
          </div>
        ))}
      </main>
      <footer className="p-2 flex gap-3">
        <input
          type="number"
          className="w-full p-2 rounded-lg border border-buttonBackground outline-none"
          placeholder="Enter your bid..."
          value={newMessage || maxBid + 0.01}
          onChange={(e) => setNewMessage(e.target.value)}
          min={maxBid + 0.01}
          step={0.01}
        />
        <button
          className="bg-buttonBackground cursor-pointer text-white px-4 rounded-lg"
          onClick={handleSendMessage}
        >
          Place Bid
        </button>
      </footer>
    </div>
  );
};
