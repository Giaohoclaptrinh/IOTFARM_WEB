// import {
//     createUserWithEmailAndPassword,
//     onAuthStateChanged,
//     signInWithEmailAndPassword,
//     signOut,
//   } from "firebase/auth";
//   import { HTTP_CONSTANTS } from "@/constants";
//   import { CONFIG_CONSTANTS } from "@/constants";
//   import { auth, route } from "./config";
//   import { FirebaseService } from "..";
//   import { ApiUtils } from "@/utils";
//   import AuthUtils from "@/utils/Auth";
  
//   // Định nghĩa AuthService
//   const AuthService = {
//     register: async (user) => {
//       try {
//         const userCredential = await createUserWithEmailAndPassword(
//           auth,
//           user.email,
//           CONFIG_CONSTANTS.DEFAULT_PASSWORD
//         );
//         const newUser = userCredential.user;
//         const result = {
//           ...user,
//           createdAt: new Date(),
//           isDisabled: 0,
//           role: CONFIG_CONSTANTS.EUserRole.USER,
//         };
//         await FirebaseService.createDocument("users", result, newUser.uid);
  
//         return ApiUtils.Response.success({ ...result, id: newUser.uid });
//       } catch (err) {
//         return ApiUtils.Response.error(err);
//       }
//     },
  
//     login: async (data) => {
//       try {
//         const res = await signInWithEmailAndPassword(
//           auth,
//           data.email,
//           data.password
//         );
//         const { user } = res;
//         const userDoc = await FirebaseService.getDocumentById(
//           "users",
//           user.uid
//         );
  
//         const result = {
//           id: user.uid,
//           email: user.email || "",
//           role: userDoc?.data?.role || CONFIG_CONSTANTS.EUserRole.USER,
//           fullName: userDoc?.data?.fullName || "",
//         };
//         return ApiUtils.Response.success(result, "Đăng nhập thành công");
//       } catch (err) {
//         return ApiUtils.Response.error(
//           err,
//           "Lỗi đăng nhập",
//           HTTP_CONSTANTS.EHttpStatusCode.BAD_REQUEST
//         );
//       }
//     },
  
//     logout: async () => {
//       try {
//         const res = await signOut(auth);
//         return ApiUtils.Response.success(res, "Đăng xuất thành công");
//       } catch (err) {
//         return ApiUtils.Response.error(
//           err,
//           "Lỗi đăng xuất",
//           HTTP_CONSTANTS.EHttpStatusCode.BAD_REQUEST
//         );
//       }
//     },
  
//     resetAccountPassword: async (user) => {
//       const { id } = user;
//       try {
//         const response = await ApiUtils.fetchAPI(route.adminApi, {
//           body: {
//             id,
//             newPassword: CONFIG_CONSTANTS.DEFAULT_PASSWORD,
//             api: "resetAccountPassword",
//           },
//         });
  
//         if (response.ok) {
//           const data = await response.json();
//           return ApiUtils.Response.success(data);
//         }
//         return ApiUtils.Response.error(response);
//       } catch (error) {
//         return ApiUtils.Response.error(error);
//       }
//     },
  
//     updateAccountStatus: async (user, disabled) => {
//       const { id } = user;
//       try {
//         const response = await ApiUtils.fetchAPI(route.adminApi, {
//           body: {
//             id,
//             disabled,
//             api: "updateAccountStatus",
//           },
//         });
//         if (response.ok) {
//           const data = await response.json();
//           return ApiUtils.Response.success(data);
//         }
//         return ApiUtils.Response.error(response);
//       } catch (error) {
//         return ApiUtils.Response.error(error);
//       }
//     },
  
//     deleteAccountByEmail: async (user) => {
//       const { email } = user;
//       try {
//         const response = await ApiUtils.fetchAPI(route.adminApi, {
//           body: {
//             email,
//             api: "deleteAccountByEmail",
//           },
//         });
//         if (response.ok) {
//           const data = await response.json();
//           return ApiUtils.Response.success(data);
//         }
//         return ApiUtils.Response.error(response);
//       } catch (error) {
//         return ApiUtils.Response.error(error);
//       }
//     },
  
//     onAuthStateChanged: (setUser) => {
//       const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
//         if (firebaseUser) {
//           const baseUser = AuthUtils.getUser();
//           if (baseUser) {
//             setUser(baseUser);
//           } else {
//             setUser(null);
//           }
//         } else {
//           setUser(null);
//         }
//       });
  
//       return unsubscribe; // Trả về hàm để hủy đăng ký listener khi component unmount
//     },
//   };
  
//   export default AuthService;
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
