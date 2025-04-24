import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

import { auth, googleProvider } from "@/firebase/firebaseConfig";
import { Button } from "../ui/button";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { redirect, useNavigate } from "react-router";
import { useEffect } from "react";
import { useAuth } from "@/context/authContext";

export default function LandingPage() {
  const { user, handleLogin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user]);

  return (
    <div>
      <Button onClick={handleLogin}>Google login</Button>
    </div>
  );
}
