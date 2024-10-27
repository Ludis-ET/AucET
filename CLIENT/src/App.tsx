import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { Loader } from "./Room/components";

const Home = lazy(() => import("./Home/Home"));

const App = () => {
  return (
    <Suspense fallback={<Loader text="Loading..." />}>
      <Routes>
        <Route path="*" element={<Home />} />
      </Routes>
    </Suspense>
  );
};

export default App;
