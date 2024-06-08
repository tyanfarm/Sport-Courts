import React from 'react';
import CustomerInfo from '../CustomerInfo/CustomerInfo';
import ProductItem from '../ProductItem/ProductItem';

const products = [
  {
    name: 'Sân bóng đá Ông Bầu Bảo Long, Sân số 2',
    sport: 'Football',
    category: 'Artificial Grass, Sân 5',
    date: '17:30 - 19:30 28/05/2024',
    total: '400.000đ',
  },
  {
    name: 'Sân bóng đá Ông Bầu Bảo Long, Sân số 3',
    sport: 'Football',
    category: 'Artificial Grass, Sân 5',
    date: '17:30 - 19:30 28/05/2024',
    total: '400.000đ',
  }
];

const ShoppingCart = () => {
  return (
    <div className="container mx-auto my-8 bg-white p-8 rounded-lg shadow-lg">
      <div className="text-sm mb-4">
        <a href="#" className="text-gray-800">Home</a> &gt; <a href="#" className="text-gray-800">Shopping Cart</a>
      </div>
      <h2 className="text-2xl font-bold mb-4">Court Renting Information</h2>
      <div className="flex">
        <CustomerInfo />
        <div className="w-2/3">
          {products.map((product, index) => (
            <ProductItem key={index} product={product} />
          ))}
          <div className="text-right font-bold text-lg mb-4">
            TOTAL: 800.000đ
          </div>
          <div className="flex justify-end space-x-4">
            <button className="bg-green-500 text-white rounded-lg px-4 py-2 inline-flex items-center">
              <i className="fas fa-plus mr-2"></i> Add Order
            </button>
            <button className="bg-green-500 text-white rounded-lg px-4 py-2 inline-flex items-center">
              <i className="fas fa-dollar-sign mr-2"></i> Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
