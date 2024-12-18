import { SteProps } from "./CreateRoom";

export const Step3 = ({ form, click }: SteProps) => {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="font-medium">3. Fill the room description detail</h3>
      <input
        type="text"
        className="outline-none border-2 border-buttonBackground rounded-xl p-3"
        value={typeof form[1] === "string" ? form[1] : ""}
        onChange={(e) => click(1, e.target.value)}
        placeholder="Name of the Product"
      />
      <textarea
        className="outline-none border-2 border-buttonBackground rounded-xl min-h-[45vh] p-3"
        value={typeof form[0] === "string" ? form[0] : ""}
        onChange={(e) => click(0, e.target.value)}
        placeholder="Insert a comprehensive description"
      ></textarea>
    </div>
  );
};
