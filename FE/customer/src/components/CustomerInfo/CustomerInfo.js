import React from 'react';

const CustomerInfo = () => {
  return (
    <div className="w-1/3 mr-8">
      <h3 className="text-xl font-semibold mb-2">Customer Information</h3>
      <table className="w-full border-collapse border border-gray-300">
        <tbody>
          <tr>
            <th className="border border-gray-300 p-2 text-left">User’s name</th>
            <td className="border border-gray-300 p-2">User152364</td>
          </tr>
          <tr>
            <th className="border border-gray-300 p-2 text-left">Phone number</th>
            <td className="border border-gray-300 p-2">*******xxx</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default CustomerInfo;
