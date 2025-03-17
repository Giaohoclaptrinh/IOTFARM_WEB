import {
  query,
  collection,
  getDocs,
  orderBy,
  doc,
  where,
  getDoc,
  addDoc,
  Timestamp,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./config";

function formatTimestampMinute(timestampSeconds) {
  // Chuyển đổi từ seconds (giây) thành đối tượng Date
  const forrmatDate = new Date(timestampSeconds * 1000); // Nhân với 1000 để chuyển sang mili giây

  // Định dạng ngày tháng theo kiểu 'yyyy-mm-dd hh:mm:ss'
  return forrmatDate.toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}


//Get name of email auth
export const getNameAndEmailByUserId = async (userId) => {
  try {
    const userDocRef = doc(db, "users", userId); // Tham chiếu tới tài liệu bằng userId
    const userDoc = await getDoc(userDocRef); // Lấy tài liệu từ Firestore

    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() }; // Trả về ID và dữ liệu tài liệu
    } else {
      console.error("User document not found.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user data: ", error);
    return null;
  }
}
// Get Dashboards
export async function getDashboards() {
  try {
    const q = query(collection(db, "dashboards")); 
    const querySnapshot = await getDocs(q);
    const dashboards = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      // updateTime: doc.createTime,
    }));
    console.log("All dashboards fetched");
    return dashboards;
  } catch (error) {
    console.error(error);
  }
}
/* -------------------------------------------------------------------------- */

// Get Dashboard By UserId
export const getDashboardsByUserId = async (userId) => {
  try {
    const dashboardsRef = collection(db, "dashboards");
    const q = query(dashboardsRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const dashboards = querySnapshot.docs.map((doc) => ({
      id: doc.id, 
      ...doc.data(),
      updateTime: formatTimestampMinute(doc._document.version.timestamp.seconds),
      createTime: formatTimestampMinute(doc._document.createTime.timestamp.seconds)
    }));    
    console.log(`Fetched dashboards for userId ${userId}`);
    return dashboards; // Trả về danh sách dashboards
  } catch (error) {
    console.error("Error fetching dashboards by userId:", error);
    throw error; // Ném lỗi để xử lý bên ngoài
  }
};

/* -------------------------------------------------------------------------- */

// Get Dashboard By Id
export const getDashboardById = async (dashboardId) => {
  try {
    const dashboardRef = doc(db, "dashboards", dashboardId);
    const dashboardSnapshot = await getDoc(dashboardRef);

    if (dashboardSnapshot.exists()) {
      console.log(`Dashboard ID ${dashboardId} fetched`);
      return dashboardSnapshot.data();
    }
  } catch (error) {
    console.error(error);
  }
};
/* -------------------------------------------------------------------------- */

// Add Dashboard
export const addDashboard = async (dashboard) => {
  try {
    return await addDoc(collection(db, "dashboards"), dashboard);
    console.log("Dashboard added");
  } catch (error) {
    console.error(error);
  }
};
/* -------------------------------------------------------------------------- */

// Delete Dashboard
export const deleteDashboard = async (dashboardId) => {
  try {
    const dashboardRef = doc(db, "dashboards", dashboardId);
    console.log("Dashboard deleted");
    await deleteDoc(dashboardRef);
  } catch (error) {
    console.error(error);
  }
};

/* -------------------------------------------------------------------------- */

// Update Dashboard
export const updateDashboard = async (dashboardId, dashboard) => {
  try {
    const dashboardRef = doc(db, "dashboards", dashboardId);
    await updateDoc(dashboardRef, dashboard);
    console.log("Dashboard updated");
  } catch (error) {
    console.error(error);
  }
}
/* -------------------------------------------------------------------------- */

// get Devices

export async function getDevicesByUserId(userId) {
  try {
    const devicesRef = (collection(db, "devices"));
    const q = query(devicesRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    // console.log(querySnapshot)
    const devices = querySnapshot.docs.map((doc) => {
      const updateTime = formatTimestampMinute(doc._document.version.timestamp.seconds);
      const createTime = formatTimestampMinute(doc._document.createTime.timestamp.seconds);
      return {
        id: doc.id,
        ...doc.data(),
        updateTime: updateTime,
        createTime: createTime
      };
    });
 
    console.log(`Fetched devices for userId ${userId}`);
    return devices;

  } catch (error) {
    console.error(error);
  }
}

/* -------------------------------------------------------------------------- */

//delete Device

export const deleteDevice = async (deviceId) => {
  try {
    const deviceRef = doc(db, "devices", deviceId);
    await deleteDoc(deviceRef);
    console.log("Device deleted");
  } catch (error) {
    console.error(error);
  }
};
/* -------------------------------------------------------------------------- */

//add Device

export const addDevice = async (device) => {
  try {
    // const docRef = await addDoc(collection(db, "devices"), device);
    return await addDoc(collection(db, "devices"), device);
    // console.log("Device added with ID: ", docRef);
    // return {id: docRef.id, createTime: formatTimestampMinute(docRef._document.createTime.timestamp.seconds)};
    console.log("Device added");
  } catch (error) {
    console.error(error);
  }
};

/* -------------------------------------------------------------------------- */

//update Device

export const updateDevice = async (deviceId, updatedFields) => {
  try {
    const deviceRef = doc(db, "devices", deviceId);
    await updateDoc(deviceRef, updatedFields);
    console.log("Device updated");
  } catch (error) {
    console.error(error);
  }
};

/* -------------------------------------------------------------------------- */

/*-------------------------CURD Variables-------------------------*/
//get Variables By UserId

export async function getVariablesByUserId(userId) {
  try {
    const variablesRef = collection(db, "variables");
    const q = query(variablesRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const variables = querySnapshot.docs.map((doc) => ({
      id: doc.id, 
      ...doc.data(),
    }));    
    console.log(`Fetched variables for userId ${userId}`);
    return variables; // Trả về danh sách dashboards
  } catch (error) {
    console.error("Error fetching variables by userId:", error);
    throw error; 
  }
}
//get Variable By DeviceId
export async function getVariablesByDeviceId(deviceId) {
  try {
    const variablesRef = collection(db, "variables");
    const q = query(variablesRef, where("deviceId", "==", deviceId));
    const querySnapshot = await getDocs(q);
    const variables = querySnapshot.docs.map((doc) => ({
      id: doc.id, 
      ...doc.data(),
    }));    
    console.log(`Fetched variables for deviceId ${deviceId}`);
    return variables; // Trả về danh sách dashboards
  } catch (error) {
    console.error("Error fetching variables by deviceId:", error);
    throw error; 
  }
}

// add Variable
export const addVariable = async (variable) => {
  try {
    return await addDoc(collection(db, "variables"), variable);
    console.log("Variable added");
  } catch (error) {
    console.error(error);
  }
};

/* -------------------------------------------------------------------------- */

//delete Variable

export const deleteVariable = async (variableId) => {
  try {
    const variableRef = doc(db, "variables", variableId);
    await deleteDoc(variableRef);
    console.log("Variable deleted");
  } catch (error) {
    console.error(error);
  }
};

/* -------------------------------------------------------------------------- */

//update Variable

export const updateVariable = async (variableId, updatedFields) => {
  try {
    const variableRef = doc(db, "variables", variableId);
    await updateDoc(variableRef, updatedFields);
    console.log("Variable updated");
  } catch (error) {
    console.error(error);
  }
};

/* -------------------------------------------------------------------------- */

