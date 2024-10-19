import  { Suspense, lazy } from "react";
import { Route, Routes, Navigate } from "react-router-dom";

const Auth = lazy(() => import("./Authentication/Auth"));
const AboutPage = lazy(() => import("./components/AboutPage"));
const ContactPage = lazy(() => import("./components/ContactPage"));

const App = () => {
  return (
    // <Suspense fallback={<Loading />}>
    <Suspense >
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<Navigate to="/" />} />{" "}
        {/* Redirect to Home for any unknown routes */}
      </Routes>
    </Suspense>
  );
};

export default App;
