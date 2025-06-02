import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiPackage,
  FiCheckCircle,
  FiAlertCircle,
  FiLogOut,
} from "react-icons/fi";
import { useAuthFunctions } from "../../hooks/useAuthFunctions";
import { BrowserProvider, Contract } from "ethers";
import ProductRegistryABI from "../../abi/ProductRegistry.json";
import RegisterManufacturer from "./RegisterManufacturer";

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

const Manufacturer = () => {
  const { user, signOutUser } = useAuthFunctions();
  const navigate = useNavigate();

  const [isVerified, setIsVerified] = useState(false);
  const [hasRequested, setHasRequested] = useState(false);
  const [productStats, setProductStats] = useState({
    total: 0,
    verified: 0,
    flagged: 0,
  });

  const handleLogout = async () => {
    try {
      await signOutUser();
      console.log("User logged out successfully");
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const fetchData = async () => {
    if (!user || !window.ethereum) return;

    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const contract = new Contract(CONTRACT_ADDRESS, ProductRegistryABI.abi, signer);

      const manufacturer = await contract.manufacturers(address);
      setIsVerified(manufacturer.isVerified);
      setHasRequested(manufacturer.requestedVerification);

      const products = await contract.getManufacturerProducts(address);

      let total = products.length;
      let verified = 0;
      let flagged = 0;

      products.forEach((product) => {
        if (product.isVerified) verified++;
        if (product.isFlagged) flagged++;
      });

      setProductStats({ total, verified, flagged });
    } catch (error) {
      console.error("Error fetching manufacturer data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user, setIsVerified]);

  const handleRequestVerification = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask to request verification.");
        return;
      }

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(CONTRACT_ADDRESS, ProductRegistryABI.abi, signer);

      const address = await signer.getAddress();
      const manufacturer = await contract.manufacturers(address);

      if (!manufacturer.name || manufacturer.name.trim() === "") {
        alert("You are not registered as a manufacturer.");
        return;
      }

      if (manufacturer.isVerified || manufacturer.requestedVerification) {
        alert("Verification already requested or completed.");
        return;
      }

      const tx = await contract.requestVerification();
      await tx.wait();

      alert("Verification request sent!");
      setHasRequested(true);
    } catch (error) {
      console.error("Request verification failed:", error);
      alert("Request failed. Please ensure you're registered.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Navbar */}
        <div className="flex justify-between items-center bg-gray-800 p-4 rounded-xl shadow-lg mb-8">
          <h1 className="text-2xl font-bold">🔹 SecureScan</h1>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-lg font-semibold">
                👋 {user?.displayName || "Manufacturer"}
              </p>
              <p
                className={`text-sm font-medium ${
                  isVerified ? "text-green-400" : "text-yellow-400"
                }`}
              >
                {isVerified ? "✅ Verified" : "🕒 Pending Verification"}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg font-semibold transition"
            >
              <FiLogOut className="text-xl" />
              Logout
            </button>
          </div>
        </div>

        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">
            Welcome, {user?.displayName || "Manufacturer"}!
          </h1>
          <p className="text-gray-400">
            Manage your product registrations and verifications here.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link to={isVerified ? "/reg-prod" : "#"} className="w-full">
            <button
              disabled={!isVerified}
              className={`w-full px-6 py-3 rounded-xl font-semibold transition transform hover:scale-105 ${
                isVerified
                  ? "bg-indigo-600 hover:bg-indigo-500"
                  : "bg-gray-600 cursor-not-allowed"
              }`}
            >
              🚀 Register Product
            </button>
          </Link>
          <Link to="/products" className="w-full">
            <button className="w-full bg-green-600 hover:bg-green-500 px-6 py-3 rounded-xl font-semibold transition transform hover:scale-105">
              📦 View Products
            </button>
          </Link>
          <Link to="/verify" className="w-full">
            <button className="w-full bg-yellow-600 hover:bg-yellow-500 px-6 py-3 rounded-xl font-semibold transition transform hover:scale-105">
              🔍 Verify Authenticity
            </button>
          </Link>
        </div>

        {/* Request Verification Button */}
        {!isVerified && !hasRequested && (
          <div className="text-center mb-8">
            <button
              onClick={handleRequestVerification}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-xl font-semibold transition"
            >
              Request Verification
            </button>
          </div>
        )}

        {/* Product Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col items-center transition transform hover:scale-105">
            <FiPackage className="text-indigo-400 text-5xl" />
            <h3 className="text-xl font-semibold mt-2">Total Products</h3>
            <p className="text-2xl font-bold">{productStats.total}</p>
          </div>
          <div className="bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col items-center transition transform hover:scale-105">
            <FiCheckCircle className="text-green-400 text-5xl" />
            <h3 className="text-xl font-semibold mt-2">Verified Products</h3>
            <p className="text-2xl font-bold">{productStats.verified}</p>
          </div>
          <div className="bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col items-center transition transform hover:scale-105">
            <FiAlertCircle className="text-red-400 text-5xl" />
            <h3 className="text-xl font-semibold mt-2">Flagged Fake</h3>
            <p className="text-2xl font-bold">{productStats.flagged}</p>
          </div>
        </div>

        {/* Register Manufacturer Form */}
        <RegisterManufacturer user={user} />
      </div>
    </div>
  );
};

export default Manufacturer;
