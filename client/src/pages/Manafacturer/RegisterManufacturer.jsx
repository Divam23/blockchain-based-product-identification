import { useState, useEffect } from "react";
import { Contract, BrowserProvider } from "ethers";
import ProductRegistryABI from "../../abi/ProductRegistry.json";
import { useManufacturer } from "../../context/ManufacturerContext";

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

const RegisterManufacturer = ({ user }) => {
  // const { name, email } = user || {};
  const name = user?.displayName || "";
  const email = user?.email || "";

  const { setManufacturerData } = useManufacturer();

  const [form, setForm] = useState({
    name: name,
    manufacturingLocation: "",
    email: email,
    phone: "",
    facilityAddress: "",
  });

  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const checkIfRegistered = async () => {
      if (!window.ethereum || !user) return;
  
      try {
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
  
        const contract = new Contract(
          CONTRACT_ADDRESS,
          ProductRegistryABI.abi,
          signer
        );
        const manufacturer = await contract.manufacturers(address);

  
        // Destructure from the returned struct (array-like)
        const [
          name,
          manufacturingLocation,
          email,
          phone,
          facilityAddress,
          timestamp,
          isVerified,
          isFlagged,
          requestedVerification
        ] = manufacturer;
  
        if (name && name !== "") {
          setIsRegistered(true);
  
          const data = {
            name,
            manufacturingLocation,
            email,
            phone,
            facilityAddress,
            timestamp,
            isVerified,
            isFlagged,
            requestedVerification
          };
  
          setManufacturerData(data);
        }
      } catch (err) {
        console.error("Error checking registration:", err);
      }
    };
  
    checkIfRegistered();
  }, [user]);
  

  const handleChange = (e) => {
    if (isRegistered) return;
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      if (!window.ethereum) return alert("Please install MetaMask");

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(
        CONTRACT_ADDRESS,
        ProductRegistryABI.abi,
        signer
      );

      const tx = await contract.registerManufacturer(
        form.name,
        form.manufacturingLocation,
        form.email,
        form.phone,
        form.facilityAddress
      );

      await tx.wait();
      alert("Manufacturer registered!");
      setIsRegistered(true);
      setManufacturerData(form);
    } catch (err) {
      console.error("Registration failed:", err);
      alert("Registration failed. See console for details.");
    }
  };

  // 👉 Hide form if already registered
  if (isRegistered) {
    return (
      <div className="max-w-md mx-auto bg-[#1e1e2f] text-center shadow-lg rounded-xl p-6 mt-10 space-y-4 border border-[#2c2c3e]">
        <h2 className="text-xl font-semibold text-white">
          You are already registered as a manufacturer.
        </h2>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-[#1e1e2f] shadow-lg rounded-xl p-6 mt-10 space-y-4 border border-[#2c2c3e]">
      <h2 className="text-2xl font-semibold text-center text-white">
        Register Manufacturer
      </h2>

      <input
        name="name"
        value={form.name}
        disabled
        className="w-full px-4 py-2 bg-[#2c2c3e] text-white opacity-60 border border-[#3a3a4d] rounded-md"
      />

      <input
        name="manufacturingLocation"
        placeholder="Manufacturing Location"
        onChange={handleChange}
        value={form.manufacturingLocation}
        className="w-full px-4 py-2 bg-[#2c2c3e] text-white placeholder-gray-400 border border-[#3a3a4d] rounded-md"
      />

      <input
        name="email"
        value={form.email}
        disabled
        className="w-full px-4 py-2 bg-[#2c2c3e] text-white opacity-60 border border-[#3a3a4d] rounded-md"
      />

      <input
        name="phone"
        placeholder="Phone"
        onChange={handleChange}
        value={form.phone}
        className="w-full px-4 py-2 bg-[#2c2c3e] text-white placeholder-gray-400 border border-[#3a3a4d] rounded-md"
      />

      <input
        name="facilityAddress"
        placeholder="Facility Address"
        onChange={handleChange}
        value={form.facilityAddress}
        className="w-full px-4 py-2 bg-[#2c2c3e] text-white placeholder-gray-400 border border-[#3a3a4d] rounded-md"
      />

      <button
        onClick={handleRegister}
        className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition duration-300"
      >
        Register
      </button>
    </div>
  );
};

export default RegisterManufacturer;
