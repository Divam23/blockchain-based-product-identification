import admin from '../firebase/admin.js';
import dotenv from "dotenv"


dotenv.config({
    path: "./env"
})

const uid = process.env.UID; 

admin.auth().setCustomUserClaims(uid, { role: 'admin' })
  .then(() => {
    console.log("Custom claim set. Admin privileges granted.");
    process.exit(0);
  })
  .catch(err => {
    console.error("Error setting custom claim:", err);
    process.exit(1);
  });
