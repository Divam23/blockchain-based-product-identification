import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { QRCodeCanvas } from "qrcode.react";
import { registerProductOnBlockchain } from "../../../blockchainService";
import { useManufacturer } from "../../context/ManufacturerContext";
import productCategories from "../../assets/category";
import { showToast, ToastNotification } from "../../components/Notification";

const ProductRegistration = () => {
  //Product Details
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [batchNumber, setBatchNumber] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [uniqueProductId, setUniqueProductId] = useState("");
  const [manufacturingDate, setManufacturingDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [hasExpiryDate, setHasExpiryDate] = useState(false);

  //Manufacturer Details
  const [manufacturerName, setManufacturerName] = useState("");
  const [manufacturingLocation, setManufacturingLocation] = useState("");
  const [manufacturerEmail, setManufacturerEmail] = useState("");
  const [manufacturerPhone, setManufacturerPhone] = useState("");
  const [facilityAddress, setFacilityAddress] = useState("");
  const [timestamp, setTimestamp] = useState("");

  //Modal Toggle
  const [showModal, setShowModal] = useState(false);

  //QR CODE
  const [qrData, setQrData] = useState("");

  const { manufacturerData } = useManufacturer();

const generateQRCode = async () => {
  if (
    !uniqueProductId ||
    !manufacturerName ||
    !batchNumber ||
    !productName ||
    !productDescription ||
    !productCategory ||
    !serialNumber ||
    !manufacturingDate ||
    !expiryDate ||
    !manufacturerEmail ||
    !facilityAddress ||
    !manufacturingLocation ||
    !timestamp
  ) {
    return showToast("Ensure all fields are filled before generating the QR code.");
  }

  try {
    showToast("Registering product on the blockchain...", "info");

    const productData = {
      uniqueProductId,
      batchNumber,
      productName,
      productDescription,
      productCategory,
      serialNumber,
      manufacturingDate,
      expiryDate,
      timestamp,
    };

    // Register product and get transaction hash
    const transactionHash = await registerProductOnBlockchain(productData);

    // ✅ Generate QR data with product details and transaction hash
    const qrContent = JSON.stringify({
      uniqueProductId,
      manufacturerName,
      batchNumber,
      productName,
      manufacturingDate,
      expiryDate,
      transactionHash,
    });
    console.log(transactionHash)
    setQrData(qrContent);
    showToast("Product registered successfully. QR code generated!", "success");
    setTimestamp(Date.now());
  } catch (error) {
    console.error("Error generating QR code:", error);
    showToast("Failed to generate QR code. Please try again.");
  }
};

  
  const handleProductRegistration = (e) => {
    e.preventDefault();

    // Basic validation using showToast
    if (!productName.trim()) return showToast("Product Name is required");
    if (!productDescription.trim())
      return showToast("Product Description is required");
    if (!productCategory.trim())
      return showToast("Product Category is required");
    if (!batchNumber.trim()) return showToast("Batch Number is required");
    if (!serialNumber.trim()) return showToast("Serial Number is required");
    if (!uniqueProductId.trim())
      return showToast("Unique Product ID is required");
    if (!manufacturingDate) return showToast("Manufacturing Date is required");
    if (hasExpiryDate && !expiryDate)
      return showToast("Expiry Date is required");
    if (new Date(expiryDate) < new Date(manufacturingDate))
      return showToast("Expiry Date cannot be before the manufacturing date!");
    if (!manufacturerName.trim())
      return showToast("Manufacturer Name is required");
    if (!manufacturingLocation.trim())
      return showToast("Manufacturing Location is required");
    if (!manufacturerEmail.trim())
      return showToast("Manufacturer Email is required");
    if (!manufacturerPhone.trim())
      return showToast("Manufacturer Phone is required");
    if (!facilityAddress.trim())
      return showToast("Facility Address is required");

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(manufacturerEmail))
      return showToast("Invalid email format");

    // Phone number validation (only digits, must be 10 characters)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(manufacturerPhone))
      return showToast("Phone number must be exactly 10 digits");

    if (hasExpiryDate && new Date(expiryDate) <= new Date(manufacturingDate)) {
      return showToast("Expiry date must be later than manufacturing date");
    }

    const productData = {
      productName,
      productDescription,
      productCategory,
      batchNumber,
      serialNumber,
      uniqueProductId,
      manufacturingDate,
      expiryDate: hasExpiryDate ? expiryDate : null,
      manufacturerName,
      manufacturingLocation,
      manufacturerEmail,
      manufacturerPhone,
      facilityAddress,
      timestamp,
    };
    console.log(productData);

    setProductName("");
    setProductDescription("");
    setProductCategory("");
    setBatchNumber("");
    setSerialNumber("");
    setUniqueProductId("");
    setManufacturingDate("");
    setExpiryDate("");
    setManufacturerName("");
    setManufacturingLocation("");
    setManufacturerEmail("");
    setManufacturerPhone("");
    setFacilityAddress("");
  };

  const downloadQRCode = () => {
    const canvas = document.querySelector("canvas");
    const imageURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = imageURL;
    link.download = `${uniqueProductId}_QRCode.png`;
    link.click();
  };

  useEffect(() => {
    setBatchNumber(`BAT-${Math.floor(100000 + Math.random() * 900000)}`);
    setSerialNumber(`SL-${Math.floor(10000 + Math.random() * 90000)}`);
    setUniqueProductId(uuidv4());
    setTimestamp(Date.now());
  
    if (manufacturerData) {
      setManufacturerName(manufacturerData.name || "");
      setManufacturingLocation(manufacturerData.manufacturingLocation || "");
      setManufacturerEmail(manufacturerData.email || "");
      setManufacturerPhone(manufacturerData.phone || "");
      setFacilityAddress(manufacturerData.facilityAddress || "");      
    }
  
    console.log("Manufacturer context data:", manufacturerData);
  }, [manufacturerData]);
  

  return (
    <>
      <div className="min-h-screen flex flex-col items-center bg-gradient-to-r from-gray-800 to-black p-10 transition duration-500 ease-in-out">
        <h1 className="text-5xl font-extrabold text-white mb-8 drop-shadow-lg ">
          Register Product
        </h1>

        <div className="bg-white/20 backdrop-blur-lg shadow-2xl rounded-2xl p-8 w-full max-w-6xl grid grid-cols-2 gap-10 border border-white/30 ">
          {/* Left Section - Product Details Form */}
          <form onSubmit={handleProductRegistration} className="space-y-6">
            <h2 className="text-3xl font-semibold text-white mb-4 animate__animated animate__fadeIn">
              🛠 Product Details
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Product Name"
                type="text"
                value={productName}
                onChange={setProductName}
                // required={true}
              />
              <InputField
                label="Product Description"
                type="text"
                value={productDescription}
                onChange={setProductDescription}
                // required={true}
              />
              <div onClick={() => setShowModal(true)}>
                <InputField
                  label="Product Category"
                  type="text"
                  value={productCategory}
                  readOnly
                  required
                />
              </div>
              <InputField
                label="Batch Number"
                type="text"
                readOnly={true}
                value={batchNumber}
                // required={true}
              />
              <InputField
                label="Serial Number"
                type="text"
                value={serialNumber}
                // required={true}
              />
              <InputField
                label="Unique Product ID"
                type="text"
                readOnly={true}
                value={uniqueProductId}
                // required={true}
              />
              <InputField
                label="Manufacturing Date"
                type="date"
                value={manufacturingDate}
                onChange={setManufacturingDate}
                // required={true}
              />
              <InputField
                label="Expiry Date"
                type="date"
                value={expiryDate}
                onChange={setExpiryDate}
              />
            </div>

            <h2 className="text-3xl font-semibold text-white mt-6 animate__animated animate__fadeIn">
              🏭 Manufacturer Details
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Manufacturer Name"
                type="text"
                value={manufacturerData?.name || ""}
                readOnly
                // required={true}
              />
              <InputField
                label="Manufacturing Location"
                type="text"
                value={manufacturerData?.manufacturingLocation || ""}
                readOnly
                // required={true}
              />
              <InputField
                label="Manufacturer Email"
                type="email"
                value={manufacturerData?.email || ""}
                readOnly
                // required={true}
              />
              <InputField
                label="Manufacturer Phone"
                type="tel"
                value={manufacturerData?.phone || ""}
                readOnly
                // required={true}
              />
              <InputField
                label="Facility Address"
                type="text"
                value={manufacturerData?.facilityAddress || ""}
                readOnly
                // required={true}
              />
              <InputField
                label="Timestamp"
                type="text"
                readOnly={true}
                value={timestamp}
              />
            </div>

            <button
              type="submit"
              onClick={generateQRCode}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:scale-105 transition-transform duration-300 text-white font-bold py-3 px-6 rounded-xl shadow-md mt-6 transform hover:scale(2)"
            >
              ✅ Register Product
            </button>
          </form>

          {/* Right Section - QR Code */}
          <div className="flex flex-col items-center justify-center bg-white/10 backdrop-blur-lg p-6 border border-white/20 rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300">
            <h2 className="text-3xl font-semibold text-white mb-4 animate__animated animate__fadeIn">
              🔍 Generated QR Code
            </h2>

            {qrData ? (
              <div className="w-48  h-48 bg-white/20 border border-white/30 shadow-lg rounded-xl flex items-center justify-center animate__animated animate__pulse">
                <QRCodeCanvas
                  value={qrData}
                  size={200}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  style={{padding: '15px'}}
                  className="rounded-xl"
                />
              </div>
            ) : (
              <div className="w-48 h-48 bg-white/20 border border-white/30 shadow-lg rounded-xl flex items-center justify-center text-white text-lg animate__animated animate__pulse">
                <span className="opacity-80">QR Code Here</span>
              </div>
            )}
            {qrData && (
              <button
                onClick={downloadQRCode}
                className="mt-4 px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-600 transition-colors duration-300"
              >
                📥 Download QR Code
              </button>
            )}
          </div>
        </div>
      </div>
      {showModal && (
        <CategoryModal
          productCategories={productCategories}
          setProductCategory={(category) => {
            setProductCategory(category);
            setShowModal(false); // Close modal after selecting
          }}
          closeModal={() => setShowModal(false)}
        />
      )}
    </>
  );
};

