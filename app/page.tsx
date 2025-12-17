import Image from "next/image";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import Professionals from "./components/Professionals";
import Footer from "./components/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <Professionals />
        <Footer />
      </main>
    </>
  );
}
