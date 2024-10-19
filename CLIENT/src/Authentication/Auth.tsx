import { Login, PhoneNumberVerification } from "./pages";
import { useAuth } from "../Context";

const Auth = () => {
  const { loading, currentUser, profile } = useAuth();
  if (loading || (currentUser && !profile)) {
    return <div>auth Loading...</div>;
  } else if (!currentUser) {
    return <Login />;
  } else if (!profile.phoneVerified) {
    return <PhoneNumberVerification />;
  } else {
    return <div>Logged in</div>;
  }
};

export default Auth;
