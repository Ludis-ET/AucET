import { useEffect, useState } from "react";
import { useAuth } from "../../../Context";
import { fetchRegisteredUsers, unregisterUser, UserRegistration } from "../../requests";
import { toast } from "react-hot-toast";

export const Register = ({ roomid }: { roomid: string }) => {
  const { profile } = useAuth();
  const [registeredUsers, setRegisteredUsers] = useState<UserRegistration[]>(
    []
  );

  useEffect(() => {
    const getRegisteredUsers = async () => {
      try {
        const users = await fetchRegisteredUsers();
        const filteredUsers = users.filter((user) => user.roomId === roomid);
        setRegisteredUsers(filteredUsers);
      } catch {
        toast.error("Failed to fetch registered users.");
      }
    };

    getRegisteredUsers();
  }, [roomid]);

  const handleUnregister = async (userId: string) => {
    try {
      await unregisterUser(userId, roomid);
      toast.success("User unregistered successfully!");
      setRegisteredUsers((prev) =>
        prev.filter((user) => user.userId !== userId)
      );
    } catch {
      toast.error("Failed to unregister user.");
    }
  };

  return (
    <div>
      <h2>Registered Users</h2>
      {registeredUsers.length === 0 ? (
        <p>No users registered for this room.</p>
      ) : (
        <ul>
          {registeredUsers.map((user, i) => (
            <li key={i}>
              <span>
                {user.name} ({user.email})
              </span>
              {user.userId === profile.userId && ( // Show button only for the logged-in user
                <button onClick={() => handleUnregister(user.userId)}>
                  Unregister
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
