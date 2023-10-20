import React from "react";
import { useUserData } from "@/components/UserContext";
import ViewerDashboard from "../components/viewerDashboard";
import CreatorDashboard from "../components/creatorDashboard";

export default function Home() {
  const { profileState } = useUserData();
  return (
    <div className="relative pt-14">
      {profileState === "creator" ? <CreatorDashboard /> : <ViewerDashboard />}
    </div>
  );
}
