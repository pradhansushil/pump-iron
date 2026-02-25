import { createContext, useContext, useState, useEffect } from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db, secondaryAuth } from "../firebase";

import { getMemberById } from "../services/db";

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  // prevents the app from making decisions (like showing the Log In page) before Firebase has finished seeing if there's an exisiting session from before.
  const [loading, setLoading] = useState(true);

  /* unsubscribe: the one that cancels the listener. if it wasn't stopped, the following can be issues:
      - onAuthStateChanged would keep watching for auth changes (if 
        user logs in, out, session expires)
      - memory leak, which leads to performance reduction
      - potential future bugs
    onAuthStateChanged: a listener that keeps watching for auth changes */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        // Fetch user role from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const role = userDoc.data().role;
          setUserRole(role);

          if (role === "member") {
            const memberData = await getMemberById(user.uid);

            if (memberData?.status === "suspended") {
              sessionStorage.setItem(
                "suspendedMessage",
                "Your account has been suspended. Please contact support",
              );
              await signOut(auth);
              return;
            }
          }
        }
      } else {
        setUserRole(null);
      }

      // loading becomes false when Firebase has finished verifying if there's an existing session or not.
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Signup function - creates new user and stores their role
  async function signup(email, password, role = "member") {
    /*Create the user in Firebase Authentication
      auth specifies which project i am registering this user to (like an address to a business) and createUserWithEmailandPassword() registers the user.
    */
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    // use setDoc to store the value of role. firebase auth cannot store this, only auth data (email and password).
    await setDoc(doc(db, "users", userCredential.user.uid), {
      email: email,
      role: role,
      createdAt: new Date().toISOString(),
    });

    return userCredential;
  }

  const adminCreateUser = async (email, password) => {
    const userCredential = await createUserWithEmailAndPassword(
      secondaryAuth,
      email,
      password,
    );

    await setDoc(doc(db, "users", userCredential.user.uid), {
      email: email,
      role: "member",
      createdAt: new Date().toISOString(),
    });
    await signOut(secondaryAuth);
    return userCredential;
  };

  // Login function - signs in existing user
  async function login(email, password) {
    // 1. Authenticate the user
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );

    // 2. Fetch their role from Firestore
    const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
    const userData = userDoc.data();

    // 3. Return the complete user object with role
    return {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      role: userData?.role || "member", // fallback to "member" if no role found
    };
  }

  // Logout function - signs out current user
  function logout() {
    return signOut(auth);
  }

  const value = {
    currentUser,
    userRole,
    loading,
    signup,
    login,
    logout,
    adminCreateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
