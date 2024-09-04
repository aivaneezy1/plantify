import Image from "next/image";
import UploadComponent from "./components/Upload";

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
