import { Link } from "react-router-dom";
import { RoomType } from "../requests";
import Countdown from "react-countdown";
import { useFetchRegisters } from "../hook/useFetchRegisters";
import { useAuth } from "../../Context";
import { FaUser } from "react-icons/fa6";

export const RoomCard = ({ room }: { room: RoomType }) => {
  const targetDate =
    typeof room.newFormValues.startdate !== "string"
      ? room.newFormValues.startdate.toDate().getTime()
      : new Date(room.newFormValues.startdate).getTime();
  const { profile } = useAuth();
  const { registeredUsers } = useFetchRegisters(room.id, profile);

  const renderRegisteredUsers = () => (
    <div className="flex -space-x-4 items-center mb-4">
      {registeredUsers.slice(0, 3).map((user) => (
        <div key={user.userId} className="flex items-center">
          <img
            className="w-12 h-12 rounded-full border-2 border-white"
            src={user.pic || "https://via.placeholder.com/150"}
            alt={user.name}
          />
        </div>
      ))}
      {registeredUsers.length > 5 && (
        <div className="text-gray-700">+{registeredUsers.length - 3}</div>
      )}
    </div>
  );

  return (
    <div className="relative flex w-96 flex-col rounded-xl bg-white bg-clip-border text-gray-700 shadow-md">
      <img
        src={room.coverPhoto}
        alt=""
        className="relative mx-4 -mt-6 h-40 overflow-hidden rounded-xl bg-brown-gray-500 bg-clip-border text-white shadow-lg shadow-brown-gray-500/40 bg-gradient-to-r from-brown-500 to-brown-600"
      />
      <div className="p-6">
        <Link
          to={`/rooms/view/${room.id}`}
          className="mb-2 block font-sans text-xl font-semibold leading-snug tracking-normal text-brown-gray-900 hover:text-buttonBackground antialiased"
        >
          {typeof room.newFormValues.name === "string"
            ? room.newFormValues.name
            : ""}
        </Link>
        <p className="block font-sans text-base font-light leading-relaxed text-inherit antialiased">
          {typeof room.newFormValues.description === "string" &&
            room.newFormValues.description.slice(0, 100)}
          ...
        </p>
        {typeof room.newFormValues.roomtype === "string" &&
        room.newFormValues.roomtype === "large" ? (
          <span className="bg-yellow-100 m-4 text-yellow-800 text-sm font-medium px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">
            Premium Room
          </span>
        ) : (
          <span className="bg-gray-100 text-gray-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">
            Basic Room
          </span>
        )}
        {typeof room.newFormValues.BuySell === "string" &&
        room.newFormValues.BuySell === "buy" ? (
          <span className="bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
            For Buyers
          </span>
        ) : (
          <span className="bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
            For Sellers
          </span>
        )}
      </div>
      <div className="p-6 pt-0 flex justify-between">
        <button
          data-ripple-light="true"
          type="button"
          className="select-none rounded-lg bg-white border-2 border-buttonBackground text-buttonBackground py-3 px-6 text-center align-middle font-sans text-lg font-bold uppercase shadow-md shadow-brown-500/20 transition-all hover:shadow-lg hover:shadow-brown-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
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
        {registeredUsers.length === 0 ? (
          <div className="text-gray-700 w-12 h-12 rounded-full border-2 border-gray-700 flex justify-center items-center">
            0 <FaUser />
          </div>
        ) : (
          renderRegisteredUsers()
        )}
      </div>
    </div>
  );
};
