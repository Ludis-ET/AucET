import { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa6";
import { RoomType } from "../../requests";
import { realtimeDb } from "../../../firebase";
import { ref, onValue, set } from "firebase/database";
import { useAuth } from "../../../Context";

export const Chat = ({ room }: { room: RoomType }) => {
  const { profile } = useAuth();
  type MessageType = {
    id: string;
    bid: number;
    timestamp: string;
    senderId: string;
  };

  const [messages, setMessages] = useState<MessageType[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");

  useEffect(() => {
    const messagesRef = ref(realtimeDb, `rooms/${room.id}/messages`);

    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const fetchedMessages: MessageType[] = [];
      snapshot.forEach((childSnapshot) => {
        fetchedMessages.push({
          id: childSnapshot.key,
          ...childSnapshot.val(),
        });
      });
      setMessages(fetchedMessages);
    });

    return () => unsubscribe();
  }, [room.id]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      const messageId = Date.now();
      await set(ref(realtimeDb, `rooms/${room.id}/messages/${messageId}`), {
        content: newMessage,
        timestamp: new Date().toISOString(),
        senderId: profile.userId,
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
            20 <FaUser />
          </span>
          <span className="bg-buttonBackground text-white p-2 rounded-full flex gap-2 items-center">
            50 <p>BID</p>
          </span>
        </span>
      </header>
      <main className="w-[500px] p-4 max-w-[90vw] h-[500px] max-h-[80vh] bg-mainBackground overflow-x-hidden overflow-y-scroll">
        {messages.map((message) => (
          <div key={message.id} className="flex gap-4 p-4">
            <div className="w-12 h-12 rounded-full bg-buttonBackground text-white flex items-center justify-center">
              {message.senderId.charAt(0)}
            </div>
            <div className="flex-1">
              <p className="font-bold">{message.senderId}</p>
              <p className="text-sm">{message.bid}</p>
            </div>
          </div>
        ))}
      </main>
      <footer className="p-2 flex gap-3">
        <input
          type="number"
          className="w-full p-2 rounded-lg border border-buttonBackground outline-none"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          className="bg-buttonBackground cursor-pointer text-white px-4 rounded-lg"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </footer>
    </div>
  );
};
