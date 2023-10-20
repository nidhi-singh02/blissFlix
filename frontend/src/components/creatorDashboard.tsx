import React, { useState } from "react";
import Link from "next/link";
import UploadForm from "./creator/uploadVideo";
import Dashboard from "./creator/dashboard";

export default function CreatorDashboard() {
    const [state, setState] = useState("dashboard");
    console.log("state", state);
    
  return (
    <div className="relative">
     <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="text-bliss-black flex justify-center pb-14">
            <div>
                <button onClick={(e) => setState("upload")} className="border border-black px-4 py-2 w-32">Upload</button>
            </div>
            <div>
                <button onClick={() => setState("dashboard")} className="border border-black px-4 py-2 w-32">Dashboard</button>
            </div>
        </div>

        {state === "upload" ? <UploadForm/> : <Dashboard/>}
      </div>
    </div>
    </div>
  );
}
