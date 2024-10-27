import { useState } from "react";
import { FaGoogle } from "react-icons/fa";

import { signUpWithGoogle } from "../firebase/GoogleAuth";
import { useAuth } from "../../Context";
import { LuLoader } from "react-icons/lu";

export const Login = () => {
  const { setCurrentUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      await signUpWithGoogle(setCurrentUser);
      setLoading(false);
    } catch (error) {
      console.error("Google sign-in failed:", error);
      setLoading(false);
    }
  };

  return (
    <div className="bg-mainBackground flex justify-center items-center h-screen">
      <div className="w-1/2 h-screen hidden lg:block">
        <img
          src="https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          alt="Placeholder"
          className="object-cover w-full h-full"
        />
      </div>
      <div className="lg:p-36 md:p-52 sm:p-20 p-8 w-full flex flex-col gap-8 lg:w-1/2">
        <h1 className="text-4xl text-center font-semibold mb-4 text-mainText">
          Welcome to AucEt, your premier online auction platform where exciting
          bidding experiences await!
        </h1>
        <button
          onClick={handleLogin}
          className="bg-buttonBackground flex items-center justify-center hover:bg-buttonHover text-mainBackground font-semibold rounded-md py-2 px-4 text-2xl"
        >
          {!loading ? (
            <>
              Continue with
              <FaGoogle className="inline-block ml-2" />
              oogle
            </>
          ) : (
            <LuLoader />
          )}
        </button>
      </div>
    </div>
  );
};
