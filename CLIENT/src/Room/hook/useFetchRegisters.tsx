import { useEffect, useState } from "react";
import { fetchRegisteredUsers, UserRegistration } from "../requests";
import { Profile } from "../../Context";
import toast from "react-hot-toast";

export const useFetchRegisters = (roomid: string, profile: Profile) => {
  const [registeredUsers, setRegisteredUsers] = useState<UserRegistration[]>(
    []
  );
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getRegisteredUsers = async () => {
      setLoading(true);
      try {
        const users = await fetchRegisteredUsers();
        const filteredUsers = users.filter((user) => user.roomId === roomid);
        setRegisteredUsers(filteredUsers);
        setIsRegistered(
          filteredUsers.some((user) => user.userId === profile.userId)
        );
      } catch {
        toast.error("Failed to fetch registered users.");
      }
      setLoading(false);
    };
    getRegisteredUsers();
  }, [roomid, profile.userId]);

  return { registeredUsers, isRegistered, loading, setRegisteredUsers, setIsRegistered };
};
