interface Props {
  form: string[];
  click: (i: number, value: string) => void;
}

export const Step1 = ({ form, click }: Props) => {
  const normal =
    "p-8 border-2 flex justify-center items-center cursor-pointer hover:bg-buttonBackground transform duration-[0.4s] hover:text-white border-buttonBackground rounded-lg w-40 text-center text-2xl font-bold";
  const clicked =
    "p-8 border-2 flex justify-center items-center cursor-pointer bg-buttonBackground hover:bg-white transform duration-[0.4s] text-white hover:text-buttonBackground border-buttonBackground rounded-lg w-40 text-center text-2xl font-bold";

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h3 className="font-medium">1. Do you going to sell or buy ?</h3>
        <div className="flex ml-8 gap-4">
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
          2. Do you want the autcion room to be closed or open to users ?
        </h3>
        <div className="flex ml-8 gap-4">
          <p
            className={form[1] === "open" ? clicked : normal}
            onClick={() => click(1, "open")}
          >
            Open
          </p>
          <p
            className={form[1] === "closed" ? clicked : normal}
            onClick={() => click(1, "closed")}
          >
            Closed
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="font-medium">
          3. How do you want it to be of the starting bid of the auction
        </h3>
        <div className="flex ml-8 gap-4">
          <p
            className={form[2] === "free" ? clicked : normal}
            onClick={() => click(2, "free")}
          >
            Free
          </p>
          <p
            className={form[2] === "set" ? clicked : normal}
            onClick={() => click(2, "set")}
          >
            Set the bid
          </p>
          <p
            className={form[2] === "people" ? clicked : normal}
            onClick={() => click(2, "people")}
          >
            Let the people decide
          </p>
        </div>
      </div>
    </div>
  );
};
