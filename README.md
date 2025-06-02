# Blockchain-Based Fake Product Identification System

## Overview

This project leverages blockchain technology to create a secure and transparent system for verifying the authenticity of products. It aims to combat counterfeit goods by providing a tamper-proof method for product identification.

## Features

- **Blockchain Integration:** Immutable product records stored on a blockchain network.
- **Smart Contracts:** Automated verification and management using Solidity smart contracts.
- **User Interface:** Web interface to register, verify, and track product authenticity.
- **Admin Panel:** Manage and monitor product registrations and authenticity checks.
- **Firebase Integration:** For user authentication and real-time updates.

## Tech Stack

- **Blockchain:** Solidity, Ethereum
- **Backend:** Node.js, Express.js
- **Frontend:** Vite, React
- **Database:** Firebase Firestore
- **Others:** Web3.js / Ethers.js for blockchain interaction

## Getting Started

### Prerequisites

- Node.js v16+
- npm or yarn
- MetaMask or compatible Ethereum wallet
- Firebase account and project setup

### Installation

1. Clone the repo:

   ```bash
   git clone https://github.com/Divam23/blockchain-fake-product-identification-system.git
   cd blockchain-fake-product-identification-system
   ```

2. Install backend dependencies:

```bash
cd server
npm install
```

3. Install frontend dependencies:

```bash
cd ../client
npm install
```

4. Set up environment variables:

- Create a .env file in the server directory and add your Firebase credentials and other secrets.
- Example .env content (do NOT commit this file):
  FIREBASE_PROJECT_ID=your-project-id
  FIREBASE_CLIENT_EMAIL=your-client-email
  FIREBASE_PRIVATE_KEY="your-private-key"
  BLOCKCHAIN_NETWORK_URL="https://your-blockchain-node-url"

5. Run the backend server:

```bash
cd ../server
npm start
```

6. Run the frontend development server:

```bash
cd ../client
npm run dev
```

7. Open your browser and visit http://localhost:5173 to see the application running.
