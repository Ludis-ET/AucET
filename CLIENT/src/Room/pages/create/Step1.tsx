export const Step1 = () => {
  return (
    <div className="p-4">
      <h3 className="font-medium">1. User Info</h3>
      <input
        type="text"
        placeholder="Enter your name"
        className="border rounded p-2 my-2 w-full"
      />
      <input
        type="email"
        placeholder="Enter your email"
        className="border rounded p-2 my-2 w-full"
      />
    </div>
  );
}
