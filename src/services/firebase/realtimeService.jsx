import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "./config";

function formatTimestampSecond(timestampSeconds) {
    // Chuyển đổi từ seconds (giây) thành đối tượng Date
    const createDate = new Date(timestampSeconds * 1000); // Nhân với 1000 để chuyển sang mili giây
  
    // Định dạng ngày tháng theo kiểu 'yyyy-mm-dd hh:mm:ss'
    return createDate.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  }
  export const listenVariablesByDeviceId = (deviceId, setVariables) => {
    const collectionRef = collection(db, "variables"); // Collection name "variables"
    const q = query(collectionRef, where("deviceId", "==", deviceId)); // Filter theo `deviceId`
  
    // Đăng ký lắng nghe sự thay đổi
    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log(snapshot.docs)
      const variables = snapshot.docs.map((doc) => (
        {
        id: doc.id,
        ...doc.data(),
        lastUpdate: formatTimestampSecond(doc._document.version.timestamp.seconds)
      }));
      setVariables(variables);
  
    //   console.log("Filtered variables for deviceId:", deviceId, variables);
    });
  
    return unsubscribe;
  };

  export const listenStatusOfDeviceId = (deviceId, setStatus) => {
    const collectionRef = collection(db, "variables");
    const q = query(collectionRef, where("deviceId", "==", deviceId));
    let latestTimestamp = 0;

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        // Tìm timestamp mới nhất từ tất cả các documents
        latestTimestamp = snapshot.docs.reduce((latest, doc) => {
          const metadataTimestamp = doc._document.version.timestamp.seconds; // Timestamp từ metadata
          return metadataTimestamp > latest ? metadataTimestamp : latest;
        }, 0);
        if (Math.floor(Date.now() / 1000) - latestTimestamp > 30) {
          setStatus("offline");
        }else{
          setStatus("online");
        }
        // console.log("Snapshot updated - Latest timestamp:", latestTimestamp);
      } else {
        setStatus("offline");
      }
    });

    const interval = setInterval(() => {
      if (latestTimestamp > 0) {
        const currentTime = Math.floor(Date.now() / 1000);
        if (currentTime - latestTimestamp > 30) {
          setStatus("offline"); 
          // console.log("Device is offline - Last updated:", latestTimestamp);
        } else {
          setStatus("online"); 
        }
      }
    }, 10000); 

    return () => {
      unsubscribe(); 
      clearInterval(interval);
    };
  };