import Image from "next/image";
import UploadComponent from "./components/Upload";
import CanvasComponent from "./components/Canvas";
import Hero from "./components/Hero";
import { Footer } from "./components/Footer";
export default function Home() {
  return (
    <div className="">
    <Hero/>
    <Footer/>
    </div>
  );
}
