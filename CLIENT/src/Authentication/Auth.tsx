import { Login, PhoneNumberVerification } from "./pages";
import { useAuth } from "../Context";

const Auth = () => {
  const { currentUser, profile } = useAuth();

  if (!currentUser) {
    return <Login />;
  }else if (!profile?.phoneVerified) {
    return <PhoneNumberVerification />;
  }

};

export default Auth;
