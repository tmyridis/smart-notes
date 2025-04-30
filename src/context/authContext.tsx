import {
  getAuth,
  GithubAuthProvider,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { db, googleProvider, githubProvider } from "@/firebase/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router";

const AuthContext = createContext<any>([]);

export function AuthProvider({ children }: { children: any }) {
  const auth = getAuth();
  const [user, setUser] = useState<User>();

  const navigate = useNavigate();
  const handleLogin = async (type: string) => {
    try {
      await signInWithPopup(
        auth,
        type === "google" ? googleProvider : githubProvider
      )
        .then(async (result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential =
            type === "google"
              ? GoogleAuthProvider.credentialFromResult(result)
              : GithubAuthProvider.credentialFromResult(result);
          if (credential) {
            const user = result.user;
            setUser(result.user);

            console.log(user);
            const docData = {
              email: user.email,
              displayName: user?.displayName,
              phoneNumber: user?.phoneNumber,
              photoURL: user.photoURL,
              notesFolder: [],
              tasksFolder: [],
              eventsFolder: [],
              scratchPad: "",
            };
            const ref = doc(db, "users", user.uid);
            const docSnap = await getDoc(ref);
            if (!docSnap.exists()) {
              await setDoc(doc(db, "users", user.uid), docData);
            }
          }
        })
        .catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.customData.email;
          // The AuthCredential type that was used.
          const credential = GoogleAuthProvider.credentialFromError(error);

          console.log(errorCode, errorMessage, credential);
          // ...
        });
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(undefined);
      localStorage.clear();
      navigate("/");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        console.log(user);
      } else {
        navigate("/");
      }
    });
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom Hook to use NotesContext
export function useAuth() {
  return useContext(AuthContext);
}
