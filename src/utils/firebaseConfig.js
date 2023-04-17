
import { initializeApp } from "firebase/app";
import { getAuth } from 'Firebase/auth'
import { getDatabase, ref, set } from 'Firebase/database'

const firebaseConfig = {
  apiKey: "AIzaSyBNdx0dDCmU-CC2WOvayIPFxhjDlPsCjjI",
  authDomain: "rate-4cb82.firebaseapp.com",
  projectId: "rate-4cb82",
  storageBucket: "rate-4cb82.appspot.com",
  messagingSenderId: "316712030290",
  appId: "1:316712030290:web:4fb2232a9cef0adbf88f8b",
};




export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);