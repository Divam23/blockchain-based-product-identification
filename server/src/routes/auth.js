// index.js or routes/auth.js
import express from 'express';
import admin from './firebaseAdmin.js';

const app = express();
app.use(express.json());

app.post('/verify-token', async (req, res) => {
  const { token } = req.body;

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    const { uid } = decoded;

    // Get user details (like custom claims)
    const user = await admin.auth().getUser(uid);

    if (user.customClaims && user.customClaims.role === 'admin') {
      return res.status(200).json({ message: 'Authorized admin', uid });
    } else {
      return res.status(403).json({ message: 'Not authorized' });
    }

  } catch (error) {
    return res.status(401).json({ message: 'Invalid token', error });
  }
});
