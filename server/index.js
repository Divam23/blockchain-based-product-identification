import dotenv from "dotenv";
import express from "express"
import cors from "cors"
import fs from 'fs/promises';

const rawData = await fs.readFile('./firebase/fake-product-web3-firebase-adminsdk-fbsvc-186abfcc0d.json', 'utf-8');
const serviceAccount = JSON.parse(rawData);




const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Route: Verify Admin
app.post("/verify-admin", async (req, res) => {
  try {
    const { idToken } = req.body;

    const decodedToken = await serviceAccount.auth().verifyIdToken(idToken);

    if (decodedToken.serviceAccount) {
      return res.status(200).json({ message: "Authorized Admin", uid: decodedToken.uid });
    }

    return res.status(403).json({ message: "Access denied: Not an admin" });
  } catch (error) {
    return res.status(401).json({ message: "Invalid token", error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
