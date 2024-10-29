import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";

type WinnerData = {
  roomId: string;
  winner: string;
  highestBid: number;
  totalBidders: number;
  userMaxBids: Array<{
    userId: string;
    name: string;
    maxBid: number;
    timestamp: string;
  }>;
};

export const Analytics = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [winnerData, setWinnerData] = useState<WinnerData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWinnerData = async () => {
      if (roomId) {
        try {
          const auctionAnalyticsRef = collection(db, "auctionAnalytics");
          const q = query(auctionAnalyticsRef, where("roomId", "==", roomId));
          const querySnapshot = await getDocs(q);

          console.log("Query executed for roomId:", roomId); // Log roomId
          console.log("Query Snapshot:", querySnapshot); // Log the snapshot

          if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
              console.log("Document data:", doc.data()); // Log document data
              setWinnerData(doc.data() as WinnerData);
            });
          } else {
            console.error("No documents found for this roomId!");
          }
        } catch (error) {
          console.error("Error fetching documents:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchWinnerData();
  }, [roomId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!winnerData) {
    return <p>No winner data found.</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Auction Summary for Room: {winnerData.roomId}
      </h1>
      <table className="w-full border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Winner ID</th>
            <th className="border px-4 py-2">Highest Bid</th>
            <th className="border px-4 py-2">Total Bidders</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border px-4 py-2">{winnerData.winner}</td>
            <td className="border px-4 py-2">{winnerData.highestBid}</td>
            <td className="border px-4 py-2">{winnerData.totalBidders}</td>
          </tr>
        </tbody>
      </table>
      <h2 className="text-xl font-bold mt-6 mb-4">Individual Bids</h2>
      <table className="w-full border">
        <thead>
          <tr>
            <th className="border px-4 py-2">User ID</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Max Bid</th>
            <th className="border px-4 py-2">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {winnerData.userMaxBids.map((bid, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{bid.userId}</td>
              <td className="border px-4 py-2">{bid.name}</td>
              <td className="border px-4 py-2">{bid.maxBid}</td>
              <td className="border px-4 py-2">
                {new Date(bid.timestamp).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
