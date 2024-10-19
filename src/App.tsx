import { Suspense, lazy, useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";

const Auth = lazy(() => import("./Authentication/Auth"));
const Home = lazy(() => import("./Home/Home"));
const Payment = lazy(() => import("./Payment/Payment"));
const Room = lazy(() => import("./Room/Room"));

const App = () => {
  const [subdomain, setSubdomain] = useState("");

  useEffect(() => {
    const hostParts = window.location.hostname.split(".");
    if (hostParts.length > 1) {
      setSubdomain(hostParts[0]);
    }
  }, []);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {subdomain === "room" && <Route path="/" element={<Room />} />}
        {subdomain === "payment" && <Route path="/" element={<Payment />} />}
        {subdomain === "auth" && <Route path="/" element={<Auth />} />}
        {subdomain === "" && <Route path="/" element={<Home />} />}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Suspense>
  );
};

export default App;
