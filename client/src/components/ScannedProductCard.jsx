import React from 'react';

const ScanProductCard = ({ product, exists }) => {
  if (!product) return null;

  const { details, manufacturerAddress } = product;

  return (
    <div
      className="mt-8 max-w-xl mx-auto bg-gray-800 text-white shadow-xl rounded-lg p-6 border border-gray-700 
                 transform transition duration-300 ease-in-out hover:scale-[1.01] hover:shadow-2xl animate-fade-in"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">Product Verification Result</h2>
        <span
          className={`px-3 py-1 rounded-full text-sm font-bold transition ${
            exists ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
          }`}
        >
          {exists ? 'Genuine Product' : 'Fake Product'}
        </span>
      </div>

      {exists ? (
        <>
          <div className="mb-4">
            <h3 className="font-semibold text-blue-400 mb-1">Product Details</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li><strong>Name:</strong> {details.name}</li>
              <li><strong>Category:</strong> {details.category}</li>
              <li><strong>Batch Number:</strong> {details.batchNumber}</li>
              <li><strong>Serial Number:</strong> {details.serialNumber}</li>
              <li><strong>Unique ID:</strong> {details.uniqueProductId}</li>
              <li><strong>Manufacturing Date:</strong> {details.manufacturingDate}</li>
              <li><strong>Expiry Date:</strong> {details.expiryDate}</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-blue-400 mb-1">Manufacturer Info</h3>
            <p className="text-sm text-gray-300">
              <strong>Address:</strong> {manufacturerAddress}
            </p>
          </div>
        </>
      ) : (
        <div className="text-red-400 font-semibold text-center mt-4 animate-pulse">
          This product is not registered on the blockchain.
        </div>
      )}
    </div>
  );
};

export default ScanProductCard;
