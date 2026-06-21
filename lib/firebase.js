import {initializeApp,cert} from "firebase-admin";
import serviceAccount from "../firebase-service-account.json" with { type: "json" };

const app =initializeApp({
  credential: cert(serviceAccount),
});

export {app};