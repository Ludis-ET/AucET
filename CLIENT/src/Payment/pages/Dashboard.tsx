import { usePayment } from "../../Context";
import { BuyBid, Transaction, Withdrawal } from ".";

export const Dashboard = () => {
  const { totalBoughtBids, totalSpentBids, loading, net } =
    usePayment();

  return (
    <div className="bg-mainBackground h-screen w-full">
      <div className="mx-auto px-4 sm:px-6 lg:pt-24 lg:px-20">
        <h2 className="text-3xl font-extrabold tracking-tight text-mainText sm:text-4xl ">
          Payment Statistics
        </h2>
        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-4 mt-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-secondaryBackground overflow-hidden shadow sm:rounded-lg animate-pulse"
              >
                <div className="px-4 py-5 sm:p-6">
                  <dl>
                    <dt className="text-sm leading-5 font-medium text-otherText truncate">
                      <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                    </dt>
                    <dd className="mt-1 text-3xl leading-9 font-semibold text-mainText">
                      <div className="h-10 bg-gray-300 rounded w-1/3"></div>
                    </dd>
                  </dl>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-4 mt-4">
            <div className="bg-secondaryBackground overflow-hidden shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dl>
                  <dt className="text-sm leading-5 font-medium text-otherText truncate">
                    Total spent Bids
                  </dt>
                  <dd className="mt-1 text-3xl leading-9 font-semibold text-mainText">
                    {totalSpentBids.toFixed(2)} BIDS
                  </dd>
                </dl>
              </div>
            </div>
            {/* Repeat for other data blocks */}
            <div className="bg-secondaryBackground overflow-hidden shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dl>
                  <dt className="text-sm leading-5 font-medium text-otherText truncate">
                    Total Bought Bids
                  </dt>
                  <dd className="mt-1 text-3xl leading-9 font-semibold text-mainText">
                    {totalBoughtBids.toFixed(2)} BIDS
                  </dd>
                </dl>
              </div>
            </div>
            <div className="bg-secondaryBackground overflow-hidden shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dl>
                  <dt className="text-sm leading-5 font-medium text-otherText truncate">
                    Total Frozen Bids
                  </dt>
                  <dd className="mt-1 text-3xl leading-9 font-semibold text-mainText">
                    0 BIDS
                  </dd>
                </dl>
              </div>
            </div>
            <div className="bg-secondaryBackground overflow-hidden shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dl>
                  <dt className="text-sm leading-5 font-medium text-otherText truncate">
                    Net Bids
                  </dt>
                  <dd className="mt-1 text-3xl leading-9 font-semibold text-mainText">
                    {net.toFixed(2)} BIDS
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="px-4 py-8 w-full sm:px-6 lg:px-20 flex gap-4 flex-wrap justify-center">
        <BuyBid />
        <Transaction />
        <Withdrawal />
      </div>
    </div>
  );
};
