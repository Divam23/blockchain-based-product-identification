import { useFirebase } from "../context/firebaseProvider";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
} from "firebase/auth";
import { showToast } from "../components/Notification";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const useAuthFunctions = () => {
  const { auth, setUser, user, loading } = useFirebase();
  const navigate = useNavigate();

  // Signup User
  const signUpUser = async (email, password, displayName) => {
    try {
      const userCredential = await toast.promise(
        createUserWithEmailAndPassword(auth, email, password),
        {
          pending: "Signing up...",
          success: "Signed up successfully! 🎉",
          error: "Signup failed! 😞",
        },
        { position: "bottom-center", autoClose: 1000 }
      );

      const newUser = userCredential.user;
      await updateProfile(newUser, { displayName });

      setUser({ ...newUser, displayName });

      return newUser;
    } catch (error) {
      console.error("Signup Error:", error);
      showToast(error.message,"error");
      navigate("/signup");
    }
  };

  // Sign in User
  const signInUser = async (email, password) => {
    try {
      const userCredential = await toast.promise(
        signInWithEmailAndPassword(auth, email, password),
        {
          pending: "Signing in...",
          success: "Signed in successfully! 🚀",
          error: "Sign in failed! ❌",
        },
        { position: "bottom-center", autoClose: 1000 }
      );
  
      const loggedInUser = userCredential.user;

      const tokenResult = await loggedInUser.getIdTokenResult(true);
      console.log(tokenResult.claims.role)
      const role = tokenResult.claims.role || "manufacturer";
      console.log("Custom Claims:", tokenResult.claims);

      const enrichedUser = {
        ...loggedInUser,
        role,
        customClaims: tokenResult.claims,
      };
  
      setUser(enrichedUser);
      return enrichedUser;
    } catch (error) {
      console.error("Sign In Error:", error);
      showToast(error.message, "error");
      throw error;
    }
  };
  

  // Sign out User
  const signOutUser = async () => {
    try {
      await signOut(auth);
      setUser(null);
      showToast("Signed out successfully!", "success");
    } catch (error) {
      console.error("Sign Out Error:", error);
      showToast(error.message, "error");
    }
  };

  return { 
    user,
    loading,
    signUpUser,
    signInUser,
    signOutUser,
  };
};
