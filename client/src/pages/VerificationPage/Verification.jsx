import React, { useEffect, useState, useRef } from "react";
import { Html5QrcodeScanner, Html5Qrcode } from "html5-qrcode";
import { ethers } from "ethers";
import contractABI from "../../../ContractABI.json";
import ScanProductCard from "../../components/ScannedProductCard";
import {
  FaCamera,
  FaUpload,
  FaRedo,
  FaExclamationTriangle,
} from "react-icons/fa";

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
const abi = contractABI[0].abi;

const Verification = () => {
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [useFileUpload, setUseFileUpload] = useState(false);

  const scannerRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const startCameraScan = async () => {
      if (!isScanning || useFileUpload) return;
  
      const qrRegionId = "qr-reader";
      scannerRef.current = new Html5Qrcode(qrRegionId);
  
      try {
        await scannerRef.current.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: 250 },
          async (decodedText) => {
            clearTimeout(timeoutRef.current);
            await handleScan(decodedText);
            await stopScanner();
            setIsScanning(false);
          },
          (errorMessage) => {
            console.warn("Scan attempt failed:", errorMessage);
          }
        );
  
        timeoutRef.current = setTimeout(async () => {
          console.log("⏰ QR scan timed out.");
          await stopScanner();
          setIsScanning(false);
          setError("QR scanning timed out. Please try again.");
        }, 20000);
      } catch (err) {
        console.error("Camera scan failed to start:", err);
        setError("Failed to access camera or start scanning.");
      }
    };
  
    startCameraScan();
  
    return () => {
      stopScanner(); // Clean up on unmount
    };
  }, [isScanning, useFileUpload]);

  
  const stopScanner = async () => {
    clearTimeout(timeoutRef.current);
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
      } catch (err) {
        console.warn("Failed to stop scanner cleanly:", err);
      }
    }
  };

  const handleScan = async (data) => {
    try {
      if (!data) return;

      if (
        typeof window === "undefined" ||
        typeof window.ethereum === "undefined"
      ) {
        throw new Error("MetaMask is not installed or accessible.");
      }

      const parsedData = typeof data === "string" ? JSON.parse(data) : data;
      const productId = parsedData.uniqueProductId || data;

      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

      const product = await contract.products(productId);
      const exists = product.isRegistered;

      console.log("Scanned productId: ", productId);
      console.log("Exists on chain: ", exists);

      setScanResult({ exists, productId, product });
      setError(null);
    } catch (err) {
      console.error("Blockchain verification error:", err);
      setError(err.message || "Blockchain verification failed.");
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const qrScanner = new Html5Qrcode("qr-reader");
      const result = await qrScanner.scanFile(file, true);
      await handleScan(result);
    } catch (err) {
      console.error("Image scan error:", err);
      setError("Failed to read QR from image.");
    }
  };

  const handleRestart = async () => {
    await stopScanner();
    document.getElementById("qr-reader")?.replaceChildren();
  
    setScanResult(null);
    setError(null);
    setIsScanning(false);
    setUseFileUpload(false);
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <FaCamera className="text-blue-400" /> Product Verification
      </h1>

      <div className="w-80 h-80 bg-gray-800 rounded-lg shadow-lg p-4 flex items-center justify-center relative">
        {!isScanning && !useFileUpload && (
          <p className="text-gray-400 text-center absolute">
            Choose Camera or Upload to Scan QR
          </p>
        )}
        <div
          id="qr-reader"
          className={`w-full h-full transition-opacity duration-300 ${
            isScanning || useFileUpload ? "opacity-100" : "opacity-0 invisible"
          }`}
        ></div>
      </div>

      <div className="flex gap-4 mt-6">
        <button
          onClick={() => {
            setUseFileUpload(false);
            setIsScanning(true);
          }}
          className={`px-4 py-2 rounded-lg transition ${
            isScanning ? "bg-green-600" : "bg-gray-700 hover:bg-gray-600"
          }`}
        >
          <FaCamera className="inline mr-2" />
          Scan with Camera
        </button>

        <button
          onClick={() => {
            setIsScanning(false);
            setUseFileUpload(true);
          }}
          className={`px-4 py-2 rounded-lg transition ${
            useFileUpload ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"
          }`}
        >
          <FaUpload className="inline mr-2" />
          Upload QR Image
        </button>
      </div>

      {useFileUpload && (
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="mt-4 bg-gray-800 text-white p-2 rounded-lg"
        />
      )}

      {error && (
        <div className="mt-6 bg-red-700 p-3 rounded-lg flex items-center gap-2">
          <FaExclamationTriangle />
          <span>{error}</span>
          <button
            onClick={handleRestart}
            className="ml-auto px-3 py-1 bg-gray-700 rounded hover:bg-gray-600"
          >
            Retry
          </button>
        </div>
      )}

      {scanResult && (
        <div className="mt-6 w-full max-w-2xl">
          <ScanProductCard
            product={scanResult.product}
            exists={scanResult.exists}
          />
        </div>
      )}

      {(scanResult || error) && (
        <button
          onClick={handleRestart}
          className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg flex items-center gap-2 transition"
        >
          <FaRedo /> Restart
        </button>
      )}
    </div>
  );
};

export default Verification;