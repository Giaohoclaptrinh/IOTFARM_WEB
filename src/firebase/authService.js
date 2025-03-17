import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

// Đăng ký tài khoản và lưu vai trò
export const registerUser = async (email, password, role) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      email,
      role // "admin" hoặc "user"
    });

    return user;
  } catch (error) {
    throw error;
  }
};

// Đăng nhập
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

// Đăng xuất
export const logoutUser = async () => {
  await signOut(auth);
};

// Lấy vai trò người dùng từ Firestore
export const getUserRole = async (uid) => {
  const userDoc = await getDoc(doc(db, "users", uid));
  return userDoc.exists() ? userDoc.data().role : null;
};
