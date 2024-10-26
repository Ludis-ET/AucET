import { Login, PhoneNumberVerification, NameSetup } from "./pages";
import { useAuth } from "../Context";

const Auth = () => {
  const { loading, currentUser, profile } = useAuth();
  if (loading || (currentUser && !profile)) {
    return <div>auth Loading...</div>;
  } else if (!currentUser) {
    return <Login />;
  } else if (!profile.phoneVerified) {
    return <PhoneNumberVerification />;
  } else if (!profile.firstName.length || !profile.lastName.length) {
    return <NameSetup />;
  } else {
    return <div>Logged in</div>;
  }
};

export default Auth;
