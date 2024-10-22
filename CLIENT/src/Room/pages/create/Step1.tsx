import { SteProps } from "./CreateRoom";

export const Step1 = ({ form, click }: SteProps) => {
  const normal =
    "md:p-8 p-2 border-2 flex justify-center items-center cursor-pointer hover:bg-buttonBackground transform duration-[0.4s] hover:text-white border-buttonBackground rounded-lg  text-center md:text-2xl font-bold";
  const clicked =
    "md:p-8 p-2 border-2 flex justify-center items-center cursor-pointer bg-buttonBackground hover:bg-white transform duration-[0.4s] text-white hover:text-buttonBackground border-buttonBackground rounded-lg   text-center md:text-2xl font-bold";

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h3 className="font-medium">
          1. Are you creating the auction to sell or buy an item?
        </h3>
        <div className="flex md:ml-8 gap-4 flex-wrap">
          <p
            className={form[0] === "sell" ? clicked : normal}
            onClick={() => click(0, "sell")}
          >
            Sell
          </p>
          <p
            className={form[0] === "buy" ? clicked : normal}
            onClick={() => click(0, "buy")}
          >
            Buy
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="font-medium">
          2. Would you like users to see each other's bids in the auction room?
        </h3>
        <div className="flex md:ml-8 gap-4 flex-wrap">
          <p
            className={form[1] === "open" ? clicked : normal}
            onClick={() => click(1, "open")}
          >
            Yes, make bids visible
          </p>
          <p
            className={form[1] === "closed" ? clicked : normal}
            onClick={() => click(1, "closed")}
          >
            No, keep bids hidden
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="font-medium">
          3. What should be the initial starting bid for the auction?
        </h3>
        <div className="flex md:ml-8 gap-4 flex-wrap">
          <p
            className={form[2] === "free" ? clicked : normal}
            onClick={() => click(2, "free")}
          >
            No starting bid
          </p>
          <p
            className={form[2] === "set" ? clicked : normal}
            onClick={() => click(2, "set")}
          >
            Set a starting bid
          </p>
          <p
            className={form[2] === "people" ? clicked : normal}
            onClick={() => click(2, "people")}
          >
            Allow bidders to decide
          </p>
        </div>
      </div>
    </div>
  );
};
