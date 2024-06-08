import React from 'react';

const ProductItem = ({ product }) => {
  return (
    <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 mb-4 relative">
      <p>{product.name}</p>
      <p>Sport: {product.sport}</p>
      <p>Category: {product.category}</p>
      <p>Date: {product.date}</p>
      <p>Total: {product.total}</p>
      <div className="absolute top-4 right-4 flex space-x-2">
        <button className="text-green-600"><i className="fas fa-edit"></i></button>
        <button className="text-red-600"><i className="fas fa-trash-alt"></i></button>
      </div>
    </div>
  );
};

export default ProductItem;
