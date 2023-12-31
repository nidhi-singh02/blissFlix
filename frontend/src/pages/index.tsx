import React from "react";
import Link from "next/link";
import { useUserData } from "@/components/UserContext";

export default function Home() {
  const { handleProfileState } = useUserData();
  return (
    <div className="relative isolate pt-14">
      <div className="flex flex-col-reverse mx-auto max-w-7xl px-6 py-18 sm:py-24 md:flex-row lg:items-center lg:gap-x-10 lg:px-8 lg:py-14">
        <div className="mx-auto lg:mx-0 flex flex-col lg:flex-row items-center gap-24">
          <div>
          <h1 className="mt-8 max-w-lg text-2xl font-krona tracking-tight text-gray-900 sm:text-4xl">
            Bliss Flix
          </h1>
          <p className="pt-6 text-2xl">
            Respect Privacy, Empower Intimacy: Welcome to BlissFlix{" "}
          </p>
          <div className="flex gap-x-6 pt-10">
            <Link href="/creator-signup">
              <button
                onClick={() => handleProfileState("creator")}
                className="rounded-full px-8 py-2 bg-bliss-pink text-bliss-white"
              >
                Creator
              </button>
            </Link>
            <Link href="/viewer-signup">
              <button
                onClick={() => handleProfileState("viewer")}
                className="rounded-full px-8 py-2 bg-bliss-pink text-bliss-white"
              >
                Viewer
              </button>
            </Link>
          </div>
          </div> <div>
          <img className="h-[300px] lg:h-[500px] w-auto" src="landing.jpeg"/>
          </div>
        </div>
      </div>
    </div>
  );
}
