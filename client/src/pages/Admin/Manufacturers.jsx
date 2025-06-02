import React, { useEffect, useState } from "react";
import { BrowserProvider, Contract } from "ethers";
import contractABI from "../../../ContractABI.json";
import { toast } from "react-toastify";

const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
const abi = contractABI[0].abi;

const Manufacturers = () => {
  const [manufacturers, setManufacturers] = useState([]);

  const fetchManufacturers = async () => {
    try {
      if (window.ethereum) {
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new Contract(contractAddress, abi, signer);

        const allAddresses = await contract.getAllManufacturers();

        const fetchedData = await Promise.all(
          allAddresses.map(async (address) => {
            try {
              const data = await contract.manufacturers(address);
              return {
                address,
                name: data.name || "",
                location: data.location || "",
                isVerified: data.isVerified,
                isFlagged: data.isFlagged,
              };
            } catch (err) {
              console.error(`Failed to fetch data for ${address}:`, err);
              return null; // or handle differently
            }
          })
        );

        // Filter out nulls in case of error
        const cleanedData = fetchedData.filter(Boolean);

        setManufacturers(cleanedData);
      }
    } catch (err) {
      console.error("Error fetching manufacturers:", err);
    }
  };

  const handleVerify = async (address) => {
    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(contractAddress, abi, signer);

      const tx = await contract.verifyManufacturer(address, true);
      await tx.wait();
      toast.success("Manufacturer verified successfully!");
      fetchManufacturers();
    } catch (err) {
      console.error(err);
      toast.error("Verification failed!");
    }
  };

  const handleFlag = async (address, shouldFlag) => {
    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(contractAddress, abi, signer);

      const tx = await contract.flagManufacturer(address, shouldFlag);
      await tx.wait();
      toast.success("Manufacturer flagged successfully!");
      fetchManufacturers();
    } catch (err) {
      console.error(err);
      toast.error("Flagging failed!");
    }
  };

  useEffect(() => {
    fetchManufacturers();

    const getAdmin = async () => {
      if (window.ethereum) {
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new Contract(contractAddress, abi, signer);
  
        const admin = await contract.admin();
        console.log("🧑‍⚖️ Admin address:", admin);
      }
    };
  
    getAdmin();

  }, []);

  return (
    <div className="p-4 text-white">
      <h2 className="text-3xl font-bold mb-6">Manufacturers Management</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 text-left rounded-lg overflow-hidden shadow">
          <thead>
            <tr className="bg-gray-700 text-sm uppercase">
              <th className="px-4 py-3">Address</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Verified</th>
              <th className="px-4 py-3">Flagged</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {manufacturers.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-400">
                  No manufacturers found.
                </td>
              </tr>
            ) : (
              manufacturers.map((m, index) => (
                <tr
                  key={index}
                  className="border-t border-gray-700 hover:bg-gray-700"
                >
                  <td className="px-4 py-3">{m.address}</td>
                  <td className="px-4 py-3">{m.name || "N/A"}</td>
                  <td className="px-4 py-3">{m.location || "N/A"}</td>
                  <td className="px-4 py-3">
                    {m.isVerified ? (
                      <span className="text-green-400 font-semibold">Yes</span>
                    ) : (
                      <span className="text-yellow-400 font-semibold">No</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {m.isFlagged ? (
                      <span className="text-red-400 font-semibold">Yes</span>
                    ) : (
                      <span className="text-gray-400 font-semibold">No</span>
                    )}
                  </td>
                  <td className="px-4 py-3 space-x-2">
                    {!m.isVerified && (
                      <button
                        onClick={() => handleVerify(m.address)}
                        className="bg-green-600 px-3 py-1 rounded hover:bg-green-500"
                      >
                        Verify
                      </button>
                    )}
                    {!m.isFlagged && (
                      <button
                        onClick={() => handleFlag(m.address)}
                        className="bg-red-600 px-3 py-1 rounded hover:bg-red-500"
                      >
                        Flag
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Manufacturers;
