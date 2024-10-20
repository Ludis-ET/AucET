export const Dashboard = () => {

  return (
    <div className="h-screen dark">
      {/* Main Content */}
      <main className="h-[calc(100vh-120px)] w-full absolute top-14 p-5">
        {/* User Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: "Total Users",
              count: 100,
              iconClass: "fa-users",
              bgColor: "bg-gray-200",
            },
            {
              title: "Total Active Users",
              count: 65,
              iconClass: "fa-users",
              bgColor: "bg-green-200",
            },
            {
              title: "Total Inactive Users",
              count: 30,
              iconClass: "fa-users",
              bgColor: "bg-yellow-200",
            },
            {
              title: "Deleted Users",
              count: 5,
              iconClass: "fa-users",
              bgColor: "bg-red-200",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-slate-50 p-5 m-2 rounded-md flex justify-between items-center shadow"
            >
              <div>
                <h3 className="font-bold">{item.title}</h3>
                <p className="text-gray-500">{item.count}</p>
              </div>
              <i
                className={`fa-solid ${item.iconClass} p-4 ${item.bgColor} rounded-md`}
              ></i>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Bar Chart */}
          <div className="m-2 shadow-md">
            <h2 className="text-xl p-2">Bar Chart</h2>
            <div id="chart" className="w-full "></div>
          </div>

          {/* User List */}
          <div className="overflow-x-auto m-2 shadow-md">
            <table className="w-full">
              <thead className="bg-gray-100 rounded-sm">
                <tr>
                  <th className="text-left">Avatar</th>
                  <th className="text-left">User Name</th>
                  <th className="text-left">Email</th>
                  <th className="text-left">Phone</th>
                  <th className="text-left">Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    name: "Rabiul Islam",
                    email: "rir.cse.71@gmail.com",
                    phone: "+8801750009149",
                    avatar:
                      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80",
                    status: "Active",
                    statusClass: "bg-green-50 text-green-700",
                  },
                  {
                    name: "Rahim Mia",
                    email: "rahim@gmail.com",
                    phone: "0000000000000",
                    avatar:
                      "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
                    status: "Deleted",
                    statusClass: "bg-red-50 text-red-700",
                  },
                  {
                    name: "Kuddus Ali",
                    email: "kuddus@gmail.com",
                    phone: "+1111111111111111",
                    avatar:
                      "https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
                    status: "Inactive",
                    statusClass: "bg-yellow-50 text-yellow-700",
                  },
                ].map((user, index) => (
                  <tr key={index}>
                    <td>
                      <img
                        className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
                        src={user.avatar}
                        alt={user.name}
                      />
                    </td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>
                      <span
                        className={`${user.statusClass} px-3 py-1 ring-1 text-xs rounded-md`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="text-center">
                      <div className="flex justify-between gap-1">
                        <i
                          title="Edit"
                          className="fa-solid fa-pencil p-1 text-green-500 rounded-full cursor-pointer"
                        ></i>
                        <i
                          title="View"
                          className="fa-solid fa-eye p-1 text-violet-500 rounded-full cursor-pointer"
                        ></i>
                        <i
                          title="Delete"
                          className="fa-solid fa-trash p-1 text-red-500 rounded-full cursor-pointer"
                        ></i>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};