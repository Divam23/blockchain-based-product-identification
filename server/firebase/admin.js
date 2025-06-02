import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ESM-compatible __dirname resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Correct path to your service account key
const serviceAccountPath = path.join(__dirname, '../firebase/fake-product-web3-firebase-adminsdk-fbsvc-186abfcc0d.json');

// Read and parse key
const serviceAccount = JSON.parse(
  fs.readFileSync(serviceAccountPath, 'utf-8')
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;

