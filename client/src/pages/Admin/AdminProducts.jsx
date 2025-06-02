import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import contractABI from "../../../ContractABI.json";
import { toast } from "react-toastify";

const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
const abi = contractABI[0].abi;

const Products = () => {
  const [products, setProducts] = useState([]);
  const fetchProducts = async () => {
    try {
      if (!window.ethereum) {
        toast.error("MetaMask is not installed.");
        return;
      }
  
      await window.ethereum.request({ method: "eth_requestAccounts" });
  
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);
  
      const rawProducts = await contract.getAllProducts();
      console.log("Raw product data from contract:", rawProducts);
  
      const productsData = rawProducts.map((productStruct, index) => {
        const details = productStruct[0];
        const manufacturer = productStruct[1];
        const isVerified = productStruct[2];
        const scannedCount = productStruct[3];
  
        return {
          productId: index, // or use a UUID if you store one in the struct
          name: details[0],
          description: details[1],
          category: details[2],
          batchNumber: details[3],
          serialNumber: details[4],
          uuid: details[5],
          manufacturingDate: details[6],
          expiryDate: details[7],
          manufacturer,
          isVerified,
          scannedCount,
        };
      });
  
      setProducts(productsData);
    } catch (err) {
      console.error("Error fetching products:", err);
      toast.error("Failed to load products");
    }
  };
  

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-4 text-white">
      <h2 className="text-3xl font-bold mb-6">Products Management</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 text-left rounded-lg overflow-hidden shadow">
          <thead>
            <tr className="bg-gray-700 text-sm uppercase">
              <th className="px-4 py-3">Product ID</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Batch No.</th>
              <th className="px-4 py-3">Serial No.</th>
              <th className="px-4 py-3">Manufacturer</th>
              <th className="px-4 py-3">Mfg Date</th>
              <th className="px-4 py-3">Expiry</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-400">
                  No products available.
                </td>
              </tr>
            ) : (
              products.map((prod, idx) => (
                <tr key={idx} className="border-t border-gray-700 hover:bg-gray-700">
                  <td className="px-4 py-2">{prod.productId}</td>
                  <td className="px-4 py-2">{prod.name}</td>
                  <td className="px-4 py-2">{prod.category}</td>
                  <td className="px-4 py-2">{prod.batchNumber}</td>
                  <td className="px-4 py-2">{prod.serialNumber}</td>
                  <td className="px-4 py-2">{prod.manufacturer}</td>
                  <td className="px-4 py-2">{prod.manufacturingDate}</td>
                  <td className="px-4 py-2">{prod.expiryDate}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;
