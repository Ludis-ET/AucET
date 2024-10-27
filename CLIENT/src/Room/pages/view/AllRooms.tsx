import { useEffect, useState } from "react";
import { getRooms, RoomType } from "../../requests";
import { RoomCardSkeleton } from "./MyRooms";
import { RoomCard } from "../../components";

export const AllRooms = () => {
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState<RoomType[] | null>(null);
  const [filteredRooms, setFilteredRooms] = useState<RoomType[] | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [newFormValuesFilter, setNewFormValuesFilter] = useState({
    BuySell: "",
    Visibility: "",
  });

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      const response = await getRooms();
      setRooms(response);
      setFilteredRooms(response);
      setLoading(false);
    };
    fetchRooms();
  }, []);

  useEffect(() => {
    if (rooms) {
      const filtered = rooms.filter((room) => {
        const matchesSearchTerm = searchTerm
          ? Object.values(room.newFormValues).some((value) =>
              value.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
          : true;

        const matchesNewFormValues =
          (!newFormValuesFilter.BuySell ||
            room.newFormValues.BuySell === newFormValuesFilter.BuySell) &&
          (!newFormValuesFilter.Visibility ||
            room.newFormValues.Visibility === newFormValuesFilter.Visibility);

        let matchesDate = true;
        if (dateFilter) {
          const roomDate = room.createdAt.toDate();
          const now = new Date();
          if (dateFilter === "last7days") {
            matchesDate = roomDate >= new Date(now.setDate(now.getDate() - 7));
          } else if (dateFilter === "lastMonth") {
            matchesDate =
              roomDate >= new Date(now.setMonth(now.getMonth() - 1));
          }
        }

        return matchesSearchTerm && matchesDate && matchesNewFormValues;
      });

      setFilteredRooms(filtered);
    }
  }, [searchTerm, dateFilter, newFormValuesFilter, rooms]);

  return (
    <div className="bg-mainBackground min-h-screen p-8 ">
      <h1 className="text-3xl text-buttonBackground font-bold px-12">
        Register for the Rooms today and enjoy special benefits!
      </h1>

      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-3">
          <div className="w-full flex flex-wrap gap-12 p-12">
            {loading ? (
              <>
                {[...Array(12)].map((_, k) => (
                  <RoomCardSkeleton key={k} />
                ))}
              </>
            ) : filteredRooms && filteredRooms.length > 0 ? (
              filteredRooms.map((r) => <RoomCard key={r.id} room={r} />)
            ) : (
              <div className="text-center w-full">
                <h1 className="text-2xl font-bold">No Rooms Found</h1>
                <p className="text-gray-500">
                  No rooms match your search criteria.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="col-span-1 hidden md:block bg-secondaryBackground p-8 rounded-xl sticky top-12 max-h-[80vh]">
          <h3 className="text-xl font-bold mb-4">Filter & Search</h3>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Search by name or description"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-3 border rounded-md w-full border-gray-300 focus:outline-none focus:border-mainText"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-medium">Filter by Date</label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="p-3 border rounded-md w-full border-gray-300 focus:outline-none focus:border-mainText"
            >
              <option value="">Anytime</option>
              <option value="last7days">Last 7 Days</option>
              <option value="lastMonth">Last Month</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-medium">Buy or Sell</label>
            <select
              value={newFormValuesFilter.BuySell}
              onChange={(e) =>
                setNewFormValuesFilter((prev) => ({
                  ...prev,
                  BuySell: e.target.value,
                }))
              }
              className="p-3 border rounded-md w-full border-gray-300 focus:outline-none focus:border-mainText"
            >
              <option value="">Any</option>
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-medium">Visibility</label>
            <select
              value={newFormValuesFilter.Visibility}
              onChange={(e) =>
                setNewFormValuesFilter((prev) => ({
                  ...prev,
                  Visibility: e.target.value,
                }))
              }
              className="p-3 border rounded-md w-full border-gray-300 focus:outline-none focus:border-mainText"
            >
              <option value="">Any</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <button
            onClick={() => {
              setSearchTerm("");
              setDateFilter("");
              setNewFormValuesFilter({ BuySell: "", Visibility: "" });
              setFilteredRooms(rooms);
            }}
            className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors duration-300 w-full mt-4"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};
