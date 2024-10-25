import { LoaderIcon } from "react-hot-toast";
import { usePayment } from "../../Context";

export const Bids = () => {
  const {
    net,
    loading: paymentLoading,
  } = usePayment();
  return (
    <span className="bg-buttonBackground text-white p-2 rounded-full flex gap-2 font-bold items-center">
      {paymentLoading ? (
        <LoaderIcon />
      ) : (
        (net).toFixed(2)
      )}{" "}
      <span className="font-normal">BIDS</span>
    </span>
  );
};
