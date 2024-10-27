import { Route, Routes } from "react-router-dom";
import Room from "../Room/Room";
import { Footer, Header } from "./components";
import Payment from "../Payment/Payment";

const Home = () => {
  return (
    <div className="bg-mainBackground min-h-screen overflow-y-scroll p-8">
      <Header />
      <main className="min-h-[80vh]">
        <Routes>
          <Route path="/*" element={<Room />} />
          <Route path="/payments/*" element={<Payment />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
