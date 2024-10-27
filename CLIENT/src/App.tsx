import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { Loader } from "./Room/components";

const Home = lazy(() => import("./Home/Home"));
const Auth = lazy(() => import("./Authentication/Auth"));

const App = () => {
  return (
    <Suspense fallback={<Loader text="Loading..." />}>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Suspense>
  );
};

export default App;
