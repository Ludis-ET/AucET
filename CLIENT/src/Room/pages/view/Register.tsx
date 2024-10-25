import { useEffect, useState } from "react";
import { useAuth, usePayment } from "../../../Context";
import {
  fetchRegisteredUsers,
  peopleStarter,
  registerUser,
  RoomType,
  unregisterUser,
  UserRegistration,
} from "../../requests";
import { toast } from "react-hot-toast";
import { addSpendBid } from "../../../Payment/chapa";
import { ConfirmationModal } from "../../components";

const BidModal = ({
  onConfirm,
  onCancel,
  setBidAmount,
}: {
  onConfirm: () => void;
  onCancel: () => void;
  setBidAmount: (amount: number) => void;
}) => {
  const [amount, setAmount] = useState("");

  const handleConfirm = () => {
    const numericAmount = Number(amount);
    if (!isNaN(numericAmount) && numericAmount > 0) {
      setBidAmount(numericAmount);
      onConfirm();
    } else {
      toast.error("Please enter a valid amount.");
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-5 rounded shadow-lg">
        <p>Enter your bid amount:</p>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border mt-2 p-2 rounded w-full outline-none"
          placeholder="Bid amount"
          min="1"
          step="0.01"
        />
        <div className="flex space-x-2 mt-4">
          <button
            onClick={handleConfirm}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Confirm
          </button>
          <button
            onClick={onCancel}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export const Register = ({
  roomid,
  room,
  type,
  bid,
}: {
  roomid: string;
  room: RoomType;
  type?: string;
  bid?: number;
}) => {
  const { profile } = useAuth();
  const [registeredUsers, setRegisteredUsers] = useState<UserRegistration[]>(
    []
  );
  const [isRegistered, setIsRegistered] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showBidModal, setShowBidModal] = useState(false);
  const [bidAmount, setBidAmount] = useState(0);
  const { net } = usePayment();

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
    if (type === "set") {
      setShowModal(true);
    } else if (type === "people") {
      setShowBidModal(true);
    } else {
      registerUserWithConfirmation();
    }
  };

const registerUserWithConfirmation = async () => {
  try {
    const transactionRate =
      parseFloat(import.meta.env.VITE_TRANSACTION_FEE) / 100;
    const tax = transactionRate * bidAmount;
    const total = tax + bidAmount;

    if (total > net) {
      toast.error("You don't have enough bid!");
      return;
    }

    
    await peopleStarter(room, profile, total);
    await addSpendBid(profile, "Registration to an auction", total, "frozen");

    
    const registrationData = {
      userId: profile.userId,
      roomId: roomid,
      name: `${profile.firstName} ${profile.lastName}`,
      email: profile.email,
      pic: profile.photoURL || "",
      date: new Date().toISOString(),
    };

    
    await registerUser(registrationData);

    toast.success("User registered successfully!");
    setIsRegistered(true);
    setRegisteredUsers((prev) => [...prev, registrationData]);
  } catch {
    toast.error("Failed to register user.");
  }
};


  const confirmRegistration = async () => {
    if (bid) {
      const transaction = import.meta.env.VITE_TRANSACTION_FEE / 100;
      const tax = transaction * bid;
      const total = tax + bid;
      if (total > net) {
        toast.error("You don't have enough bid!");
      } else {
        await addSpendBid(
          profile,
          "Registration to an auction",
          total,
          "frozen"
        );
        toast.success("Payment Success");
        registerUserWithConfirmation();
      }
    }
    setShowModal(false);
  };

  const handleUnregister = async (userId: string) => {
    try {
      await unregisterUser(userId, roomid);
      if (bid) {
        await addSpendBid(profile, "Unregistering Room", bid, "refund");
      }
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
                  src={user.pic || "https://via.placeholder.com/150"}
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
                src={user.pic || "https://via.placeholder.com/150"}
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

      {showModal && (
        <ConfirmationModal
          onConfirm={confirmRegistration}
          onCancel={() => setShowModal(false)}
          message={`Pay the bid amount of ${bid} to register?`}
        />
      )}

      {showBidModal && (
        <BidModal
          onConfirm={() => {
            setShowBidModal(false);
            registerUserWithConfirmation();
          }}
          onCancel={() => setShowBidModal(false)}
          setBidAmount={setBidAmount}
        />
      )}
    </div>
  );
};