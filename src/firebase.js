import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC8xyMzfygkTeGpg988x2UiDDP9kbeN5jg",
  authDomain: "case-stud-545ce.firebaseapp.com",
  projectId: "case-stud-545ce",
  storageBucket: "case-stud-545ce.firebasestorage.app",
  messagingSenderId: "534471364413",
  appId: "1:534471364413:web:bded3ed9c897f9c398ff54",
  measurementId: "G-6WBTCCMTLG"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Initialize Firestore
const db = getFirestore(app);

export { db };
