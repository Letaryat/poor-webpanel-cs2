import Image from "next/image";
import { ServerList } from "@/components/serverlist";
import { HomeSwiper } from "@/components/swiper/swipers";
export default function Home() {
  return (
    <div className="flex justify-center">
      <main className="container">
        <HomeSwiper/>
        <ServerList/>
      </main>
    </div>
  );
}
