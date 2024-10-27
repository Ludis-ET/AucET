export const Loader = ({ text }: { text: string }) => {
  return (
    <div className="col-span-4 md:col-span-3 w-full min-h-screen flex flex-col gap-4 items-center justify-center">
      <div className="loader"></div>
      <h1 className="text-2xl font-bold text-buttonBackground">
        {text}
      </h1>
    </div>
  );
};
