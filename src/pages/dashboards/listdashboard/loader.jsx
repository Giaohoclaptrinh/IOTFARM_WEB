// loader.jsx
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../services/firebase/config";
import { auth } from "../../../services/firebase/config";
import { useAuth } from "../../../contexts/Auth";

export async function dashboardsLoader() {
  try {
    const user = getCurrentUser();  // Thay vì useAuth
    if (!user) {
      throw new Error('User not authenticated');
    }
    console.log("User ID:", user);

    

    // Lấy dữ liệu từ collection "dashboards" theo userId
    const q = query(collection(db, "dashboards"), where("userId", "==", user.uid));
    const querySnapshot = await getDocs(q);

    const dashboards = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return { dashboards };
  } catch (error) {
    console.error("Error loading dashboards:", error);
    throw error;
  }
}

function getCurrentUser() {
    const { currentUser } = useAuth();
    return currentUser;
  }
