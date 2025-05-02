import { useAuth } from "@/context/authContext";
import React, { useEffect } from "react";

export default function Profile() {
  const { user } = useAuth();

  return <div>Profile</div>;
}
