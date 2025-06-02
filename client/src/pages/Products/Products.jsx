import React, { useEffect, useState } from "react";
import { FaBoxOpen } from "react-icons/fa";
import ProductCard from "../../components/ProductCard";
import { ethers } from "ethers";
import contractABI from "../../../ContractABI.json";


const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
const abi = contractABI[0].abi;

const ManufacturerProducts = () => {
  const [products, setProducts] = useState([]);
  const [manufacturerInfo, setManufacturerInfo] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
          const provider = new ethers.BrowserProvider(window.ethereum);
          await provider.send("eth_requestAccounts", []);
          const signer = await provider.getSigner();
          const manufacturerAddress = await signer.getAddress();

          const contract = new ethers.Contract(contractAddress, abi, signer);

          const m = await contract.manufacturers(manufacturerAddress);
          console.log("Manufacturer Address:", manufacturerAddress);
        console.log("Manufacturer Data:", m);

          setManufacturerInfo({
            name: m.name,
            location: m.manufacturingLocation,
          });

          const productIds = await contract.getManufacturerProducts(manufacturerAddress);
          console.log("Product IDs:", productIds);


          const productPromises = productIds.map(async (id) => {
            const product = await contract.products(id);
            return {
              id: product.details.uniqueProductId,
              name: product.details.name,
              description: product.details.description,
              batchNumber: product.details.batchNumber,
              serialNumber: product.details.serialNumber,
              expiryDate: product.details.expiryDate,
            };
          });

          const productsFetched = await Promise.all(productPromises);
          setProducts(productsFetched);
        } else {
          alert("Please install MetaMask to view your products.");
          console.error("MetaMask is not installed");
        }
      } catch (error) {
        console.error("Failed to fetch manufacturer products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
        <FaBoxOpen className="text-blue-400" />
        Products by {manufacturerInfo.name || "Manufacturer"}
      </h1>
      <p className="text-gray-400 mb-6">{manufacturerInfo.location || "Location not available"}</p>

      {loading ? (
        <p className="text-gray-400">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-500">No products found for this manufacturer.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ManufacturerProducts;
