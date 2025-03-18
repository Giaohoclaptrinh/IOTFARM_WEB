import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const withAuthorization = (WrappedComponent, requiredRole) => {
  return function ProtectedComponent(props) {
    const [userRole, setUserRole] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
      const fetchUserRole = async () => {
        if (auth.currentUser) {
          const userRef = doc(db, "users", auth.currentUser.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            setUserRole(userSnap.data().role);
          }
        }
      };

      fetchUserRole();
    }, []);

    if (!userRole) {
      return <p>Loading...</p>;
    }

    if (userRole !== requiredRole) {
      navigate("/unauthorized");
      return null;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuthorization;
