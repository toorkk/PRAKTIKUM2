import { initializeApp } from "firebase/app";
import {getFirestore} from "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAU2rENIK1cwH9CslflU9pros2Q4BpTW2E",
  authDomain: "migracijepraktikum2.firebaseapp.com",
  projectId: "migracijepraktikum2",
  storageBucket: "migracijepraktikum2.appspot.com",
  messagingSenderId: "357071765466",
  appId: "1:357071765466:web:f5c6f1c35e76633ecccae3"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);