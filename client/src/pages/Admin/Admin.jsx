import React, { useEffect, useState } from "react";
import {
  FaUsers,
  FaCheckCircle,
  FaTimesCircle,
  FaBox,
  FaBars,
  FaChevronLeft,
  FaChevronRight,
  FaTh,
  FaIndustry,
  FaTags,
  FaExclamationTriangle,
} from "react-icons/fa";
import { ethers } from "ethers";
import contractABI from "../../../ContractABI.json";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuthFunctions } from "../../hooks/useAuthFunctions";

const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
const abi = contractABI[0].abi;

const Admin = () => {
  const [stats, setStats] = useState({
    totalManufacturers: 0,
    verified: 0,
    flagged: 0,
    scanned: 0,
  });

  const [sidebarOpen, setSidebarOpen] = useState(false); // for mobile
  const [collapsed, setCollapsed] = useState(false); // for desktop
  const navigate = useNavigate();
  const location = useLocation();
  const { signOutUser } = useAuthFunctions();

  const handleSignOut = async () => {
    await signOutUser();
    navigate("/login");
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (typeof window.ethereum !== "undefined") {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const contract = new ethers.Contract(contractAddress, abi, signer);
          const [total, verified, flagged, scanned] = await contract.getStats();

          setStats({
            totalManufacturers: total.toString(),
            verified: verified.toString(),
            flagged: flagged.toString(),
            scanned: scanned.toString(),
          });
        } else {
          console.error("MetaMask not found");
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };

    fetchStats();
  }, []);

  const isDashboardPage =
    location.pathname === "/adminDashboard" ||
    location.pathname === "/adminDashboard/dashboard";

  const navLinks = [
    { to: "dashboard", label: "Dashboard", icon: <FaTh /> },
    { to: "manufacturers", label: "Manufacturers", icon: <FaIndustry /> },
    { to: "products", label: "Products", icon: <FaTags /> },
    { to: "reports", label: "Reports", icon: <FaExclamationTriangle /> },
  ];

  return (
    <div className="relative min-h-screen flex bg-gray-900 text-white">
      {/* Mobile toggle button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="absolute top-4 left-4 z-50 bg-gray-700 text-white p-2 rounded-md lg:hidden"
      >
        <FaBars />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed z-40 top-0 left-0 h-full bg-gray-800 transition-all duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0 w-64" : "-translate-x-full"}
        ${collapsed ? "lg:w-20" : "lg:w-64"} lg:translate-x-0`}
      >
        {/* Collapse Toggle (Desktop Only) */}
        <div className="hidden lg:flex justify-end p-2">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-400 hover:text-white"
          >
            {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
          </button>
        </div>

        <div className="p-4 space-y-6">
          <h1 className={`text-2xl font-bold transition-all ${collapsed ? "hidden" : "block"}`}>
            Admin Panel
          </h1>

          <nav className="space-y-3">
            {navLinks.map(({ to, label, icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-4 p-2 rounded transition-colors ${
                  location.pathname.includes(`/adminDashboard/${to}`)
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-700"
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <span>{icon}</span>
                <span className={`${collapsed ? "hidden" : "block"} transition-all`}>
                  {label}
                </span>
              </Link>
            ))}
          </nav>

          <button
            onClick={handleSignOut}
            className="w-full mt-4 py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded transition"
          >
            {collapsed ? <FaTimesCircle className="mx-auto" /> : "Sign Out"}
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main content */}
      <main
        className={`flex-1 p-6 transition-all duration-300 ease-in-out ${
          collapsed ? "lg:ml-20" : "lg:ml-64"
        }`}
      >
        {isDashboardPage ? (
          <>
            <h2 className="text-3xl font-semibold mb-6">Dashboard Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={<FaUsers size={32} />}
                label="Total Manufacturers"
                value={stats.totalManufacturers}
              />
              <StatCard
                icon={<FaCheckCircle size={32} className="text-green-400" />}
                label="Verified"
                value={stats.verified}
              />
              <StatCard
                icon={<FaTimesCircle size={32} className="text-red-400" />}
                label="Flagged"
                value={stats.flagged}
              />
              <StatCard
                icon={<FaBox size={32} />}
                label="Products Scanned"
                value={stats.scanned}
              />
            </div>
          </>
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  );
};

const StatCard = ({ icon, label, value }) => (
  <div className="p-6 bg-gray-800 rounded-lg flex items-center gap-4">
    {icon}
    <div>
      <p className="text-gray-400">{label}</p>
      <h3 className="text-xl font-bold">{value}</h3>
    </div>
  </div>
);

export default Admin;
