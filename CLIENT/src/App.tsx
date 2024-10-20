import { Suspense, lazy } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useAuth } from "./Context";

const Auth = lazy(() => import("./Authentication/Auth"));
const Home = lazy(() => import("./Home/Home"));
const Payment = lazy(() => import("./Payment/Payment"));
const Room = lazy(() => import("./Room/Room"));

const App = () => {
  const { currentUser, profile } = useAuth();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {currentUser && profile ? (
          <>
            <Route path="/rooms/*" element={<Room />} />
            <Route path="/payments/*" element={<Payment />} />
            <Route path="*" element={<Home />} />
          </>
        ) : (
          <Route path="*" element={<Auth />} />
        )}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Suspense>
  );
};

export default App;
