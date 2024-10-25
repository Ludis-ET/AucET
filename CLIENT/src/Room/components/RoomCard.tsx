import { Link } from "react-router-dom";
import { RoomType } from "../requests";
import Countdown from "react-countdown";

export const RoomCard = ({ room }: { room: RoomType }) => {
  const targetDate = typeof room.newFormValues.startdate !== 'string'
    ? room.newFormValues.startdate.toDate().getTime()
    : new Date(room.newFormValues.startdate).getTime();

  return (
    <div className="relative flex w-96 flex-col rounded-xl bg-white bg-clip-border text-gray-700 shadow-md">
      <img
        src={room.coverPhoto}
        alt=""
        className="relative mx-4 -mt-6 h-40 overflow-hidden rounded-xl bg-brown-gray-500 bg-clip-border text-white shadow-lg shadow-brown-gray-500/40 bg-gradient-to-r from-brown-500 to-brown-600"
      />
      <div className="p-6">
        <Link to={`/rooms/view/${room.id}`} className="mb-2 block font-sans text-xl font-semibold leading-snug tracking-normal text-brown-gray-900 antialiased">
          {typeof room.newFormValues.name === "string"
            ? room.newFormValues.name
            : ""}
        </Link>
        <p className="block font-sans text-base font-light leading-relaxed text-inherit antialiased">
          {typeof room.newFormValues.description === "string" &&
            room.newFormValues.description.slice(0, 100)}
          ...
        </p>
      </div>
      <div className="p-6 pt-0 flex justify-between">
        <button
          data-ripple-light="true"
          type="button"
          className="select-none rounded-lg bg-buttonBackground py-3 px-6 text-center align-middle font-sans text-lg font-bold uppercase text-white shadow-md shadow-brown-500/20 transition-all hover:shadow-lg hover:shadow-brown-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
        >
          <Countdown
            date={targetDate}
            renderer={({ days, hours, minutes, seconds, completed }) => {
              if (completed) {
                return <span>Time's up!</span>;
              } else {
                return (
                  <span>
                    {days}d {hours}h {minutes}m {seconds}s
                  </span>
                );
              }
            }}
          />
        </button>
        <div className="flex -space-x-4 items-center">
          <img
            className="w-12 h-12 rounded-full border-2 border-white"
            src="https://imgs.search.brave.com/cnBTPfjieYl8Zldapb6BREkh4fHewxyfQLQivSZTkjs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9keWwz/NDdoaXd2M2N0LmNs/b3VkZnJvbnQubmV0/L2FwcC91cGxvYWRz/LzIwMjMvMDkvQ2Fy/ZWVycy1iZWxvdy1z/dGF0cy0xLTEud2Vi/cA"
            alt="Profile 1"
          />
          <img
            className="w-12 h-12 rounded-full border-2 border-white"
            src="https://imgs.search.brave.com/cnBTPfjieYl8Zldapb6BREkh4fHewxyfQLQivSZTkjs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9keWwz/NDdoaXd2M2N0LmNs/b3VkZnJvbnQubmV0/L2FwcC91cGxvYWRz/LzIwMjMvMDkvQ2Fy/ZWVycy1iZWxvdy1z/dGF0cy0xLTEud2Vi/cA"
            alt="Profile 2"
          />
          <div className="w-12 h-12 flex items-center justify-center bg-gray-300 text-gray-700 rounded-full border-2 border-white font-bold">
            +700
          </div>
        </div>
      </div>
    </div>
  );
};
