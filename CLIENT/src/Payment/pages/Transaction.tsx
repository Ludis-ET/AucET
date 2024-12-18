import { Timestamp } from "firebase/firestore";
import { BuyBid, SpentBid, usePayment, WithdrawnBid } from "../../Context";
import { formatDistanceToNow } from "date-fns";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export const Transaction = () => {
  const { buyBids, spentBids, loading, withdrawnBids } = usePayment();
  const BidToETB = import.meta.env.VITE_BID_AMOUNT;
  const sortByDate = (arr: Array<BuyBid | SpentBid | WithdrawnBid>) => {
    return arr.sort((a, b) => {
      const dateA =
        a.createdAt instanceof Timestamp
          ? a.createdAt.toMillis()
          : new Date(a.createdAt).getTime();
      const dateB =
        b.createdAt instanceof Timestamp
          ? b.createdAt.toMillis()
          : new Date(b.createdAt).getTime();
      return dateB - dateA;
    });
  };

  const formatDate = (date: Date | Timestamp) => {
    const timestamp = date instanceof Timestamp ? date.toDate() : date;
    return formatDistanceToNow(timestamp, { addSuffix: true });
  };

  const sortedTransactions = sortByDate([
    ...buyBids,
    ...spentBids,
    ...withdrawnBids,
  ]);

  const getStatusColor = (status: string) => {
    if (status === "completed" || status === "refunded") {
      return "bg-green-700";
    } else if (status === "frozen") {
      return "bg-gray-400";
    } else if (status === "pending") {
      return "bg-yellow-600";
    } else if (status === "withdrawn") {
      return "bg-red-700";
    }
    return "bg-blue-900";
  };

  return (
    <div className="bg-secondaryBackground p-8 rounded-lg max-w-[90vw] min-w-[30vw] shadow-lg">
      <header className="flex justify-between items-center gap-20 border-b-2 pb-4">
        <p className="text-mainText font-extrabold text-2xl">
          Recent Transactions
        </p>
      </header>
      <main className="max-h-[40vh] pb-4 overflow-y-scroll">
        {loading ? (
          <div>
            {[...Array(5)].map((_, index) => (
              <div key={index} className="rounded-lg shadow-lg p-4 mb-4">
                <div className="flex justify-between items-center gap-12">
                  <span>
                    <Skeleton
                      className="text-otherText font-semibold"
                      width={100}
                    />
                    <Skeleton
                      className="text-gray-500 font-semibold"
                      width={80}
                    />
                    <Skeleton width={60} />
                  </span>
                  <Skeleton
                    className="font-semibold rounded-full p-2 text-secondaryBackground"
                    width={50}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            {sortedTransactions.map((transaction, i) => (
              <div
                key={i}
                className="bg-mainBackground rounded-lg shadow-lg p-4 mb-4"
              >
                <div className="flex justify-between items-center gap-12">
                  <span>
                    <p className="text-otherText font-semibold">
                      {transaction.amount *
                        ("txRef" in transaction ? 1 : BidToETB)}{" "}
                      ETB
                    </p>
                    <p className="text-gray-500 font-semibold">
                      {formatDate(transaction.createdAt)}
                    </p>
                    <p>{transaction.status}</p>
                    {"reason" in transaction && (
                      <p className="text-buttonBackground font-bold">
                        {transaction.reason}
                      </p>
                    )}
                  </span>
                  <p
                    className={`font-semibold rounded-full p-2 text-secondaryBackground ${getStatusColor(
                      transaction.status
                    )}`}
                  >
                    {"txRef" in transaction
                      ? "+ " + transaction.numberOfBids
                      : "status" in transaction &&
                        transaction.status === "refund"
                      ? "+" + transaction.amount
                      : "- " + transaction.amount}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
