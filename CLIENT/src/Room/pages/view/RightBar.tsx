import { useAuth } from "../../../Context";

export const RightBar = () => {
  const { profile } = useAuth();
  console.log(profile)
  return (
    <div className="col-span-1 bg-secondaryBackground sticky top-12 p-8 rounded-xl">
      <div>
        <img src={profile.photoURL} className="w-96 h-96" alt="" />
        <p>
            {profile.displayName}
        </p>
      </div>
    </div>
  );
};
