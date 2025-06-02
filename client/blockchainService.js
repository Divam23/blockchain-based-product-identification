import { ethers } from "ethers";
import contractABI from "./ContractABI.json";

export const connectWithMetaMask = async () => {
  if (!window.ethereum) {
    throw new Error("MetaMask not detected. Please install MetaMask.");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);

  await window.ethereum.request({ method: "eth_requestAccounts" });

  const signer = await provider.getSigner();
  console.log("Connected account:", await signer.getAddress());

  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
  const contract = new ethers.Contract(contractAddress, contractABI[0].abi, signer);

  console.log("Connected to contract at:", contractAddress);
  return contract;
};

export const registerProductOnBlockchain = async (productData) => {
  try {
    const contract = await connectWithMetaMask();

    // Create ProductDetails struct
    const productDetails = {
      name: productData.productName,
      description: productData.productDescription,
      category: productData.productCategory,
      batchNumber: productData.batchNumber,
      serialNumber: productData.serialNumber,
      uniqueProductId: productData.uniqueProductId,
      manufacturingDate: productData.manufacturingDate,
      expiryDate: productData.expiryDate,
    };

    console.log("Sending transaction...");

    // Call contract function with the correct parameters
    const tx = await contract.registerProduct(
      productDetails
    );

    console.log("Transaction sent. Waiting for confirmation...");
    const receipt = await tx.wait();
    alert(`Transaction successful! \nTransaction Hash: ${receipt.hash}`);
    console.log("Transaction confirmed:", receipt);

    return receipt.hash;
  } catch (error) {
    console.error("Error registering product:", error);
    throw error;
  }
};
