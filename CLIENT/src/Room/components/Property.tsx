export const Property = ({
  title,
  content,
}: {
  title: string;
  content: string;
}) => {
  return (
    <div className="relative flex flex-col w-full pb-4 bg-mainBackground rounded-xl overflow-hidden font-sans text-sm">
      <div className="absolute inset-px bg-secondaryBackground rounded-[0.9375rem] z-20"></div>

      <div className="absolute left-2 inset-y-4 w-1 bg-gradient-to-b from-buttonHover via-buttonBackground to-mainText rounded-sm transform transition-transform duration-300 ease-linear hover:translate-x-1 z-30"></div>

      <div className="text-mainText cursor-pointer px-5 pt-4 pb-2 font-medium text-lg transition-transform duration-300 ease-linear hover:translate-x-1 z-40">
        {title}
      </div>
      <div className="text-otherText cursor-pointer px-5 transition-transform duration-300 ease-linear hover:translate-x-1.5 z-40">
        {content}
      </div>

      <div className="absolute w-[20rem] h-[20rem] bg-white opacity-0 transition-opacity duration-300 ease-in-out rounded-full -top-10 left-1/2 transform -translate-x-1/2 blur-lg z-10 hover:opacity-10"></div>
      <div className="absolute w-[20rem] h-[20rem] bg-white opacity-0 transition-opacity duration-300 ease-in-out rounded-full -top-10 left-1/2 transform -translate-x-1/2 blur-lg z-0 hover:opacity-10"></div>
    </div>
  );
};
