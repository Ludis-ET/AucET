import { useState } from "react";

export const Step1 = () => {
  const [form, setForm] = useState([""]);

  const normal =
    "p-8 border-2 cursor-pointer hover:bg-buttonBackground transform duration-[0.4s] hover:text-white border-buttonBackground rounded-lg w-40 text-center text-2xl font-bold";
  const clicked =
    "p-8 border-2 cursor-pointer bg-buttonBackground hover:bg-white transform duration-[0.4s] text-white hover:text-buttonBackground border-buttonBackground rounded-lg w-40 text-center text-2xl font-bold";

  const click = (i: number, value: string) => {
    const newForm = [...form];
    newForm[i] = value;
    setForm(newForm);
  };

  return (
    <div className="p-4">
      <h3 className="font-medium">1. User Info</h3>
      <div className="flex gap-4">
        <p
          className={form[0] === "one" ? clicked : normal}
          onClick={() => click(0, "one")}
        >
          one
        </p>
        <p
          className={form[0] === "two" ? clicked : normal}
          onClick={() => click(0, "two")}
        >
          two
        </p>
      </div>
      <input
        type="email"
        placeholder="Enter your email"
        className="border rounded p-2 my-2 w-full"
      />
    </div>
  );
};
