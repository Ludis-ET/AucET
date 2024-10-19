import { Login, PhoneNumberVerification } from "./pages";
import { useAuth } from "../Context";

const Auth = () => {
  const { currentUser, setCurrentUser } = useAuth();

  const setPhoneNumber = (phone: string) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, phoneNumber: phone };
      setCurrentUser(updatedUser);
    }
  };

  if (currentUser) {
    if (!currentUser.phoneNumber) {
      return <PhoneNumberVerification setPhoneNumber={setPhoneNumber} />;
    }
    return <div>Welcome, {currentUser.displayName}!</div>;
  }

  return <Login />;
};

export default Auth;
