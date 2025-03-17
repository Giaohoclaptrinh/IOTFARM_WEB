import { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../../services/firebase/config';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  // Đăng ký trạng thái đăng nhập của người dùng
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (!user) {
            setCurrentUser(null);
            return;
        }
        const uid = user.uid; 
        console.log(uid);
        setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  const value = { currentUser };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook tùy chỉnh để sử dụng context
export function useAuth() {
  return useContext(AuthContext);
}