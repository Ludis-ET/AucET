import { Login } from "./pages";
import { useAuth } from "../Context";

const Auth = () => {
  const { currentUser } = useAuth();
  console.log(currentUser);
  return <Login />;
};

export default Auth;
