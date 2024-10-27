import Room from "../Room/Room";
import { Footer, Header } from "./components";

const Home = () => {
  return (
    <div className="bg-mainBackground min-h-screen overflow-y-scroll p-8">
      <Header />
      <main className="min-h-[80vh]">
        <Room />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
