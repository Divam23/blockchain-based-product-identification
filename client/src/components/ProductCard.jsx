import React from "react";

const ProductCard = ({ product }) => {
  return (
    <div className="bg-gray-800 p-5 rounded-lg shadow-lg hover:shadow-blue-500/40 transition">
      <h2 className="text-xl font-semibold mb-1">{product.name}</h2>
      <p className="text-gray-400 text-sm mb-2">{product.description}</p>
      <div className="text-sm text-gray-300">
        <p>
          <span className="font-semibold">Batch:</span> {product.batchNumber}
        </p>
        <p>
          <span className="font-semibold">Serial:</span> {product.serialNumber}
        </p>
        <p>
          <span className="font-semibold">Expiry:</span>{" "}
          {new Date(product.expiryDate).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
