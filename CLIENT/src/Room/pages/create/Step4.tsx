import { FaCheck } from "react-icons/fa6";
import { FcCheckmark } from "react-icons/fc";
import { SteProps } from "./CreateRoom";
import { usePayment } from "../../../Context";
import toast from "react-hot-toast";

export const Step4 = ({ form, click }: SteProps) => {
  const { net } = usePayment();
  return (
    <div className="">
      <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2">
        <div className="rounded-3xl rounded-t-3xl bg-white/60 p-8 ring-1 ring-gray-900/10 sm:mx-8 sm:rounded-b-none sm:p-10 lg:mx-0 lg:rounded-bl-3xl lg:rounded-tr-none">
          <h3
            id="tier-hobby"
            className="text-base font-semibold leading-7 text-buttonBackground"
          >
            Normal Room
          </h3>
          <p className="mt-4 flex items-baseline gap-x-2">
            <span className="text-5xl font-semibold tracking-tight text-gray-900">
              Free
            </span>
            <span className="text-base text-gray-500">Bid</span>
          </p>
          <p className="mt-6 text-base leading-7 text-gray-600">
            The perfect plan if you've planned to get small registrations
          </p>
          <ul
            role="list"
            className="mt-8 space-y-3 text-sm leading-6 text-gray-600 sm:mt-10"
          >
            <li className="flex gap-x-3">
              <FcCheckmark />
              60 Registrations
            </li>
            <li className="flex gap-x-3">
              <FcCheckmark />
              Advanced analytics
            </li>
            <li className="flex gap-x-3">
              <FcCheckmark />
              24-hour support response time
            </li>
          </ul>
          <a
            aria-describedby="tier-hobby"
            onClick={() => click(0, "small")}
            className="mt-8 block rounded-md cursor-pointer px-3.5 py-2.5 text-center text-sm font-semibold text-buttonBackground ring-1 ring-inset ring-buttonBackground hover:ring-buttonBackground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:mt-10"
          >
            Choose{form[0] == "small" && "d"}
          </a>
        </div>
        <div className="relative rounded-3xl bg-gray-900 p-8 shadow-2xl ring-1 ring-gray-900/10 sm:p-10">
          <h3
            id="tier-enterprise"
            className="text-base font-semibold leading-7 text-buttonBackground"
          >
            Adarash
          </h3>
          <p className="mt-4 flex items-baseline gap-x-2">
            <span className="text-5xl font-semibold tracking-tight text-white">
              2
            </span>
            <span className="text-base text-gray-400">Bids</span>
          </p>
          <p className="mt-6 text-base leading-7 text-gray-300">
            Dedicated support and infrastructure for your auction.
          </p>
          <ul
            role="list"
            className="mt-8 space-y-3 text-sm leading-6 text-gray-300 sm:mt-10"
          >
            <li className="flex gap-x-3">
              <FaCheck className="text-buttonBackground" />
              Unlimited Registrations
            </li>
            <li className="flex gap-x-3">
              <FaCheck className="text-buttonBackground" />
              Advanced analytics
            </li>
            <li className="flex gap-x-3">
              <FaCheck className="text-buttonBackground" />
              Dedicated support representative
            </li>
            <li className="flex gap-x-3">
              <FaCheck className="text-buttonBackground" />
              Marketing automations
            </li>
            <li className="flex gap-x-3">
              <FaCheck className="text-buttonBackground" />
              Custom integrations
            </li>
          </ul>
          <a
            aria-describedby="tier-enterprise"
            onClick={() => {
              if (net < 2) {
                toast.error("you don't have enough bids");
                click(0, "small");
              } else {
                click(0, "large");
              }
            }}
            className="mt-8 block rounded-md cursor-pointer bg-buttonBackground px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-buttonHover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 sm:mt-10"
          >
            Choose{form[0] === "large" && "d"}
          </a>
        </div>
      </div>
    </div>
  );
};
