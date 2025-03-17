import { auth, db } from "./firebaseConfig";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

// Đăng nhập
export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Login failed:", error.message);
    return null;
  }
};

// Đăng xuất
export const logout = async () => {
  await signOut(auth);
};

// Lấy quyền của user từ Firestore
export const getUserRole = async (uid) => {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    return userSnap.data().role;
  } else {
    return "user"; // Mặc định nếu không tìm thấy
  }
};
