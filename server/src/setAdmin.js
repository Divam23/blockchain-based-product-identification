import admin from '../firebase/admin.js';

const uid = 'EwW2Nmd8GtgsQJlye69CTc39FFy1'; 

admin.auth().setCustomUserClaims(uid, { role: 'admin' })
  .then(() => {
    console.log("Custom claim set. Admin privileges granted.");
    process.exit(0);
  })
  .catch(err => {
    console.error("Error setting custom claim:", err);
    process.exit(1);
  });
