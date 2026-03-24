import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyCZaS2VD0y356vFc5H0kRDh2WnvbzUsO5o",
  authDomain: "jcb-mytime.firebaseapp.com",
  projectId: "jcb-mytime",
  storageBucket: "jcb-mytime.firebasestorage.app",
  messagingSenderId: "651961038733",
  appId: "1:651961038733:web:aa436953c4e1da9fc36fc4",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
  }),
});
export const storage = getStorage(app);
export const functions = getFunctions(app);
