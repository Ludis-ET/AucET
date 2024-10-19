import { FaGoogle } from "react-icons/fa";

export const Login = () => {

  return (
    <div className="bg-mainBackground flex justify-center items-center h-screen">
      <div className="w-1/2 h-screen hidden lg:block">
        <img
          src="https://imgs.search.brave.com/cJ8Sv_AvFN4U4Fe1q72njil-6NPRNdtGN_zijlQLtng/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTAw/NTIxNjUzMi9waG90/by9vbmxpbmUtYXVj/dGlvbi1jb25jZXB0/LndlYnA_Yj0xJnM9/NjEyeDYxMiZ3PTAm/az0yMCZjPW9KWl9R/SmNCNjBQQ0FjcnJo/Qk5zT2tWNmxiZnVK/RHRWYVhfdGZoRUpi/SFE9"
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
        //   onClick={handleLogin}
          className="bg-buttonBackground flex items-center justify-center hover:bg-buttonHover text-mainBackground font-semibold rounded-md py-2 px-4 text-2xl"
        >
          Continue with
          <FaGoogle className="inline-block ml-2" />
          Google
        </button>
      </div>
    </div>
  );
};
