import { useEffect, useState } from "react";
import { useAuth } from "../../../Context";
import {
  fetchRegisteredUsers,
  registerUser,
  unregisterUser,
  UserRegistration,
} from "../../requests";
import { toast } from "react-hot-toast";

export const Register = ({ roomid }: { roomid: string }) => {
  const { profile } = useAuth();
  const [registeredUsers, setRegisteredUsers] = useState<UserRegistration[]>(
    []
  );
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const getRegisteredUsers = async () => {
      try {
        const users = await fetchRegisteredUsers();
        const filteredUsers = users.filter((user) => user.roomId === roomid);
        setRegisteredUsers(filteredUsers);
        const userExists = filteredUsers.some(
          (user) => user.userId === profile.userId
        );
        setIsRegistered(userExists);
      } catch {
        toast.error("Failed to fetch registered users.");
      }
    };

    getRegisteredUsers();
  }, [roomid, profile.userId]);

  const handleRegister = async () => {
    const registrationData = {
      userId: profile.userId,
      roomId: roomid,
      name: `${profile.firstName} ${profile.lastName}`,
      email: profile.email,
      pic:
        profile.photoURL ||
        "https://imgs.search.brave.com/GIL_dabaOq4GAxTVyW2oN5sl6gbK1dpS4fspnJz7FJY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by9hdmF0YXItcmVz/b3VyY2luZy1jb21w/YW55XzEyNTQ5Njct/NjY1My5qcGc_c2Vt/dD1haXNfaHlicmlk",
      date: new Date().toISOString(),
    };

    try {
      await registerUser(registrationData);
      toast.success("User registered successfully!");
      setIsRegistered(true);
      setRegisteredUsers((prev) => [...prev, registrationData]);
    } catch {
      toast.error("Failed to register user.");
    }
  };

  const handleUnregister = async (userId: string) => {
    try {
      await unregisterUser(userId, roomid);
      toast.success("User unregistered successfully!");
      setRegisteredUsers((prev) =>
        prev.filter((user) => user.userId !== userId)
      );
      setIsRegistered(false);
    } catch {
      toast.error("Failed to unregister user.");
    }
  };

  const renderRegisteredUsers = () => {
    if (registeredUsers.length > 5) {
      return (
        <>
          <div className="flex -space-x-4 items-center mb-4">
            {registeredUsers.slice(0, 5).map((user) => (
              <div key={user.userId} className="flex items-center">
                <img
                  className="w-12 h-12 rounded-full border-2 border-white"
                  src={
                    user.pic ||
                    "https://imgs.search.brave.com/GIL_dabaOq4GAxTVyW2oN5sl6gbK1dpS4fspnJz7FJY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by9hdmF0YXItcmVz/b3VyY2luZy1jb21w/YW55XzEyNTQ5Njct/NjY1My5qcGc_c2Vt/dD1haXNfaHlicmlk"
                  }
                  alt={user.name}
                />
              </div>
            ))}
          </div>
          <div className="text-gray-700">
            +{registeredUsers.length - 5} more
          </div>
        </>
      );
    } else {
      return (
        <div className="flex -space-x-4 items-center mb-4">
          {registeredUsers.map((user) => (
            <div key={user.userId} className="flex items-center">
              <img
                className="w-12 h-12 rounded-full border-2 border-white"
                src={
                  user.pic ||
                  "https://imgs.search.brave.com/GIL_dabaOq4GAxTVyW2oN5sl6gbK1dpS4fspnJz7FJY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by9hdmF0YXItcmVz/b3VyY2luZy1jb21w/YW55XzEyNTQ5Njct/NjY1My5qcGc_c2Vt/dD1haXNfaHlicmlk"
                }
                alt={user.name}
              />
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Registered Users</h2>
      {registeredUsers.length === 0 ? (
        <p>No users registered for this room.</p>
      ) : (
        renderRegisteredUsers()
      )}
      <div className="flex space-x-2">
        {isRegistered ? (
          <button
            onClick={() => handleUnregister(profile.userId)}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Unregister
          </button>
        ) : (
          <button
            onClick={handleRegister}
            className="bg-buttonBackground text-white px-4 py-2 rounded hover:bg-buttonHover"
          >
            Register
          </button>
        )}
      </div>
    </div>
  );
};
