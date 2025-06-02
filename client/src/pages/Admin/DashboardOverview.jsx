import React, { useEffect, useState } from "react";
import { FaUsers, FaCheckCircle, FaTimesCircle, FaBox } from "react-icons/fa";
import { ethers } from "ethers";
import contractABI from "../../../ContractABI.json";

const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
const abi = contractABI[0].abi;

const StatCard = ({ icon: Icon, title, value, color }) => (
  <div className="p-6 bg-gray-800 rounded-lg flex items-center gap-4 shadow-lg transition-transform hover:scale-105">
    <Icon size={32} className={color} />
    <div>
      <p className="text-gray-400">{title}</p>
      <h3 className="text-xl font-bold animate-pulse">{value}</h3>
    </div>
  </div>
);

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    flagged: 0,
    scanned: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (window.ethereum) {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const contract = new ethers.Contract(contractAddress, abi, signer);
          const [total, verified, flagged, scanned] = await contract.getStats();

          setStats({
            total: total.toString(),
            verified: verified.toString(),
            flagged: flagged.toString(),
            scanned: scanned.toString(),
          });
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 10000); // refresh every 10s

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Dashboard Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <StatCard icon={FaUsers} title="Total Manufacturers" value={stats.total} color="text-blue-400" />
        <StatCard icon={FaCheckCircle} title="Verified Manufacturers" value={stats.verified} color="text-green-400" />
        <StatCard icon={FaTimesCircle} title="Flagged Manufacturers" value={stats.flagged} color="text-red-400" />
        <StatCard icon={FaBox} title="Products Scanned" value={stats.scanned} color="text-yellow-400" />
      </div>
    </div>
  );
};

export default DashboardOverview;