const InputField = ({ label, type, value, readOnly, onChange, required }) => {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-semibold text-white/80 mb-2">
        {label}
      </label>
      <input
        type={type}
        className="bg-white/20 text-white placeholder-white/60 border border-white/30 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-200 ease-in-out"
        onChange={!readOnly ? (e) => onChange(e.target.value) : undefined}
        placeholder={`Enter ${label}`}
        readOnly={readOnly}
        required={required}
        value={value}
      />
    </div>
  );
};

const CategoryModal = ({
  productCategories,
  setProductCategory,
  closeModal,
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-gradient-to-r from-gray-800 to-black text-white p-6 rounded-xl shadow-xl w-96 border border-white/30">
      <h2 className="text-xl font-bold mb-4">Select a Category</h2>
      <ul className="divide-y divide-gray-500">
        {productCategories.map((category) => (
          <li
            key={category.id}
            onClick={() => {
              setProductCategory(category.name);
              closeModal();
            }}
            className="p-3 cursor-pointer hover:bg-white/10 transition duration-300"
          >
            {category.name}
          </li>
        ))}
      </ul>
      <button
        onClick={closeModal}
        className="mt-4 w-full bg-red-600 hover:bg-red-700 transition duration-300 text-white py-2 rounded-lg shadow-md"
      >
        Close
      </button>
    </div>
  </div>
);

export default ProductRegistration;
