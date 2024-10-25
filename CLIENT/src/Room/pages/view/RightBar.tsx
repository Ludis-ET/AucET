import { useAuth } from "../../../Context";
import verified from "/verified.png"

export const RightBar = () => {
  const { profile } = useAuth();
  
  return (
    <div className="col-span-1 bg-secondaryBackground sticky top-12 p-8 rounded-xl">
      <div className="w-full flex flex-col gap-4 items-center">
        <img
          src={
            profile.photoURL
              ? profile.photoURL
              : "https://imgs.search.brave.com/GIL_dabaOq4GAxTVyW2oN5sl6gbK1dpS4fspnJz7FJY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by9hdmF0YXItcmVz/b3VyY2luZy1jb21w/YW55XzEyNTQ5Njct/NjY1My5qcGc_c2Vt/dD1haXNfaHlicmlk"
          }
          className="w-40 h-40"
          alt=""
        />
        <p className="text-buttonBackground text-xl font-bold flex gap-2 items-center">{profile.displayName} <img src={verified} className="w-8" /> </p>
      </div>
    </div>
  );
};
