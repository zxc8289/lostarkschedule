import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, set, serverTimestamp } from "firebase/database";
import { getAuth, signInWithRedirect, GoogleAuthProvider, signOut as firebaseSignOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBU-KdFBFDHC8fikZp5s0_sZvIWItqVmao",
  authDomain: "lostark-schedule-site.firebaseapp.com",
  projectId: "lostark-schedule-site",
  storageBucket: "lostark-schedule-site.appspot.com",
  messagingSenderId: "998809115129",
  appId: "1:998809115129:web:37cfa108cee588cff40528",
  measurementId: "G-K9L3DTCQBV",
  databaseURL:
    "https://lostark-schedule-site-default-rtdb.asia-southeast1.firebasedatabase.app",
};

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);

// Firebase Authentication 초기화
const auth = getAuth(app);

// Google 인증 공급자
const googleProvider = new GoogleAuthProvider();

// Google 로그인 함수
const signInWithGoogle = () => {
  signInWithRedirect(auth, googleProvider);
};

// signOut 함수를 export
const signOut = () => firebaseSignOut(auth);


const ServerValue = {
  TIMESTAMP: serverTimestamp(),
};

export { db, ref, set, ServerValue, auth, signInWithGoogle, signOut };
