// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import Cookies from 'js-cookie';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
// export const analytics = getAnalytics(app);

export const setFirebaseUID = async (uid: string) => {

  if (uid) {
    Cookies.set('uid', uid, { expires: 7 }); // Save UID in a cookie
    // test newly set cookie
    
  }
  
  const uidTest = Cookies.get('uid');
  console.log("Logging newly set cookie:", uidTest); 

};

// export const getFirebaseUID = () => {
//   // I recall the getAuth in each and every function, because of changes in the user instance of firebase.
//     // test newly set cookie
//   const uid = Cookies.get('uid');
//   console.log("Fetched  uid cookie:", uid); 
  
//   if (!uid) return null
//   return uid
// };
